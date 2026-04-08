import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { palette, theme } from "@/theme";

export const AiComposer = ({
  value,
  onChangeText,
  onSend,
  disabled
}: {
  value: string;
  onChangeText: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}) => (
  <View style={styles.shell}>
    <View style={styles.composer}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Ask about an event, resource, study plan, or next step"
        placeholderTextColor={palette.slate}
        underlineColorAndroid="transparent"
        multiline
        maxLength={600}
        style={styles.input}
      />
      <Pressable style={[styles.sendButton, disabled ? styles.disabled : null]} disabled={disabled} onPress={onSend}>
        <Ionicons name="arrow-up-outline" size={18} color={disabled ? palette.slate : palette.ink} />
      </Pressable>
    </View>
  </View>
);

const styles = StyleSheet.create({
  shell: {
    paddingTop: 6
  },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    borderRadius: 22,
    paddingLeft: 12,
    paddingRight: 8,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: palette.border
  },
  input: {
    flex: 1,
    maxHeight: 92,
    minHeight: 22,
    backgroundColor: "transparent",
    color: palette.cream,
    paddingTop: 2,
    paddingBottom: 2,
    textAlignVertical: "top",
    ...theme.typography.body
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.gold
  },
  disabled: {
    backgroundColor: "rgba(255,255,255,0.08)"
  }
});
