import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Linking, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { DEMO_MODE, HAS_FIREBASE_CONFIG } from "@/constants/config";
import { AppScreen } from "@/components/common/AppScreen";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { GlassCard } from "@/components/cards/GlassCard";
import { ListItemCard } from "@/components/cards/ListItemCard";
import { EventDetailHeader } from "@/components/events/EventDetailHeader";
import { EventReminderControl, ReminderPreset } from "@/components/events/EventReminderControl";
import { RelatedEventContentSection } from "@/components/events/RelatedEventContentSection";
import { SaveEventButton } from "@/components/events/SaveEventButton";
import { buildEventRecords } from "@/domain/services/events";
import {
  useGetEventSavesQuery,
  useGetEventsQuery,
  useGetForumThreadsQuery,
  useGetNewsQuery,
  useGetOrganizationsQuery,
  useGetResourcesQuery,
  useGetStudyTracksQuery,
  useUpdateEventSaveMutation
} from "@/store/services/fblaApi";
import { palette, theme } from "@/theme";

type EventDetailMode = "overview" | "prep" | "discussion";

const reminderPresetFromSave = (save?: { reminder1?: string | null; reminder2?: string | null }): ReminderPreset => {
  if (save?.reminder1 && save?.reminder2) return "both";
  if (save?.reminder1) return "dayBefore";
  if (save?.reminder2) return "hourBefore";
  return "none";
};

