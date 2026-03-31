import { DemoDataset } from "@/domain/models/types";

const now = "2026-03-30T09:00:00.000Z";

export const demoDataset: DemoDataset = {
  organizations: [
    {
      id: "org-national",
      type: "national",
      name: "Future Business Leaders of America",
      shortName: "FBLA National",
      parentOrganizationId: null,
      status: "active",
      websiteUrl: "https://www.fbla.org"
    },
    {
      id: "org-ca",
      type: "state_chapter",
      name: "California FBLA",
      shortName: "CA FBLA",
      parentOrganizationId: "org-national",
      stateCode: "CA",
      status: "active",
      websiteUrl: "https://cafbla.org"
    },
    {
      id: "org-bay",
      type: "state_subdivision",
      name: "Bay Section",
      shortName: "Bay Section",
      parentOrganizationId: "org-ca",
      stateCode: "CA",
      subdivisionTypeLabel: "section",
      status: "active"
    },
    {
      id: "org-monta-vista",
      type: "local_chapter",
      name: "Monta Vista FBLA",
      shortName: "Monta Vista",
      parentOrganizationId: "org-ca",
      stateCode: "CA",
      schoolName: "Monta Vista High School",
      status: "active"
    }
  ],
  user: {
    id: "user-demo",
    division: "high_school",
    email: "member@fblacentral.app",
    firstName: "Nolan",
    lastName: "Huang",
    displayName: "Nolan Huang",
    graduationYear: 2027,
    schoolName: "Monta Vista High School",
    localChapterId: "org-monta-vista",
    stateChapterId: "org-ca",
    stateSubdivisionId: "org-bay",
    goals: ["compete this year", "prepare for conferences", "explore leadership growth"],
    generalInterests: ["leadership", "networking", "career growth"],
    competitionInterests: ["mobile application development", "public speaking", "network design"],
    notificationPreferences: {
      enabled: true,
      categories: {
        upcomingSavedEvents: true,
        urgentAnnouncements: true,
        studyReminders: true,
        followedThreadReplies: true,
        recommendedOpportunities: true,
        resourceUpdates: true
      },
      quietHours: {
        start: "22:00",
        end: "07:00"
      },
      digestFrequency: "daily"
    },
    privacyPreferences: {
      showSchoolName: false,
      showGraduationYear: false,
      showChapter: true
    },
    accessibilityPreferences: {
      largeText: false,
      highContrast: false,
      reducedMotion: false,
      screenReaderOptimized: false
    },
    onboardingComplete: false,
    createdAt: now,
    updatedAt: now,
    lastActiveAt: now
  },
  events: [
    {
      id: "event-state-leadership",
      title: "California State Leadership Conference",
      description:
        "Three-day state conference with leadership workshops, competition briefings, and recognition events.",
      eventType: "state_conference",
      scopeType: "state",
      organizationId: "org-ca",
      stateChapterId: "org-ca",
      startTime: "2026-04-18T16:00:00.000Z",
      endTime: "2026-04-20T21:00:00.000Z",
      timezone: "America/Los_Angeles",
      locationName: "Anaheim Convention Center",
      locationAddress: "800 W Katella Ave, Anaheim, CA",
      status: "scheduled",
      sourceType: "official",
      sourceReference: "California FBLA conference calendar"
    },
    {
      id: "event-mobile-submission",
      title: "Mobile Application Development Submission Deadline",
      description:
        "Final deadline for mobile application assets, code review materials, and judging documentation.",
      eventType: "competitive_deadline",
      scopeType: "state",
      organizationId: "org-ca",
      stateChapterId: "org-ca",
      startTime: "2026-04-08T22:59:00.000Z",
      endTime: "2026-04-08T22:59:00.000Z",
      timezone: "America/Los_Angeles",
      locationName: "Online Submission Portal",
      virtualUrl: "https://cafbla.org/submissions",
      status: "open",
      sourceType: "official",
      sourceReference: "Competitive events guide"
    },
    {
      id: "event-chapter-meeting",
      title: "Monta Vista Chapter Strategy Night",
      description:
        "Weekly meeting focused on polishing presentations, reviewing deadlines, and coordinating peer feedback.",
      eventType: "chapter_meeting",
      scopeType: "chapter",
      organizationId: "org-monta-vista",
      stateChapterId: "org-ca",
      localChapterId: "org-monta-vista",
      startTime: "2026-04-02T02:30:00.000Z",
      endTime: "2026-04-02T04:00:00.000Z",
      timezone: "America/Los_Angeles",
      locationName: "Monta Vista Business Lab",
      status: "scheduled",
      sourceType: "curated",
      sourceReference: "Chapter calendar"
    },
    {
      id: "event-national-fall",
      title: "National Leadership Kickoff Webinar",
      description:
        "National-level webinar covering program opportunities, season planning, and key member resources.",
      eventType: "workshop",
      scopeType: "national",
      organizationId: "org-national",
      startTime: "2026-04-11T00:00:00.000Z",
      endTime: "2026-04-11T01:00:00.000Z",
      timezone: "America/Los_Angeles",
      locationName: "Live Stream",
      virtualUrl: "https://www.fbla.org",
      status: "scheduled",
      sourceType: "official"
    }
  ],
  eventSaves: [
    {
      id: "save-event-mobile-submission",
      userId: "user-demo",
      eventId: "event-mobile-submission",
      savedAt: now,
      reminder1: "2026-04-06T19:00:00.000Z",
      reminder2: "2026-04-08T17:00:00.000Z",
      personalNote: "Finalize demo flow and presentation timing.",
      studyPlanId: "study-mobile-polish"
    }
  ],
  resources: [
    {
      id: "resource-competition-guide",
      title: "Competitive Events Guide",
      summary:
        "Official guide for event rules, deliverables, judging flow, and competition preparation expectations.",
      resourceType: "guide",
      category: "competitive events",
      contentFormat: "url",
      scopeType: "national",
      organizationId: "org-national",
      url: "https://www.fbla.org",
      estimatedReadMinutes: 18,
      tags: ["official", "competition", "mobile application development"],
      sourceName: "FBLA National",
      sourceUrl: "https://www.fbla.org",
      publishedAt: "2026-02-01T16:00:00.000Z",
      updatedAt: "2026-03-25T16:00:00.000Z",
      isOfficial: true,
      isDownloadable: true
    },
    {
      id: "resource-demo-checklist",
      title: "Presentation Demo Checklist",
      summary:
        "Step-by-step checklist for hitting the strongest seven-minute walkthrough moments from profile setup to AI support.",
      resourceType: "checklist",
      category: "training materials",
      contentFormat: "embedded",
      scopeType: "state",
      organizationId: "org-ca",
      estimatedReadMinutes: 7,
      tags: ["demo", "presentation", "judging"],
      sourceName: "California FBLA",
      publishedAt: "2026-03-15T16:00:00.000Z",
      updatedAt: "2026-03-28T16:00:00.000Z",
      isOfficial: true,
      isDownloadable: false
    },
    {
      id: "resource-mobile-rubric",
      title: "Mobile App Rubric Deep Dive",
      summary:
        "Curated breakdown of the judging rubric with design, validation, and architecture highlights to emphasize.",
      resourceType: "article",
      category: "competitive events",
      contentFormat: "embedded",
      scopeType: "chapter",
      organizationId: "org-monta-vista",
      estimatedReadMinutes: 10,
      tags: ["architecture", "validation", "rubric"],
      sourceName: "Monta Vista FBLA",
      publishedAt: "2026-03-20T16:00:00.000Z",
      updatedAt: "2026-03-29T16:00:00.000Z",
      isOfficial: false,
      isDownloadable: false
    },
    {
      id: "resource-state-travel",
      title: "State Conference Travel Packet",
      summary:
        "Travel logistics, check-in times, housing expectations, and conference arrival guidance.",
      resourceType: "pdf",
      category: "conferences",
      contentFormat: "url",
      scopeType: "state",
      organizationId: "org-ca",
      url: "https://cafbla.org",
      estimatedReadMinutes: 8,
      tags: ["conference", "travel", "logistics"],
      sourceName: "California FBLA",
      sourceUrl: "https://cafbla.org",
      publishedAt: "2026-03-10T16:00:00.000Z",
      updatedAt: "2026-03-26T16:00:00.000Z",
      isOfficial: true,
      isDownloadable: true
    },
    {
      id: "resource-leadership-toolkit",
      title: "Leadership Growth Toolkit",
      summary:
        "A structured set of habits, reflection prompts, and chapter contribution ideas for members growing beyond competition.",
      resourceType: "template",
      category: "leadership development",
      contentFormat: "embedded",
      scopeType: "national",
      organizationId: "org-national",
      estimatedReadMinutes: 9,
      tags: ["leadership", "chapter life", "growth"],
      sourceName: "FBLA National",
      publishedAt: "2026-01-15T16:00:00.000Z",
      updatedAt: "2026-03-22T16:00:00.000Z",
      isOfficial: true,
      isDownloadable: false
    }
  ],
  resourceState: [
    {
      id: "resource-state-1",
      userId: "user-demo",
      resourceId: "resource-competition-guide",
      isSaved: true,
      isOfflineAvailable: true,
      readingProgressPercent: 70,
      lastOpenedAt: "2026-03-29T18:30:00.000Z",
      highlightCount: 5
    },
    {
      id: "resource-state-2",
      userId: "user-demo",
      resourceId: "resource-demo-checklist",
      isSaved: true,
      isOfflineAvailable: false,
      readingProgressPercent: 100,
      lastOpenedAt: "2026-03-30T07:40:00.000Z",
      highlightCount: 2
    }
  ],
  newsPosts: [
    {
      id: "news-deadline-window",
      title: "Submission window closes next week",
      body:
        "Competitive event final submissions close next week. Double-check your artifact list, citations, and presentation sequence before the deadline.",
      summary: "Final submission checks for competition teams.",
      scopeType: "state",
      organizationId: "org-ca",
      priorityLevel: "urgent",
      topicTags: ["deadline", "competition"],
      relatedEventId: "event-mobile-submission",
      publishedAt: "2026-03-29T14:30:00.000Z",
      createdByType: "state",
      isPinned: true,
      isOfficial: true
    },
    {
      id: "news-national-opportunity",
      title: "National leadership webinar registration is live",
      body:
        "Registration is now open for the national leadership kickoff webinar, including new member pathways and fall planning tips.",
      summary: "Registration opened for a national leadership webinar.",
      scopeType: "national",
      organizationId: "org-national",
      priorityLevel: "medium",
      topicTags: ["leadership", "webinar"],
      relatedEventId: "event-national-fall",
      publishedAt: "2026-03-28T17:00:00.000Z",
      createdByType: "national",
      isPinned: false,
      isOfficial: true
    },
    {
      id: "news-chapter-feedback",
      title: "Chapter peer review slots added",
      body:
        "Additional peer review slots are open before strategy night. Reserve a slot if you want presentation timing feedback.",
      summary: "More chapter review slots before strategy night.",
      scopeType: "chapter",
      organizationId: "org-monta-vista",
      priorityLevel: "high",
      topicTags: ["chapter", "feedback", "presentation"],
      relatedThreadId: "thread-demo-structure",
      publishedAt: "2026-03-30T01:00:00.000Z",
      createdByType: "chapter",
      isPinned: false,
      isOfficial: true
    }
  ],
  newsState: [
    {
      id: "news-state-1",
      userId: "user-demo",
      newsPostId: "news-national-opportunity",
      isRead: false,
      isSaved: false
    }
  ],
  socialChannels: [
    {
      id: "social-chapter-instagram",
      organizationId: "org-monta-vista",
      platform: "Instagram",
      handle: "@montavistafbla",
      profileUrl: "https://instagram.com/montavistafbla",
      displayName: "Monta Vista FBLA",
      isPrimary: true,
      isActive: true,
      lastVerifiedAt: now
    },
    {
      id: "social-state-youtube",
      organizationId: "org-ca",
      platform: "YouTube",
      handle: "@cafbla",
      profileUrl: "https://youtube.com/@cafbla",
      displayName: "California FBLA",
      isPrimary: true,
      isActive: true,
      lastVerifiedAt: now
    },
    {
      id: "social-national-site",
      organizationId: "org-national",
      platform: "Website",
      handle: "fbla.org",
      profileUrl: "https://www.fbla.org",
      displayName: "FBLA National",
      isPrimary: true,
      isActive: true,
      lastVerifiedAt: now
    }
  ],
  socialHighlights: [
    {
      id: "highlight-state-countdown",
      socialChannelId: "social-state-youtube",
      title: "Conference countdown and packing tips",
      summary: "A quick state chapter reel with arrival reminders and stage-day preparation tips.",
      externalPostUrl: "https://youtube.com/@cafbla",
      publishedAt: "2026-03-29T19:00:00.000Z",
      relatedEventId: "event-state-leadership"
    },
    {
      id: "highlight-chapter-build-night",
      socialChannelId: "social-chapter-instagram",
      title: "Build night recap",
      summary: "Chapter showcase from last night’s working session and mock judging rounds.",
      externalPostUrl: "https://instagram.com/montavistafbla",
      publishedAt: "2026-03-28T20:15:00.000Z",
      relatedNewsPostId: "news-chapter-feedback"
    }
  ],
  studyTracks: [
    {
      id: "study-mobile-polish",
      title: "Mobile App Final Polish Sprint",
      description:
        "A focused prep track covering architecture talking points, validation examples, and high-impact demo sequencing.",
      trackType: "event_prep",
      relatedEventId: "event-mobile-submission",
      relatedResourceIds: [
        "resource-competition-guide",
        "resource-demo-checklist",
        "resource-mobile-rubric"
      ],
      difficultyLevel: "advanced",
      estimatedTotalMinutes: 65,
      tags: ["mobile application development", "presentation", "validation"],
      isOfficial: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: "study-conference-readiness",
      title: "State Conference Readiness",
      description:
        "Track for travel prep, agenda planning, and event-day confidence before the state conference opens.",
      trackType: "event_prep",
      relatedEventId: "event-state-leadership",
      relatedResourceIds: ["resource-state-travel", "resource-leadership-toolkit"],
      difficultyLevel: "intermediate",
      estimatedTotalMinutes: 45,
      tags: ["conference", "travel", "leadership"],
      isOfficial: true,
      createdAt: now,
      updatedAt: now
    },
    {
      id: "study-presentation-presence",
      title: "Presentation Presence Builder",
      description:
        "Short practice units to tighten storytelling, confidence, transitions, and Q&A control.",
      trackType: "skills",
      relatedResourceIds: ["resource-demo-checklist"],
      difficultyLevel: "foundation",
      estimatedTotalMinutes: 30,
      tags: ["public speaking", "confidence", "delivery"],
      isOfficial: false,
      createdAt: now,
      updatedAt: now
    }
  ],
  studyUnits: [
    {
      id: "unit-architecture-story",
      studyTrackId: "study-mobile-polish",
      title: "Architecture Storyboard",
      unitType: "reading",
      contentRef: "Explain the layered architecture and why it matters to judges.",
      sequenceOrder: 1,
      estimatedMinutes: 10
    },
    {
      id: "unit-validation-quiz",
      studyTrackId: "study-mobile-polish",
      title: "Validation Rapid Quiz",
      unitType: "quiz",
      contentRef: "Validation rules, security boundaries, and recommendation logic.",
      sequenceOrder: 2,
      estimatedMinutes: 12
    },
    {
      id: "unit-demo-checklist",
      studyTrackId: "study-mobile-polish",
      title: "Demo Moment Checklist",
      unitType: "checklist",
      contentRef: "Save event -> AI help -> forum thread -> news deep link -> social hub.",
      sequenceOrder: 3,
      estimatedMinutes: 8
    }
  ],
  studyProgress: [
    {
      id: "study-progress-1",
      userId: "user-demo",
      studyTrackId: "study-mobile-polish",
      progressPercent: 68,
      lastOpenedAt: "2026-03-30T06:55:00.000Z",
      weakTopics: ["validation", "firestore schema"],
      nextRecommendedUnitId: "unit-demo-checklist"
    }
  ],
  quizAttempts: [
    {
      id: "quiz-attempt-1",
      userId: "user-demo",
      studyUnitId: "unit-validation-quiz",
      scorePercent: 72,
      questionCount: 10,
      correctCount: 7,
      attemptedAt: "2026-03-29T23:00:00.000Z",
      missedTopicTags: ["validation", "server-side checks"]
    }
  ],
  forumCategories: [
    {
      id: "forum-cat-competition",
      name: "Competition Discussion",
      description: "Strategy, build feedback, and event-specific questions.",
      scopeType: "state",
      organizationId: "org-ca",
      visibilityType: "public",
      sortOrder: 1
    },
    {
      id: "forum-cat-study",
      name: "Study Support",
      description: "Ask for help, compare weak topics, and share prep tips.",
      scopeType: "national",
      organizationId: "org-national",
      visibilityType: "public",
      sortOrder: 2
    }
  ],
  forumThreads: [
    {
      id: "thread-demo-structure",
      categoryId: "forum-cat-competition",
      authorUserId: "user-demo",
      title: "How are you structuring the strongest seven-minute demo?",
      body:
        "I’m trying to make sure the app feels connected rather than like a list of tabs. What sequence has landed best for you?",
      threadType: "discussion",
      status: "active",
      relatedEventId: "event-mobile-submission",
      relatedStudyTrackId: "study-mobile-polish",
      tags: ["demo", "mobile application development", "presentation"],
      replyCount: 2,
      helpfulCount: 9,
      viewCount: 44,
      createdAt: "2026-03-28T23:10:00.000Z",
      updatedAt: "2026-03-30T03:40:00.000Z",
      lastActivityAt: "2026-03-30T03:40:00.000Z"
    },
    {
      id: "thread-travel-questions",
      categoryId: "forum-cat-competition",
      authorUserId: "user-demo",
      title: "State conference arrival and check-in tips?",
      body:
        "Would love a simple rundown from anyone who attended last year. What should first-timers prioritize when they arrive?",
      threadType: "logistics",
      status: "active",
      relatedEventId: "event-state-leadership",
      relatedResourceId: "resource-state-travel",
      tags: ["conference", "travel", "first timers"],
      replyCount: 1,
      helpfulCount: 5,
      viewCount: 19,
      createdAt: "2026-03-27T20:30:00.000Z",
      updatedAt: "2026-03-29T05:10:00.000Z",
      lastActivityAt: "2026-03-29T05:10:00.000Z"
    }
  ],
  forumReplies: [
    {
      id: "reply-1",
      threadId: "thread-demo-structure",
      authorUserId: "user-demo",
      body:
        "What helped our chapter most was showing one action chain: save the event, watch the home screen update, then open the generated study prep.",
      status: "active",
      helpfulCount: 4,
      createdAt: "2026-03-29T02:00:00.000Z",
      updatedAt: "2026-03-29T02:00:00.000Z"
    },
    {
      id: "reply-2",
      threadId: "thread-demo-structure",
      authorUserId: "user-demo",
      body:
        "We also kept the social proof moment short. One official highlight card was enough to show prompt alignment without derailing the main story.",
      status: "active",
      helpfulCount: 2,
      createdAt: "2026-03-30T03:40:00.000Z",
      updatedAt: "2026-03-30T03:40:00.000Z"
    },
    {
      id: "reply-3",
      threadId: "thread-travel-questions",
      authorUserId: "user-demo",
      body:
        "Try to pre-save your schedule and logistics documents before travel day. It makes spotty internet much less stressful at the venue.",
      status: "active",
      helpfulCount: 3,
      createdAt: "2026-03-29T05:10:00.000Z",
      updatedAt: "2026-03-29T05:10:00.000Z"
    }
  ],
  forumFollows: [
    {
      id: "follow-thread-1",
      userId: "user-demo",
      threadId: "thread-demo-structure",
      followedAt: now
    }
  ],
  aiConversations: [],
  aiGeneratedAssets: []
};

export const demoOptionCatalog = {
  goals: [
    "compete this year",
    "attend more chapter events",
    "learn about FBLA opportunities",
    "improve business knowledge",
    "prepare for conferences",
    "explore leadership growth"
  ],
  generalInterests: ["leadership", "networking", "career growth", "service", "chapter life"],
  competitionInterests: [
    "mobile application development",
    "public speaking",
    "network design",
    "business management",
    "coding and programming"
  ]
};
