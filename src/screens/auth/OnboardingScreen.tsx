import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ActivityIndicator, Animated, Easing, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { AppScreen } from "@/components/common/AppScreen";
import { TextField } from "@/components/forms/TextField";
import { InterestChipSelector } from "@/components/profile/InterestChipSelector";
import { MemberIdentitySelector } from "@/components/profile/MemberIdentitySelector";
import { NotificationPreferenceCard } from "@/components/profile/NotificationPreferenceCard";
import { OnboardingProgressHeader } from "@/components/profile/OnboardingProgressHeader";
import { SelectionChip } from "@/components/profile/SelectionChip";
import { onboardingSchema, OnboardingInput } from "@/data/schemas/onboarding";
import {
  buildOnboardingDefaults,
  canAdvanceOnboardingStep,
  getOrganizationOptions,
  graduationYearOptions,
  memberCompetitionOptions,
  memberGoalOptions,
  memberInterestOptions,
  onboardingSteps
} from "@/domain/services/memberProfile";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useCompleteOnboardingMutation, useGetOrganizationsQuery } from "@/store/services/fblaApi";
import { setUser } from "@/store/slices/sessionSlice";
import { palette, theme } from "@/theme";

export const OnboardingScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.session.user);
  const { data: organizations = [] } = useGetOrganizationsQuery();
  const [completeOnboarding, { isLoading }] = useCompleteOnboardingMutation();
  const [stepIndex, setStepIndex] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);
  const finishOpacity = useRef(new Animated.Value(0)).current;

  const defaults = useMemo(() => buildOnboardingDefaults(user, organizations), [user, organizations]);
  const { control, handleSubmit, setError, clearErrors, setValue, watch, formState } = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    values: defaults
  });

  useEffect(() => {
    if (!isFinishing) {
      finishOpacity.setValue(0);
      return;
    }

    Animated.loop(
      Animated.sequence([
        Animated.timing(finishOpacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true
        }),
        Animated.timing(finishOpacity, {
          toValue: 0.45,
          duration: 700,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true
        })
      ])
    ).start();
  }, [finishOpacity, isFinishing]);

  const values = watch();
  const activeStep = onboardingSteps[stepIndex];
  const { stateChapters, localChapters, subdivisions } = useMemo(
    () => getOrganizationOptions(organizations, values.stateChapterId),
    [organizations, values.stateChapterId]
  );

  const toggleArrayValue = (field: "goals" | "generalInterests" | "competitionInterests", value: string) => {
    const current = values[field] ?? [];
    setValue(field, current.includes(value) ? current.filter((item) => item !== value) : [...current, value], {
      shouldValidate: false
    });
  };

  const canContinue = canAdvanceOnboardingStep(activeStep.key, values);

  const getStepIndexForError = (errors: typeof formState.errors) => {
    if (errors.stateChapterId || errors.localChapterId || errors.stateSubdivisionId) return 1;
    if (errors.firstName || errors.lastName || errors.schoolName || errors.graduationYear) return 2;
    if (errors.goals || errors.generalInterests || errors.competitionInterests) return 3;
    if (errors.notificationPreferences) return 4;
    return onboardingSteps.length - 1;
  };

  const onSubmit = handleSubmit(
    async (input) => {
      clearErrors("root");

      try {
        setIsFinishing(true);
        const nextUser = await completeOnboarding({
          ...input,
          email: input.email || user?.email || "",
          graduationYear: input.graduationYear ?? new Date().getFullYear(),
          notificationPreferences: {
            ...input.notificationPreferences,
            enabled: Object.values(input.notificationPreferences.categories).some(Boolean),
            digestFrequency: input.notificationPreferences.digestFrequency ?? "daily"
          }
        }).unwrap();
        await new Promise((resolve) => setTimeout(resolve, 900));
        dispatch(setUser(nextUser));
        requestAnimationFrame(() => {
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "MainTabs",
                state: {
                  index: 4,
                  routes: [
                    { name: "Home" },
                    { name: "Events" },
                    { name: "Study" },
                    { name: "Community" },
                    { name: "Profile" }
                  ]
                }
              }
            ]
          });
        });
      } catch {
        setIsFinishing(false);
        setError("root", {
          type: "manual",
          message: "We couldn't finish setup right now. Please try again."
        });
      }
    },
    (errors) => {
      setIsFinishing(false);
      setStepIndex(getStepIndexForError(errors));
      setError("root", {
        type: "manual",
        message: "Please complete the required fields before entering FBLA Central."
      });
    }
  );

  const renderWelcome = () => (
    <View style={styles.stepCard}>
      <Text style={styles.stepTitle}>Build your member profile</Text>
      <Text style={styles.stepSubtitle}>
        A quick setup makes FBLA Central feel connected to your chapter, your interests, and the updates that actually matter.
      </Text>
      <View style={styles.featureGrid}>
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>Chapter-aware</Text>
          <Text style={styles.featureBody}>See the right events, news, and reminders first.</Text>
        </View>
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>Study-personalized</Text>
          <Text style={styles.featureBody}>Get prep help shaped around your goals and competition focus.</Text>
        </View>
      </View>
    </View>
  );

  const renderOrganization = () => (
    <View style={styles.stepCard}>
      <Text style={styles.stepTitle}>Connect your FBLA structure</Text>
      <Text style={styles.stepSubtitle}>This tells the app which chapter and state context should guide your experience.</Text>
      <MemberIdentitySelector
        label="State chapter"
        helper="Choose the state chapter that should shape conferences and major announcements."
        options={stateChapters}
        value={values.stateChapterId}
        onChange={(value) => {
          setValue("stateChapterId", value);
          const nextOptions = getOrganizationOptions(organizations, value);
          if (!nextOptions.localChapters.some((item) => item.id === values.localChapterId)) {
            setValue("localChapterId", "");
          }
          if (!nextOptions.subdivisions.some((item) => item.id === values.stateSubdivisionId)) {
            setValue("stateSubdivisionId", null);
          }
        }}
      />
      <MemberIdentitySelector
        label="Local chapter"
        helper="Used for chapter-specific planning and reminders."
        options={localChapters}
        value={values.localChapterId}
        onChange={(value) => setValue("localChapterId", value)}
      />
      {subdivisions.length ? (
        <MemberIdentitySelector
          label="Subdivision"
          helper="Optional, for states that use sections or regions."
          options={subdivisions}
          value={values.stateSubdivisionId}
          onChange={(value) => setValue("stateSubdivisionId", value)}
        />
      ) : null}
    </View>
  );

  const renderBasics = () => (
    <View style={styles.stepCard}>
      <Text style={styles.stepTitle}>Set up your member basics</Text>
      <Text style={styles.stepSubtitle}>Keep this limited to the information that helps personalize your FBLA Central profile.</Text>
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
        name="schoolName"
        render={({ field, fieldState }) => (
          <TextField label="School" value={field.value} onChangeText={field.onChange} error={fieldState.error?.message} />
        )}
      />
      <View style={styles.inlineSection}>
        <Text style={styles.inlineLabel}>Graduation year</Text>
        <View style={styles.chipRow}>
          {graduationYearOptions.map((year) => (
            <SelectionChip key={year} label={String(year)} active={values.graduationYear === year} onPress={() => setValue("graduationYear", year)} />
          ))}
        </View>
      </View>
    </View>
  );

  const renderInterests = () => (
    <View style={styles.stepCard}>
      <Text style={styles.stepTitle}>Choose your focus</Text>
      <Text style={styles.stepSubtitle}>These picks drive recommendations across study, resources, events, and updates.</Text>
      <InterestChipSelector
        title="Goals"
        subtitle="What are you trying to get out of this year?"
        options={memberGoalOptions}
        values={values.goals}
        onToggle={(value) => toggleArrayValue("goals", value)}
      />
      <InterestChipSelector
        title="General interests"
        subtitle="Shape the app beyond just event prep."
        options={memberInterestOptions}
        values={values.generalInterests}
        onToggle={(value) => toggleArrayValue("generalInterests", value)}
      />
      <InterestChipSelector
        title="Competition interests"
        subtitle="Tell the app which competitive areas matter most."
        options={memberCompetitionOptions}
        values={values.competitionInterests}
        onToggle={(value) => toggleArrayValue("competitionInterests", value)}
      />
    </View>
  );

  const renderNotifications = () => (
    <View style={styles.stepCard}>
      <Text style={styles.stepTitle}>Choose your alert style</Text>
      <Text style={styles.stepSubtitle}>Keep the signal strong without turning the app into noise.</Text>
      <NotificationPreferenceCard
        title="Event reminders"
        subtitle="Saved deadlines, conference timing, and planning nudges."
        value={values.notificationPreferences.categories.upcomingSavedEvents}
        onValueChange={(value) => setValue("notificationPreferences.categories.upcomingSavedEvents", value)}
      />
      <NotificationPreferenceCard
        title="Urgent announcements"
        subtitle="Priority updates tied to your chapter and state context."
        value={values.notificationPreferences.categories.urgentAnnouncements}
        onValueChange={(value) => setValue("notificationPreferences.categories.urgentAnnouncements", value)}
      />
      <NotificationPreferenceCard
        title="Study reminders"
        subtitle="Gentle prompts to keep prep moving."
        value={values.notificationPreferences.categories.studyReminders}
        onValueChange={(value) => setValue("notificationPreferences.categories.studyReminders", value)}
      />
      <View style={styles.inlineSection}>
        <Text style={styles.inlineLabel}>Digest</Text>
        <View style={styles.chipRow}>
          {(["instant", "daily", "weekly"] as const).map((option) => (
            <SelectionChip
              key={option}
              label={option[0].toUpperCase() + option.slice(1)}
              active={values.notificationPreferences.digestFrequency === option}
              onPress={() => setValue("notificationPreferences.digestFrequency", option)}
            />
          ))}
        </View>
      </View>
    </View>
  );

  const renderComplete = () => (
    <View style={styles.stepCard}>
      <Text style={styles.stepTitle}>Your FBLA Central is ready</Text>
      <Text style={styles.stepSubtitle}>You now have a profile tuned to your chapter, your season, and the way you want to stay informed.</Text>
      <View style={styles.featureGrid}>
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>{localChapters.find((item) => item.id === values.localChapterId)?.shortName ?? "Chapter ready"}</Text>
          <Text style={styles.featureBody}>Local context can now shape your events and reminders.</Text>
        </View>
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>{values.goals.length} goals selected</Text>
          <Text style={styles.featureBody}>Study, resources, and updates can now prioritize what matters most.</Text>
        </View>
      </View>
    </View>
  );

  const renderStep = () => {
    switch (activeStep.key) {
      case "welcome":
        return renderWelcome();
      case "organization":
        return renderOrganization();
      case "basics":
        return renderBasics();
      case "interests":
        return renderInterests();
      case "notifications":
        return renderNotifications();
      case "complete":
        return renderComplete();
    }
  };

  return (
    <AppScreen title="Onboarding" scroll={false} hideDefaultHeader showBackButton={false}>
      <View style={styles.screen}>
        {isFinishing ? (
          <View style={styles.finishingOverlay}>
            <ActivityIndicator color={palette.gold} size="large" />
            <Animated.View style={{ opacity: finishOpacity }}>
              <Text style={styles.finishingTitle}>Building your FBLA Central</Text>
            </Animated.View>
            <Text style={styles.finishingBody}>Loading your chapter context, recommendations, and study setup...</Text>
          </View>
        ) : null}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>FBLA Central</Text>
          <Text style={styles.title}>Set up your member profile</Text>
          <Text style={styles.subtitle}>Personalize your chapter context, priorities, and alerts in a few focused steps.</Text>
        </View>

        <OnboardingProgressHeader currentStep={stepIndex + 1} totalSteps={onboardingSteps.length} label={activeStep.label} />

        <View style={styles.bodyShell}>
          <ScrollView style={styles.content} contentContainerStyle={styles.contentInner} showsVerticalScrollIndicator={false}>
            {renderStep()}
            {formState.errors.root ? <Text style={styles.error}>{formState.errors.root.message}</Text> : null}
          </ScrollView>
        </View>

        <View style={styles.footer}>
          {stepIndex > 0 ? (
            <Pressable style={styles.secondaryButton} onPress={() => setStepIndex((current) => current - 1)}>
              <Text style={styles.secondaryLabel}>Back</Text>
            </Pressable>
          ) : null}
          {activeStep.key === "complete" ? (
            <Pressable style={[styles.primaryButton, (isLoading || isFinishing) && styles.disabled]} disabled={isLoading || isFinishing} onPress={onSubmit}>
              <Text style={styles.primaryLabel}>{isLoading ? "Finishing..." : "Enter FBLA Central"}</Text>
            </Pressable>
          ) : (
            <Pressable
              style={[styles.primaryButton, !canContinue && styles.disabled]}
              disabled={!canContinue}
              onPress={() => setStepIndex((current) => Math.min(current + 1, onboardingSteps.length - 1))}
            >
              <Text style={styles.primaryLabel}>Continue</Text>
            </Pressable>
          )}
        </View>
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    gap: 8
  },
  finishingOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 3,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 24,
    backgroundColor: "rgba(8,17,30,0.94)"
  },
  header: {
    gap: 3
  },
  eyebrow: {
    ...theme.typography.label,
    color: palette.sky,
    textTransform: "uppercase"
  },
  title: {
    ...theme.typography.display,
    fontSize: 26,
    color: palette.cream
  },
  subtitle: {
    ...theme.typography.body,
    color: palette.mist
  },
  finishingTitle: {
    ...theme.typography.title,
    fontSize: 22,
    color: palette.cream
  },
  finishingBody: {
    ...theme.typography.body,
    color: palette.mist,
    textAlign: "center"
  },
  bodyShell: {
    flex: 1,
    minHeight: 0,
    alignSelf: "stretch",
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)"
  },
  content: {
    flexGrow: 1
  },
  contentInner: {
    padding: 10,
    gap: 8
  },
  stepCard: {
    gap: 8,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border
  },
  stepTitle: {
    ...theme.typography.title,
    fontSize: 18,
    color: palette.cream
  },
  stepSubtitle: {
    ...theme.typography.body,
    color: palette.mist
  },
  featureGrid: {
    gap: 8
  },
  featureCard: {
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: palette.border,
    gap: 3
  },
  featureTitle: {
    ...theme.typography.label,
    fontSize: 13,
    color: palette.cream
  },
  featureBody: {
    ...theme.typography.label,
    color: palette.mist,
    lineHeight: 15
  },
  inlineSection: {
    gap: 8
  },
  inlineLabel: {
    ...theme.typography.label,
    color: palette.sky
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  footer: {
    flexDirection: "row",
    gap: 10,
    paddingBottom: 12
  },
  primaryButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.gold
  },
  secondaryButton: {
    minWidth: 86,
    minHeight: 44,
    paddingHorizontal: 14,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "rgba(255,255,255,0.04)"
  },
  primaryLabel: {
    ...theme.typography.label,
    color: palette.ink
  },
  secondaryLabel: {
    ...theme.typography.label,
    color: palette.cream
  },
  disabled: {
    opacity: 0.6
  },
  error: {
    ...theme.typography.label,
    color: palette.danger
  }
});