const buildReminderPayload = (startTime: string, preset: ReminderPreset) => {
  const start = new Date(startTime);
  const dayBefore = new Date(start.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const hourBefore = new Date(start.getTime() - 60 * 60 * 1000).toISOString();

  switch (preset) {
    case "dayBefore":
      return { reminder1: dayBefore, reminder2: null };
    case "hourBefore":
      return { reminder1: null, reminder2: hourBefore };
    case "both":
      return { reminder1: dayBefore, reminder2: hourBefore };
    default:
      return { reminder1: null, reminder2: null };
  }
};

export const EventDetailScreen = ({ route, navigation }: any) => {
  const { eventId } = route.params;
  const [mode, setMode] = useState<EventDetailMode>("overview");
  const [noteDraft, setNoteDraft] = useState("");
  const [savedOverride, setSavedOverride] = useState<boolean | null>(null);
  const [reminderDraft, setReminderDraft] = useState<ReminderPreset>("none");
  const [noteFeedback, setNoteFeedback] = useState<"idle" | "saved">("idle");
  const [reminderFeedback, setReminderFeedback] = useState<"idle" | "saved">("idle");
  const noteFeedbackOpacity = useRef(new Animated.Value(0)).current;
  const noteFeedbackTranslateY = useRef(new Animated.Value(8)).current;
  const reminderFeedbackOpacity = useRef(new Animated.Value(0)).current;
  const reminderFeedbackTranslateY = useRef(new Animated.Value(8)).current;

  const { data: events = [] } = useGetEventsQuery();
  const { data: saves = [] } = useGetEventSavesQuery();
  const { data: organizations = [] } = useGetOrganizationsQuery();
  const { data: resources = [] } = useGetResourcesQuery();
  const { data: news = [] } = useGetNewsQuery();
  const { data: studyTracks = [] } = useGetStudyTracksQuery();
  const { data: threads = [] } = useGetForumThreadsQuery();
  const [updateEventSave, { isLoading }] = useUpdateEventSaveMutation();

  const record = useMemo(
    () => buildEventRecords(events, saves, organizations).find((item) => item.event.id === eventId),
    [eventId, events, organizations, saves]
  );

  useEffect(() => {
    setNoteDraft(record?.save?.personalNote ?? "");
  }, [record?.save?.personalNote]);

  useEffect(() => {
    setReminderDraft(reminderPresetFromSave(record?.save));
  }, [record?.save]);

  useEffect(() => {
    setSavedOverride(null);
  }, [record?.isSaved]);

  const options = useMemo(
    () => [
      { value: "overview" as const, label: "Overview" },
      { value: "prep" as const, label: "Prep" },
      { value: "discussion" as const, label: "Discussion" }
    ],
    []
  );

  if (!record) {
    return (
      <AppScreen title="Event" eyebrow="Details" subtitle="This event could not be found.">
        <GlassCard title="Missing event" subtitle="Try going back to the calendar or agenda and reopening it." />
      </AppScreen>
    );
  }

  const event = record.event;
  const isSavedState = savedOverride ?? record.isSaved;
  const canPersistAuxiliaryChanges = isSavedState && (DEMO_MODE || HAS_FIREBASE_CONFIG);

  const animateConfirmation = (type: "note" | "reminder") => {
    const opacity = type === "note" ? noteFeedbackOpacity : reminderFeedbackOpacity;
    const translateY = type === "note" ? noteFeedbackTranslateY : reminderFeedbackTranslateY;
    const setter = type === "note" ? setNoteFeedback : setReminderFeedback;

    setter("saved");
    opacity.setValue(0);
    translateY.setValue(8);

    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 180,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true
        })
      ]),
      Animated.delay(900),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true
      })
    ]).start(() => {
      setter("idle");
      translateY.setValue(8);
    });
  };

  const linkedResources = resources.filter(
    (item) => item.tags.some((tag) => event.title.toLowerCase().includes(tag.split(" ")[0])) || item.category.includes("conference")
  );
  const linkedNews = news.filter((item) => item.relatedEventId === eventId);
  const linkedStudy = studyTracks.filter((item) => item.relatedEventId === eventId);
  const linkedThreads = threads.filter((item) => item.relatedEventId === eventId);

  const handleSaveToggle = async () => {
    const nextSavedState = !isSavedState;

    if (DEMO_MODE && !HAS_FIREBASE_CONFIG) {
      setSavedOverride(nextSavedState);
      return;
    }

    try {
      await updateEventSave({
        eventId,
        isSaved: nextSavedState,
        personalNote: record.save?.personalNote,
        reminder1: record.save?.reminder1 ?? null,
        reminder2: record.save?.reminder2 ?? null
      });
    } catch {
      if (DEMO_MODE) {
        setSavedOverride(nextSavedState);
      }
    }
  };

  const handleReminderChange = async (value: ReminderPreset) => {
    setReminderDraft(value);

    if (canPersistAuxiliaryChanges) {
      try {
        await updateEventSave({
          eventId,
          isSaved: true,
          personalNote: noteDraft,
          ...buildReminderPayload(event.startTime, value)
        });
      } catch {
        if (!DEMO_MODE) {
          setReminderDraft(reminderPresetFromSave(record.save));
          return;
        }
      }
    }

    animateConfirmation("reminder");
  };

  const handleSaveNote = async () => {
    if (canPersistAuxiliaryChanges) {
      try {
        await updateEventSave({
          eventId,
          isSaved: true,
          personalNote: noteDraft,
          ...buildReminderPayload(event.startTime, reminderDraft)
        });
      } catch {
        if (!DEMO_MODE) {
          return;
        }
      }
    }

    animateConfirmation("note");
  };

  return (
    <AppScreen title="Event" eyebrow="Planning detail" subtitle={record.dateTimeLabel}>
      <View style={styles.screen}>
        <EventDetailHeader record={record} />

        <GlassCard>
          <View style={styles.actionSection}>
            <View style={styles.actionRow}>
              <View style={styles.primaryAction}>
                <SaveEventButton
                  isSaved={isSavedState}
                  onPress={handleSaveToggle}
                  disabled={isLoading}
                  compact
                  forceFullLabel
                />
              </View>
              <Pressable style={styles.aiButton} onPress={() => navigation.navigate("AI", { contextId: eventId })}>
                <Text style={styles.aiButtonText}>Ask AI</Text>
              </Pressable>
            </View>
            <Text style={styles.helperText}>
              {isSavedState
                ? "Pinned to your schedule. Adjust reminders and notes anytime."
                : "Reminders and notes can be set here even before you add this event to your schedule."}
            </Text>
            <View style={styles.reminderWrap}>
              <View style={styles.inlineHeader}>
                <Text style={styles.sectionLabel}>Reminders</Text>
                {reminderFeedback === "saved" ? (
                  <Animated.View
                    style={[
                      styles.feedbackPill,
                      { opacity: reminderFeedbackOpacity, transform: [{ translateY: reminderFeedbackTranslateY }] }
                    ]}
                  >
                    <Text style={styles.feedbackPillLabel}>
                      {isSavedState ? "Reminder updated" : "Reminder ready"}
                    </Text>
                  </Animated.View>
                ) : null}
              </View>
              <EventReminderControl value={reminderDraft} onChange={handleReminderChange} />
            </View>
          </View>
        </GlassCard>

        <GlassCard title="Logistics" subtitle={record.dateTimeLabel}>
          <Text style={styles.metaLine}>{event.locationName}</Text>
          {event.locationAddress ? <Text style={styles.body}>{event.locationAddress}</Text> : null}
          <Text style={styles.body}>Organizer: {record.scopeContext}</Text>
          {event.sourceReference ? <Text style={styles.body}>Source: {event.sourceReference}</Text> : null}
          {event.virtualUrl ? (
            <Pressable onPress={() => Linking.openURL(event.virtualUrl!)}>
              <Text style={styles.link}>Open related link</Text>
            </Pressable>
          ) : null}
        </GlassCard>

        <GlassCard title="Private note" subtitle="Keep personal prep steps or logistics for yourself.">
          <TextInput
            value={noteDraft}
            onChangeText={setNoteDraft}
            multiline
            placeholder="Add reminders for yourself, packing notes, or prep tasks."
            placeholderTextColor={palette.slate}
            underlineColorAndroid="transparent"
            style={styles.noteInput}
          />
          <View style={styles.noteFooter}>
            <Pressable style={styles.noteButton} onPress={handleSaveNote}>
              <Text style={styles.noteButtonText}>Save note</Text>
            </Pressable>
            {noteFeedback === "saved" ? (
              <Animated.View
                style={[
                  styles.noteFeedback,
                  { opacity: noteFeedbackOpacity, transform: [{ translateY: noteFeedbackTranslateY }] }
                ]}
              >
                <Text style={styles.noteFeedbackLabel}>
                  {isSavedState ? "Note saved" : "Note saved for this session"}
                </Text>
              </Animated.View>
            ) : null}
          </View>
        </GlassCard>

        <SegmentedControl value={mode} options={options} onChange={setMode} />

        {mode === "overview" ? (
          <View style={styles.sectionStack}>
            <RelatedEventContentSection
              title="Announcements"
              caption="Official updates and context connected to this event."
            >
              {linkedNews.length ? (
                linkedNews.map((item) => (
                  <ListItemCard
                    key={item.id}
                    eyebrow={item.priorityLevel}
                    title={item.title}
                    summary={item.summary}
                    meta={new Date(item.publishedAt).toLocaleDateString()}
                    onPress={() => navigation.navigate("NewsDetail", { newsPostId: item.id })}
                  />
                ))
              ) : (
                <GlassCard title="No linked announcements" subtitle="Event-specific notices will appear here when available." />
              )}
            </RelatedEventContentSection>

            <RelatedEventContentSection title="Related resources" caption="Open forms, guides, or travel details fast.">
              {linkedResources.length ? (
                linkedResources.slice(0, 3).map((item) => (
                  <ListItemCard
                    key={item.id}
                    eyebrow={item.category}
                    title={item.title}
                    summary={item.summary}
                    meta={`${item.estimatedReadMinutes} min`}
                    onPress={() => navigation.navigate("ResourceDetail", { resourceId: item.id })}
                  />
                ))
              ) : (
                <GlassCard title="No linked resources yet" subtitle="Helpful documents and links will show here when they are connected." />
              )}
            </RelatedEventContentSection>
          </View>
        ) : null}

        {mode === "prep" ? (
          <View style={styles.sectionStack}>
            <RelatedEventContentSection title="Study help" caption="Prep tracks and study support tied to this event.">
              {linkedStudy.length ? (
                linkedStudy.map((track) => (
                  <ListItemCard
                    key={track.id}
                    eyebrow="Study track"
                    title={track.title}
                    summary={track.description}
                    meta={`${track.estimatedTotalMinutes} min`}
                    onPress={() => navigation.navigate("StudyTrackDetail", { studyTrackId: track.id })}
                  />
                ))
              ) : (
                <GlassCard title="No study track linked" subtitle="This event does not have a dedicated prep track yet." />
              )}
            </RelatedEventContentSection>

            <RelatedEventContentSection title="Suggested resources" caption="Use these to tighten logistics and competition prep.">
              {linkedResources.length ? (
                linkedResources.map((item) => (
                  <ListItemCard
                    key={item.id}
                    eyebrow={item.resourceType}
                    title={item.title}
                    summary={item.summary}
                    meta={`${item.estimatedReadMinutes} min`}
                    onPress={() => navigation.navigate("ResourceDetail", { resourceId: item.id })}
                  />
                ))
              ) : (
                <GlassCard title="Nothing linked yet" subtitle="Prep recommendations will appear here as they are connected." />
              )}
            </RelatedEventContentSection>
          </View>
        ) : null}

        {mode === "discussion" ? (
          <RelatedEventContentSection
            title="Discussion threads"
            caption="Questions, logistics, and member planning around this event."
          >
            {linkedThreads.length ? (
              linkedThreads.map((thread) => (
                <ListItemCard
                  key={thread.id}
                  eyebrow={`${thread.replyCount} replies`}
                  title={thread.title}
                  summary={thread.body}
                  meta={new Date(thread.lastActivityAt).toLocaleDateString()}
                  onPress={() => navigation.navigate("ThreadDetail", { threadId: thread.id })}
                />
              ))
            ) : (
              <GlassCard title="No discussion yet" subtitle="Open Community to start a logistics or prep thread for this event." />
            )}
          </RelatedEventContentSection>
        ) : null}
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    gap: theme.spacing.md
  },
  actionSection: {
    gap: 16
  },
  actionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "stretch",
    gap: 10
  },
  primaryAction: {
    flex: 1,
    minWidth: 0
  },
  aiButton: {
    flexGrow: 0,
    flexShrink: 0,
    minWidth: 92,
    minHeight: 38,
    paddingHorizontal: 14,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: "rgba(117,184,255,0.28)",
    backgroundColor: "rgba(117,184,255,0.1)",
    alignItems: "center",
    justifyContent: "center"
  },
  aiButtonText: {
    ...theme.typography.label,
    color: palette.sky
  },
  helperText: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 20,
    marginTop: 2
  },
  reminderWrap: {
    gap: 10
  },
  inlineHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8
  },
  sectionLabel: {
    ...theme.typography.label,
    color: palette.slate
  },
  feedbackPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(108,229,168,0.14)",
    borderWidth: 1,
    borderColor: "rgba(108,229,168,0.28)"
  },
  feedbackPillLabel: {
    ...theme.typography.label,
    color: palette.success
  },
  metaLine: {
    ...theme.typography.label,
    color: palette.sky
  },
  body: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 21
  },
  link: {
    ...theme.typography.label,
    color: palette.gold
  },
  noteInput: {
    minHeight: 92,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "rgba(7,17,29,0.45)",
    padding: theme.spacing.md,
    color: palette.cream,
    includeFontPadding: false,
    textAlignVertical: "top",
    ...theme.typography.body
  },
  noteFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10
  },
  noteButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.pill,
    backgroundColor: palette.gold
  },
  noteButtonText: {
    ...theme.typography.label,
    color: palette.ink
  },
  noteFeedback: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: "rgba(117,184,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(117,184,255,0.22)"
  },
  noteFeedbackLabel: {
    ...theme.typography.label,
    color: palette.sky
  },
  sectionStack: {
    gap: theme.spacing.md
  }
});
