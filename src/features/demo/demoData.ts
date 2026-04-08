import { DemoDataset } from "@/domain/models/types";

const now = "2026-04-03T16:00:00.000Z";

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
      id: "org-ca-bay",
      type: "state_subdivision",
      name: "Southern Section",
      shortName: "Southern Section",
      parentOrganizationId: "org-ca",
      stateCode: "CA",
      subdivisionTypeLabel: "section",
      status: "active"
    },
    {
      id: "org-ca-sv",
      type: "state_subdivision",
      name: "Inland Section",
      shortName: "Inland Section",
      parentOrganizationId: "org-ca",
      stateCode: "CA",
      subdivisionTypeLabel: "section",
      status: "active"
    },
    {
      id: "org-monta-vista",
      type: "local_chapter",
      name: "Glen A. Wilson FBLA",
      shortName: "Glen A. Wilson",
      parentOrganizationId: "org-ca",
      stateCode: "CA",
      schoolName: "Glen A. Wilson High School",
      status: "active",
      websiteUrl: "https://www.fbla.org"
    },
    {
      id: "org-irvington",
      type: "local_chapter",
      name: "Irvington FBLA",
      shortName: "Irvington",
      parentOrganizationId: "org-ca",
      stateCode: "CA",
      schoolName: "Irvington High School",
      status: "active"
    },
    {
      id: "org-tx",
      type: "state_chapter",
      name: "Texas FBLA",
      shortName: "TX FBLA",
      parentOrganizationId: "org-national",
      stateCode: "TX",
      status: "active"
    },
    {
      id: "org-westlake",
      type: "local_chapter",
      name: "Westlake FBLA",
      shortName: "Westlake",
      parentOrganizationId: "org-tx",
      stateCode: "TX",
      schoolName: "Westlake High School",
      status: "active"
    },
    {
      id: "org-wa",
      type: "state_chapter",
      name: "Washington FBLA",
      shortName: "WA FBLA",
      parentOrganizationId: "org-national",
      stateCode: "WA",
      status: "active"
    },
    {
      id: "org-bellevue",
      type: "local_chapter",
      name: "Bellevue FBLA",
      shortName: "Bellevue",
      parentOrganizationId: "org-wa",
      stateCode: "WA",
      schoolName: "Bellevue High School",
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
    schoolName: "Glen A. Wilson High School",
    localChapterId: "org-monta-vista",
    stateChapterId: "org-ca",
    stateSubdivisionId: "org-ca-bay",
    goals: [
      "compete this year",
      "prepare for conferences",
      "explore leadership growth",
      "improve business knowledge"
    ],
    generalInterests: ["leadership", "networking", "career growth", "chapter life"],
    competitionInterests: [
      "mobile application development",
      "public speaking",
      "business management"
    ],
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
        start: "22:30",
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
    onboardingComplete: true,
    createdAt: "2026-01-08T18:30:00.000Z",
    updatedAt: now,
    lastActiveAt: now
  },
  events: [
    {
      id: "event-chapter-strategy-night",
      title: "Glen A. Wilson Strategy Night",
      description:
        "Weekly build night focused on tightening demo flow, clarifying talking points, and reviewing any open chapter deadlines before the next practice round.",
      eventType: "chapter_meeting",
      scopeType: "chapter",
      organizationId: "org-monta-vista",
      stateChapterId: "org-ca",
      localChapterId: "org-monta-vista",
      startTime: "2026-04-07T02:15:00.000Z",
      endTime: "2026-04-07T04:00:00.000Z",
      timezone: "America/Los_Angeles",
      locationName: "Glen A. Wilson Business Lab",
      status: "scheduled",
      sourceType: "curated",
      sourceReference: "Chapter officer planning board"
    },
    {
      id: "event-chapter-recruitment-open-house",
      title: "Spring Member Recruitment Open House",
      description:
        "An after-school showcase for prospective members featuring officer introductions, event demos, and current member project tables.",
      eventType: "chapter_activity",
      scopeType: "chapter",
      organizationId: "org-monta-vista",
      stateChapterId: "org-ca",
      localChapterId: "org-monta-vista",
      startTime: "2026-04-10T01:30:00.000Z",
      endTime: "2026-04-10T03:30:00.000Z",
      timezone: "America/Los_Angeles",
      locationName: "Student Union",
      status: "scheduled",
      sourceType: "curated",
      sourceReference: "Chapter spring outreach calendar"
    },
    {
      id: "event-chapter-service-supply-sort",
      title: "School Supply Service Sort Night",
      description:
        "Members package service-drive donations, prep thank-you notes, and finalize volunteer roles for the weekend community distribution shift.",
      eventType: "chapter_activity",
      scopeType: "chapter",
      organizationId: "org-monta-vista",
      stateChapterId: "org-ca",
      localChapterId: "org-monta-vista",
      startTime: "2026-04-16T01:00:00.000Z",
      endTime: "2026-04-16T03:00:00.000Z",
      timezone: "America/Los_Angeles",
      locationName: "Leadership Room 204",
      status: "scheduled",
      sourceType: "curated",
      sourceReference: "Community service committee plan"
    },
    {
      id: "event-chapter-speaking-lab",
      title: "Speaking Lab and Mock Q&A",
      description:
        "A focused chapter practice session for event intros, transitions, timing, and short-answer Q&A confidence.",
      eventType: "workshop",
      scopeType: "chapter",
      organizationId: "org-monta-vista",
      stateChapterId: "org-ca",
      localChapterId: "org-monta-vista",
      startTime: "2026-04-21T01:30:00.000Z",
      endTime: "2026-04-21T03:15:00.000Z",
      timezone: "America/Los_Angeles",
      locationName: "Library Presentation Room",
      status: "scheduled",
      sourceType: "curated",
      sourceReference: "Chapter competitive events calendar"
    },
    {
      id: "event-chapter-parent-preview",
      title: "Member Showcase and Parent Preview",
      description:
        "An evening chapter showcase where competitors rehearse, families preview projects, and officers share season highlights and next steps.",
      eventType: "chapter_activity",
      scopeType: "chapter",
      organizationId: "org-monta-vista",
      stateChapterId: "org-ca",
      localChapterId: "org-monta-vista",
      startTime: "2026-04-24T01:30:00.000Z",
      endTime: "2026-04-24T03:00:00.000Z",
      timezone: "America/Los_Angeles",
      locationName: "Glen A. Wilson Student Union",
      status: "scheduled",
      sourceType: "curated",
      sourceReference: "Chapter showcase schedule"
    },
    {
      id: "event-chapter-officer-transition-retreat",
      title: "Officer Transition Retreat",
      description:
        "Incoming and outgoing officers align on handoff notes, summer planning, chapter systems, and first-meeting priorities for fall.",
      eventType: "milestone",
      scopeType: "chapter",
      organizationId: "org-monta-vista",
      stateChapterId: "org-ca",
      localChapterId: "org-monta-vista",
      startTime: "2026-05-02T17:30:00.000Z",
      endTime: "2026-05-02T22:30:00.000Z",
      timezone: "America/Los_Angeles",
      locationName: "Cupertino Community Center",
      status: "scheduled",
      sourceType: "curated",
      sourceReference: "Officer transition timeline"
    },
    {
      id: "event-bay-mock-interviews",
      title: "Southern Section Mock Interview Workshop",
      description:
        "Small-group workshop with alumni and officers focused on interview delivery, confidence, and useful live feedback.",
      eventType: "subdivision_event",
      scopeType: "subdivision",
      organizationId: "org-ca-bay",
      stateChapterId: "org-ca",
      stateSubdivisionId: "org-ca-bay",
      startTime: "2026-04-05T20:00:00.000Z",
      endTime: "2026-04-05T22:00:00.000Z",
      timezone: "America/Los_Angeles",
      locationName: "Cupertino Community Room",
      status: "scheduled",
      sourceType: "curated",
      sourceReference: "Southern Section prep calendar"
    },
    {
      id: "event-bay-objective-test-bootcamp",
      title: "Southern Section Objective Test Bootcamp",
      description:
        "A fast-moving review session for testing strategy, timing, and common weak areas before members sit for scored objective tests.",
      eventType: "subdivision_event",
      scopeType: "subdivision",
      organizationId: "org-ca-bay",
      stateChapterId: "org-ca",
      stateSubdivisionId: "org-ca-bay",
      startTime: "2026-04-12T20:30:00.000Z",
      endTime: "2026-04-12T22:30:00.000Z",
      timezone: "America/Los_Angeles",
      locationName: "Fremont Main Library",
      status: "scheduled",
      sourceType: "curated",
      sourceReference: "Southern Section member workshop board"
    },
    {
      id: "event-bay-leadership-roundtable",
      title: "Southern Section Leadership Roundtable",
      description:
        "A subdivision conversation for chapter officers on retention, recruitment, meeting quality, and balancing service and competition.",
      eventType: "subdivision_event",
      scopeType: "subdivision",
      organizationId: "org-ca-bay",
      stateChapterId: "org-ca",
      stateSubdivisionId: "org-ca-bay",
      startTime: "2026-04-29T01:00:00.000Z",
      endTime: "2026-04-29T02:30:00.000Z",
      timezone: "America/Los_Angeles",
      locationName: "Virtual Roundtable",
      virtualUrl: "https://www.fbla.org",
      status: "scheduled",
      sourceType: "curated",
      sourceReference: "Southern Section officer coordination board"
    },
    {
      id: "event-state-registration-window",
      title: "State Leadership Conference Registration Window Closes",
      description:
        "Final internal cutoff for registration adjustments, adviser confirmations, and rooming alignment before state conference travel planning locks.",
      eventType: "competitive_deadline",
      scopeType: "state",
      organizationId: "org-ca",
      stateChapterId: "org-ca",
      startTime: "2026-04-08T23:00:00.000Z",
      endTime: "2026-04-08T23:00:00.000Z",
      timezone: "America/Los_Angeles",
      locationName: "CA FBLA Registration Portal",
      virtualUrl: "https://cafbla.org",
      status: "open",
      sourceType: "official",
      sourceReference: "Demo-safe state conference planning milestone"
    },
    {
      id: "event-state-upload-office-hours",
      title: "Competitive Events Upload Office Hours",
      description:
        "State officers answer last-minute upload questions, file formatting issues, and judging material checklist questions.",
      eventType: "workshop",
      scopeType: "state",
      organizationId: "org-ca",
      stateChapterId: "org-ca",
      startTime: "2026-04-09T02:00:00.000Z",
      endTime: "2026-04-09T03:15:00.000Z",
      timezone: "America/Los_Angeles",
      locationName: "Virtual Office Hours",
      virtualUrl: "https://cafbla.org",
      status: "scheduled",
      sourceType: "official",
      sourceReference: "State officer office hours board"
    },
    {
      id: "event-state-travel-webinar",
      title: "State Conference Travel and Check-In Webinar",
      description:
        "A practical briefing on arrival windows, packing, expectations, adviser communication, and what to do during the first ninety minutes on site.",
      eventType: "workshop",
      scopeType: "state",
      organizationId: "org-ca",
      stateChapterId: "org-ca",
      startTime: "2026-04-11T18:00:00.000Z",
      endTime: "2026-04-11T19:00:00.000Z",
      timezone: "America/Los_Angeles",
      locationName: "Live Webinar",
      virtualUrl: "https://cafbla.org",
      status: "scheduled",
      sourceType: "official",
      sourceReference: "State travel communications packet"
    },
    {
      id: "event-state-rooming-list",
      title: "Hotel Rooming List and Chaperone Roster Due",
      description:
        "Deadline for final rooming assignments, travel rosters, and last changes before the conference housing file is locked.",
      eventType: "milestone",
      scopeType: "state",
      organizationId: "org-ca",
      stateChapterId: "org-ca",
      startTime: "2026-04-14T19:00:00.000Z",
      endTime: "2026-04-14T19:00:00.000Z",
      timezone: "America/Los_Angeles",
      locationName: "CA FBLA Travel Desk",
      virtualUrl: "https://cafbla.org",
      status: "open",
      sourceType: "official",
      sourceReference: "Conference logistics bulletin"
    },
    {
      id: "event-state-coaching-clinic",
      title: "Business Presentation Coaching Clinic",
      description:
        "An evening clinic with scoring practice, slide-story feedback, and a final checklist for members polishing presentation events.",
      eventType: "workshop",
      scopeType: "state",
      organizationId: "org-ca",
      stateChapterId: "org-ca",
      startTime: "2026-04-15T01:30:00.000Z",
      endTime: "2026-04-15T03:00:00.000Z",
      timezone: "America/Los_Angeles",
      locationName: "Virtual Coaching Room",
      virtualUrl: "https://cafbla.org",
      status: "scheduled",
      sourceType: "official",
      sourceReference: "State training calendar"
    },
    {
      id: "event-state-leadership-conference",
      title: "California State Leadership Conference",
      description:
        "A multi-day state conference with leadership sessions, competition blocks, networking opportunities, and member recognition programming.",
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
      sourceReference: "Demo-safe state conference anchor event"
    },
    {
      id: "event-state-judging-orientation",
      title: "Presentation Events Judging Orientation",
      description:
        "A short virtual orientation outlining room flow, timing expectations, and how to settle nerves before presentation rounds begin.",
      eventType: "workshop",
      scopeType: "state",
      organizationId: "org-ca",
      stateChapterId: "org-ca",
      startTime: "2026-04-17T01:00:00.000Z",
      endTime: "2026-04-17T01:45:00.000Z",
      timezone: "America/Los_Angeles",
      locationName: "Virtual Briefing",
      virtualUrl: "https://cafbla.org",
      status: "scheduled",
      sourceType: "official",
      sourceReference: "Competitive events communications"
    },
    {
      id: "event-state-summer-application-workshop",
      title: "Summer Leadership Programs Interest Workshop",
      description:
        "A state-led workshop helping members compare summer leadership options, applications, and personal fit.",
      eventType: "workshop",
      scopeType: "state",
      organizationId: "org-ca",
      stateChapterId: "org-ca",
      startTime: "2026-05-05T01:00:00.000Z",
      endTime: "2026-05-05T02:15:00.000Z",
      timezone: "America/Los_Angeles",
      locationName: "Virtual Session",
      virtualUrl: "https://cafbla.org",
      status: "scheduled",
      sourceType: "official",
      sourceReference: "Leadership development calendar"
    },
    {
      id: "event-state-community-service-showcase",
      title: "State Community Service Showcase Submission",
      description:
        "Soft deadline for chapter service recap slides, impact numbers, and photos before the spring showcase collection closes.",
      eventType: "competitive_deadline",
      scopeType: "state",
      organizationId: "org-ca",
      stateChapterId: "org-ca",
      startTime: "2026-05-08T23:59:00.000Z",
      endTime: "2026-05-08T23:59:00.000Z",
      timezone: "America/Los_Angeles",
      locationName: "CA FBLA Submission Form",
      virtualUrl: "https://cafbla.org",
      status: "open",
      sourceType: "official",
      sourceReference: "State chapter service showcase memo"
    },
    {
      id: "event-national-kickoff-webinar",
      title: "National Leadership Kickoff Webinar",
      description:
        "A national-level webinar covering leadership opportunities, season planning habits, and the strongest ways to use official member resources.",
      eventType: "workshop",
      scopeType: "national",
      organizationId: "org-national",
      startTime: "2026-04-13T00:00:00.000Z",
      endTime: "2026-04-13T01:00:00.000Z",
      timezone: "America/Los_Angeles",
      locationName: "National Live Stream",
      virtualUrl: "https://www.fbla.org",
      status: "scheduled",
      sourceType: "official",
      sourceReference: "National webinar calendar"
    },
    {
      id: "event-national-officer-interest-call",
      title: "National Officer Interest Call",
      description:
        "A short Q&A for members curious about future officer pipelines, leadership expectations, and how to start building readiness now.",
      eventType: "workshop",
      scopeType: "national",
      organizationId: "org-national",
      startTime: "2026-04-22T23:00:00.000Z",
      endTime: "2026-04-23T00:00:00.000Z",
      timezone: "America/Los_Angeles",
      locationName: "National Zoom Room",
      virtualUrl: "https://www.fbla.org",
      status: "scheduled",
      sourceType: "official",
      sourceReference: "National leadership interest series"
    },
    {
      id: "event-national-membership-challenge",
      title: "National Membership Momentum Challenge Kickoff",
      description:
        "A national campaign launch sharing chapter recruitment ideas, member welcome systems, and chapter-storytelling examples.",
      eventType: "milestone",
      scopeType: "national",
      organizationId: "org-national",
      startTime: "2026-04-27T23:30:00.000Z",
      endTime: "2026-04-28T00:15:00.000Z",
      timezone: "America/Los_Angeles",
      locationName: "National Campaign Live",
      virtualUrl: "https://www.fbla.org",
      status: "scheduled",
      sourceType: "official",
      sourceReference: "Membership campaign toolkit"
    },
    {
      id: "event-national-collegiate-panel",
      title: "College and Career Transition Panel",
      description:
        "A member-facing panel with alumni on networking, summer opportunities, and how to carry chapter experience into the next step after graduation.",
      eventType: "workshop",
      scopeType: "national",
      organizationId: "org-national",
      startTime: "2026-05-06T00:00:00.000Z",
      endTime: "2026-05-06T01:15:00.000Z",
      timezone: "America/Los_Angeles",
      locationName: "National Webinar",
      virtualUrl: "https://www.fbla.org",
      status: "scheduled",
      sourceType: "official",
      sourceReference: "National member growth series"
    }
  ],
  eventSaves: [
    {
      id: "save-event-state-registration-window",
      userId: "user-demo",
      eventId: "event-state-registration-window",
      savedAt: "2026-04-01T20:00:00.000Z",
      reminder1: "2026-04-06T18:00:00.000Z",
      reminder2: "2026-04-08T17:00:00.000Z",
      personalNote: "Double-check adviser roster and teammate registration details.",
      studyPlanId: "study-conference-readiness"
    },
    {
      id: "save-event-state-travel-webinar",
      userId: "user-demo",
      eventId: "event-state-travel-webinar",
      savedAt: "2026-04-02T18:15:00.000Z",
      reminder1: "2026-04-11T16:30:00.000Z",
      personalNote: "Ask about check-in timing and presentation equipment backup plans."
    },
    {
      id: "save-event-state-leadership-conference",
      userId: "user-demo",
      eventId: "event-state-leadership-conference",
      savedAt: "2026-04-02T18:20:00.000Z",
      reminder1: "2026-04-16T18:00:00.000Z",
      reminder2: "2026-04-17T16:00:00.000Z",
      personalNote: "Finalize packing list, presentation backup, and arrival messaging.",
      studyPlanId: "study-mobile-polish"
    },
    {
      id: "save-event-chapter-speaking-lab",
      userId: "user-demo",
      eventId: "event-chapter-speaking-lab",
      savedAt: "2026-04-03T01:10:00.000Z",
      reminder1: "2026-04-20T21:00:00.000Z",
      personalNote: "Use this as the final full-speed mock run."
    },
    {
      id: "save-event-national-kickoff-webinar",
      userId: "user-demo",
      eventId: "event-national-kickoff-webinar",
      savedAt: "2026-04-03T04:00:00.000Z",
      reminder1: "2026-04-12T18:00:00.000Z",
      personalNote: "Worth attending for leadership growth ideas after SLC."
    },
    {
      id: "save-event-chapter-officer-transition-retreat",
      userId: "user-demo",
      eventId: "event-chapter-officer-transition-retreat",
      savedAt: "2026-04-03T04:20:00.000Z",
      reminder1: "2026-05-01T17:30:00.000Z",
      personalNote: "Bring onboarding notes and fall first-meeting ideas.",
      studyPlanId: "study-officer-transition"
    }
  ],
  resources: [
    {
      id: "resource-competition-guide",
      title: "Competitive Events Guide",
      summary:
        "A high-level official guide covering event rules, deliverables, judging flow, and preparation expectations across competition categories.",
      resourceType: "guide",
      category: "official documents",
      contentFormat: "url",
      scopeType: "national",
      organizationId: "org-national",
      url: "https://www.fbla.org",
      estimatedReadMinutes: 18,
      tags: ["official", "competition", "mobile", "business"],
      sourceName: "FBLA National",
      sourceUrl: "https://www.fbla.org",
      publishedAt: "2026-02-01T16:00:00.000Z",
      updatedAt: "2026-03-28T16:00:00.000Z",
      isOfficial: true,
      isDownloadable: true
    },
    {
      id: "resource-business-presentation-rubric",
      title: "Business Presentation Rubric Guide",
      summary:
        "A scoring-focused breakdown of strong structure, transitions, visuals, confidence, and judge-facing clarity in presentation events.",
      resourceType: "guide",
      category: "competitive events",
      contentFormat: "embedded",
      scopeType: "state",
      organizationId: "org-ca",
      estimatedReadMinutes: 12,
      tags: ["business", "presentation", "rubric", "judging"],
      sourceName: "California FBLA",
      publishedAt: "2026-03-18T16:00:00.000Z",
      updatedAt: "2026-03-30T16:00:00.000Z",
      isOfficial: true,
      isDownloadable: false
    },
    {
      id: "resource-mobile-architecture-notes",
      title: "Mobile App Architecture Talking Points",
      summary:
        "Curated notes on explaining data flow, validation boundaries, user-state persistence, and why the app feels integrated during judging.",
      resourceType: "article",
      category: "training materials",
      contentFormat: "embedded",
      scopeType: "chapter",
      organizationId: "org-monta-vista",
      estimatedReadMinutes: 10,
      tags: ["mobile", "architecture", "validation", "presentation"],
      sourceName: "Glen A. Wilson FBLA",
      publishedAt: "2026-03-21T16:00:00.000Z",
      updatedAt: "2026-04-01T16:00:00.000Z",
      isOfficial: false,
      isDownloadable: false
    },
    {
      id: "resource-state-travel-packet",
      title: "State Conference Travel Packet",
      summary:
        "Travel logistics, check-in times, housing expectations, and conference arrival guidance for the state conference trip.",
      resourceType: "pdf",
      category: "conferences",
      contentFormat: "document",
      scopeType: "state",
      organizationId: "org-ca",
      storagePath: "demo-local-travel-packet",
      estimatedReadMinutes: 8,
      tags: ["conference", "travel", "logistics", "packing"],
      sourceName: "California FBLA",
      sourceUrl: "https://cafbla.org",
      publishedAt: "2026-03-10T16:00:00.000Z",
      updatedAt: "2026-03-26T16:00:00.000Z",
      isOfficial: true,
      isDownloadable: true
    },
    {
      id: "resource-conference-packing-checklist",
      title: "Conference Packing Checklist",
      summary:
        "A concise checklist covering attire, chargers, printed backups, badges, water, and quick travel-day essentials.",
      resourceType: "checklist",
      category: "conferences",
      contentFormat: "embedded",
      scopeType: "state",
      organizationId: "org-ca",
      estimatedReadMinutes: 5,
      tags: ["conference", "packing", "travel", "checklist"],
      sourceName: "California FBLA",
      publishedAt: "2026-03-22T16:00:00.000Z",
      updatedAt: "2026-04-01T16:00:00.000Z",
      isOfficial: true,
      isDownloadable: false
    },
    {
      id: "resource-officer-transition-playbook",
      title: "Officer Transition Playbook",
      summary:
        "A practical handbook for handoff notes, calendar ownership, committee structure, onboarding, and preserving chapter momentum between teams.",
      resourceType: "pdf",
      category: "leadership development",
      contentFormat: "document",
      scopeType: "national",
      organizationId: "org-national",
      storagePath: "demo-local-officer-transition",
      estimatedReadMinutes: 14,
      tags: ["leadership", "officer", "transition", "chapter"],
      sourceName: "FBLA National",
      sourceUrl: "https://www.fbla.org",
      publishedAt: "2026-02-12T16:00:00.000Z",
      updatedAt: "2026-03-29T16:00:00.000Z",
      isOfficial: true,
      isDownloadable: true
    },
    {
      id: "resource-public-speaking-prep",
      title: "Public Speaking Prep Guide",
      summary:
        "Short drills for pacing, eye contact, transitions, and recovering smoothly when you lose a sentence or get an unexpected question.",
      resourceType: "guide",
      category: "training materials",
      contentFormat: "embedded",
      scopeType: "national",
      organizationId: "org-national",
      estimatedReadMinutes: 11,
      tags: ["public", "speaking", "delivery", "confidence"],
      sourceName: "FBLA National",
      publishedAt: "2026-02-18T16:00:00.000Z",
      updatedAt: "2026-03-25T16:00:00.000Z",
      isOfficial: true,
      isDownloadable: false
    },
    {
      id: "resource-networking-tips",
      title: "Networking Conversation Starters",
      summary:
        "A member-friendly handout for starting conversations at conferences, introducing yourself with confidence, and leaving a strong professional impression.",
      resourceType: "article",
      category: "leadership development",
      contentFormat: "embedded",
      scopeType: "national",
      organizationId: "org-national",
      estimatedReadMinutes: 7,
      tags: ["networking", "confidence", "conference", "leadership"],
      sourceName: "FBLA National",
      publishedAt: "2026-02-25T16:00:00.000Z",
      updatedAt: "2026-03-24T16:00:00.000Z",
      isOfficial: true,
      isDownloadable: false
    },
    {
      id: "resource-chapter-agenda-template",
      title: "Chapter Meeting Agenda Template",
      summary:
        "A reusable agenda layout with openings, committee updates, calendar checkpoints, and a closing action section.",
      resourceType: "template",
      category: "guides / templates",
      contentFormat: "embedded",
      scopeType: "chapter",
      organizationId: "org-monta-vista",
      estimatedReadMinutes: 4,
      tags: ["chapter", "meeting", "agenda", "officer"],
      sourceName: "Glen A. Wilson FBLA",
      publishedAt: "2026-03-02T16:00:00.000Z",
      updatedAt: "2026-03-30T16:00:00.000Z",
      isOfficial: false,
      isDownloadable: true
    },
    {
      id: "resource-service-project-worksheet",
      title: "Community Service Planning Worksheet",
      summary:
        "A worksheet for event goals, volunteer roles, collection targets, communications, and simple post-event reflection.",
      resourceType: "template",
      category: "membership / chapter life",
      contentFormat: "embedded",
      scopeType: "chapter",
      organizationId: "org-monta-vista",
      estimatedReadMinutes: 6,
      tags: ["service", "chapter", "planning", "leadership"],
      sourceName: "Glen A. Wilson FBLA",
      publishedAt: "2026-03-14T16:00:00.000Z",
      updatedAt: "2026-03-31T16:00:00.000Z",
      isOfficial: false,
      isDownloadable: true
    },
    {
      id: "resource-objective-test-strategy",
      title: "Objective Test Strategy Guide",
      summary:
        "A tested approach to timing, educated guessing, marking uncertain questions, and building a short recovery routine before results spiral.",
      resourceType: "guide",
      category: "competitive events",
      contentFormat: "embedded",
      scopeType: "state",
      organizationId: "org-ca",
      estimatedReadMinutes: 9,
      tags: ["objective", "test", "strategy", "business"],
      sourceName: "California FBLA",
      publishedAt: "2026-03-12T16:00:00.000Z",
      updatedAt: "2026-03-29T16:00:00.000Z",
      isOfficial: true,
      isDownloadable: false
    },
    {
      id: "resource-conference-etiquette",
      title: "Conference Etiquette Quick Guide",
      summary:
        "A short guide on professionalism, room etiquette, courtesy in shared spaces, and small habits that make members stand out for the right reasons.",
      resourceType: "pdf",
      category: "conferences",
      contentFormat: "document",
      scopeType: "national",
      organizationId: "org-national",
      storagePath: "demo-local-conference-etiquette",
      estimatedReadMinutes: 7,
      tags: ["conference", "etiquette", "professionalism", "networking"],
      sourceName: "FBLA National",
      sourceUrl: "https://www.fbla.org",
      publishedAt: "2026-03-01T16:00:00.000Z",
      updatedAt: "2026-03-22T16:00:00.000Z",
      isOfficial: true,
      isDownloadable: true
    },
    {
      id: "resource-roleplay-prep-notes",
      title: "Roleplay Prep Notes",
      summary:
        "A concise sheet on listening for the real prompt, structuring recommendations fast, and sounding calm while thinking out loud.",
      resourceType: "study_reference",
      category: "competitive events",
      contentFormat: "embedded",
      scopeType: "national",
      organizationId: "org-national",
      estimatedReadMinutes: 8,
      tags: ["roleplay", "business", "strategy", "presentation"],
      sourceName: "FBLA National",
      publishedAt: "2026-02-28T16:00:00.000Z",
      updatedAt: "2026-03-27T16:00:00.000Z",
      isOfficial: true,
      isDownloadable: false
    },
    {
      id: "resource-mobile-demo-checklist",
      title: "Demo Moment Checklist",
      summary:
        "A polished chapter checklist for keeping the app walkthrough connected from home to events, resources, AI, and community.",
      resourceType: "checklist",
      category: "training materials",
      contentFormat: "embedded",
      scopeType: "chapter",
      organizationId: "org-monta-vista",
      estimatedReadMinutes: 6,
      tags: ["mobile", "demo", "presentation", "checklist"],
      sourceName: "Glen A. Wilson FBLA",
      publishedAt: "2026-03-20T16:00:00.000Z",
      updatedAt: "2026-04-02T16:00:00.000Z",
      isOfficial: false,
      isDownloadable: false
    },
    {
      id: "resource-validation-rules-sheet",
      title: "Validation and Guardrails Notes",
      summary:
        "A speaking aid for explaining onboarding validation, saved-state consistency, and why guardrails matter in member-facing tools.",
      resourceType: "article",
      category: "training materials",
      contentFormat: "embedded",
      scopeType: "chapter",
      organizationId: "org-monta-vista",
      estimatedReadMinutes: 7,
      tags: ["validation", "mobile", "architecture", "business"],
      sourceName: "Glen A. Wilson FBLA",
      publishedAt: "2026-03-23T16:00:00.000Z",
      updatedAt: "2026-04-02T16:00:00.000Z",
      isOfficial: false,
      isDownloadable: false
    },
    {
      id: "resource-state-presentation-room-flow",
      title: "Presentation Room Flow Overview",
      summary:
        "A calm, step-by-step explanation of arrival, setup, timing, introductions, and exits for presentation events.",
      resourceType: "guide",
      category: "competitive events",
      contentFormat: "embedded",
      scopeType: "state",
      organizationId: "org-ca",
      estimatedReadMinutes: 8,
      tags: ["presentation", "conference", "timing", "judging"],
      sourceName: "California FBLA",
      publishedAt: "2026-03-25T16:00:00.000Z",
      updatedAt: "2026-04-01T16:00:00.000Z",
      isOfficial: true,
      isDownloadable: false
    },
    {
      id: "resource-recruitment-campaign-playbook",
      title: "Spring Recruitment Campaign Playbook",
      summary:
        "A chapter-friendly guide to open houses, classroom visits, officer intros, and following up with interested students.",
      resourceType: "guide",
      category: "membership / chapter life",
      contentFormat: "embedded",
      scopeType: "chapter",
      organizationId: "org-monta-vista",
      estimatedReadMinutes: 9,
      tags: ["chapter", "recruitment", "membership", "leadership"],
      sourceName: "Glen A. Wilson FBLA",
      publishedAt: "2026-03-08T16:00:00.000Z",
      updatedAt: "2026-03-28T16:00:00.000Z",
      isOfficial: false,
      isDownloadable: false
    },
    {
      id: "resource-official-branding-reference",
      title: "Official Branding and Slide Reference",
      summary:
        "A quick reference on logo use, slide cleanliness, readable contrast, and staying polished without overdesigning a deck.",
      resourceType: "policy",
      category: "official documents",
      contentFormat: "url",
      scopeType: "national",
      organizationId: "org-national",
      url: "https://www.fbla.org",
      estimatedReadMinutes: 8,
      tags: ["official", "branding", "presentation", "slides"],
      sourceName: "FBLA National",
      sourceUrl: "https://www.fbla.org",
      publishedAt: "2026-02-14T16:00:00.000Z",
      updatedAt: "2026-03-19T16:00:00.000Z",
      isOfficial: true,
      isDownloadable: true
    },
    {
      id: "resource-officer-election-toolkit",
      title: "Officer Election Toolkit",
      summary:
        "Suggested timelines, campaign norms, speech prep tips, and a clean transfer plan for chapters entering election season.",
      resourceType: "template",
      category: "leadership development",
      contentFormat: "embedded",
      scopeType: "state",
      organizationId: "org-ca",
      estimatedReadMinutes: 10,
      tags: ["officer", "leadership", "chapter", "transition"],
      sourceName: "California FBLA",
      publishedAt: "2026-03-05T16:00:00.000Z",
      updatedAt: "2026-03-29T16:00:00.000Z",
      isOfficial: true,
      isDownloadable: false
    },
    {
      id: "resource-business-communication-review",
      title: "Business Communication Review Pack",
      summary:
        "A compact study reference for tone, audience, formatting, and common communication scenarios that show up in objective-test prep.",
      resourceType: "study_reference",
      category: "competitive events",
      contentFormat: "embedded",
      scopeType: "national",
      organizationId: "org-national",
      estimatedReadMinutes: 13,
      tags: ["business", "communication", "test", "review"],
      sourceName: "FBLA National",
      publishedAt: "2026-02-20T16:00:00.000Z",
      updatedAt: "2026-03-26T16:00:00.000Z",
      isOfficial: true,
      isDownloadable: false
    },
    {
      id: "resource-meeting-procedure-notes",
      title: "Meeting Procedure Notes",
      summary:
        "A student-friendly overview of motions, recognition, simple parliamentary procedure, and how to keep meetings moving without sounding stiff.",
      resourceType: "article",
      category: "leadership development",
      contentFormat: "embedded",
      scopeType: "national",
      organizationId: "org-national",
      estimatedReadMinutes: 8,
      tags: ["meeting", "leadership", "chapter", "procedure"],
      sourceName: "FBLA National",
      publishedAt: "2026-02-22T16:00:00.000Z",
      updatedAt: "2026-03-23T16:00:00.000Z",
      isOfficial: true,
      isDownloadable: false
    },
    {
      id: "resource-fundraising-idea-sheet",
      title: "Chapter Fundraising Idea Sheet",
      summary:
        "An idea bank for realistic chapter fundraisers with effort estimates, student appeal, and execution reminders.",
      resourceType: "article",
      category: "membership / chapter life",
      contentFormat: "embedded",
      scopeType: "state",
      organizationId: "org-ca",
      estimatedReadMinutes: 6,
      tags: ["chapter", "fundraising", "membership", "planning"],
      sourceName: "California FBLA",
      publishedAt: "2026-03-16T16:00:00.000Z",
      updatedAt: "2026-03-31T16:00:00.000Z",
      isOfficial: true,
      isDownloadable: false
    },
    {
      id: "resource-nlc-interest-overview",
      title: "National Conference Interest Overview",
      summary:
        "A broad overview of what members usually think about when planning for national-level travel, logistics, and professional expectations.",
      resourceType: "guide",
      category: "conferences",
      contentFormat: "embedded",
      scopeType: "national",
      organizationId: "org-national",
      estimatedReadMinutes: 9,
      tags: ["conference", "travel", "national", "planning"],
      sourceName: "FBLA National",
      publishedAt: "2026-03-03T16:00:00.000Z",
      updatedAt: "2026-03-24T16:00:00.000Z",
      isOfficial: true,
      isDownloadable: false
    },
    {
      id: "resource-ai-presentation-script",
      title: "AI Feature Demo Script",
      summary:
        "A short script for explaining how the AI assistant should recommend next steps, study tracks, and source-backed follow-up actions.",
      resourceType: "template",
      category: "training materials",
      contentFormat: "embedded",
      scopeType: "chapter",
      organizationId: "org-monta-vista",
      estimatedReadMinutes: 5,
      tags: ["ai", "demo", "mobile", "presentation"],
      sourceName: "Glen A. Wilson FBLA",
      publishedAt: "2026-03-27T16:00:00.000Z",
      updatedAt: "2026-04-02T16:00:00.000Z",
      isOfficial: false,
      isDownloadable: false
    },
    {
      id: "resource-judging-day-routine",
      title: "Judging Day Routine Checklist",
      summary:
        "A simple pre-round checklist for timing, mindset, equipment checks, and quick recovery if something runs late.",
      resourceType: "checklist",
      category: "competitive events",
      contentFormat: "embedded",
      scopeType: "state",
      organizationId: "org-ca",
      estimatedReadMinutes: 4,
      tags: ["presentation", "conference", "checklist", "timing"],
      sourceName: "California FBLA",
      publishedAt: "2026-03-29T16:00:00.000Z",
      updatedAt: "2026-04-02T16:00:00.000Z",
      isOfficial: true,
      isDownloadable: false
    },
    {
      id: "resource-icerberg-questions-bank",
      title: "Q&A Recovery Questions Bank",
      summary:
        "Practice prompts to help members answer unclear judge questions, buy a little thinking time, and recover cleanly under pressure.",
      resourceType: "study_reference",
      category: "training materials",
      contentFormat: "embedded",
      scopeType: "chapter",
      organizationId: "org-monta-vista",
      estimatedReadMinutes: 6,
      tags: ["public", "speaking", "q&a", "presentation"],
      sourceName: "Glen A. Wilson FBLA",
      publishedAt: "2026-03-24T16:00:00.000Z",
      updatedAt: "2026-04-01T16:00:00.000Z",
      isOfficial: false,
      isDownloadable: false
    },
    {
      id: "resource-membership-welcome-email",
      title: "New Member Welcome Email Template",
      summary:
        "A polished outreach template for onboarding interested students after an open house or classroom presentation.",
      resourceType: "template",
      category: "membership / chapter life",
      contentFormat: "embedded",
      scopeType: "chapter",
      organizationId: "org-monta-vista",
      estimatedReadMinutes: 3,
      tags: ["chapter", "membership", "recruitment", "communication"],
      sourceName: "Glen A. Wilson FBLA",
      publishedAt: "2026-03-18T16:00:00.000Z",
      updatedAt: "2026-03-30T16:00:00.000Z",
      isOfficial: false,
      isDownloadable: true
    },
    {
      id: "resource-officer-dashboard-checklist",
      title: "Officer Dashboard Maintenance Checklist",
      summary:
        "A quick maintenance list for calendars, announcements, forms, and chapter systems that should not silently drift.",
      resourceType: "checklist",
      category: "leadership development",
      contentFormat: "embedded",
      scopeType: "chapter",
      organizationId: "org-monta-vista",
      estimatedReadMinutes: 4,
      tags: ["officer", "leadership", "chapter", "systems"],
      sourceName: "Glen A. Wilson FBLA",
      publishedAt: "2026-03-26T16:00:00.000Z",
      updatedAt: "2026-04-02T16:00:00.000Z",
      isOfficial: false,
      isDownloadable: false
    },
    {
      id: "resource-competition-timeline-onepager",
      title: "Competition Season One-Page Timeline",
      summary:
        "A visual planning sheet that helps members map registration, prep milestones, practice windows, and conference travel steps on one page.",
      resourceType: "pdf",
      category: "official documents",
      contentFormat: "document",
      scopeType: "state",
      organizationId: "org-ca",
      storagePath: "demo-local-season-timeline",
      estimatedReadMinutes: 6,
      tags: ["competition", "timeline", "conference", "planning"],
      sourceName: "California FBLA",
      sourceUrl: "https://cafbla.org",
      publishedAt: "2026-03-11T16:00:00.000Z",
      updatedAt: "2026-03-27T16:00:00.000Z",
      isOfficial: true,
      isDownloadable: true
    },
    {
      id: "resource-data-science-ai-guidelines",
      title: "Data Science & AI Guidelines",
      summary:
        "Official event guidelines covering the event format, submission expectations, judging focus, and key preparation constraints for Data Science & AI.",
      resourceType: "pdf",
      category: "competitive events",
      contentFormat: "document",
      scopeType: "national",
      organizationId: "org-national",
      storagePath: "demo-local-data-science-ai-guidelines",
      estimatedReadMinutes: 16,
      tags: ["data science", "ai", "guidelines", "competition", "testing"],
      sourceName: "FBLA National",
      sourceUrl: "https://www.fbla.org",
      publishedAt: "2026-02-20T16:00:00.000Z",
      updatedAt: "2026-03-30T16:00:00.000Z",
      isOfficial: true,
      isDownloadable: true
    },
    {
      id: "resource-leadership-growth-toolkit",
      title: "Leadership Growth Toolkit",
      summary:
        "A structured set of habits, reflection prompts, and chapter contribution ideas for members growing beyond competition.",
      resourceType: "template",
      category: "leadership development",
      contentFormat: "embedded",
      scopeType: "national",
      organizationId: "org-national",
      estimatedReadMinutes: 9,
      tags: ["leadership", "chapter", "growth", "career"],
      sourceName: "FBLA National",
      publishedAt: "2026-01-15T16:00:00.000Z",
      updatedAt: "2026-03-22T16:00:00.000Z",
      isOfficial: true,
      isDownloadable: false
    }
  ],
  resourceState: [
    {
      id: "resource-state-competition-guide",
      userId: "user-demo",
      resourceId: "resource-competition-guide",
      isSaved: true,
      isOfflineAvailable: true,
      readingProgressPercent: 72,
      lastOpenedAt: "2026-04-02T17:40:00.000Z",
      highlightCount: 7
    },
    {
      id: "resource-state-travel-packet",
      userId: "user-demo",
      resourceId: "resource-state-travel-packet",
      isSaved: true,
      isOfflineAvailable: true,
      readingProgressPercent: 100,
      lastOpenedAt: "2026-04-03T01:15:00.000Z",
      highlightCount: 4
    },
    {
      id: "resource-state-business-rubric",
      userId: "user-demo",
      resourceId: "resource-business-presentation-rubric",
      isSaved: true,
      isOfflineAvailable: false,
      readingProgressPercent: 58,
      lastOpenedAt: "2026-04-02T23:00:00.000Z",
      highlightCount: 6
    },
    {
      id: "resource-state-mobile-architecture",
      userId: "user-demo",
      resourceId: "resource-mobile-architecture-notes",
      isSaved: true,
      isOfflineAvailable: false,
      readingProgressPercent: 84,
      lastOpenedAt: "2026-04-03T02:05:00.000Z",
      highlightCount: 9
    },
    {
      id: "resource-state-demo-checklist",
      userId: "user-demo",
      resourceId: "resource-mobile-demo-checklist",
      isSaved: true,
      isOfflineAvailable: false,
      readingProgressPercent: 100,
      lastOpenedAt: "2026-04-03T02:18:00.000Z",
      highlightCount: 3
    },
    {
      id: "resource-state-objective-test",
      userId: "user-demo",
      resourceId: "resource-objective-test-strategy",
      isSaved: true,
      isOfflineAvailable: false,
      readingProgressPercent: 43,
      lastOpenedAt: "2026-04-01T22:40:00.000Z",
      highlightCount: 2
    },
    {
      id: "resource-state-networking",
      userId: "user-demo",
      resourceId: "resource-networking-tips",
      isSaved: true,
      isOfflineAvailable: false,
      readingProgressPercent: 38,
      lastOpenedAt: "2026-03-31T22:00:00.000Z",
      highlightCount: 1
    },
    {
      id: "resource-state-officer-transition",
      userId: "user-demo",
      resourceId: "resource-officer-transition-playbook",
      isSaved: true,
      isOfflineAvailable: true,
      readingProgressPercent: 21,
      lastOpenedAt: "2026-04-02T20:50:00.000Z",
      highlightCount: 1
    },
    {
      id: "resource-state-conference-etiquette",
      userId: "user-demo",
      resourceId: "resource-conference-etiquette",
      isSaved: false,
      isOfflineAvailable: false,
      readingProgressPercent: 65,
      lastOpenedAt: "2026-03-30T18:20:00.000Z",
      highlightCount: 2
    },
    {
      id: "resource-state-branding",
      userId: "user-demo",
      resourceId: "resource-official-branding-reference",
      isSaved: false,
      isOfflineAvailable: false,
      readingProgressPercent: 24,
      lastOpenedAt: "2026-03-29T17:10:00.000Z",
      highlightCount: 0
    }
  ],
  newsPosts: [
    {
      id: "news-registration-window",
      title: "Registration edits close soon.",
      body:
        "Conference registration adjustments are wrapping up this week. Chapters should confirm attendee names, adviser approvals, and housing details before the window closes.",
      summary: "Final registration adjustments are due soon.",
      scopeType: "state",
      organizationId: "org-ca",
      priorityLevel: "urgent",
      topicTags: ["deadline", "conference", "registration"],
      relatedEventId: "event-state-registration-window",
      relatedResourceId: "resource-competition-timeline-onepager",
      publishedAt: "2026-04-02T15:00:00.000Z",
      createdByType: "state",
      isPinned: true,
      isOfficial: true
    },
    {
      id: "news-travel-webinar-reminder",
      title: "Travel webinar link posted for members",
      body:
        "The travel and check-in webinar link is now posted. Members heading to the state conference should review the packet first so the Q&A can stay focused on final logistics.",
      summary: "Travel webinar details are available now.",
      scopeType: "state",
      organizationId: "org-ca",
      priorityLevel: "high",
      topicTags: ["travel", "conference", "webinar"],
      relatedEventId: "event-state-travel-webinar",
      relatedResourceId: "resource-state-travel-packet",
      publishedAt: "2026-04-03T02:15:00.000Z",
      createdByType: "state",
      isPinned: false,
      isOfficial: true
    },
    {
      id: "news-judging-orientation",
      title: "Presentation events orientation added for Friday",
      body:
        "A short orientation has been added for presentation-event competitors who want one final walkthrough of room flow, setup, and timing expectations before conference travel begins.",
      summary: "A new presentation orientation has been scheduled.",
      scopeType: "state",
      organizationId: "org-ca",
      priorityLevel: "medium",
      topicTags: ["presentation", "conference", "orientation"],
      relatedEventId: "event-state-judging-orientation",
      relatedResourceId: "resource-state-presentation-room-flow",
      publishedAt: "2026-04-02T21:30:00.000Z",
      createdByType: "state",
      isPinned: false,
      isOfficial: true
    },
    {
      id: "news-open-house-help",
      title: "Open house volunteers still needed",
      body:
        "We still need a few members to greet guests, reset tables, and help with officer intros at the spring recruitment open house. Reply in the chapter thread if you can help.",
      summary: "Volunteer slots are open for the recruitment open house.",
      scopeType: "chapter",
      organizationId: "org-monta-vista",
      priorityLevel: "medium",
      topicTags: ["chapter", "recruitment", "volunteers"],
      relatedEventId: "event-chapter-recruitment-open-house",
      relatedThreadId: "thread-recruitment-open-house-ideas",
      publishedAt: "2026-04-02T18:00:00.000Z",
      createdByType: "chapter",
      isPinned: false,
      isOfficial: true
    },
    {
      id: "news-showcase-signups",
      title: "Parent preview speaking slots are live",
      body:
        "Members presenting at the parent preview can now choose a speaking slot. If you want a tech-check before your slot, note it in your signup comment.",
      summary: "Speaking slot signups opened for the parent preview.",
      scopeType: "chapter",
      organizationId: "org-monta-vista",
      priorityLevel: "high",
      topicTags: ["chapter", "showcase", "presentation"],
      relatedEventId: "event-chapter-parent-preview",
      relatedThreadId: "thread-parent-preview-flow",
      publishedAt: "2026-04-03T00:30:00.000Z",
      createdByType: "chapter",
      isPinned: false,
      isOfficial: true
    },
    {
      id: "news-bay-bootcamp",
      title: "Southern Section objective test bootcamp this Sunday",
      body:
        "Members who want a final reset on objective-test pacing, strategy, and review should register for Sunday’s Southern Section bootcamp.",
      summary: "Southern Section is running an objective-test bootcamp this weekend.",
      scopeType: "subdivision",
      organizationId: "org-ca-bay",
      priorityLevel: "medium",
      topicTags: ["test", "bootcamp", "study"],
      relatedEventId: "event-bay-objective-test-bootcamp",
      relatedResourceId: "resource-objective-test-strategy",
      publishedAt: "2026-04-01T19:00:00.000Z",
      createdByType: "state",
      isPinned: false,
      isOfficial: true
    },
    {
      id: "news-state-spotlight-service",
      title: "Chapter spotlight: creative service drive recaps",
      body:
        "This week’s spotlight highlights chapters that paired donation collection with member reflection and strong turnout planning.",
      summary: "State spotlight featuring chapter service-drive planning.",
      scopeType: "state",
      organizationId: "org-ca",
      priorityLevel: "low",
      topicTags: ["service", "spotlight", "chapter life"],
      relatedEventId: "event-chapter-service-supply-sort",
      publishedAt: "2026-04-01T16:00:00.000Z",
      createdByType: "state",
      isPinned: false,
      isOfficial: true
    },
    {
      id: "news-national-webinar-registration",
      title: "National leadership webinar registration is live",
      body:
        "Registration is now open for the national leadership kickoff webinar, including season-planning tips, member resources, and ways to build stronger momentum early.",
      summary: "Registration opened for the national kickoff webinar.",
      scopeType: "national",
      organizationId: "org-national",
      priorityLevel: "medium",
      topicTags: ["leadership", "webinar", "national"],
      relatedEventId: "event-national-kickoff-webinar",
      publishedAt: "2026-03-31T18:00:00.000Z",
      createdByType: "national",
      isPinned: false,
      isOfficial: true
    },
    {
      id: "news-membership-momentum",
      title: "Membership momentum challenge launches later this month",
      body:
        "National is sharing a new campaign toolkit for chapters that want stronger recruitment energy, cleaner onboarding, and better follow-through after events.",
      summary: "A national membership campaign is launching soon.",
      scopeType: "national",
      organizationId: "org-national",
      priorityLevel: "medium",
      topicTags: ["membership", "chapter", "leadership"],
      relatedEventId: "event-national-membership-challenge",
      relatedResourceId: "resource-recruitment-campaign-playbook",
      publishedAt: "2026-04-01T15:20:00.000Z",
      createdByType: "national",
      isPinned: false,
      isOfficial: true
    },
    {
      id: "news-officer-interest-call",
      title: "National officer interest call announced",
      body:
        "Members curious about future leadership pathways can join a short national Q&A later this month for a realistic look at expectations and preparation.",
      summary: "A national officer-interest Q&A has been announced.",
      scopeType: "national",
      organizationId: "org-national",
      priorityLevel: "low",
      topicTags: ["leadership", "officer", "growth"],
      relatedEventId: "event-national-officer-interest-call",
      relatedResourceId: "resource-leadership-growth-toolkit",
      publishedAt: "2026-04-02T14:15:00.000Z",
      createdByType: "national",
      isPinned: false,
      isOfficial: true
    },
    {
      id: "news-summer-program-interest",
      title: "Summer leadership workshop added to the state calendar",
      body:
        "A spring workshop has been added for members comparing summer leadership opportunities and planning personal growth goals after conference season.",
      summary: "State added a summer leadership interest workshop.",
      scopeType: "state",
      organizationId: "org-ca",
      priorityLevel: "low",
      topicTags: ["leadership", "summer", "planning"],
      relatedEventId: "event-state-summer-application-workshop",
      relatedResourceId: "resource-leadership-growth-toolkit",
      publishedAt: "2026-04-03T01:00:00.000Z",
      createdByType: "state",
      isPinned: false,
      isOfficial: true
    },
    {
      id: "news-speaking-lab-reminder",
      title: "Bring your full intro to next speaking lab",
      body:
        "For next week’s speaking lab, members should bring a polished intro and one backup plan in case the first two minutes need to be shortened.",
      summary: "Members should come prepared with a full intro for speaking lab.",
      scopeType: "chapter",
      organizationId: "org-monta-vista",
      priorityLevel: "medium",
      topicTags: ["chapter", "practice", "public speaking"],
      relatedEventId: "event-chapter-speaking-lab",
      relatedResourceId: "resource-public-speaking-prep",
      publishedAt: "2026-04-03T03:00:00.000Z",
      createdByType: "chapter",
      isPinned: false,
      isOfficial: true
    },
    {
      id: "news-officer-transition-save-date",
      title: "Officer transition retreat save-the-date",
      body:
        "Incoming and outgoing officers should save the date for the transition retreat. Expect notes on calendars, committees, chapter systems, and summer planning.",
      summary: "The chapter officer transition retreat is on the calendar.",
      scopeType: "chapter",
      organizationId: "org-monta-vista",
      priorityLevel: "medium",
      topicTags: ["officer", "leadership", "transition"],
      relatedEventId: "event-chapter-officer-transition-retreat",
      relatedResourceId: "resource-officer-transition-playbook",
      publishedAt: "2026-04-02T17:00:00.000Z",
      createdByType: "chapter",
      isPinned: false,
      isOfficial: true
    },
    {
      id: "news-resource-drop",
      title: "New conference etiquette quick guide added",
      body:
        "A short etiquette guide is now in the resource library for members who want a quick review before travel and shared-space conference time.",
      summary: "A new conference etiquette resource was added.",
      scopeType: "national",
      organizationId: "org-national",
      priorityLevel: "low",
      topicTags: ["resource", "conference", "etiquette"],
      relatedResourceId: "resource-conference-etiquette",
      publishedAt: "2026-04-01T13:30:00.000Z",
      createdByType: "national",
      isPinned: false,
      isOfficial: true
    },
    {
      id: "news-mock-interview-recap",
      title: "Southern Section mock interview seats filled quickly",
      body:
        "The mock interview workshop filled faster than expected. Members who registered should arrive early and bring one specific question they want feedback on.",
      summary: "Mock interview workshop registration filled quickly.",
      scopeType: "subdivision",
      organizationId: "org-ca-bay",
      priorityLevel: "medium",
      topicTags: ["interview", "workshop", "bay section"],
      relatedEventId: "event-bay-mock-interviews",
      publishedAt: "2026-04-02T16:25:00.000Z",
      createdByType: "state",
      isPinned: false,
      isOfficial: true
    },
    {
      id: "news-state-rooming-reminder",
      title: "Rooming list reminder for advisers and officers",
      body:
        "If your chapter still has rooming questions, settle them early. Last-minute corrections are much harder once the housing file is finalized.",
      summary: "State is encouraging chapters to close rooming questions early.",
      scopeType: "state",
      organizationId: "org-ca",
      priorityLevel: "high",
      topicTags: ["travel", "housing", "conference"],
      relatedEventId: "event-state-rooming-list",
      relatedResourceId: "resource-state-travel-packet",
      publishedAt: "2026-04-03T04:05:00.000Z",
      createdByType: "state",
      isPinned: false,
      isOfficial: true
    },
    {
      id: "news-parent-preview-highlight",
      title: "Parent preview will feature live project walk-throughs",
      body:
        "This year’s parent preview will include quick live demos and project tables so families can see the app, prep flow, and chapter work in action.",
      summary: "The parent preview will include live project demos.",
      scopeType: "chapter",
      organizationId: "org-monta-vista",
      priorityLevel: "low",
      topicTags: ["showcase", "chapter", "demo"],
      relatedEventId: "event-chapter-parent-preview",
      relatedThreadId: "thread-parent-preview-flow",
      publishedAt: "2026-04-01T22:10:00.000Z",
      createdByType: "chapter",
      isPinned: false,
      isOfficial: true
    },
    {
      id: "news-college-career-panel",
      title: "National college and career panel added for May",
      body:
        "Members interested in life after chapter leadership can join a panel with alumni on networking, opportunities, and translating chapter experience into the next stage.",
      summary: "National added a college and career transition panel.",
      scopeType: "national",
      organizationId: "org-national",
      priorityLevel: "low",
      topicTags: ["career", "leadership", "panel"],
      relatedEventId: "event-national-collegiate-panel",
      publishedAt: "2026-04-02T12:30:00.000Z",
      createdByType: "national",
      isPinned: false,
      isOfficial: true
    }
  ],
  newsState: [
    {
      id: "news-state-registration-window",
      userId: "user-demo",
      newsPostId: "news-registration-window",
      isRead: true,
      isSaved: true,
      readAt: "2026-04-02T18:00:00.000Z",
      savedAt: "2026-04-02T18:05:00.000Z"
    },
    {
      id: "news-state-travel-webinar",
      userId: "user-demo",
      newsPostId: "news-travel-webinar-reminder",
      isRead: true,
      isSaved: true,
      readAt: "2026-04-03T02:30:00.000Z",
      savedAt: "2026-04-03T02:31:00.000Z"
    },
    {
      id: "news-state-rooming",
      userId: "user-demo",
      newsPostId: "news-state-rooming-reminder",
      isRead: false,
      isSaved: true,
      savedAt: "2026-04-03T04:10:00.000Z"
    },
    {
      id: "news-state-speaking-lab",
      userId: "user-demo",
      newsPostId: "news-speaking-lab-reminder",
      isRead: true,
      isSaved: false,
      readAt: "2026-04-03T03:10:00.000Z"
    },
    {
      id: "news-state-national-webinar",
      userId: "user-demo",
      newsPostId: "news-national-webinar-registration",
      isRead: false,
      isSaved: false
    },
    {
      id: "news-state-officer-transition",
      userId: "user-demo",
      newsPostId: "news-officer-transition-save-date",
      isRead: true,
      isSaved: true,
      readAt: "2026-04-02T17:30:00.000Z",
      savedAt: "2026-04-02T17:32:00.000Z"
    },
    {
      id: "news-state-resource-drop",
      userId: "user-demo",
      newsPostId: "news-resource-drop",
      isRead: true,
      isSaved: false,
      readAt: "2026-04-01T18:15:00.000Z"
    },
    {
      id: "news-state-summer-workshop",
      userId: "user-demo",
      newsPostId: "news-summer-program-interest",
      isRead: false,
      isSaved: false
    }
  ],
  socialChannels: [
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
    },
    {
      id: "social-national-instagram",
      organizationId: "org-national",
      platform: "Instagram",
      handle: "@fbla_pbl",
      profileUrl: "https://instagram.com/fbla_pbl",
      displayName: "FBLA National Instagram",
      isPrimary: false,
      isActive: true,
      lastVerifiedAt: now
    },
    {
      id: "social-national-tiktok",
      organizationId: "org-national",
      platform: "TikTok",
      handle: "@fbla_pbl",
      profileUrl: "https://tiktok.com/@fbla_pbl",
      displayName: "FBLA National TikTok",
      isPrimary: false,
      isActive: true,
      lastVerifiedAt: now
    },
    {
      id: "social-national-x",
      organizationId: "org-national",
      platform: "X",
      handle: "@FBLA_PBL",
      profileUrl: "https://x.com/FBLA_PBL",
      displayName: "FBLA National on X",
      isPrimary: false,
      isActive: true,
      lastVerifiedAt: now
    },
    {
      id: "social-ca-site",
      organizationId: "org-ca",
      platform: "Website",
      handle: "cafbla.org",
      profileUrl: "https://cafbla.org",
      displayName: "California FBLA",
      isPrimary: true,
      isActive: true,
      lastVerifiedAt: now
    },
    {
      id: "social-ca-instagram",
      organizationId: "org-ca",
      platform: "Instagram",
      handle: "@cafbla",
      profileUrl: "https://instagram.com/cafbla",
      displayName: "California FBLA Instagram",
      isPrimary: false,
      isActive: true,
      lastVerifiedAt: now
    },
    {
      id: "social-ca-youtube",
      organizationId: "org-ca",
      platform: "YouTube",
      handle: "@cafbla",
      profileUrl: "https://youtube.com/@cafbla",
      displayName: "California FBLA YouTube",
      isPrimary: false,
      isActive: true,
      lastVerifiedAt: now
    },
    {
      id: "social-ca-facebook",
      organizationId: "org-ca",
      platform: "Facebook",
      handle: "California FBLA",
      profileUrl: "https://facebook.com/cafbla",
      displayName: "California FBLA Facebook",
      isPrimary: false,
      isActive: true,
      lastVerifiedAt: now
    },
    {
      id: "social-mv-instagram",
      organizationId: "org-monta-vista",
      platform: "Instagram",
      handle: "@montavistafbla",
      profileUrl: "https://instagram.com/montavistafbla",
      displayName: "Glen A. Wilson FBLA",
      isPrimary: true,
      isActive: true,
      lastVerifiedAt: now
    },
    {
      id: "social-mv-website",
      organizationId: "org-monta-vista",
      platform: "Website",
      handle: "Glen A. Wilson Chapter Site",
      profileUrl: "https://www.fbla.org",
      displayName: "Glen A. Wilson FBLA Website",
      isPrimary: false,
      isActive: true,
      lastVerifiedAt: now
    },
    {
      id: "social-tx-instagram",
      organizationId: "org-tx",
      platform: "Instagram",
      handle: "@texasfbla",
      profileUrl: "https://instagram.com/texasfbla",
      displayName: "Texas FBLA Instagram",
      isPrimary: true,
      isActive: true,
      lastVerifiedAt: now
    },
    {
      id: "social-wa-instagram",
      organizationId: "org-wa",
      platform: "Instagram",
      handle: "@wafbla",
      profileUrl: "https://instagram.com/wafbla",
      displayName: "Washington FBLA Instagram",
      isPrimary: true,
      isActive: true,
      lastVerifiedAt: now
    }
  ],
  socialHighlights: [
    {
      id: "highlight-ca-travel-reminder",
      socialChannelId: "social-ca-youtube",
      title: "Conference countdown and packing tips",
      summary: "A quick state chapter reel with arrival reminders, packing checks, and first-day confidence tips.",
      externalPostUrl: "https://youtube.com/@cafbla",
      publishedAt: "2026-04-02T20:00:00.000Z",
      relatedEventId: "event-state-leadership-conference"
    },
    {
      id: "highlight-ca-bootcamp",
      socialChannelId: "social-ca-instagram",
      title: "Objective test bootcamp preview",
      summary: "Short carousel previewing pacing strategies, review habits, and Southern Section study energy this weekend.",
      externalPostUrl: "https://instagram.com/cafbla",
      publishedAt: "2026-04-01T19:30:00.000Z",
      relatedEventId: "event-bay-objective-test-bootcamp"
    },
    {
      id: "highlight-mv-build-night",
      socialChannelId: "social-mv-instagram",
      title: "Build night recap",
      summary: "Chapter showcase from the latest working session with mock judging rounds, device checks, and team feedback moments.",
      externalPostUrl: "https://instagram.com/montavistafbla",
      publishedAt: "2026-04-02T04:00:00.000Z",
      relatedNewsPostId: "news-speaking-lab-reminder"
    },
    {
      id: "highlight-mv-open-house",
      socialChannelId: "social-mv-instagram",
      title: "Open house teaser",
      summary: "A fast chapter teaser inviting prospective members to the spring recruitment event and officer meet-and-greet.",
      externalPostUrl: "https://instagram.com/montavistafbla",
      publishedAt: "2026-04-02T23:30:00.000Z",
      relatedEventId: "event-chapter-recruitment-open-house"
    },
    {
      id: "highlight-national-kickoff",
      socialChannelId: "social-national-tiktok",
      title: "Leadership kickoff countdown",
      summary: "National promo highlighting season planning, member confidence, and why official channels matter.",
      externalPostUrl: "https://tiktok.com/@fbla_pbl",
      publishedAt: "2026-04-01T16:10:00.000Z",
      relatedEventId: "event-national-kickoff-webinar"
    },
    {
      id: "highlight-national-membership",
      socialChannelId: "social-national-instagram",
      title: "Membership momentum toolkit preview",
      summary: "National preview of campaign ideas for chapters that want stronger recruitment and a cleaner first impression.",
      externalPostUrl: "https://instagram.com/fbla_pbl",
      publishedAt: "2026-04-02T17:45:00.000Z",
      relatedNewsPostId: "news-membership-momentum"
    },
    {
      id: "highlight-national-career-panel",
      socialChannelId: "social-national-x",
      title: "Career panel save-the-date",
      summary: "Short reminder for members interested in networking and life after chapter leadership.",
      externalPostUrl: "https://x.com/FBLA_PBL",
      publishedAt: "2026-04-02T13:00:00.000Z",
      relatedEventId: "event-national-collegiate-panel"
    },
    {
      id: "highlight-ca-presentation-clinic",
      socialChannelId: "social-ca-facebook",
      title: "Presentation clinic recap",
      summary: "State officers shared slide cleanup, room-confidence tips, and final rehearsal habits that members keep asking about.",
      externalPostUrl: "https://facebook.com/cafbla",
      publishedAt: "2026-04-03T01:05:00.000Z",
      relatedEventId: "event-state-coaching-clinic"
    },
    {
      id: "highlight-mv-service-drive",
      socialChannelId: "social-mv-instagram",
      title: "Service drive prep in motion",
      summary: "Chapter volunteers organizing donation tables and service notes ahead of the community drop-off day.",
      externalPostUrl: "https://instagram.com/montavistafbla",
      publishedAt: "2026-04-01T21:40:00.000Z",
      relatedEventId: "event-chapter-service-supply-sort"
    },
    {
      id: "highlight-tx-officer-board",
      socialChannelId: "social-tx-instagram",
      title: "Officer board intro series",
      summary: "Texas chapters shared a polished carousel introducing officers and how chapters are planning for the next season.",
      externalPostUrl: "https://instagram.com/texasfbla",
      publishedAt: "2026-03-31T19:20:00.000Z"
    },
    {
      id: "highlight-wa-recruitment",
      socialChannelId: "social-wa-instagram",
      title: "Recruitment board inspiration",
      summary: "A visual roundup of chapter boards, hallway outreach, and student-friendly chapter messaging.",
      externalPostUrl: "https://instagram.com/wafbla",
      publishedAt: "2026-03-30T18:00:00.000Z"
    },
    {
      id: "highlight-ca-rooming-reminder",
      socialChannelId: "social-ca-instagram",
      title: "Rooming list reminder",
      summary: "One-card reminder nudging chapters to finish rooming details early and reduce travel-week stress.",
      externalPostUrl: "https://instagram.com/cafbla",
      publishedAt: "2026-04-03T04:10:00.000Z",
      relatedNewsPostId: "news-state-rooming-reminder"
    }
  ],
  studyTracks: [
    {
      id: "study-mobile-polish",
      title: "Mobile App Final Polish Sprint",
      description:
        "A focused prep track covering architecture talking points, validation examples, demo sequencing, and confident project storytelling.",
      trackType: "event_prep",
      relatedEventId: "event-state-leadership-conference",
      relatedResourceIds: [
        "resource-mobile-architecture-notes",
        "resource-mobile-demo-checklist",
        "resource-validation-rules-sheet",
        "resource-business-presentation-rubric"
      ],
      difficultyLevel: "advanced",
      estimatedTotalMinutes: 81,
      tags: ["mobile", "presentation", "validation", "public"],
      isOfficial: true,
      createdAt: "2026-03-10T16:00:00.000Z",
      updatedAt: now
    },
    {
      id: "study-conference-readiness",
      title: "State Conference Readiness",
      description:
        "A practical prep track for travel logistics, room flow, networking, and getting through conference day with less friction.",
      trackType: "event_prep",
      relatedEventId: "event-state-leadership-conference",
      relatedResourceIds: [
        "resource-state-travel-packet",
        "resource-conference-packing-checklist",
        "resource-conference-etiquette",
        "resource-state-presentation-room-flow"
      ],
      difficultyLevel: "intermediate",
      estimatedTotalMinutes: 48,
      tags: ["conference", "travel", "networking", "presentation"],
      isOfficial: true,
      createdAt: "2026-03-12T16:00:00.000Z",
      updatedAt: now
    },
    {
      id: "study-objective-test-reset",
      title: "Objective Test Reset",
      description:
        "A short, repeatable track for timing control, business communication review, and recovering from avoidable misses.",
      trackType: "competition",
      relatedEventId: "event-bay-objective-test-bootcamp",
      relatedResourceIds: [
        "resource-objective-test-strategy",
        "resource-business-communication-review"
      ],
      difficultyLevel: "intermediate",
      estimatedTotalMinutes: 42,
      tags: ["objective", "test", "business", "communication"],
      isOfficial: true,
      createdAt: "2026-03-15T16:00:00.000Z",
      updatedAt: now
    },
    {
      id: "study-accounting-essentials",
      title: "Accounting Event Essentials",
      description:
        "A practical accounting prep path focused on transaction analysis, the accounting cycle, adjusting entries, and statement logic for objective-test confidence.",
      trackType: "competition",
      relatedEventId: "event-state-leadership-conference",
      relatedResourceIds: [],
      difficultyLevel: "intermediate",
      estimatedTotalMinutes: 44,
      tags: ["accounting", "financial statements", "journal entries", "objective test"],
      isOfficial: true,
      createdAt: "2026-03-16T16:00:00.000Z",
      updatedAt: now
    },
    {
      id: "study-presentation-presence",
      title: "Presentation Presence Builder",
      description:
        "Practice units to tighten delivery, transitions, eye contact, and calm recovery when the room gets tense.",
      trackType: "skills",
      relatedResourceIds: [
        "resource-public-speaking-prep",
        "resource-icerberg-questions-bank"
      ],
      difficultyLevel: "foundation",
      estimatedTotalMinutes: 34,
      tags: ["public", "speaking", "confidence", "presentation"],
      isOfficial: false,
      createdAt: "2026-03-18T16:00:00.000Z",
      updatedAt: now
    },
    {
      id: "study-networking-basics",
      title: "Conference Networking Basics",
      description:
        "A confidence-building track for starting conversations, introducing yourself well, and making conference interactions less awkward.",
      trackType: "skills",
      relatedEventId: "event-state-leadership-conference",
      relatedResourceIds: [
        "resource-networking-tips",
        "resource-conference-etiquette"
      ],
      difficultyLevel: "foundation",
      estimatedTotalMinutes: 25,
      tags: ["networking", "conference", "leadership", "career"],
      isOfficial: true,
      createdAt: "2026-03-19T16:00:00.000Z",
      updatedAt: now
    },
    {
      id: "study-officer-transition",
      title: "Officer Transition Sprint",
      description:
        "A short leadership path on preserving chapter systems, transferring context cleanly, and starting the next team with less confusion.",
      trackType: "topic",
      relatedEventId: "event-chapter-officer-transition-retreat",
      relatedResourceIds: [
        "resource-officer-transition-playbook",
        "resource-officer-election-toolkit",
        "resource-officer-dashboard-checklist"
      ],
      difficultyLevel: "intermediate",
      estimatedTotalMinutes: 38,
      tags: ["leadership", "officer", "transition", "chapter"],
      isOfficial: true,
      createdAt: "2026-03-22T16:00:00.000Z",
      updatedAt: now
    },
    {
      id: "study-meeting-procedure",
      title: "Meeting Procedure Fundamentals",
      description:
        "A practical introduction to motions, recognition, agenda control, and keeping meetings clear instead of stiff.",
      trackType: "topic",
      relatedResourceIds: [
        "resource-meeting-procedure-notes",
        "resource-chapter-agenda-template"
      ],
      difficultyLevel: "foundation",
      estimatedTotalMinutes: 28,
      tags: ["meeting", "chapter", "leadership", "procedure"],
      isOfficial: true,
      createdAt: "2026-03-14T16:00:00.000Z",
      updatedAt: now
    },
    {
      id: "study-recruitment-momentum",
      title: "Recruitment Momentum Builder",
      description:
        "A chapter-life track for stronger event invitations, cleaner follow-up, and turning interest into actual new membership.",
      trackType: "skills",
      relatedEventId: "event-chapter-recruitment-open-house",
      relatedResourceIds: [
        "resource-recruitment-campaign-playbook",
        "resource-membership-welcome-email"
      ],
      difficultyLevel: "foundation",
      estimatedTotalMinutes: 26,
      tags: ["chapter", "membership", "recruitment", "leadership"],
      isOfficial: false,
      createdAt: "2026-03-20T16:00:00.000Z",
      updatedAt: now
    }
  ],
  studyUnits: [
    {
      id: "unit-mobile-storyboard",
      studyTrackId: "study-mobile-polish",
      title: "Architecture Storyboard",
      unitType: "reading",
      contentRef: "Practice explaining how the app moves from profile to recommendations without sounding like a list of tabs.",
      sequenceOrder: 1,
      estimatedMinutes: 12
    },
    {
      id: "unit-mobile-talking-points-cards",
      studyTrackId: "study-mobile-polish",
      title: "Mobile Development Talking Point Flashcards",
      unitType: "flashcards",
      contentRef: "Judge-facing prompts for architecture, validation, privacy settings, and clean demo language.",
      sequenceOrder: 2,
      estimatedMinutes: 9
    },
    {
      id: "unit-mobile-validation-quiz",
      studyTrackId: "study-mobile-polish",
      title: "Validation Rapid Quiz",
      unitType: "quiz",
      contentRef: "Validation rules, boundaries, and why guardrails matter in a member app.",
      sequenceOrder: 3,
      estimatedMinutes: 12
    },
    {
      id: "unit-mobile-demo-checklist",
      studyTrackId: "study-mobile-polish",
      title: "Connected Demo Checklist",
      unitType: "checklist",
      contentRef: "Home -> saved event -> linked study -> resource -> AI -> forum thread -> social highlight.",
      sequenceOrder: 4,
      estimatedMinutes: 8
    },
    {
      id: "unit-conference-packing",
      studyTrackId: "study-conference-readiness",
      title: "Travel and Packing Review",
      unitType: "reading",
      contentRef: "Know what to bring, what to print, and what to double-check before leaving for the conference.",
      sequenceOrder: 1,
      estimatedMinutes: 10
    },
    {
      id: "unit-conference-networking-cards",
      studyTrackId: "study-conference-readiness",
      title: "Networking Flashcards",
      unitType: "flashcards",
      contentRef: "Conversation openers, polite exits, and quick professional habits.",
      sequenceOrder: 2,
      estimatedMinutes: 8
    },
    {
      id: "unit-conference-room-flow",
      studyTrackId: "study-conference-readiness",
      title: "Presentation Room Flow",
      unitType: "checklist",
      contentRef: "Arrival, setup, timing, transitions, and the first answer after a judge asks a question.",
      sequenceOrder: 3,
      estimatedMinutes: 7
    },
    {
      id: "unit-test-strategy-review",
      studyTrackId: "study-objective-test-reset",
      title: "Pacing Strategy Review",
      unitType: "reading",
      contentRef: "Learn a calmer pace for objective tests and stop overcommitting to early hard questions.",
      sequenceOrder: 1,
      estimatedMinutes: 9
    },
    {
      id: "unit-test-business-comms",
      studyTrackId: "study-objective-test-reset",
      title: "Business Communication Drill",
      unitType: "quiz",
      contentRef: "Audience, tone, formatting, and common business communication misses.",
      sequenceOrder: 2,
      estimatedMinutes: 12
    },
    {
      id: "unit-test-retry-list",
      studyTrackId: "study-objective-test-reset",
      title: "Missed Question Retry List",
      unitType: "checklist",
      contentRef: "Capture weak question types and turn them into a short next-session retry list.",
      sequenceOrder: 3,
      estimatedMinutes: 6
    },
    {
      id: "unit-accounting-foundations",
      studyTrackId: "study-accounting-essentials",
      title: "Accounting Foundations Review",
      unitType: "reading",
      contentRef: "Refresh the accounting equation, account types, and how transactions move through the accounting cycle.",
      sequenceOrder: 1,
      estimatedMinutes: 9
    },
    {
      id: "unit-accounting-terms-cards",
      studyTrackId: "study-accounting-essentials",
      title: "Accounting Terms Flashcards",
      unitType: "flashcards",
      contentRef: "Core accounting vocabulary for objective tests, including journal entries, trial balance logic, and statement purpose.",
      sequenceOrder: 2,
      estimatedMinutes: 10
    },
    {
      id: "unit-accounting-cycle-quiz",
      studyTrackId: "study-accounting-essentials",
      title: "Accounting Cycle Quiz",
      unitType: "quiz",
      contentRef: "Transaction analysis, adjusting entries, trial balance logic, and financial statement reading.",
      sequenceOrder: 3,
      estimatedMinutes: 11
    },
    {
      id: "unit-accounting-error-check",
      studyTrackId: "study-accounting-essentials",
      title: "Error-Check Routine",
      unitType: "checklist",
      contentRef: "A short routine for catching common objective-test mistakes before moving on to the next question block.",
      sequenceOrder: 4,
      estimatedMinutes: 5
    },
    {
      id: "unit-presence-opening",
      studyTrackId: "study-presentation-presence",
      title: "Opening Minute Reset",
      unitType: "flashcards",
      contentRef: "Strong starts, cleaner transitions, and how to avoid rushing the first sentence.",
      sequenceOrder: 1,
      estimatedMinutes: 7
    },
    {
      id: "unit-presence-qa",
      studyTrackId: "study-presentation-presence",
      title: "Q&A Recovery Set",
      unitType: "quiz",
      contentRef: "Calm answers, clarifying questions, and buying a second to think without sounding unsure.",
      sequenceOrder: 2,
      estimatedMinutes: 10
    },
    {
      id: "unit-presence-runthrough",
      studyTrackId: "study-presentation-presence",
      title: "Two-Minute Runthrough",
      unitType: "checklist",
      contentRef: "A short confidence routine before a live mock or presentation round.",
      sequenceOrder: 3,
      estimatedMinutes: 5
    },
    {
      id: "unit-networking-intros",
      studyTrackId: "study-networking-basics",
      title: "Introductions That Don’t Feel Awkward",
      unitType: "flashcards",
      contentRef: "Practice short introductions that sound natural and professional.",
      sequenceOrder: 1,
      estimatedMinutes: 6
    },
    {
      id: "unit-networking-followup",
      studyTrackId: "study-networking-basics",
      title: "Follow-Up Conversation Quiz",
      unitType: "quiz",
      contentRef: "Questions to ask, how to pivot politely, and when to exit a conversation well.",
      sequenceOrder: 2,
      estimatedMinutes: 8
    },
    {
      id: "unit-networking-routine",
      studyTrackId: "study-networking-basics",
      title: "Conference Social Routine",
      unitType: "checklist",
      contentRef: "A pre-room routine for name badge, eye contact, and first conversation goals.",
      sequenceOrder: 3,
      estimatedMinutes: 4
    },
    {
      id: "unit-transition-notes",
      studyTrackId: "study-officer-transition",
      title: "What to Handoff",
      unitType: "reading",
      contentRef: "Calendars, committee notes, contact lists, and the systems members depend on most.",
      sequenceOrder: 1,
      estimatedMinutes: 10
    },
    {
      id: "unit-transition-roles",
      studyTrackId: "study-officer-transition",
      title: "Officer Roles Check",
      unitType: "quiz",
      contentRef: "Role clarity, committee ownership, and common transition gaps.",
      sequenceOrder: 2,
      estimatedMinutes: 10
    },
    {
      id: "unit-transition-retreat-checklist",
      studyTrackId: "study-officer-transition",
      title: "Retreat Agenda Checklist",
      unitType: "checklist",
      contentRef: "What the chapter should leave the retreat with before summer starts.",
      sequenceOrder: 3,
      estimatedMinutes: 6
    },
    {
      id: "unit-meeting-motions",
      studyTrackId: "study-meeting-procedure",
      title: "Motion Basics",
      unitType: "reading",
      contentRef: "Common motions, who speaks when, and how to avoid confusion during chapter business.",
      sequenceOrder: 1,
      estimatedMinutes: 8
    },
    {
      id: "unit-meeting-recognition",
      studyTrackId: "study-meeting-procedure",
      title: "Recognition and Flow Quiz",
      unitType: "quiz",
      contentRef: "Simple scenarios for keeping the room orderly without overcomplicating the process.",
      sequenceOrder: 2,
      estimatedMinutes: 8
    },
    {
      id: "unit-meeting-agenda",
      studyTrackId: "study-meeting-procedure",
      title: "Agenda Builder",
      unitType: "checklist",
      contentRef: "Use the agenda template to build a cleaner chapter meeting in under ten minutes.",
      sequenceOrder: 3,
      estimatedMinutes: 5
    },
    {
      id: "unit-recruitment-message",
      studyTrackId: "study-recruitment-momentum",
      title: "Recruitment Message Audit",
      unitType: "reading",
      contentRef: "Improve how the chapter explains itself to students who are interested but not yet committed.",
      sequenceOrder: 1,
      estimatedMinutes: 7
    },
    {
      id: "unit-recruitment-followup",
      studyTrackId: "study-recruitment-momentum",
      title: "Follow-Up Timing Quiz",
      unitType: "quiz",
      contentRef: "What to send after an open house and how to keep interest from going cold.",
      sequenceOrder: 2,
      estimatedMinutes: 8
    },
    {
      id: "unit-recruitment-open-house",
      studyTrackId: "study-recruitment-momentum",
      title: "Open House Checklist",
      unitType: "checklist",
      contentRef: "Tables, officer intros, QR code flow, and one action every guest should leave with.",
      sequenceOrder: 3,
      estimatedMinutes: 5
    }
  ],
  studyProgress: [
    {
      id: "study-progress-mobile",
      userId: "user-demo",
      studyTrackId: "study-mobile-polish",
      progressPercent: 74,
      lastOpenedAt: "2026-04-03T02:22:00.000Z",
      weakTopics: ["validation", "q&a recovery", "architecture clarity"],
      nextRecommendedUnitId: "unit-mobile-talking-points-cards"
    },
    {
      id: "study-progress-conference",
      userId: "user-demo",
      studyTrackId: "study-conference-readiness",
      progressPercent: 61,
      lastOpenedAt: "2026-04-03T01:18:00.000Z",
      weakTopics: ["networking introductions", "travel checklist"],
      nextRecommendedUnitId: "unit-conference-networking-cards"
    },
    {
      id: "study-progress-test",
      userId: "user-demo",
      studyTrackId: "study-objective-test-reset",
      progressPercent: 46,
      lastOpenedAt: "2026-04-01T22:50:00.000Z",
      weakTopics: ["business communication", "time management"],
      nextRecommendedUnitId: "unit-test-business-comms"
    },
    {
      id: "study-progress-accounting",
      userId: "user-demo",
      studyTrackId: "study-accounting-essentials",
      progressPercent: 39,
      lastOpenedAt: "2026-04-02T21:35:00.000Z",
      weakTopics: ["adjusting entries", "trial balance"],
      nextRecommendedUnitId: "unit-accounting-terms-cards"
    },
    {
      id: "study-progress-presence",
      userId: "user-demo",
      studyTrackId: "study-presentation-presence",
      progressPercent: 83,
      lastOpenedAt: "2026-04-02T23:20:00.000Z",
      weakTopics: ["q&a recovery"],
      nextRecommendedUnitId: "unit-presence-runthrough"
    },
    {
      id: "study-progress-transition",
      userId: "user-demo",
      studyTrackId: "study-officer-transition",
      progressPercent: 22,
      lastOpenedAt: "2026-04-02T20:55:00.000Z",
      weakTopics: ["handoff notes", "committee ownership"],
      nextRecommendedUnitId: "unit-transition-notes"
    }
  ],
  quizAttempts: [
    {
      id: "quiz-mobile-validation-1",
      userId: "user-demo",
      studyUnitId: "unit-mobile-validation-quiz",
      scorePercent: 76,
      questionCount: 10,
      correctCount: 8,
      attemptedAt: "2026-04-02T23:05:00.000Z",
      missedTopicTags: ["validation", "architecture clarity"]
    },
    {
      id: "quiz-mobile-validation-2",
      userId: "user-demo",
      studyUnitId: "unit-mobile-validation-quiz",
      scorePercent: 82,
      questionCount: 10,
      correctCount: 8,
      attemptedAt: "2026-04-03T02:10:00.000Z",
      missedTopicTags: ["q&a recovery"]
    },
    {
      id: "quiz-business-comms-1",
      userId: "user-demo",
      studyUnitId: "unit-test-business-comms",
      scorePercent: 68,
      questionCount: 12,
      correctCount: 8,
      attemptedAt: "2026-03-31T22:10:00.000Z",
      missedTopicTags: ["business communication", "time management"]
    },
    {
      id: "quiz-business-comms-2",
      userId: "user-demo",
      studyUnitId: "unit-test-business-comms",
      scorePercent: 74,
      questionCount: 12,
      correctCount: 9,
      attemptedAt: "2026-04-01T22:42:00.000Z",
      missedTopicTags: ["business communication"]
    },
    {
      id: "quiz-accounting-cycle-1",
      userId: "user-demo",
      studyUnitId: "unit-accounting-cycle-quiz",
      scorePercent: 72,
      questionCount: 5,
      correctCount: 4,
      attemptedAt: "2026-04-02T21:28:00.000Z",
      missedTopicTags: ["adjusting entries", "trial balance"]
    },
    {
      id: "quiz-qa-recovery",
      userId: "user-demo",
      studyUnitId: "unit-presence-qa",
      scorePercent: 79,
      questionCount: 8,
      correctCount: 6,
      attemptedAt: "2026-04-02T23:18:00.000Z",
      missedTopicTags: ["q&a recovery"]
    },
    {
      id: "quiz-networking-followup",
      userId: "user-demo",
      studyUnitId: "unit-networking-followup",
      scorePercent: 71,
      questionCount: 8,
      correctCount: 6,
      attemptedAt: "2026-03-31T21:50:00.000Z",
      missedTopicTags: ["networking introductions"]
    },
    {
      id: "quiz-transition-roles",
      userId: "user-demo",
      studyUnitId: "unit-transition-roles",
      scorePercent: 64,
      questionCount: 8,
      correctCount: 5,
      attemptedAt: "2026-04-02T20:58:00.000Z",
      missedTopicTags: ["committee ownership", "handoff notes"]
    },
    {
      id: "quiz-meeting-recognition",
      userId: "user-demo",
      studyUnitId: "unit-meeting-recognition",
      scorePercent: 88,
      questionCount: 8,
      correctCount: 7,
      attemptedAt: "2026-03-28T18:00:00.000Z",
      missedTopicTags: ["motion wording"]
    }
  ],
  forumCategories: [
    {
      id: "forum-cat-general",
      name: "General Questions",
      description: "Broad FBLA questions that do not fit neatly into one prep area.",
      scopeType: "national",
      organizationId: "org-national",
      visibilityType: "public",
      sortOrder: 1
    },
    {
      id: "forum-cat-competition",
      name: "Competition Discussion",
      description: "Strategy, build feedback, and event-specific conversations.",
      scopeType: "state",
      organizationId: "org-ca",
      visibilityType: "public",
      sortOrder: 2
    },
    {
      id: "forum-cat-event-prep",
      name: "Event Preparation",
      description: "Prep routines, logistics, and event-week coordination.",
      scopeType: "state",
      organizationId: "org-ca",
      visibilityType: "public",
      sortOrder: 3
    },
    {
      id: "forum-cat-chapter-life",
      name: "Chapter Life",
      description: "Recruitment, service, meetings, and chapter systems.",
      scopeType: "chapter",
      organizationId: "org-monta-vista",
      visibilityType: "chapter",
      sortOrder: 4
    },
    {
      id: "forum-cat-conference",
      name: "Conference Discussion",
      description: "Travel, etiquette, schedules, and conference-day questions.",
      scopeType: "state",
      organizationId: "org-ca",
      visibilityType: "public",
      sortOrder: 5
    },
    {
      id: "forum-cat-resource",
      name: "Resource Help",
      description: "Ask what to open, what matters, and what resource to trust first.",
      scopeType: "national",
      organizationId: "org-national",
      visibilityType: "public",
      sortOrder: 6
    },
    {
      id: "forum-cat-study",
      name: "Study Support",
      description: "Weak areas, quizzes, review routines, and study accountability.",
      scopeType: "national",
      organizationId: "org-national",
      visibilityType: "public",
      sortOrder: 7
    },
    {
      id: "forum-cat-announcements",
      name: "Announcements Discussion",
      description: "Clarify updates, deadlines, and what a post actually means for members.",
      scopeType: "state",
      organizationId: "org-ca",
      visibilityType: "public",
      sortOrder: 8
    }
  ],
  forumThreads: [
    {
      id: "thread-demo-structure",
      categoryId: "forum-cat-competition",
      authorUserId: "user-demo",
      title: "How are you structuring the strongest seven-minute demo?",
      body:
        "I want the walkthrough to feel connected rather than like a list of screens. What order has landed best for you when you need to show both member value and technical depth?",
      threadType: "discussion",
      status: "active",
      relatedEventId: "event-state-leadership-conference",
      relatedStudyTrackId: "study-mobile-polish",
      tags: ["mobile", "demo", "presentation", "judging"],
      replyCount: 3,
      helpfulCount: 11,
      viewCount: 86,
      createdAt: "2026-03-31T22:10:00.000Z",
      updatedAt: "2026-04-03T01:00:00.000Z",
      lastActivityAt: "2026-04-03T01:00:00.000Z"
    },
    {
      id: "thread-validation-explain",
      categoryId: "forum-cat-competition",
      authorUserId: "user-ava-chen",
      title: "Best way to explain validation without losing the judges?",
      body:
        "We built a lot of guardrails into onboarding and saved-state flows. I want to explain why that matters in plain language instead of sounding too technical.",
      threadType: "question",
      status: "active",
      relatedResourceId: "resource-validation-rules-sheet",
      relatedStudyTrackId: "study-mobile-polish",
      tags: ["validation", "mobile", "presentation"],
      replyCount: 2,
      helpfulCount: 8,
      viewCount: 54,
      createdAt: "2026-04-01T01:40:00.000Z",
      updatedAt: "2026-04-02T20:12:00.000Z",
      lastActivityAt: "2026-04-02T20:12:00.000Z"
    },
    {
      id: "thread-business-presentation-opening",
      categoryId: "forum-cat-competition",
      authorUserId: "user-lena-ortiz",
      title: "Do you script the first thirty seconds of your presentation?",
      body:
        "I’m deciding how much to memorize versus how much to keep flexible. Curious what feels most natural without sounding rehearsed.",
      threadType: "discussion",
      status: "active",
      relatedResourceId: "resource-public-speaking-prep",
      tags: ["public", "speaking", "presentation"],
      replyCount: 2,
      helpfulCount: 7,
      viewCount: 39,
      createdAt: "2026-03-30T18:00:00.000Z",
      updatedAt: "2026-04-01T17:45:00.000Z",
      lastActivityAt: "2026-04-01T17:45:00.000Z"
    },
    {
      id: "thread-roleplay-last-minute",
      categoryId: "forum-cat-competition",
      authorUserId: "user-maya-singh",
      title: "Last-minute roleplay prep that actually helps",
      body:
        "If you only have one short block before a roleplay, what do you review that gives the biggest confidence boost?",
      threadType: "tip_guide",
      status: "active",
      relatedResourceId: "resource-roleplay-prep-notes",
      tags: ["roleplay", "business", "study"],
      replyCount: 1,
      helpfulCount: 6,
      viewCount: 27,
      createdAt: "2026-03-29T23:50:00.000Z",
      updatedAt: "2026-04-02T15:10:00.000Z",
      lastActivityAt: "2026-04-02T15:10:00.000Z"
    },
    {
      id: "thread-travel-questions",
      categoryId: "forum-cat-conference",
      authorUserId: "user-demo",
      title: "State conference arrival and check-in tips?",
      body:
        "Would love a simple rundown from anyone who has done state before. What should first-timers prioritize in the first hour after arriving?",
      threadType: "logistics",
      status: "active",
      relatedEventId: "event-state-leadership-conference",
      relatedResourceId: "resource-state-travel-packet",
      tags: ["conference", "travel", "first timers"],
      replyCount: 2,
      helpfulCount: 9,
      viewCount: 63,
      createdAt: "2026-03-30T19:20:00.000Z",
      updatedAt: "2026-04-02T22:15:00.000Z",
      lastActivityAt: "2026-04-02T22:15:00.000Z"
    },
    {
      id: "thread-packing-checklist-essentials",
      categoryId: "forum-cat-conference",
      authorUserId: "user-jordan-lee",
      title: "What always ends up on your conference packing checklist?",
      body:
        "Trying to make sure I don’t forget the small things that matter on a travel day. What do experienced members pack that newer members overlook?",
      threadType: "question",
      status: "active",
      relatedEventId: "event-state-leadership-conference",
      relatedResourceId: "resource-conference-packing-checklist",
      tags: ["conference", "packing", "travel"],
      replyCount: 3,
      helpfulCount: 10,
      viewCount: 72,
      createdAt: "2026-03-31T02:20:00.000Z",
      updatedAt: "2026-04-03T00:25:00.000Z",
      lastActivityAt: "2026-04-03T00:25:00.000Z"
    },
    {
      id: "thread-rooming-list-questions",
      categoryId: "forum-cat-conference",
      authorUserId: "user-rina-patel",
      title: "How early are you locking your rooming list?",
      body:
        "Our chapter still has one maybe attendee. Curious how other officers handle rooming lists without creating last-minute chaos for advisers.",
      threadType: "discussion",
      status: "active",
      relatedEventId: "event-state-rooming-list",
      tags: ["conference", "travel", "officer"],
      replyCount: 1,
      helpfulCount: 5,
      viewCount: 31,
      createdAt: "2026-04-01T19:00:00.000Z",
      updatedAt: "2026-04-02T18:40:00.000Z",
      lastActivityAt: "2026-04-02T18:40:00.000Z"
    },
    {
      id: "thread-networking-lunch",
      categoryId: "forum-cat-conference",
      authorUserId: "user-ethan-kim",
      title: "How do you make networking lunch feel less awkward?",
      body:
        "I’m fine presenting, but the in-between conference conversations are harder. Looking for tips that feel natural and not overly scripted.",
      threadType: "study_help",
      status: "active",
      relatedStudyTrackId: "study-networking-basics",
      relatedResourceId: "resource-networking-tips",
      tags: ["networking", "conference", "confidence"],
      replyCount: 2,
      helpfulCount: 8,
      viewCount: 43,
      createdAt: "2026-03-31T21:10:00.000Z",
      updatedAt: "2026-04-02T16:20:00.000Z",
      lastActivityAt: "2026-04-02T16:20:00.000Z"
    },
    {
      id: "thread-objective-test-routine",
      categoryId: "forum-cat-study",
      authorUserId: "user-demo",
      title: "What’s your best routine before objective tests?",
      body:
        "I’m trying to avoid panic-reviewing right before a test. What short routine actually helps you feel sharper instead of more stressed?",
      threadType: "study_help",
      status: "active",
      relatedEventId: "event-bay-objective-test-bootcamp",
      relatedStudyTrackId: "study-objective-test-reset",
      tags: ["objective", "test", "study", "business"],
      replyCount: 3,
      helpfulCount: 12,
      viewCount: 80,
      createdAt: "2026-03-29T20:00:00.000Z",
      updatedAt: "2026-04-02T23:20:00.000Z",
      lastActivityAt: "2026-04-02T23:20:00.000Z"
    },
    {
      id: "thread-business-comms-weak-area",
      categoryId: "forum-cat-study",
      authorUserId: "user-noah-garcia",
      title: "Business communication keeps dragging my score down",
      body:
        "I’m fine on broad concepts but I still miss tone and audience questions. Any resource or quiz routine that helped you fix that?",
      threadType: "question",
      status: "active",
      relatedResourceId: "resource-business-communication-review",
      relatedStudyTrackId: "study-objective-test-reset",
      tags: ["business", "communication", "study", "test"],
      replyCount: 2,
      helpfulCount: 7,
      viewCount: 41,
      createdAt: "2026-03-30T23:00:00.000Z",
      updatedAt: "2026-04-01T22:00:00.000Z",
      lastActivityAt: "2026-04-01T22:00:00.000Z"
    },
    {
      id: "thread-qa-recovery",
      categoryId: "forum-cat-study",
      authorUserId: "user-ava-chen",
      title: "How are you practicing Q&A recovery?",
      body:
        "I can answer clear questions, but if a judge phrases something oddly I lose momentum. Looking for practice methods that make recovery feel normal.",
      threadType: "study_help",
      status: "active",
      relatedStudyTrackId: "study-presentation-presence",
      relatedResourceId: "resource-icerberg-questions-bank",
      tags: ["public", "speaking", "q&a", "study"],
      replyCount: 2,
      helpfulCount: 9,
      viewCount: 49,
      createdAt: "2026-03-31T03:40:00.000Z",
      updatedAt: "2026-04-03T00:05:00.000Z",
      lastActivityAt: "2026-04-03T00:05:00.000Z"
    },
    {
      id: "thread-study-accountability",
      categoryId: "forum-cat-study",
      authorUserId: "user-lena-ortiz",
      title: "Anyone doing short daily study accountability?",
      body:
        "I do much better with short daily reps than giant cram sessions. Curious how others are keeping themselves consistent this month.",
      threadType: "discussion",
      status: "active",
      tags: ["study", "accountability", "routine"],
      replyCount: 1,
      helpfulCount: 4,
      viewCount: 22,
      createdAt: "2026-04-01T04:00:00.000Z",
      updatedAt: "2026-04-02T13:20:00.000Z",
      lastActivityAt: "2026-04-02T13:20:00.000Z"
    },
    {
      id: "thread-resource-which-first",
      categoryId: "forum-cat-resource",
      authorUserId: "user-maya-singh",
      title: "If you only open one resource before conference week, which one is it?",
      body:
        "Trying to prioritize instead of half-reading ten things. What’s the one resource that gives the most value right away?",
      threadType: "question",
      status: "active",
      relatedResourceId: "resource-state-travel-packet",
      tags: ["resource", "conference", "planning"],
      replyCount: 2,
      helpfulCount: 6,
      viewCount: 29,
      createdAt: "2026-04-01T20:10:00.000Z",
      updatedAt: "2026-04-02T16:00:00.000Z",
      lastActivityAt: "2026-04-02T16:00:00.000Z"
    },
    {
      id: "thread-slide-cleanup-help",
      categoryId: "forum-cat-resource",
      authorUserId: "user-ethan-kim",
      title: "What actually makes a deck feel cleaner to judges?",
      body:
        "We’ve simplified our slides a lot, but I’m still not sure what details judges notice most when they say a deck feels polished.",
      threadType: "discussion",
      status: "active",
      relatedResourceId: "resource-official-branding-reference",
      tags: ["branding", "slides", "presentation"],
      replyCount: 1,
      helpfulCount: 5,
      viewCount: 25,
      createdAt: "2026-03-30T20:30:00.000Z",
      updatedAt: "2026-04-02T12:40:00.000Z",
      lastActivityAt: "2026-04-02T12:40:00.000Z"
    },
    {
      id: "thread-officer-resource-pack",
      categoryId: "forum-cat-resource",
      authorUserId: "user-rina-patel",
      title: "Best officer resources to hand to the next board?",
      body:
        "We’re starting transition notes early this year. What documents made the biggest difference when your chapter changed officer teams?",
      threadType: "question",
      status: "active",
      relatedResourceId: "resource-officer-transition-playbook",
      relatedStudyTrackId: "study-officer-transition",
      tags: ["officer", "leadership", "transition", "chapter"],
      replyCount: 2,
      helpfulCount: 8,
      viewCount: 36,
      createdAt: "2026-03-31T19:45:00.000Z",
      updatedAt: "2026-04-02T22:40:00.000Z",
      lastActivityAt: "2026-04-02T22:40:00.000Z"
    },
    {
      id: "thread-recruitment-open-house-ideas",
      categoryId: "forum-cat-chapter-life",
      authorUserId: "user-demo",
      title: "What should we put at each table for the recruitment open house?",
      body:
        "We want the event to feel active instead of just informational. Looking for simple table ideas that make students stop and ask questions.",
      threadType: "question",
      status: "active",
      relatedEventId: "event-chapter-recruitment-open-house",
      relatedStudyTrackId: "study-recruitment-momentum",
      tags: ["chapter", "recruitment", "membership"],
      replyCount: 2,
      helpfulCount: 7,
      viewCount: 35,
      createdAt: "2026-04-01T00:20:00.000Z",
      updatedAt: "2026-04-02T18:10:00.000Z",
      lastActivityAt: "2026-04-02T18:10:00.000Z"
    },
    {
      id: "thread-service-project-followup",
      categoryId: "forum-cat-chapter-life",
      authorUserId: "user-noah-garcia",
      title: "How do you keep service projects from feeling one-and-done?",
      body:
        "We do a good job with the event itself, but the reflection and follow-up piece always gets rushed. Curious what other chapters do.",
      threadType: "discussion",
      status: "active",
      relatedResourceId: "resource-service-project-worksheet",
      tags: ["service", "chapter", "leadership"],
      replyCount: 1,
      helpfulCount: 5,
      viewCount: 21,
      createdAt: "2026-03-30T22:15:00.000Z",
      updatedAt: "2026-04-01T18:00:00.000Z",
      lastActivityAt: "2026-04-01T18:00:00.000Z"
    },
    {
      id: "thread-officer-election-advice",
      categoryId: "forum-cat-chapter-life",
      authorUserId: "user-maya-singh",
      title: "Advice for making officer elections feel more helpful than awkward",
      body:
        "We want elections to feel supportive and clear, not tense. What norms or structure helped your chapter keep the process healthy?",
      threadType: "tip_guide",
      status: "active",
      relatedResourceId: "resource-officer-election-toolkit",
      tags: ["officer", "leadership", "chapter"],
      replyCount: 2,
      helpfulCount: 9,
      viewCount: 44,
      createdAt: "2026-03-29T18:30:00.000Z",
      updatedAt: "2026-04-02T19:20:00.000Z",
      lastActivityAt: "2026-04-02T19:20:00.000Z"
    },
    {
      id: "thread-parent-preview-flow",
      categoryId: "forum-cat-chapter-life",
      authorUserId: "user-lena-ortiz",
      title: "How are you pacing your parent preview walk-throughs?",
      body:
        "We want families to see real progress without dragging the night out. Curious what format others are using for live project demos.",
      threadType: "discussion",
      status: "active",
      relatedEventId: "event-chapter-parent-preview",
      tags: ["chapter", "showcase", "presentation"],
      replyCount: 1,
      helpfulCount: 4,
      viewCount: 18,
      createdAt: "2026-04-01T23:00:00.000Z",
      updatedAt: "2026-04-02T21:30:00.000Z",
      lastActivityAt: "2026-04-02T21:30:00.000Z"
    },
    {
      id: "thread-meeting-procedure-help",
      categoryId: "forum-cat-general",
      authorUserId: "user-jordan-lee",
      title: "Simple way to teach meeting procedure to newer members?",
      body:
        "Our chapter wants cleaner meetings, but we don’t want to make everything feel overly formal. Looking for a good middle ground.",
      threadType: "question",
      status: "active",
      relatedStudyTrackId: "study-meeting-procedure",
      relatedResourceId: "resource-meeting-procedure-notes",
      tags: ["meeting", "chapter", "leadership"],
      replyCount: 2,
      helpfulCount: 8,
      viewCount: 37,
      createdAt: "2026-03-30T17:10:00.000Z",
      updatedAt: "2026-04-02T14:45:00.000Z",
      lastActivityAt: "2026-04-02T14:45:00.000Z"
    },
    {
      id: "thread-balance-school-and-prep",
      categoryId: "forum-cat-general",
      authorUserId: "user-ethan-kim",
      title: "How are you balancing event prep with regular school right now?",
      body:
        "Competition season always hits when regular classes get busy too. Curious what routines are helping people stay on top of both.",
      threadType: "discussion",
      status: "active",
      tags: ["study", "planning", "balance"],
      replyCount: 2,
      helpfulCount: 6,
      viewCount: 40,
      createdAt: "2026-03-31T00:15:00.000Z",
      updatedAt: "2026-04-02T17:20:00.000Z",
      lastActivityAt: "2026-04-02T17:20:00.000Z"
    },
    {
      id: "thread-ask-ai-best-use",
      categoryId: "forum-cat-general",
      authorUserId: "user-ava-chen",
      title: "What’s the best way to use the AI assistant without wasting time?",
      body:
        "I like the idea of AI for next steps and summaries, but I’m curious what prompts are actually useful in the middle of conference prep.",
      threadType: "official_discussion",
      status: "active",
      tags: ["ai", "resources", "study"],
      replyCount: 2,
      helpfulCount: 10,
      viewCount: 61,
      createdAt: "2026-04-01T02:40:00.000Z",
      updatedAt: "2026-04-03T00:40:00.000Z",
      lastActivityAt: "2026-04-03T00:40:00.000Z"
    },
    {
      id: "thread-update-what-matters",
      categoryId: "forum-cat-announcements",
      authorUserId: "user-demo",
      title: "From the registration update, what actually matters for members?",
      body:
        "Trying to translate the latest registration post into clear student actions. What should members themselves check versus leaving to advisers?",
      threadType: "question",
      status: "active",
      relatedEventId: "event-state-registration-window",
      relatedResourceId: "resource-competition-timeline-onepager",
      tags: ["announcement", "deadline", "conference"],
      replyCount: 1,
      helpfulCount: 6,
      viewCount: 28,
      createdAt: "2026-04-02T16:20:00.000Z",
      updatedAt: "2026-04-02T20:00:00.000Z",
      lastActivityAt: "2026-04-02T20:00:00.000Z"
    },
    {
      id: "thread-travel-webinar-questions",
      categoryId: "forum-cat-announcements",
      authorUserId: "user-rina-patel",
      title: "Questions you want answered in the travel webinar?",
      body:
        "Trying to collect the most useful travel questions in one place before the webinar starts. What are you still unsure about?",
      threadType: "discussion",
      status: "active",
      relatedEventId: "event-state-travel-webinar",
      relatedResourceId: "resource-state-travel-packet",
      tags: ["announcement", "travel", "conference"],
      replyCount: 2,
      helpfulCount: 7,
      viewCount: 30,
      createdAt: "2026-04-02T18:20:00.000Z",
      updatedAt: "2026-04-03T03:30:00.000Z",
      lastActivityAt: "2026-04-03T03:30:00.000Z"
    },
    {
      id: "thread-membership-toolkit",
      categoryId: "forum-cat-announcements",
      authorUserId: "user-noah-garcia",
      title: "What would you want in the new membership campaign toolkit?",
      body:
        "National teased a recruitment toolkit. If you could add one thing that chapters actually need, what would it be?",
      threadType: "discussion",
      status: "active",
      relatedEventId: "event-national-membership-challenge",
      relatedResourceId: "resource-recruitment-campaign-playbook",
      tags: ["announcement", "membership", "chapter"],
      replyCount: 1,
      helpfulCount: 5,
      viewCount: 20,
      createdAt: "2026-04-02T15:45:00.000Z",
      updatedAt: "2026-04-02T22:00:00.000Z",
      lastActivityAt: "2026-04-02T22:00:00.000Z"
    }
  ],
  forumReplies: [
    {
      id: "reply-demo-1",
      threadId: "thread-demo-structure",
      authorUserId: "user-rina-patel",
      body:
        "What helped our chapter most was showing one action chain: save the event, watch the home screen update, then open the linked study plan.",
      status: "active",
      helpfulCount: 5,
      createdAt: "2026-04-01T00:10:00.000Z",
      updatedAt: "2026-04-01T00:10:00.000Z"
    },
    {
      id: "reply-demo-2",
      threadId: "thread-demo-structure",
      authorUserId: "user-demo",
      body:
        "We kept the social proof moment short. One official highlight card was enough to show context without derailing the main story.",
      status: "active",
      helpfulCount: 3,
      createdAt: "2026-04-02T02:40:00.000Z",
      updatedAt: "2026-04-02T02:40:00.000Z"
    },
    {
      id: "reply-demo-3",
      threadId: "thread-demo-structure",
      authorUserId: "user-ava-chen",
      body:
        "I’d end with AI referencing a real saved event. It makes the app feel like it understands what the member is already doing.",
      status: "active",
      helpfulCount: 4,
      createdAt: "2026-04-03T01:00:00.000Z",
      updatedAt: "2026-04-03T01:00:00.000Z"
    },
    {
      id: "reply-validation-1",
      threadId: "thread-validation-explain",
      authorUserId: "user-demo",
      body:
        "I’ve had better luck saying validation protects the member from bad or incomplete inputs before those problems spread into reminders, saved items, or recommendations.",
      status: "active",
      helpfulCount: 4,
      createdAt: "2026-04-02T12:10:00.000Z",
      updatedAt: "2026-04-02T12:10:00.000Z"
    },
    {
      id: "reply-validation-2",
      threadId: "thread-validation-explain",
      authorUserId: "user-maya-singh",
      body:
        "The plain-language version we use is: the app should help students move forward, not quietly save broken information that creates confusion later.",
      status: "active",
      helpfulCount: 5,
      createdAt: "2026-04-02T20:12:00.000Z",
      updatedAt: "2026-04-02T20:12:00.000Z"
    },
    {
      id: "reply-opening-1",
      threadId: "thread-business-presentation-opening",
      authorUserId: "user-rina-patel",
      body:
        "I script the first two lines exactly, then switch to anchor phrases. That keeps the opening clean without making the whole thing sound memorized.",
      status: "active",
      helpfulCount: 3,
      createdAt: "2026-03-31T18:40:00.000Z",
      updatedAt: "2026-03-31T18:40:00.000Z"
    },
    {
      id: "reply-opening-2",
      threadId: "thread-business-presentation-opening",
      authorUserId: "user-demo",
      body:
        "Same here. I lock in the opening, the transition to the middle, and the closer, then leave the rest flexible enough to sound natural.",
      status: "active",
      helpfulCount: 2,
      createdAt: "2026-04-01T17:45:00.000Z",
      updatedAt: "2026-04-01T17:45:00.000Z"
    },
    {
      id: "reply-roleplay-1",
      threadId: "thread-roleplay-last-minute",
      authorUserId: "user-jordan-lee",
      body:
        "I review a single structure: identify the need, give two actions, explain impact. That helps even if the scenario changes.",
      status: "active",
      helpfulCount: 4,
      createdAt: "2026-04-02T15:10:00.000Z",
      updatedAt: "2026-04-02T15:10:00.000Z"
    },
    {
      id: "reply-travel-1",
      threadId: "thread-travel-questions",
      authorUserId: "user-maya-singh",
      body:
        "Try to pre-save your schedule and logistics documents before travel day. Spotty internet feels much less stressful when the basics are already on your phone.",
      status: "active",
      helpfulCount: 5,
      createdAt: "2026-03-31T05:10:00.000Z",
      updatedAt: "2026-03-31T05:10:00.000Z"
    },
    {
      id: "reply-travel-2",
      threadId: "thread-travel-questions",
      authorUserId: "user-lena-ortiz",
      body:
        "First hour for us was always badge pickup, room key check, then a calm reset before opening session. Rushing straight into social time made the rest of the night messier.",
      status: "active",
      helpfulCount: 3,
      createdAt: "2026-04-02T22:15:00.000Z",
      updatedAt: "2026-04-02T22:15:00.000Z"
    },
    {
      id: "reply-packing-1",
      threadId: "thread-packing-checklist-essentials",
      authorUserId: "user-demo",
      body:
        "Phone charger, printed backup, water bottle, and one extra professional layer because conference rooms always vary more than I expect.",
      status: "active",
      helpfulCount: 4,
      createdAt: "2026-04-01T18:00:00.000Z",
      updatedAt: "2026-04-01T18:00:00.000Z"
    },
    {
      id: "reply-packing-2",
      threadId: "thread-packing-checklist-essentials",
      authorUserId: "user-ethan-kim",
      body:
        "I also pack a tiny folder with schedule printouts and emergency contact info. It feels old-school until someone’s phone dies.",
      status: "active",
      helpfulCount: 3,
      createdAt: "2026-04-02T14:20:00.000Z",
      updatedAt: "2026-04-02T14:20:00.000Z"
    },
    {
      id: "reply-packing-3",
      threadId: "thread-packing-checklist-essentials",
      authorUserId: "user-rina-patel",
      body:
        "Mints, stain pen, and a backup USB have saved more stress than any big item on my list.",
      status: "active",
      helpfulCount: 5,
      createdAt: "2026-04-03T00:25:00.000Z",
      updatedAt: "2026-04-03T00:25:00.000Z"
    },
    {
      id: "reply-rooming-1",
      threadId: "thread-rooming-list-questions",
      authorUserId: "user-demo",
      body:
        "We’re trying to lock a draft early and mark the one uncertain spot separately so advisers are not rebuilding the whole list at the last second.",
      status: "active",
      helpfulCount: 2,
      createdAt: "2026-04-02T18:40:00.000Z",
      updatedAt: "2026-04-02T18:40:00.000Z"
    },
    {
      id: "reply-networking-1",
      threadId: "thread-networking-lunch",
      authorUserId: "user-maya-singh",
      body:
        "I keep two easy opener questions ready so I’m not improvising from scratch. Once the first thirty seconds are over, it gets much easier.",
      status: "active",
      helpfulCount: 4,
      createdAt: "2026-04-01T19:15:00.000Z",
      updatedAt: "2026-04-01T19:15:00.000Z"
    },
    {
      id: "reply-networking-2",
      threadId: "thread-networking-lunch",
      authorUserId: "user-demo",
      body:
        "Asking what event someone is doing has been the safest opener for me. It works even when I’m nervous and usually leads somewhere useful.",
      status: "active",
      helpfulCount: 3,
      createdAt: "2026-04-02T16:20:00.000Z",
      updatedAt: "2026-04-02T16:20:00.000Z"
    },
    {
      id: "reply-test-routine-1",
      threadId: "thread-objective-test-routine",
      authorUserId: "user-lena-ortiz",
      body:
        "I do one tiny warm-up set, then stop. Too much last-minute reviewing just makes all the concepts blur together for me.",
      status: "active",
      helpfulCount: 4,
      createdAt: "2026-03-30T02:00:00.000Z",
      updatedAt: "2026-03-30T02:00:00.000Z"
    },
    {
      id: "reply-test-routine-2",
      threadId: "thread-objective-test-routine",
      authorUserId: "user-demo",
      body:
        "I also write down the two topics I usually miss so I remember to stay calm if those show up instead of spiraling.",
      status: "active",
      helpfulCount: 3,
      createdAt: "2026-04-01T22:50:00.000Z",
      updatedAt: "2026-04-01T22:50:00.000Z"
    },
    {
      id: "reply-test-routine-3",
      threadId: "thread-objective-test-routine",
      authorUserId: "user-noah-garcia",
      body:
        "The best shift for me was pacing by checkpoints instead of trying to feel perfect about every question early in the test.",
      status: "active",
      helpfulCount: 5,
      createdAt: "2026-04-02T23:20:00.000Z",
      updatedAt: "2026-04-02T23:20:00.000Z"
    },
    {
      id: "reply-business-comms-1",
      threadId: "thread-business-comms-weak-area",
      authorUserId: "user-demo",
      body:
        "The review pack helped me most when I turned each miss into a tiny note on why that audience or tone fit better than the others.",
      status: "active",
      helpfulCount: 3,
      createdAt: "2026-04-01T20:00:00.000Z",
      updatedAt: "2026-04-01T20:00:00.000Z"
    },
    {
      id: "reply-business-comms-2",
      threadId: "thread-business-comms-weak-area",
      authorUserId: "user-jordan-lee",
      body:
        "I started grouping misses by pattern instead of question number. Once I noticed I always missed internal-vs-external audience questions, my score improved faster.",
      status: "active",
      helpfulCount: 4,
      createdAt: "2026-04-01T22:00:00.000Z",
      updatedAt: "2026-04-01T22:00:00.000Z"
    },
    {
      id: "reply-qa-1",
      threadId: "thread-qa-recovery",
      authorUserId: "user-demo",
      body:
        "We’ve been practicing a short reset phrase like, “That’s a great question. Here’s the part of the app that addresses it directly,” so there’s less dead air.",
      status: "active",
      helpfulCount: 4,
      createdAt: "2026-04-02T19:10:00.000Z",
      updatedAt: "2026-04-02T19:10:00.000Z"
    },
    {
      id: "reply-qa-2",
      threadId: "thread-qa-recovery",
      authorUserId: "user-ava-chen",
      body:
        "I’ve also started asking a clarifying question if the prompt is vague. It feels more confident than guessing at what the judge meant.",
      status: "active",
      helpfulCount: 5,
      createdAt: "2026-04-03T00:05:00.000Z",
      updatedAt: "2026-04-03T00:05:00.000Z"
    },
    {
      id: "reply-accountability-1",
      threadId: "thread-study-accountability",
      authorUserId: "user-rina-patel",
      body:
        "Three twenty-minute blocks a week has been way more realistic for me than chasing a perfect daily streak.",
      status: "active",
      helpfulCount: 2,
      createdAt: "2026-04-02T13:20:00.000Z",
      updatedAt: "2026-04-02T13:20:00.000Z"
    },
    {
      id: "reply-resource-first-1",
      threadId: "thread-resource-which-first",
      authorUserId: "user-demo",
      body:
        "If conference week is close, I’d open the travel packet first because it reduces stress fast and lets everything else land more clearly.",
      status: "active",
      helpfulCount: 4,
      createdAt: "2026-04-02T15:10:00.000Z",
      updatedAt: "2026-04-02T15:10:00.000Z"
    },
    {
      id: "reply-resource-first-2",
      threadId: "thread-resource-which-first",
      authorUserId: "user-lena-ortiz",
      body:
        "Agreed. Then I’d use one judging or room-flow guide so the logistics and the competition mindset reinforce each other.",
      status: "active",
      helpfulCount: 3,
      createdAt: "2026-04-02T16:00:00.000Z",
      updatedAt: "2026-04-02T16:00:00.000Z"
    },
    {
      id: "reply-slides-1",
      threadId: "thread-slide-cleanup-help",
      authorUserId: "user-maya-singh",
      body:
        "The biggest jump for us came from making every slide answer one question instead of trying to carry the whole app on each screen.",
      status: "active",
      helpfulCount: 3,
      createdAt: "2026-04-02T12:40:00.000Z",
      updatedAt: "2026-04-02T12:40:00.000Z"
    },
    {
      id: "reply-officer-pack-1",
      threadId: "thread-officer-resource-pack",
      authorUserId: "user-demo",
      body:
        "Calendar ownership, login storage, committee contacts, and a “what quietly breaks if nobody owns it” list ended up being our most helpful handoff pages.",
      status: "active",
      helpfulCount: 5,
      createdAt: "2026-04-02T20:50:00.000Z",
      updatedAt: "2026-04-02T20:50:00.000Z"
    },
    {
      id: "reply-officer-pack-2",
      threadId: "thread-officer-resource-pack",
      authorUserId: "user-rina-patel",
      body:
        "I’d add a one-page “how we run our first two meetings” note too. That saved our new board a lot of second-guessing.",
      status: "active",
      helpfulCount: 3,
      createdAt: "2026-04-02T22:40:00.000Z",
      updatedAt: "2026-04-02T22:40:00.000Z"
    },
    {
      id: "reply-open-house-1",
      threadId: "thread-recruitment-open-house-ideas",
      authorUserId: "user-maya-singh",
      body:
        "A “what event would you try?” board worked really well for us. It gave visitors something easy to answer and opened a real conversation fast.",
      status: "active",
      helpfulCount: 4,
      createdAt: "2026-04-02T17:45:00.000Z",
      updatedAt: "2026-04-02T17:45:00.000Z"
    },
    {
      id: "reply-open-house-2",
      threadId: "thread-recruitment-open-house-ideas",
      authorUserId: "user-demo",
      body:
        "Love that. We’re also thinking about a short app demo loop on one device so people see what chapter activity can actually lead to.",
      status: "active",
      helpfulCount: 3,
      createdAt: "2026-04-02T18:10:00.000Z",
      updatedAt: "2026-04-02T18:10:00.000Z"
    },
    {
      id: "reply-service-1",
      threadId: "thread-service-project-followup",
      authorUserId: "user-lena-ortiz",
      body:
        "We assign one person to capture photos, one to track numbers, and one to write the short recap that same day before everyone disappears.",
      status: "active",
      helpfulCount: 3,
      createdAt: "2026-04-01T18:00:00.000Z",
      updatedAt: "2026-04-01T18:00:00.000Z"
    },
    {
      id: "reply-election-1",
      threadId: "thread-officer-election-advice",
      authorUserId: "user-rina-patel",
      body:
        "Clear role descriptions changed everything for us. Candidates felt less like they were campaigning blindly and more like they were applying to serve well.",
      status: "active",
      helpfulCount: 4,
      createdAt: "2026-04-01T22:10:00.000Z",
      updatedAt: "2026-04-01T22:10:00.000Z"
    },
    {
      id: "reply-election-2",
      threadId: "thread-officer-election-advice",
      authorUserId: "user-demo",
      body:
        "We also moved Q&A questions toward chapter systems and care for members, not just “why are you qualified?” That changed the tone a lot.",
      status: "active",
      helpfulCount: 5,
      createdAt: "2026-04-02T19:20:00.000Z",
      updatedAt: "2026-04-02T19:20:00.000Z"
    },
    {
      id: "reply-preview-1",
      threadId: "thread-parent-preview-flow",
      authorUserId: "user-demo",
      body:
        "We’re leaning toward three-minute demos at tables with one shared intro so families can still explore instead of sitting through a long block.",
      status: "active",
      helpfulCount: 2,
      createdAt: "2026-04-02T21:30:00.000Z",
      updatedAt: "2026-04-02T21:30:00.000Z"
    },
    {
      id: "reply-meeting-1",
      threadId: "thread-meeting-procedure-help",
      authorUserId: "user-maya-singh",
      body:
        "Teaching members the “why” behind motions mattered more than memorizing every term for us. Once they understood the flow, the vocabulary came much easier.",
      status: "active",
      helpfulCount: 4,
      createdAt: "2026-04-01T13:20:00.000Z",
      updatedAt: "2026-04-01T13:20:00.000Z"
    },
    {
      id: "reply-meeting-2",
      threadId: "thread-meeting-procedure-help",
      authorUserId: "user-demo",
      body:
        "We use one simple visual agenda and only introduce extra procedure when it solves a real problem. That helped newer members stay comfortable.",
      status: "active",
      helpfulCount: 5,
      createdAt: "2026-04-02T14:45:00.000Z",
      updatedAt: "2026-04-02T14:45:00.000Z"
    },
    {
      id: "reply-balance-1",
      threadId: "thread-balance-school-and-prep",
      authorUserId: "user-jordan-lee",
      body:
        "I plan around the two nights I’m most likely to protect instead of hoping every day will go perfectly. That made prep much less frustrating.",
      status: "active",
      helpfulCount: 3,
      createdAt: "2026-04-01T20:15:00.000Z",
      updatedAt: "2026-04-01T20:15:00.000Z"
    },
    {
      id: "reply-balance-2",
      threadId: "thread-balance-school-and-prep",
      authorUserId: "user-demo",
      body:
        "I’m also trying to use smaller study blocks tied to real upcoming events instead of one giant “prep” task that never feels finished.",
      status: "active",
      helpfulCount: 3,
      createdAt: "2026-04-02T17:20:00.000Z",
      updatedAt: "2026-04-02T17:20:00.000Z"
    },
    {
      id: "reply-ai-1",
      threadId: "thread-ask-ai-best-use",
      authorUserId: "user-demo",
      body:
        "It helps most when I ask it to prioritize what I already saved. Summaries are nice, but “what should I do next for this event?” is where it feels most useful.",
      status: "active",
      helpfulCount: 6,
      createdAt: "2026-04-02T18:30:00.000Z",
      updatedAt: "2026-04-02T18:30:00.000Z"
    },
    {
      id: "reply-ai-2",
      threadId: "thread-ask-ai-best-use",
      authorUserId: "user-ava-chen",
      body:
        "Same. I’ve also liked using it after opening a resource so it can turn the key points into a smaller study set instead of me rereading everything.",
      status: "active",
      helpfulCount: 5,
      createdAt: "2026-04-03T00:40:00.000Z",
      updatedAt: "2026-04-03T00:40:00.000Z"
    },
    {
      id: "reply-update-1",
      threadId: "thread-update-what-matters",
      authorUserId: "user-rina-patel",
      body:
        "Member-side check: make sure your own event materials and attendance details are right. Adviser-side check: registration system and rooming details.",
      status: "active",
      helpfulCount: 4,
      createdAt: "2026-04-02T20:00:00.000Z",
      updatedAt: "2026-04-02T20:00:00.000Z"
    },
    {
      id: "reply-webinar-1",
      threadId: "thread-travel-webinar-questions",
      authorUserId: "user-demo",
      body:
        "I want them to clarify exactly what should be on us versus what advisers are handling at check-in. That split always gets fuzzy.",
      status: "active",
      helpfulCount: 3,
      createdAt: "2026-04-02T18:35:00.000Z",
      updatedAt: "2026-04-02T18:35:00.000Z"
    },
    {
      id: "reply-webinar-2",
      threadId: "thread-travel-webinar-questions",
      authorUserId: "user-ethan-kim",
      body:
        "I’d love a “what happens if you arrive late” answer too, because travel delays always seem to be the thing nobody wants to talk about until it happens.",
      status: "active",
      helpfulCount: 4,
      createdAt: "2026-04-03T03:30:00.000Z",
      updatedAt: "2026-04-03T03:30:00.000Z"
    },
    {
      id: "reply-membership-1",
      threadId: "thread-membership-toolkit",
      authorUserId: "user-lena-ortiz",
      body:
        "A realistic follow-up sequence would help a lot. Plenty of chapters can create interest, but the handoff after the event is where momentum dies.",
      status: "active",
      helpfulCount: 3,
      createdAt: "2026-04-02T22:00:00.000Z",
      updatedAt: "2026-04-02T22:00:00.000Z"
    }
  ],
  forumFollows: [
    {
      id: "follow-thread-demo-structure",
      userId: "user-demo",
      threadId: "thread-demo-structure",
      followedAt: "2026-04-01T00:00:00.000Z"
    },
    {
      id: "follow-thread-travel-questions",
      userId: "user-demo",
      threadId: "thread-travel-questions",
      followedAt: "2026-04-02T18:00:00.000Z"
    },
    {
      id: "follow-thread-objective-routine",
      userId: "user-demo",
      threadId: "thread-objective-test-routine",
      followedAt: "2026-03-31T23:00:00.000Z"
    },
    {
      id: "follow-thread-open-house",
      userId: "user-demo",
      threadId: "thread-recruitment-open-house-ideas",
      followedAt: "2026-04-01T18:00:00.000Z"
    },
    {
      id: "follow-thread-ai",
      userId: "user-demo",
      threadId: "thread-ask-ai-best-use",
      followedAt: "2026-04-02T18:32:00.000Z"
    }
  ],
  aiConversations: [
    {
      id: "ai-conversation-state-prep",
      userId: "user-demo",
      contextType: "event",
      contextId: "event-state-leadership-conference",
      createdAt: "2026-04-02T18:40:00.000Z",
      updatedAt: "2026-04-02T18:45:00.000Z",
      messages: [
        {
          id: "ai-msg-1",
          role: "user",
          content: "What should I finish first before the state conference?",
          sourceLinks: [],
          createdAt: "2026-04-02T18:40:00.000Z"
        },
        {
          id: "ai-msg-2",
          role: "assistant",
          content:
            "Start with the registration and travel items that can block the rest of your week, then move into the Mobile App Final Polish Sprint so your judging prep stays tied to a real event deadline.",
          sourceLinks: [
            { label: "California State Leadership Conference", type: "event", id: "event-state-leadership-conference" },
            { label: "State Conference Travel Packet", type: "resource", id: "resource-state-travel-packet" },
            { label: "Mobile App Final Polish Sprint", type: "study_track", id: "study-mobile-polish" }
          ],
          createdAt: "2026-04-02T18:41:00.000Z"
        }
      ]
    },
    {
      id: "ai-conversation-resource-summary",
      userId: "user-demo",
      contextType: "resource",
      contextId: "resource-business-presentation-rubric",
      createdAt: "2026-04-02T23:06:00.000Z",
      updatedAt: "2026-04-02T23:09:00.000Z",
      messages: [
        {
          id: "ai-msg-3",
          role: "user",
          content: "Summarize this rubric and tell me what judges will notice first.",
          sourceLinks: [],
          createdAt: "2026-04-02T23:06:00.000Z"
        },
        {
          id: "ai-msg-4",
          role: "assistant",
          content:
            "The first things judges will notice are whether your structure is easy to follow, whether your transitions feel controlled, and whether your visuals support the story instead of competing with it.",
          sourceLinks: [
            { label: "Business Presentation Rubric Guide", type: "resource", id: "resource-business-presentation-rubric" },
            { label: "Presentation Presence Builder", type: "study_track", id: "study-presentation-presence" }
          ],
          createdAt: "2026-04-02T23:07:00.000Z"
        }
      ]
    },
    {
      id: "ai-conversation-forum-reply",
      userId: "user-demo",
      contextType: "forum",
      contextId: "thread-travel-webinar-questions",
      createdAt: "2026-04-03T03:18:00.000Z",
      updatedAt: "2026-04-03T03:20:00.000Z",
      messages: [
        {
          id: "ai-msg-5",
          role: "user",
          content: "Draft a helpful reply for this thread.",
          sourceLinks: [],
          createdAt: "2026-04-03T03:18:00.000Z"
        },
        {
          id: "ai-msg-6",
          role: "assistant",
          content:
            "A helpful reply would group questions into member logistics, adviser responsibilities, and arrival-day timing so the webinar host can answer them cleanly instead of jumping between details.",
          sourceLinks: [
            { label: "Questions you want answered in the travel webinar?", type: "forum_thread", id: "thread-travel-webinar-questions" },
            { label: "State Conference Travel Packet", type: "resource", id: "resource-state-travel-packet" },
            { label: "Travel webinar link posted for members", type: "news_post", id: "news-travel-webinar-reminder" }
          ],
          createdAt: "2026-04-03T03:19:00.000Z"
        }
      ]
    }
  ],
  aiGeneratedAssets: [
    {
      id: "asset-state-prep-summary",
      userId: "user-demo",
      assetType: "summary",
      sourceItemType: "event",
      sourceItemId: "event-state-leadership-conference",
      contentBlob:
        "Priority summary: confirm registration and rooming, review the travel packet, then finish one full presentation run-through before conference departure.",
      createdAt: "2026-04-02T18:41:00.000Z"
    },
    {
      id: "asset-mobile-flashcards",
      userId: "user-demo",
      assetType: "flashcards",
      sourceItemType: "resource",
      sourceItemId: "resource-mobile-architecture-notes",
      contentBlob:
        "Flashcards: data flow, validation, saved state, recommendation bundle, and why each layer matters in a member-facing app.",
      createdAt: "2026-04-02T22:20:00.000Z"
    },
    {
      id: "asset-conference-study-plan",
      userId: "user-demo",
      assetType: "study_plan",
      sourceItemType: "study_track",
      sourceItemId: "study-conference-readiness",
      contentBlob:
        "Plan: travel packet review, networking flashcards, room-flow checklist, then one practical packing pass the night before travel.",
      createdAt: "2026-04-03T01:20:00.000Z"
    },
    {
      id: "asset-thread-summary",
      userId: "user-demo",
      assetType: "thread_summary",
      sourceItemType: "forum_thread",
      sourceItemId: "thread-objective-test-routine",
      contentBlob:
        "Thread summary: members recommend short warm-up sets, pacing checkpoints, and turning predictable misses into a retry list instead of cramming.",
      createdAt: "2026-04-02T23:30:00.000Z"
    }
  ]
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
  generalInterests: [
    "leadership",
    "networking",
    "career growth",
    "service",
    "chapter life"
  ],
  competitionInterests: [
    "mobile application development",
    "public speaking",
    "business management",
    "coding and programming",
    "network design"
  ]
};
