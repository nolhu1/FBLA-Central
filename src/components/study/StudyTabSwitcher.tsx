import { StyleSheet, View } from "react-native";

import { SegmentedControl } from "@/components/common/SegmentedControl";

export type StudyTabKey = "overview" | "practice" | "progress" | "review";

interface StudyTabSwitcherProps {
  value: StudyTabKey;
  onChange: (value: StudyTabKey) => void;
}

export const StudyTabSwitcher = ({ value, onChange }: StudyTabSwitcherProps) => (
  <View style={styles.wrapper}>
    <SegmentedControl
      value={value}
      onChange={onChange}
      compact
      options={[
        { value: "overview", label: "Overview" },
        { value: "practice", label: "Practice" },
        { value: "progress", label: "Progress" },
        { value: "review", label: "Review" }
      ]}
    />
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "flex-start"
  }
});
