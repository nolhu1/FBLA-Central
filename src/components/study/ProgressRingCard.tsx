import { StyleSheet, Text, View } from "react-native";

import { palette, theme } from "@/theme";

interface ProgressRingCardProps {
  label: string;
  value: number;
  caption: string;
}

const SEGMENTS = 16;

export const ProgressRingCard = ({ label, value, caption }: ProgressRingCardProps) => {
  const activeSegments = Math.round((Math.max(0, Math.min(100, value)) / 100) * SEGMENTS);

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.ringWrap} accessibilityLabel={`${label} ${value} percent`}>
        {Array.from({ length: SEGMENTS }, (_, index) => {
          const angle = (Math.PI * 2 * index) / SEGMENTS - Math.PI / 2;
          const radius = 44;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const active = index < activeSegments;

          return (
            <View
              key={index}
              style={[
                styles.segment,
                {
                  left: 54 + x,
                  top: 54 + y,
                  backgroundColor: active ? palette.gold : "rgba(255,255,255,0.10)",
                  transform: [{ rotate: `${(angle * 180) / Math.PI + 90}deg` }]
                }
              ]}
            />
          );
        })}
        <View style={styles.center}>
          <Text style={styles.value}>{value}%</Text>
          <Text style={styles.centerLabel}>ready</Text>
        </View>
      </View>
      <Text style={styles.caption}>{caption}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 190,
    borderRadius: 24,
    padding: theme.spacing.md,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border,
    gap: 10
  },
  label: {
    ...theme.typography.label,
    color: palette.sky
  },
  ringWrap: {
    height: 120,
    alignItems: "center",
    justifyContent: "center"
  },
  segment: {
    position: "absolute",
    width: 8,
    height: 20,
    borderRadius: 999,
    marginLeft: -4,
    marginTop: -10
  },
  center: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(8,17,30,0.76)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)"
  },
  value: {
    ...theme.typography.display,
    fontSize: 24,
    color: palette.cream
  },
  centerLabel: {
    ...theme.typography.label,
    color: palette.mist
  },
  caption: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 19
  }
});
