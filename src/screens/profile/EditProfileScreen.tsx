import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppScreen } from "@/components/common/AppScreen";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { GlassCard } from "@/components/cards/GlassCard";
import { TextField } from "@/components/forms/TextField";
import { InterestChipSelector } from "@/components/profile/InterestChipSelector";
import { MemberIdentitySelector } from "@/components/profile/MemberIdentitySelector";
import { NotificationPreferenceCard } from "@/components/profile/NotificationPreferenceCard";
import { SelectionChip } from "@/components/profile/SelectionChip";
import { onboardingSchema, OnboardingInput } from "@/data/schemas/onboarding";
import {
  buildOnboardingDefaults,
  getOrganizationOptions,
  graduationYearOptions,
  memberCompetitionOptions,
  memberGoalOptions,
  memberInterestOptions
} from "@/domain/services/memberProfile";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useCompleteOnboardingMutation, useGetOrganizationsQuery } from "@/store/services/fblaApi";
import { setUser } from "@/store/slices/sessionSlice";
import { palette, theme } from "@/theme";

type EditTab = "identity" | "interests" | "alerts";

export const EditProfileScreen = ({ route, navigation }: any) => {
  const user = useAppSelector((state) => state.session.user);
  const dispatch = useAppDispatch();
  const { data: organizations = [] } = useGetOrganizationsQuery();
  const [completeOnboarding, { isLoading }] = useCompleteOnboardingMutation();
  const [tab, setTab] = useState<EditTab>(route.params?.initialTab ?? "identity");

  const defaults = useMemo(() => buildOnboardingDefaults(user, organizations), [user, organizations]);
  const { control, handleSubmit, setValue, watch } = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    values: defaults
  });

  const values = watch();
  const { stateChapters, localChapters, subdivisions } = useMemo(
    () => getOrganizationOptions(organizations, values.stateChapterId),
    [organizations, values.stateChapterId]
  );

  if (!user) return null;

  const toggleArrayValue = (field: "goals" | "generalInterests" | "competitionInterests", value: string) => {
    const current = values[field] ?? [];
    setValue(
      field,
      current.includes(value) ? current.filter((item) => item !== value) : [...current, value]
    );
  };

  const onSubmit = handleSubmit(async (input) => {
    const nextUser = await completeOnboarding(input).unwrap();
    dispatch(setUser(nextUser));
    navigation.goBack();
  });

  return (
    <AppScreen title="Edit Profile" eyebrow="Member setup" subtitle="Update the identity and personalization data shaping your FBLA Central experience.">
      <SegmentedControl
        value={tab}
        onChange={setTab}
        compact
        options={[
          { value: "identity", label: "Identity" },
          { value: "interests", label: "Interests" },
          { value: "alerts", label: "Alerts" }
        ]}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {tab === "identity" ? (
          <GlassCard title="Member identity" subtitle="Keep your chapter, school, and graduation context accurate so recommendations stay relevant.">
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
            <MemberIdentitySelector label="State chapter" options={stateChapters} value={values.stateChapterId} onChange={(value) => setValue("stateChapterId", value)} />
            <MemberIdentitySelector label="Local chapter" options={localChapters} value={values.localChapterId} onChange={(value) => setValue("localChapterId", value)} />
            {subdivisions.length ? (
              <MemberIdentitySelector label="Subdivision" options={subdivisions} value={values.stateSubdivisionId} onChange={(value) => setValue("stateSubdivisionId", value)} />
            ) : null}
            <View style={styles.yearSection}>
              <Text style={styles.sectionLabel}>Graduation year</Text>
              <View style={styles.chipRow}>
                {graduationYearOptions.map((year) => (
                  <SelectionChip key={year} label={String(year)} active={values.graduationYear === year} onPress={() => setValue("graduationYear", year)} />
                ))}
              </View>
            </View>
          </GlassCard>
        ) : null}

        {tab === "interests" ? (
          <GlassCard title="Interests and goals" subtitle="Keep your goals and content preferences aligned with the season you are in right now.">
            <InterestChipSelector title="Goals" subtitle="What are you trying to get out of this year?" options={memberGoalOptions} values={values.goals} onToggle={(value) => toggleArrayValue("goals", value)} />
            <InterestChipSelector title="General interests" subtitle="Shape the app beyond competition prep." options={memberInterestOptions} values={values.generalInterests} onToggle={(value) => toggleArrayValue("generalInterests", value)} />
            <InterestChipSelector title="Competition interests" subtitle="Prioritize event-specific study and recommendations." options={memberCompetitionOptions} values={values.competitionInterests} onToggle={(value) => toggleArrayValue("competitionInterests", value)} />
          </GlassCard>
        ) : null}

        {tab === "alerts" ? (
          <GlassCard title="Notification profile" subtitle="Set the notifications that actually help you stay ready.">
            <NotificationPreferenceCard title="Enable notifications" subtitle="Turn off alerts entirely if you want a quieter experience." value={values.notificationPreferences.enabled} onValueChange={(value) => setValue("notificationPreferences.enabled", value)} />
            <NotificationPreferenceCard title="Saved events" subtitle="Deadlines, reminders, and event timing." value={values.notificationPreferences.categories.upcomingSavedEvents} onValueChange={(value) => setValue("notificationPreferences.categories.upcomingSavedEvents", value)} />
            <NotificationPreferenceCard title="Urgent announcements" subtitle="High-priority chapter, state, or national updates." value={values.notificationPreferences.categories.urgentAnnouncements} onValueChange={(value) => setValue("notificationPreferences.categories.urgentAnnouncements", value)} />
            <NotificationPreferenceCard title="Study reminders" subtitle="Practice nudges and prep-focused reminders." value={values.notificationPreferences.categories.studyReminders} onValueChange={(value) => setValue("notificationPreferences.categories.studyReminders", value)} />
            <View style={styles.yearSection}>
              <Text style={styles.sectionLabel}>Digest frequency</Text>
              <View style={styles.chipRow}>
                {(["instant", "daily", "weekly"] as const).map((option) => (
                  <SelectionChip key={option} label={option[0].toUpperCase() + option.slice(1)} active={values.notificationPreferences.digestFrequency === option} onPress={() => setValue("notificationPreferences.digestFrequency", option)} />
                ))}
              </View>
            </View>
          </GlassCard>
        ) : null}
      </ScrollView>

      <Pressable style={[styles.button, isLoading && styles.disabled]} onPress={onSubmit}>
        <Text style={styles.buttonText}>{isLoading ? "Saving..." : "Save changes"}</Text>
      </Pressable>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.md
  },
  yearSection: {
    gap: 8
  },
  sectionLabel: {
    ...theme.typography.label,
    color: palette.sky
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  button: {
    minHeight: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.gold
  },
  buttonText: {
    ...theme.typography.label,
    color: palette.ink
  },
  disabled: {
    opacity: 0.65
  }
});
