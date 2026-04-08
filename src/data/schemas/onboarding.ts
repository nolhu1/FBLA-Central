import { z } from "zod";

export const onboardingSchema = z.object({
  firstName: z.string().min(2, "First name is required."),
  lastName: z.string().min(2, "Last name is required."),
  email: z.string().optional(),
  schoolName: z.string().min(2, "School name is required."),
  graduationYear: z
    .number()
    .min(new Date().getFullYear())
    .max(new Date().getFullYear() + 6)
    .nullable(),
  localChapterId: z.string().min(1, "Choose a chapter."),
  stateChapterId: z.string().min(1, "Choose a state chapter."),
  stateSubdivisionId: z.string().nullable().optional(),
  goals: z.array(z.string()).min(1, "Choose at least one goal."),
  generalInterests: z.array(z.string()).min(1, "Choose at least one interest."),
  competitionInterests: z.array(z.string()).min(1),
  notificationPreferences: z.object({
    enabled: z.boolean(),
    categories: z.object({
      upcomingSavedEvents: z.boolean(),
      urgentAnnouncements: z.boolean(),
      studyReminders: z.boolean(),
      followedThreadReplies: z.boolean(),
      recommendedOpportunities: z.boolean(),
      resourceUpdates: z.boolean()
    }),
    quietHours: z.object({
      start: z.string(),
      end: z.string()
    }),
    digestFrequency: z.enum(["instant", "daily", "weekly"]).nullable()
  })
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
