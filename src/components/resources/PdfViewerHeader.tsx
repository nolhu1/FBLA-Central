import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { palette, theme } from "@/theme";

export const PdfViewerHeader = ({
  title,
  onShare,
  onOpenExternal
}: {
  title: string;
  onShare: () => void;
  onOpenExternal: () => void;
}) => (
  <View style={styles.header}>
    <View style={styles.copy}>
      <Text style={styles.eyebrow}>PDF viewer</Text>
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
    </View>
    <View style={styles.actions}>
      <Pressable style={styles.iconButton} onPress={onShare}>
        <Ionicons name="share-social-outline" size={17} color={palette.cream} />
      </Pressable>
      <Pressable style={styles.iconButton} onPress={onOpenExternal}>
        <Ionicons name="open-outline" size={17} color={palette.cream} />
      </Pressable>
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10
  },
  copy: {
    flex: 1,
    gap: 4
  },
  eyebrow: {
    ...theme.typography.label,
    color: palette.sky,
    textTransform: "uppercase"
  },
  title: {
    ...theme.typography.title,
    color: palette.cream
  },
  actions: {
    flexDirection: "row",
    gap: 8
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: palette.border
  }
});
