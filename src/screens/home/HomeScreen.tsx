import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppScreen } from "@/components/common/AppScreen";
import { GlassCard } from "@/components/cards/GlassCard";
import { SectionHeader } from "@/components/common/SectionHeader";
import { useGetHomeBundleQuery } from "@/store/services/fblaApi";
import { formatDateTime } from "@/utils/time";
import { palette, theme } from "@/theme";

export const HomeScreen = ({ navigation }: any) => {
  const { data } = useGetHomeBundleQuery();

  return (
    <AppScreen
      title="Command Center"
      eyebrow="Personalized member home"
      subtitle="The app’s connected system in one glance: what matters now, what to study next, where to go, and which updates need your attention."
      rightAction={<Ionicons name="sparkles-outline" size={22} color={palette.gold} />}
    >
      {data?.nextUp ? (
        <GlassCard
          title="Next up"
          subtitle={data.nextUp.title}
          footer={<Text style={styles.meta}>{formatDateTime((data.nextUp as any).startTime ?? (data.nextUp as any).publishedAt)}</Text>}
          onPress={() =>
            "startTime" in data.nextUp
              ? navigation.navigate("EventDetail", { eventId: data.nextUp.id })
              : navigation.navigate("News")
          }
        >
          <Text style={styles.body}>
            {"description" in data.nextUp ? data.nextUp.description : data.nextUp.summary}
          </Text>
        </GlassCard>
      ) : null}

      <SectionHeader title="My priorities" caption="Rules-based recommendations anchored to your profile, saved items, weak topics, and urgent updates." />
      <View style={styles.column}>
        {data?.priorities.map((priority) => (
          <GlassCard key={priority}>
            <Text style={styles.priority}>{priority}</Text>
          </GlassCard>
        ))}
      </View>

      {data?.studyFocus ? (
        <>
          <SectionHeader title="Study focus" caption="Competition prep should follow naturally from events and saved official resources." />
          <GlassCard
            title={data.studyFocus.title}
            subtitle={data.studyFocus.description}
            footer={<Text style={styles.meta}>{data.studyFocus.estimatedTotalMinutes} minute sprint</Text>}
            onPress={() => navigation.navigate("Study")}
          />
        </>
      ) : null}

      <SectionHeader title="Explore" caption="Secondary systems stay one tap away from the command center." />
      <View style={styles.grid}>
        <Pressable style={styles.quickAction} onPress={() => navigation.navigate("Resources")}>
          <Ionicons name="document-text-outline" size={20} color={palette.gold} />
          <Text style={styles.quickActionText}>Resources</Text>
        </Pressable>
        <Pressable style={styles.quickAction} onPress={() => navigation.navigate("News")}>
          <Ionicons name="newspaper-outline" size={20} color={palette.gold} />
          <Text style={styles.quickActionText}>News</Text>
        </Pressable>
        <Pressable style={styles.quickAction} onPress={() => navigation.navigate("SocialHub")}>
          <Ionicons name="globe-outline" size={20} color={palette.gold} />
          <Text style={styles.quickActionText}>Social Hub</Text>
        </Pressable>
        <Pressable style={styles.quickAction} onPress={() => navigation.navigate("AI")}>
          <Ionicons name="sparkles-outline" size={20} color={palette.gold} />
          <Text style={styles.quickActionText}>Ask FBLA AI</Text>
        </Pressable>
      </View>

      <SectionHeader title="Momentum snapshot" caption="A quick pulse on saved content, study progress, and community participation." />
      <View style={styles.grid}>
        <GlassCard title={String(data?.momentumSnapshot.savedEvents ?? 0)} subtitle="Saved events" />
        <GlassCard title={`${data?.momentumSnapshot.studyProgress ?? 0}%`} subtitle="Study progress" />
        <GlassCard title={String(data?.momentumSnapshot.savedResources ?? 0)} subtitle="Saved resources" />
        <GlassCard title={String(data?.momentumSnapshot.discussionParticipation ?? 0)} subtitle="Discussion touches" />
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
    color: palette.gold
  },
  body: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 22
  },
  priority: {
    ...theme.typography.body,
    color: palette.cream,
    lineHeight: 22
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md
  },
  quickAction: {
    width: "47%",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 10
  },
  quickActionText: {
    ...theme.typography.label,
    color: palette.cream
  }
});
