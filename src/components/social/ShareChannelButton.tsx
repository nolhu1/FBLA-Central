import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";

import { palette } from "@/theme";

interface ShareChannelButtonProps {
  onPress: () => void;
}

export const ShareChannelButton = ({ onPress }: ShareChannelButtonProps) => (
  <Pressable accessibilityRole="button" accessibilityLabel="Share official channel" onPress={onPress} style={styles.button}>
    <Ionicons name="share-social-outline" size={18} color={palette.cream} />
  </Pressable>
);

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)"
  }
});
