import { StyleSheet, View } from "react-native";

import { SegmentedControl } from "@/components/common/SegmentedControl";
import { NewsScopeFilter } from "@/domain/services/news";

interface NewsScopeSwitcherProps {
  value: NewsScopeFilter;
  onChange: (value: NewsScopeFilter) => void;
}

export const NewsScopeSwitcher = ({ value, onChange }: NewsScopeSwitcherProps) => (
  <View style={styles.wrapper}>
    <SegmentedControl
      value={value}
      onChange={onChange}
      compact
      options={[
        { value: "chapter", label: "Chapter" },
        { value: "state", label: "State" },
        { value: "national", label: "National" }
      ]}
    />
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 2,
    alignItems: "flex-start"
  }
});
