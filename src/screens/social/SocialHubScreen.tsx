import { StyleSheet, Text, View } from "react-native";

import { AppScreen } from "@/components/common/AppScreen";
import { GlassCard } from "@/components/cards/GlassCard";
import { SectionHeader } from "@/components/common/SectionHeader";
import { useGetSocialHubQuery } from "@/store/services/fblaApi";
import { palette, theme } from "@/theme";

export const SocialHubScreen = () => {
  const { data } = useGetSocialHubQuery();

  return (
    <AppScreen
      title="Social Hub"
      eyebrow="Official chapter, state, and national channels"
      subtitle="Social integration is treated as a contextual communication layer with graceful outbound fallbacks instead of a fragile embedded-feed dependency."
    >
      <SectionHeader title="Channels" />
      <View style={styles.column}>
        {data?.channels.map((channel) => (
          <GlassCard key={channel.id} title={channel.displayName} subtitle={`${channel.platform} • ${channel.handle}`}>
            <Text style={styles.meta}>{channel.profileUrl}</Text>
          </GlassCard>
        ))}
      </View>

      <SectionHeader title="Official highlights" />
      <View style={styles.column}>
        {data?.highlights.map((highlight) => (
          <GlassCard key={highlight.id} title={highlight.title} subtitle={highlight.summary}>
            <Text style={styles.meta}>{highlight.externalPostUrl}</Text>
          </GlassCard>
        ))}
      </View>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  column: {
    gap: theme.spacing.md
  },
  meta: {
    ...theme.typography.label,
    color: palette.sky
  }
});
