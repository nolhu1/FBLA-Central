import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { palette } from "@/theme";

export const CommunitySearchBar = ({
  value,
  onChangeText,
  onClear
}: {
  value: string;
  onChangeText: (value: string) => void;
  onClear: () => void;
}) => (
  <View style={styles.wrapper}>
    <Ionicons name="search-outline" size={18} color={palette.sky} />
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder="Search questions, threads, travel, study help"
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
    gap: 8,
    borderRadius: 16,
    minHeight: 46,
    paddingHorizontal: 14,
    paddingVertical: 10,
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
