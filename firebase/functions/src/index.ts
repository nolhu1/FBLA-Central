import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { setGlobalOptions } from "firebase-functions/v2";

initializeApp();
setGlobalOptions({ region: "us-central1", maxInstances: 10 });

const db = getFirestore();
const OPENAI_API_KEY = defineSecret("OPENAI_API_KEY");

const toTimestamp = () => new Date().toISOString();

const requireAuth = (request: any) => {
  if (!request.auth?.uid) {
    throw new HttpsError("unauthenticated", "Authentication is required.");
  }
  return request.auth.uid as string;
};

const containsBlockedTerms = (value: string) => /(?:damn|hell|stupid)/i.test(value);

const buildHomeBundle = async (userId: string) => {
  const userSnapshot = await db.collection("users").doc(userId).get();
  if (!userSnapshot.exists) {
    throw new HttpsError("not-found", "User profile not found.");
  }

  const [eventsSnap, resourcesSnap, newsSnap, studySnap, threadsSnap, highlightsSnap, eventSavesSnap] =
    await Promise.all([
      db.collection("events").get(),
      db.collection("resources").get(),
      db.collection("news_posts").get(),
      db.collection("study_tracks").get(),
      db.collection("forum_threads").get(),
      db.collection("social_highlights").get(),
      db.collection("users").doc(userId).collection("event_saves").get()
    ]);

  const events = eventsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const resources = resourcesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const news = newsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const studyTracks = studySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const threads = threadsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const highlights = highlightsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const savedEventIds = new Set(eventSavesSnap.docs.map((doc) => doc.data().event_id));

  const sortedEvents = events
    .filter((event) => Date.parse((event.start_time as string) ?? "") >= Date.now())
    .sort((a, b) => Date.parse(a.start_time as string) - Date.parse(b.start_time as string));

  const nextUp = sortedEvents[0] ?? news.find((post) => post.is_pinned);
  const suggestedStudyTracks = studyTracks.filter((track) =>
    savedEventIds.has(track.related_event_id) || (track.tags ?? []).includes("mobile application development")
  );
  const relatedResources = resources.filter(
    (resource) =>
      (resource.tags ?? []).includes("official") ||
      (resource.tags ?? []).includes("competition") ||
      (resource.tags ?? []).includes("validation")
  );
  const relevantThreads = threads.filter(
    (thread) => savedEventIds.has(thread.related_event_id) || (thread.tags ?? []).includes("presentation")
  );
  const importantUpdates = news.filter(
    (post) => post.is_pinned || post.priority_level === "urgent" || savedEventIds.has(post.related_event_id)
  );

  return {
    nextUp,
    priorities: [
      "Open the official guide tied to your next deadline.",
      "Review the study track that matches your saved competition milestone.",
      "Check for pinned announcements that affect your prep flow."
    ],
    studyFocus: suggestedStudyTracks[0] ?? null,
    recentAnnouncements: importantUpdates.slice(0, 3),
    recommendedResources: relatedResources.slice(0, 4),
    communityActivity: relevantThreads.slice(0, 4),
    socialHighlights: highlights.slice(0, 3),
    momentumSnapshot: {
      savedEvents: savedEventIds.size,
      savedResources: 0,
      studyProgress: 0,
      discussionParticipation: relevantThreads.length,
      bookmarks: savedEventIds.size
    },
    recommendationBundle: {
      recommendedEventIds: sortedEvents.slice(0, 3).map((event) => event.id),
      suggestedStudyTrackIds: suggestedStudyTracks.slice(0, 3).map((track) => track.id),
      relatedResourceIds: relatedResources.slice(0, 4).map((resource) => resource.id),
      relevantDiscussionIds: relevantThreads.slice(0, 4).map((thread) => thread.id),
      importantUpdateIds: importantUpdates.slice(0, 4).map((post) => post.id),
      priorities: [
        "Finish the next competition-facing deliverable.",
        "Use linked resources before asking AI to clarify anything official.",
        "Open the most active contextual thread if you still need help."
      ]
    }
  };
};

