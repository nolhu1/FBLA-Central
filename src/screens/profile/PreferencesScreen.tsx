import { StyleSheet, Text, View } from "react-native";

import { AppScreen } from "@/components/common/AppScreen";
import { GlassCard } from "@/components/cards/GlassCard";
import { SelectionChip } from "@/components/profile/SelectionChip";
import { useAppSelector } from "@/store/hooks";
import { palette, theme } from "@/theme";

export const PreferencesScreen = () => {
  const user = useAppSelector((state) => state.session.user);

  if (!user) return null;

  const notificationRows = [
    { label: "Saved events", value: user.notificationPreferences.categories.upcomingSavedEvents },
    { label: "Urgent announcements", value: user.notificationPreferences.categories.urgentAnnouncements },
    { label: "Study reminders", value: user.notificationPreferences.categories.studyReminders },
    { label: "Followed discussions", value: user.notificationPreferences.categories.followedThreadReplies },
    { label: "Recommended opportunities", value: user.notificationPreferences.categories.recommendedOpportunities },
    { label: "Resource updates", value: user.notificationPreferences.categories.resourceUpdates }
  ];

  return (
    <AppScreen title="Preferences" eyebrow="Member settings" subtitle="Review the choices shaping notifications, privacy, and accessibility across your member experience.">
      <GlassCard title="Notification profile" subtitle="These settings determine how FBLA Central keeps you informed and prepared.">
        <View style={styles.preferenceList}>
          {notificationRows.map((row) => (
            <View key={row.label} style={styles.preferenceRow}>
              <Text style={styles.rowLabel}>{row.label}</Text>
              <SelectionChip label={row.value ? "On" : "Off"} active={row.value} onPress={() => {}} />
            </View>
          ))}
        </View>
        <Text style={styles.meta}>Quiet hours: {user.notificationPreferences.quietHours.start} to {user.notificationPreferences.quietHours.end}</Text>
        <Text style={styles.meta}>Digest: {user.notificationPreferences.digestFrequency}</Text>
      </GlassCard>

      <GlassCard title="Privacy" subtitle="These settings control how your member identity appears inside the app.">
        <View style={styles.preferenceList}>
          <View style={styles.preferenceRow}>
            <Text style={styles.rowLabel}>Show school name</Text>
            <SelectionChip label={user.privacyPreferences.showSchoolName ? "Visible" : "Hidden"} active={user.privacyPreferences.showSchoolName} onPress={() => {}} />
          </View>
          <View style={styles.preferenceRow}>
            <Text style={styles.rowLabel}>Show graduation year</Text>
            <SelectionChip label={user.privacyPreferences.showGraduationYear ? "Visible" : "Hidden"} active={user.privacyPreferences.showGraduationYear} onPress={() => {}} />
          </View>
          <View style={styles.preferenceRow}>
            <Text style={styles.rowLabel}>Show chapter</Text>
            <SelectionChip label={user.privacyPreferences.showChapter ? "Visible" : "Hidden"} active={user.privacyPreferences.showChapter} onPress={() => {}} />
          </View>
        </View>
      </GlassCard>

      <GlassCard title="Accessibility" subtitle="Current device-support preferences that shape readability and motion.">
        <View style={styles.preferenceList}>
          <View style={styles.preferenceRow}>
            <Text style={styles.rowLabel}>Large text</Text>
            <SelectionChip label={user.accessibilityPreferences.largeText ? "On" : "Off"} active={user.accessibilityPreferences.largeText} onPress={() => {}} />
          </View>
          <View style={styles.preferenceRow}>
            <Text style={styles.rowLabel}>High contrast</Text>
            <SelectionChip label={user.accessibilityPreferences.highContrast ? "On" : "Off"} active={user.accessibilityPreferences.highContrast} onPress={() => {}} />
          </View>
          <View style={styles.preferenceRow}>
            <Text style={styles.rowLabel}>Reduced motion</Text>
            <SelectionChip label={user.accessibilityPreferences.reducedMotion ? "On" : "Off"} active={user.accessibilityPreferences.reducedMotion} onPress={() => {}} />
          </View>
          <View style={styles.preferenceRow}>
            <Text style={styles.rowLabel}>Screen reader optimized</Text>
            <SelectionChip label={user.accessibilityPreferences.screenReaderOptimized ? "On" : "Off"} active={user.accessibilityPreferences.screenReaderOptimized} onPress={() => {}} />
          </View>
        </View>
      </GlassCard>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  preferenceList: {
    gap: 8
  },
  preferenceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  rowLabel: {
    ...theme.typography.body,
    color: palette.cream,
    flex: 1
  },
  meta: {
    ...theme.typography.label,
    color: palette.sky
  }
});
