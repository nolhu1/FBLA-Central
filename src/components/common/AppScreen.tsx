import { PropsWithChildren, ReactNode } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { palette, theme } from "@/theme";

interface AppScreenProps extends PropsWithChildren {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  rightAction?: ReactNode;
  scroll?: boolean;
}

export const AppScreen = ({
  title,
  eyebrow,
  subtitle,
  rightAction,
  children,
  scroll = true
}: AppScreenProps) => {
  const content = (
    <View style={styles.inner}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {rightAction ? <View style={styles.action}>{rightAction}</View> : null}
      </View>
      {children}
    </View>
  );

  return (
    <LinearGradient
      colors={["#07111d", "#0e223c", "#12355f"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        {scroll ? (
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {content}
          </ScrollView>
        ) : (
          content
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1
  },
  safeArea: {
    flex: 1
  },
  scrollContent: {
    paddingBottom: 80
  },
  inner: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.lg
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: theme.spacing.md
  },
  headerText: {
    flex: 1,
    gap: 4
  },
  eyebrow: {
    ...theme.typography.label,
    textTransform: "uppercase",
    color: palette.sky
  },
  title: {
    ...theme.typography.display,
    color: palette.cream
  },
  subtitle: {
    ...theme.typography.body,
    color: palette.mist,
    lineHeight: 22
  },
  action: {
    marginTop: 8
  }
});
