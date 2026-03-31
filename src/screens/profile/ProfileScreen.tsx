import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppScreen } from "@/components/common/AppScreen";
import { GlassCard } from "@/components/cards/GlassCard";
import { APP_MODE_LABEL, DEMO_MODE } from "@/constants/config";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser } from "@/store/slices/sessionSlice";
import { getRepository } from "@/data/repositories";
import { palette, theme } from "@/theme";

export const ProfileScreen = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.session.user);

  if (!user) return null;

  return (
    <AppScreen
      title={user.displayName || `${user.firstName} ${user.lastName}`}
      eyebrow={`${APP_MODE_LABEL} member profile`}
      subtitle="Profiles should be private by default and should drive personalization across announcements, events, study tracks, resources, and community surfacing."
    >
      <GlassCard title="Organization">
        <Text style={styles.body}>{user.schoolName}</Text>
        <Text style={styles.meta}>{user.email}</Text>
      </GlassCard>

      <GlassCard title="Goals" subtitle={user.goals.join(" • ")} />
      <GlassCard title="General interests" subtitle={user.generalInterests.join(" • ")} />
      <GlassCard title="Competition interests" subtitle={user.competitionInterests.join(" • ")} />

      <GlassCard title="Preferences">
        <Text style={styles.body}>Notifications: {user.notificationPreferences.enabled ? "On" : "Off"}</Text>
        <Text style={styles.body}>Quiet hours: {user.notificationPreferences.quietHours.start} to {user.notificationPreferences.quietHours.end}</Text>
        <Text style={styles.body}>Privacy: chapter visible {user.privacyPreferences.showChapter ? "Yes" : "No"}</Text>
        <Text style={styles.body}>Reduced motion: {user.accessibilityPreferences.reducedMotion ? "On" : "Off"}</Text>
      </GlassCard>

      <Pressable
        style={styles.signOut}
        onPress={async () => {
          await getRepository().signOut();
          dispatch(setUser(null));
        }}
      >
        <Text style={styles.signOutText}>{DEMO_MODE ? "Leave demo workspace" : "Sign out"}</Text>
      </Pressable>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  body: {
    ...theme.typography.body,
    color: palette.cream,
    lineHeight: 22
  },
  meta: {
    ...theme.typography.label,
    color: palette.sky
  },
  signOut: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: theme.radius.md,
    paddingVertical: 14,
    alignItems: "center"
  },
  signOutText: {
    ...theme.typography.label,
    color: palette.cream
  }
});
