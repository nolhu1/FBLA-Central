import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { AppScreen } from "@/components/common/AppScreen";
import { GlassCard } from "@/components/cards/GlassCard";
import { TextField } from "@/components/forms/TextField";
import { EmptyState } from "@/components/feedback/EmptyState";
import { useSearchQuery } from "@/store/services/fblaApi";
import { palette, theme } from "@/theme";

export const SearchScreen = ({ navigation }: any) => {
  const [query, setQuery] = useState("");
  const { data = [] } = useSearchQuery(query, { skip: query.trim().length < 2 });

  return (
    <AppScreen
      title="Unified search"
      eyebrow="Events, resources, news, study, forums"
      subtitle="A strong cross-feature search layer makes the app feel much more advanced and helps members jump straight to what they need."
    >
      <TextField label="Search" value={query} onChangeText={setQuery} placeholder="Try: mobile, deadline, travel, leadership" />
      {query.trim().length < 2 ? (
        <EmptyState title="Start with a keyword" body="Unified search supports events, resources, news, study sets, and forum threads." />
      ) : (
        <View style={styles.column}>
          {data.map((result) => (
            <GlassCard
              key={`${result.type}-${result.id}`}
              title={result.title}
              subtitle={result.shortSummary}
              footer={<Text style={styles.meta}>{result.type.toUpperCase()} • {result.relevanceMetadata}</Text>}
              onPress={() => {
                if (result.routeTarget === "EventDetail") navigation.navigate("EventDetail", { eventId: result.id });
                if (result.routeTarget === "ThreadDetail") navigation.navigate("ThreadDetail", { threadId: result.id });
                if (result.routeTarget === "Resources") navigation.navigate("Resources");
                if (result.routeTarget === "News") navigation.navigate("News");
                if (result.routeTarget === "Study") navigation.navigate("Study");
              }}
            />
          ))}
        </View>
      )}
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
  }
});
