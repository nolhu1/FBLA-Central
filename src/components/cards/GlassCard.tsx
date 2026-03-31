import { PropsWithChildren, ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { palette, theme } from "@/theme";

interface GlassCardProps extends PropsWithChildren {
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  onPress?: () => void;
}

export const GlassCard = ({ title, subtitle, footer, onPress, children }: GlassCardProps) => {
  const content = (
    <>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
      {footer ? <View style={styles.footer}>{footer}</View> : null}
    </>
  );

  if (onPress) {
    return (
      <Pressable style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]} onPress={onPress}>
        {content}
      </Pressable>
    );
  }

  return <View style={styles.card}>{content}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: palette.border,
    gap: theme.spacing.sm
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }]
  },
  title: {
    ...theme.typography.title,
    color: palette.cream
  },
  subtitle: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 20
  },
  footer: {
    marginTop: 4
  }
});
