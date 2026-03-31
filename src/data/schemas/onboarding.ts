import { z } from "zod";

export const onboardingSchema = z.object({
  firstName: z.string().min(2, "First name is required."),
  lastName: z.string().min(2, "Last name is required."),
  email: z.string().email("Enter a valid email address."),
  schoolName: z.string().min(2, "School name is required."),
  graduationYear: z
    .number()
    .min(new Date().getFullYear())
    .max(new Date().getFullYear() + 6),
  localChapterId: z.string().min(1, "Choose a chapter."),
  stateChapterId: z.string().min(1, "Choose a state chapter."),
  goals: z.array(z.string()).min(1, "Choose at least one goal."),
  generalInterests: z.array(z.string()).min(1, "Choose at least one interest."),
  competitionInterests: z.array(z.string()).min(1)
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;
