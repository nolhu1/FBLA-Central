import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { palette } from "@/theme";

interface ResourceSearchBarProps {
  value: string;
  onChangeText: (value: string) => void;
  onClear: () => void;
}

export const ResourceSearchBar = ({ value, onChangeText, onClear }: ResourceSearchBarProps) => (
  <View style={styles.wrapper}>
    <Ionicons name="search-outline" size={18} color={palette.sky} />
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder="Search guides, templates, travel, rubrics"
      placeholderTextColor={palette.slate}
      underlineColorAndroid="transparent"
      style={styles.input}
    />
    {value ? (
      <Pressable onPress={onClear}>
        <Ionicons name="close-circle" size={18} color={palette.slate} />
      </Pressable>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border
  },
  input: {
    flex: 1,
    color: palette.cream,
    backgroundColor: "transparent",
    paddingVertical: 0
  }
});
