# Production Folder Structure

This document captures the production-facing repository tree for FBLA Central.

Excluded from this view:

- dependency directories such as `node_modules`
- local/build artifacts such as `.git`, `.expo`, `dist`, `__pycache__`, and compiled Functions output
- local-only content and bundled non-production document assets

```text
.
|-- .env.example
|-- .gitignore
|-- App.tsx
|-- README.md
|-- app.json
|-- assets
|   `-- pdfs
|       `-- logo
|           `-- FBLA\ Central\ Logo.png
|-- babel.config.js
|-- docs
|   |-- ai-chat-screen-redesign.md
|   |-- events-screen-redesign.md
|   |-- folder-structure.md
|   |-- forums-layout-fixes.md
|   |-- forums-screen-redesign.md
|   |-- home-screen-redesign.md
|   |-- layout-formatting-fix-pass.md
|   |-- mobile-layout-refactor.md
|   |-- news-screen-redesign.md
|   |-- onboarding-profile-redesign.md
|   |-- resources-screen-redesign.md
|   |-- social-hub-redesign.md
|   |-- study-screen-layout-refactor.md
|   |-- study-screen-redesign.md
|   `-- ui-motion-polish.md
|-- eas.json
|-- eslint.config.js
|-- fbla_central_data_model_snapshot.png
|-- fbla_central_data_model_snapshot.svg
|-- fbla_central_technical_architecture.png
|-- firebase
|   `-- functions
|       |-- package-lock.json
|       |-- package.json
|       |-- src
|       |   `-- index.ts
|       `-- tsconfig.json
|-- firebase.json
|-- firestore.rules
|-- generated
|   `-- user_journey_flowchart.svg
|-- metro.config.js
|-- package-lock.json
|-- package.json
|-- scripts
|   |-- generate_data_model_snapshot.py
|   |-- generate_technical_architecture.py
|   `-- generate_user_journey_flowchart.py
|-- src
|   |-- app
|   |   |-- App.tsx
|   |   `-- providers
|   |       `-- AppProviders.tsx
|   |-- components
|   |   |-- ai
|   |   |   |-- AiChatHeader.tsx
|   |   |   |-- AiComposer.tsx
|   |   |   |-- AiContextCard.tsx
|   |   |   |-- AiEmptyState.tsx
|   |   |   |-- AiErrorState.tsx
|   |   |   |-- AiQuickActionChipRow.tsx
|   |   |   |-- AiSourceReferenceCard.tsx
|   |   |   |-- AiTypingIndicator.tsx
|   |   |   |-- AssistantMessageBubble.tsx
|   |   |   `-- UserMessageBubble.tsx
|   |   |-- branding
|   |   |   `-- AppLogoMark.tsx
|   |   |-- cards
|   |   |   |-- GlassCard.tsx
|   |   |   `-- ListItemCard.tsx
|   |   |-- common
|   |   |   |-- AnimatedEntrance.tsx
|   |   |   |-- AnimatedSwitcher.tsx
|   |   |   |-- AppScreen.tsx
|   |   |   |-- Pill.tsx
|   |   |   |-- PreviewHeader.tsx
|   |   |   |-- SectionHeader.tsx
|   |   |   |-- SegmentedControl.tsx
|   |   |   `-- ShimmerBlock.tsx
|   |   |-- community
|   |   |   |-- AskQuestionCard.tsx
|   |   |   |-- CategoryPillScroller.tsx
|   |   |   |-- CategoryTile.tsx
|   |   |   |-- CommunityHeader.tsx
|   |   |   |-- CommunitySearchBar.tsx
|   |   |   |-- CompactThreadCard.tsx
|   |   |   |-- EmptyCommunityState.tsx
|   |   |   |-- FeaturedThreadCard.tsx
|   |   |   |-- LinkedThreadContentCard.tsx
|   |   |   |-- ReplyComposer.tsx
|   |   |   |-- ThreadDetailHeader.tsx
|   |   |   |-- ThreadSkeletonLoader.tsx
|   |   |   |-- ThreadStatsRow.tsx
|   |   |   `-- ThreadStatusBadge.tsx
|   |   |-- events
|   |   |   |-- AgendaSection.tsx
|   |   |   |-- CalendarDayEventList.tsx
|   |   |   |-- CalendarMonthView.tsx
|   |   |   |-- CompactEventCard.tsx
|   |   |   |-- EventDetailHeader.tsx
|   |   |   |-- EventFilterBar.tsx
|   |   |   |-- EventReminderControl.tsx
|   |   |   |-- EventScopeBadge.tsx
|   |   |   |-- EventTypeChip.tsx
|   |   |   |-- EventViewSwitcher.tsx
|   |   |   |-- EventsHeader.tsx
|   |   |   |-- RelatedEventContentSection.tsx
|   |   |   `-- SaveEventButton.tsx
|   |   |-- feedback
|   |   |   `-- EmptyState.tsx
|   |   |-- forms
|   |   |   `-- TextField.tsx
|   |   |-- home
|   |   |   |-- HeroPriorityCard.tsx
|   |   |   |-- HomeHeader.tsx
|   |   |   |-- HomePreviewCard.tsx
|   |   |   |-- HomeSection.tsx
|   |   |   |-- MomentumCard.tsx
|   |   |   |-- QuickActionButton.tsx
|   |   |   `-- StudyFocusCard.tsx
|   |   |-- lists
|   |   |-- news
|   |   |   |-- CompactNewsCard.tsx
|   |   |   |-- EmptyNewsState.tsx
|   |   |   |-- NewsDetailHeader.tsx
|   |   |   |-- NewsFilterChips.tsx
|   |   |   |-- NewsHeader.tsx
|   |   |   |-- NewsPriorityBadge.tsx
|   |   |   |-- NewsRelatedContentSection.tsx
|   |   |   |-- NewsSaveButton.tsx
|   |   |   |-- NewsScopeBadge.tsx
|   |   |   |-- NewsScopeSwitcher.tsx
|   |   |   |-- NewsSkeletonLoader.tsx
|   |   |   `-- PinnedAnnouncementCard.tsx
|   |   |-- profile
|   |   |   |-- InterestChipSelector.tsx
|   |   |   |-- InterestSummaryChips.tsx
|   |   |   |-- MemberIdentitySelector.tsx
|   |   |   |-- NotificationPreferenceCard.tsx
|   |   |   |-- OnboardingProgressHeader.tsx
|   |   |   |-- ProfileHeaderCard.tsx
|   |   |   |-- ProfileMetricTileRow.tsx
|   |   |   |-- ProfileSettingsEntryList.tsx
|   |   |   |-- SavedItemsQuickLinks.tsx
|   |   |   `-- SelectionChip.tsx
|   |   |-- resources
|   |   |   |-- CategoryScroller.tsx
|   |   |   |-- CompactResourceCard.tsx
|   |   |   |-- EmptyResourcesState.tsx
|   |   |   |-- FeaturedResourceCard.tsx
|   |   |   |-- PdfViewerHeader.tsx
|   |   |   |-- RelatedResourcesSection.tsx
|   |   |   |-- ResourceCategoryBadge.tsx
|   |   |   |-- ResourceDetailHeader.tsx
|   |   |   |-- ResourceFilterChips.tsx
|   |   |   |-- ResourceSearchBar.tsx
|   |   |   |-- ResourceSkeletonLoader.tsx
|   |   |   |-- ResourceTypeBadge.tsx
|   |   |   |-- ResourcesHeader.tsx
|   |   |   `-- SavedResourceButton.tsx
|   |   |-- social
|   |   |   |-- EmptySocialState.tsx
|   |   |   |-- FeaturedSocialCard.tsx
|   |   |   |-- OpenExternalActionSheet.tsx
|   |   |   |-- ScopeSwitcher.tsx
|   |   |   |-- ShareChannelButton.tsx
|   |   |   |-- SocialChannelCard.tsx
|   |   |   |-- SocialHighlightCard.tsx
|   |   |   |-- SocialHubHeader.tsx
|   |   |   |-- SocialPlatformBadge.tsx
|   |   |   `-- SocialSectionHeader.tsx
|   |   `-- study
|   |       |-- ActiveTrackCard.tsx
|   |       |-- ContinueStudyCompactHero.tsx
|   |       |-- ContinueStudyHero.tsx
|   |       |-- EmptyStudyState.tsx
|   |       |-- MasteryBreakdownCard.tsx
|   |       |-- MetricTileRow.tsx
|   |       |-- OverviewTabPanel.tsx
|   |       |-- PracticeTabPanel.tsx
|   |       |-- ProgressRingCard.tsx
|   |       |-- ProgressTabPanel.tsx
|   |       |-- ReadinessCard.tsx
|   |       |-- RecommendedStudyCard.tsx
|   |       |-- ReviewTabPanel.tsx
|   |       |-- StudyHeader.tsx
|   |       |-- StudyMetricStrip.tsx
|   |       |-- StudyModeShortcut.tsx
|   |       |-- StudyPracticeLoadingState.tsx
|   |       |-- StudySkeletonLoader.tsx
|   |       |-- StudyTabSwitcher.tsx
|   |       |-- WeakAreaPanel.tsx
|   |       `-- WeeklyStudyChartCard.tsx
|   |-- constants
|   |   `-- config.ts
|   |-- data
|   |   |-- api
|   |   |   `-- firebase.ts
|   |   |-- cache
|   |   |-- repositories
|   |   |   |-- firebaseRepository.ts
|   |   |   |-- index.ts
|   |   |   `-- types.ts
|   |   |-- schemas
|   |   |   `-- onboarding.ts
|   |   `-- storage
|   |       `-- async.ts
|   |-- domain
|   |   |-- models
|   |   |   `-- types.ts
|   |   |-- rules
|   |   `-- services
|   |       |-- ai.ts
|   |       |-- community.ts
|   |       |-- events.ts
|   |       |-- home.ts
|   |       |-- memberProfile.ts
|   |       |-- news.ts
|   |       |-- recommendations.ts
|   |       |-- resources.ts
|   |       |-- search.ts
|   |       |-- social.ts
|   |       |-- study.ts
|   |       `-- studyPractice.ts
|   |-- features
|   |-- motion
|   |   |-- tokens.ts
|   |   `-- useReducedMotion.ts
|   |-- navigation
|   |   `-- RootNavigator.tsx
|   |-- screens
|   |   |-- ai
|   |   |   `-- AIScreen.tsx
|   |   |-- auth
|   |   |   |-- OnboardingScreen.tsx
|   |   |   `-- SignInScreen.tsx
|   |   |-- community
|   |   |   |-- CommunityScreen.tsx
|   |   |   |-- CommunityThreadListScreen.tsx
|   |   |   |-- CreateThreadScreen.tsx
|   |   |   `-- ThreadDetailScreen.tsx
|   |   |-- events
|   |   |   |-- EventDetailScreen.tsx
|   |   |   `-- EventsScreen.tsx
|   |   |-- home
|   |   |   `-- HomeScreen.tsx
|   |   |-- news
|   |   |   |-- NewsDetailScreen.tsx
|   |   |   `-- NewsScreen.tsx
|   |   |-- profile
|   |   |   |-- EditProfileScreen.tsx
|   |   |   |-- PreferencesScreen.tsx
|   |   |   `-- ProfileScreen.tsx
|   |   |-- resources
|   |   |   |-- PdfViewerScreen.tsx
|   |   |   |-- ResourceDetailScreen.tsx
|   |   |   `-- ResourcesScreen.tsx
|   |   |-- search
|   |   |   `-- SearchScreen.tsx
|   |   |-- social
|   |   |   `-- SocialHubScreen.tsx
|   |   `-- study
|   |       |-- FlashcardPracticeScreen.tsx
|   |       |-- QuizPracticeScreen.tsx
|   |       |-- StudyPracticeBrowserScreen.tsx
|   |       |-- StudyPracticeDetailScreen.tsx
|   |       |-- StudyScreen.tsx
|   |       `-- StudyTrackDetailScreen.tsx
|   |-- store
|   |   |-- hooks.ts
|   |   |-- index.ts
|   |   |-- selectors
|   |   |-- services
|   |   |   `-- fblaApi.ts
|   |   `-- slices
|   |       |-- sessionSlice.ts
|   |       `-- uiSlice.ts
|   |-- theme
|   |   `-- index.ts
|   `-- utils
|       |-- copy.ts
|       `-- time.ts
`-- tsconfig.json
```