export const getRecommendations = onCall(async (request) => {
  const userId = requireAuth(request);
  return buildHomeBundle(userId);
});

export const saveEventAndGeneratePrep = onCall(async (request) => {
  const userId = requireAuth(request);
  const { eventId, personalNote } = request.data ?? {};

  if (!eventId || typeof eventId !== "string") {
    throw new HttpsError("invalid-argument", "A valid eventId is required.");
  }

  const eventRef = db.collection("events").doc(eventId);
  const eventSnapshot = await eventRef.get();
  if (!eventSnapshot.exists) {
    throw new HttpsError("not-found", "Event not found.");
  }

  await db
    .collection("users")
    .doc(userId)
    .collection("event_saves")
    .doc(eventId)
    .set(
      {
        user_id: userId,
        event_id: eventId,
        personal_note: typeof personalNote === "string" ? personalNote.slice(0, 300) : "",
        saved_at: toTimestamp()
      },
      { merge: true }
    );

  const [studySnap, resourcesSnap, threadsSnap] = await Promise.all([
    db.collection("study_tracks").where("related_event_id", "==", eventId).get(),
    db.collection("resources").get(),
    db.collection("forum_threads").where("related_event_id", "==", eventId).get()
  ]);

  return {
    saved: true,
    relatedStudyTrackIds: studySnap.docs.map((doc) => doc.id),
    relatedResourceIds: resourcesSnap.docs
      .filter((doc) => ((doc.data().tags as string[] | undefined) ?? []).some((tag) => tag.includes("competition")))
      .slice(0, 4)
      .map((doc) => doc.id),
    relatedThreadIds: threadsSnap.docs.map((doc) => doc.id)
  };
});

export const createForumReply = onCall(async (request) => {
  const userId = requireAuth(request);
  const { threadId, body } = request.data ?? {};

  if (!threadId || typeof threadId !== "string") {
    throw new HttpsError("invalid-argument", "threadId is required.");
  }

  if (!body || typeof body !== "string" || body.trim().length < 8) {
    throw new HttpsError("invalid-argument", "Replies must contain at least 8 characters.");
  }

  if (containsBlockedTerms(body)) {
    throw new HttpsError("failed-precondition", "Reply contains blocked language.");
  }

  const threadRef = db.collection("forum_threads").doc(threadId);
  const threadSnapshot = await threadRef.get();
  if (!threadSnapshot.exists) {
    throw new HttpsError("not-found", "Thread not found.");
  }

  await db.collection("forum_replies").add({
    thread_id: threadId,
    author_user_id: userId,
    body: body.trim(),
    status: "active",
    helpful_count: 0,
    created_at: toTimestamp(),
    updated_at: toTimestamp()
  });

  await threadRef.set(
    {
      last_activity_at: toTimestamp(),
      updated_at: toTimestamp(),
      reply_count: (threadSnapshot.data()?.reply_count ?? 0) + 1
    },
    { merge: true }
  );

  return { ok: true };
});

export const createForumThread = onCall(async (request) => {
  const userId = requireAuth(request);
  const { categoryId, title, body, threadType, relatedEventId, relatedResourceId, relatedStudyTrackId } =
    request.data ?? {};

  if (!categoryId || !title || !body) {
    throw new HttpsError("invalid-argument", "categoryId, title, and body are required.");
  }

  if (String(title).trim().length < 10) {
    throw new HttpsError("invalid-argument", "Thread title must be more descriptive.");
  }

  if (containsBlockedTerms(String(title)) || containsBlockedTerms(String(body))) {
    throw new HttpsError("failed-precondition", "Thread contains blocked language.");
  }

  const duplicateQuery = await db
    .collection("forum_threads")
    .where("category_id", "==", categoryId)
    .where("title", "==", String(title).trim())
    .get();

  if (!duplicateQuery.empty) {
    throw new HttpsError("already-exists", "A thread with the same title already exists.");
  }

  const created = await db.collection("forum_threads").add({
    category_id: categoryId,
    author_user_id: userId,
    title: String(title).trim(),
    body: String(body).trim(),
    thread_type: threadType ?? "discussion",
    status: "active",
    related_event_id: relatedEventId ?? null,
    related_resource_id: relatedResourceId ?? null,
    related_study_track_id: relatedStudyTrackId ?? null,
    tags: [],
    reply_count: 0,
    helpful_count: 0,
    view_count: 0,
    created_at: toTimestamp(),
    updated_at: toTimestamp(),
    last_activity_at: toTimestamp()
  });

  return { threadId: created.id };
});

