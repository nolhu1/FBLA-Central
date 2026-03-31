import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppScreen } from "@/components/common/AppScreen";
import { GlassCard } from "@/components/cards/GlassCard";
import { TextField } from "@/components/forms/TextField";
import { useAskAIMutation } from "@/store/services/fblaApi";
import { palette, theme } from "@/theme";

export const AIScreen = () => {
  const [prompt, setPrompt] = useState("Create a study plan for my mobile app deadline.");
  const [askAI, { data, isLoading }] = useAskAIMutation();

  return (
    <AppScreen
      title="FBLA AI"
      eyebrow="Grounded support layer"
      subtitle="AI should explain, summarize, guide, and recommend next steps while linking members back to official or in-app source material whenever possible."
    >
      <GlassCard title="Ask a question">
        <TextField
          label="Prompt"
          value={prompt}
          onChangeText={setPrompt}
          multiline
          placeholder="Ask for a summary, study plan, event explanation, or resource help."
        />
        <Pressable style={styles.button} onPress={() => askAI({ prompt })}>
          <Text style={styles.buttonText}>{isLoading ? "Thinking..." : "Ask FBLA AI"}</Text>
        </Pressable>
      </GlassCard>

      {data ? (
        <GlassCard title="Response" subtitle={data.answer}>
          <Text style={styles.meta}>Sources</Text>
          {data.sourceLinks.map((link) => (
            <Text key={`${link.type}-${link.id}`} style={styles.source}>
              {link.label}
            </Text>
          ))}
        </GlassCard>
      ) : null}
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: palette.gold,
    borderRadius: theme.radius.md,
    paddingVertical: 14,
    alignItems: "center"
  },
  buttonText: {
    ...theme.typography.label,
    color: palette.ink,
    fontSize: 14
  },
  meta: {
    ...theme.typography.label,
    color: palette.sky
  },
  source: {
    ...theme.typography.body,
    color: palette.cream
  }
});
