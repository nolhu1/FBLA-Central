import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppScreen } from "@/components/common/AppScreen";
import { GlassCard } from "@/components/cards/GlassCard";
import { Pill } from "@/components/common/Pill";
import { TextField } from "@/components/forms/TextField";
import { demoOptionCatalog } from "@/features/demo/demoData";
import { onboardingSchema, OnboardingInput } from "@/data/schemas/onboarding";
import { useCompleteOnboardingMutation, useGetOrganizationsQuery } from "@/store/services/fblaApi";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/sessionSlice";
import { palette, theme } from "@/theme";

export const OnboardingScreen = () => {
  const dispatch = useAppDispatch();
  const { data: organizations = [] } = useGetOrganizationsQuery();
  const [completeOnboarding, { isLoading }] = useCompleteOnboardingMutation();
  const localChapters = organizations.filter((item) => item.type === "local_chapter");
  const stateChapters = organizations.filter((item) => item.type === "state_chapter");

  const { control, handleSubmit, formState, setValue, watch } = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      firstName: "Nolan",
      lastName: "Huang",
      email: "member@fblacentral.app",
      schoolName: "Monta Vista High School",
      graduationYear: 2027,
      localChapterId: localChapters[0]?.id ?? "",
      stateChapterId: stateChapters[0]?.id ?? "",
      goals: ["compete this year", "prepare for conferences"],
      generalInterests: ["leadership", "career growth"],
      competitionInterests: ["mobile application development"]
    }
  });

  const toggleArrayValue = (field: keyof OnboardingInput, value: string) => {
    const currentValue = (watch(field) as string[]) ?? [];
    const nextValue = currentValue.includes(value)
      ? currentValue.filter((item) => item !== value)
      : [...currentValue, value];
    setValue(field, nextValue as any);
  };

  const onSubmit = handleSubmit(async (values) => {
    const user = await completeOnboarding(values).unwrap();
    dispatch(setUser(user));
  });

  return (
    <AppScreen
      title="Personalize your FBLA Central experience"
      eyebrow="Onboarding"
      subtitle="Profiles drive event ranking, study recommendations, resource suggestions, forum surfacing, and notification defaults."
    >
      <GlassCard title="Member profile">
        <Controller
          control={control}
          name="firstName"
          render={({ field, fieldState }) => (
            <TextField label="First name" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />
          )}
        />
        <Controller
          control={control}
          name="lastName"
          render={({ field, fieldState }) => (
            <TextField label="Last name" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <TextField label="Email" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />
          )}
        />
        <Controller
          control={control}
          name="schoolName"
          render={({ field, fieldState }) => (
            <TextField label="School" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />
          )}
        />
      </GlassCard>

      <GlassCard title="Organization scope">
        <Text style={styles.label}>State chapter</Text>
        <View style={styles.pillRow}>
          {stateChapters.map((item) => (
            <Pill
              key={item.id}
              label={item.shortName}
              active={watch("stateChapterId") === item.id}
              onPress={() => setValue("stateChapterId", item.id)}
            />
          ))}
        </View>
        <Text style={styles.label}>Local chapter</Text>
        <View style={styles.pillRow}>
          {localChapters.map((item) => (
            <Pill
              key={item.id}
              label={item.shortName}
              active={watch("localChapterId") === item.id}
              onPress={() => setValue("localChapterId", item.id)}
            />
          ))}
        </View>
      </GlassCard>

      <GlassCard title="Goals and interests">
        <Text style={styles.label}>Goals</Text>
        <View style={styles.pillRow}>
          {demoOptionCatalog.goals.map((goal) => (
            <Pill
              key={goal}
              label={goal}
              active={watch("goals")?.includes(goal)}
              onPress={() => toggleArrayValue("goals", goal)}
            />
          ))}
        </View>

        <Text style={styles.label}>General interests</Text>
        <View style={styles.pillRow}>
          {demoOptionCatalog.generalInterests.map((interest) => (
            <Pill
              key={interest}
              label={interest}
              active={watch("generalInterests")?.includes(interest)}
              onPress={() => toggleArrayValue("generalInterests", interest)}
            />
          ))}
        </View>

        <Text style={styles.label}>Competition interests</Text>
        <View style={styles.pillRow}>
          {demoOptionCatalog.competitionInterests.map((interest) => (
            <Pill
              key={interest}
              label={interest}
              active={watch("competitionInterests")?.includes(interest)}
              onPress={() => toggleArrayValue("competitionInterests", interest)}
            />
          ))}
        </View>
      </GlassCard>

      {formState.errors.root ? <Text style={styles.error}>{formState.errors.root.message}</Text> : null}
      <Pressable onPress={onSubmit} style={[styles.button, isLoading && styles.buttonDisabled]}>
        <Text style={styles.buttonText}>Finish onboarding</Text>
      </Pressable>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  label: {
    ...theme.typography.label,
    color: palette.mist
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  button: {
    backgroundColor: palette.gold,
    paddingVertical: 16,
    borderRadius: theme.radius.md,
    alignItems: "center"
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: {
    ...theme.typography.label,
    color: palette.ink,
    fontSize: 14
  },
  error: {
    ...theme.typography.label,
    color: palette.danger
  }
});
