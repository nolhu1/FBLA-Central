import { StyleSheet, View } from "react-native";

import { StudyDashboard } from "@/domain/services/study";

import { StudyModeShortcut } from "./StudyModeShortcut";

interface PracticeTabPanelProps {
  dashboard: StudyDashboard;
  onNavigate: (name: string, params?: Record<string, string | undefined>) => void;
}

export const PracticeTabPanel = ({ dashboard, onNavigate }: PracticeTabPanelProps) => (
  <View style={styles.grid}>
    {dashboard.modes.map((item) => (
      <StudyModeShortcut
        key={item.id}
        label={item.label}
        caption={item.caption}
        icon={item.icon}
        onPress={() => onNavigate(item.route.name, item.route.params)}
      />
    ))}
  </View>
);

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  }
});