export const submitForumReport = onCall(async (request) => {
  const userId = requireAuth(request);
  const { contentType, contentId, reasonCode, details } = request.data ?? {};

  if (!contentType || !contentId || !reasonCode) {
    throw new HttpsError("invalid-argument", "contentType, contentId, and reasonCode are required.");
  }

  await db.collection("forum_reports").add({
    reporter_user_id: userId,
    content_type: contentType,
    content_id: contentId,
    reason_code: reasonCode,
    details: typeof details === "string" ? details.slice(0, 500) : "",
    status: "pending_review",
    created_at: toTimestamp()
  });

  return { ok: true };
});

export const askAIAssistant = onCall(
  { secrets: [OPENAI_API_KEY] },
  async (request) => {
    const userId = requireAuth(request);
    const prompt = String(request.data?.prompt ?? "").trim();
    const contextId = request.data?.contextId ? String(request.data.contextId) : null;

    if (!prompt) {
      throw new HttpsError("invalid-argument", "Prompt is required.");
    }

    const [userSnapshot, eventSnapshot, resourceSnapshot, newsSnapshot, threadSnapshot] = await Promise.all([
      db.collection("users").doc(userId).get(),
      contextId ? db.collection("events").doc(contextId).get() : Promise.resolve(null as any),
      contextId ? db.collection("resources").doc(contextId).get() : Promise.resolve(null as any),
      contextId ? db.collection("news_posts").doc(contextId).get() : Promise.resolve(null as any),
      contextId ? db.collection("forum_threads").doc(contextId).get() : Promise.resolve(null as any)
    ]);

    const contextObject =
      (eventSnapshot?.exists && { type: "event", ...eventSnapshot.data(), id: eventSnapshot.id }) ||
      (resourceSnapshot?.exists && { type: "resource", ...resourceSnapshot.data(), id: resourceSnapshot.id }) ||
      (newsSnapshot?.exists && { type: "news", ...newsSnapshot.data(), id: newsSnapshot.id }) ||
      (threadSnapshot?.exists && { type: "forum", ...threadSnapshot.data(), id: threadSnapshot.id }) ||
      null;

    const sourceLinks = [];
    if (contextObject) {
      sourceLinks.push({
        label: contextObject.title ?? contextObject.id,
        type: contextObject.type,
        id: contextObject.id
      });
    }

    const apiKey = OPENAI_API_KEY.value();
    if (!apiKey) {
      throw new HttpsError("failed-precondition", "OPENAI_API_KEY secret is not configured.");
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5",
        instructions:
          "You are the FBLA Central assistant. Use only the provided app context. Never invent official rules, deadlines, or policy. Prefer concise, source-backed guidance and explicitly say when the user should open an official resource.",
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text: JSON.stringify({
                  user: userSnapshot.data(),
                  context: contextObject
                })
              }
            ]
          },
          {
            role: "user",
            content: [{ type: "input_text", text: prompt }]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new HttpsError("internal", `OpenAI request failed: ${errorText}`);
    }

    const payload = (await response.json()) as { output_text?: string };
    const answer = payload.output_text?.trim();

    if (!answer) {
      throw new HttpsError("internal", "The AI provider returned an empty response.");
    }

    await db.collection("ai_conversations").add({
      user_id: userId,
      context_id: contextId,
      created_at: toTimestamp(),
      updated_at: toTimestamp(),
      messages: [
        { role: "user", content: prompt, created_at: toTimestamp() },
        { role: "assistant", content: answer, created_at: toTimestamp(), source_links: sourceLinks }
      ]
    });

    return {
      answer,
      sourceLinks
    };
  }
);
