import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text } from "react-native";

import { palette, theme } from "@/theme";

interface OpenExternalActionSheetProps {
  visible: boolean;
  title: string;
  subtitle: string;
  onOpenInApp?: () => void;
  onOpenInBrowser: () => void;
  onShare: () => void;
  onClose: () => void;
}

export const OpenExternalActionSheet = ({
  visible,
  title,
  subtitle,
  onOpenInApp,
  onOpenInBrowser,
  onShare,
  onClose
}: OpenExternalActionSheetProps) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <Pressable style={styles.backdrop} onPress={onClose}>
      <Pressable style={styles.sheet} onPress={() => undefined}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {onOpenInApp ? (
          <Pressable style={styles.action} onPress={onOpenInApp}>
            <Ionicons name="phone-portrait-outline" size={18} color={palette.cream} />
            <Text style={styles.actionText}>Open in app</Text>
          </Pressable>
        ) : null}
        <Pressable style={styles.action} onPress={onOpenInBrowser}>
          <Ionicons name="open-outline" size={18} color={palette.cream} />
          <Text style={styles.actionText}>Open in browser</Text>
        </Pressable>
        <Pressable style={styles.action} onPress={onShare}>
          <Ionicons name="share-social-outline" size={18} color={palette.cream} />
          <Text style={styles.actionText}>Share link</Text>
        </Pressable>
      </Pressable>
    </Pressable>
  </Modal>
);

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
    padding: theme.spacing.lg
  },
  sheet: {
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    backgroundColor: palette.navy,
    borderWidth: 1,
    borderColor: palette.border,
    gap: 10
  },
  title: {
    ...theme.typography.title,
    color: palette.cream
  },
  subtitle: {
    ...theme.typography.body,
    color: palette.mist
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 46,
    borderRadius: theme.radius.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: "rgba(255,255,255,0.06)"
  },
  actionText: {
    ...theme.typography.body,
    color: palette.cream
  }
});
