import { PropsWithChildren, ReactNode } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { palette, theme } from "@/theme";

interface AppScreenProps extends PropsWithChildren {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  rightAction?: ReactNode;
  scroll?: boolean;
  includeTopSafeArea?: boolean;
  showBackButton?: boolean;
  hideDefaultHeader?: boolean;
}

export const AppScreen = ({
  title,
  eyebrow,
  subtitle,
  rightAction,
  children,
  scroll = true,
  includeTopSafeArea = true,
  showBackButton = true,
  hideDefaultHeader = false
}: AppScreenProps) => {
  const navigation = useNavigation<any>();
  const shouldShowBackButton = showBackButton && navigation.canGoBack();

  const content = (
    <View style={[styles.inner, !scroll ? styles.innerStatic : null]}>
      {shouldShowBackButton ? (
        <View style={styles.topControls}>
          <Pressable
            style={({ pressed }) => [styles.backButton, pressed ? styles.backButtonPressed : null]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={16} color={palette.cream} />
          </Pressable>
        </View>
      ) : null}
      {!hideDefaultHeader ? (
        <View style={styles.header}>
          <View style={styles.headerText}>
            {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
            <Text style={styles.title}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
          {rightAction ? <View style={styles.action}>{rightAction}</View> : null}
        </View>
      ) : null}
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
      <SafeAreaView
        style={styles.safeArea}
        edges={includeTopSafeArea ? ["top", "left", "right"] : ["left", "right"]}
      >
        {scroll ? (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {content}
          </ScrollView>
        ) : (
          <View style={styles.staticContent}>{content}</View>
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
    flexGrow: 1,
    paddingBottom: 96
  },
  staticContent: {
    flex: 1
  },
  inner: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    gap: theme.spacing.md
  },
  innerStatic: {
    flex: 1,
    paddingBottom: theme.spacing.sm
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: theme.spacing.md
  },
  topControls: {
    alignItems: "flex-start",
    marginBottom: -2
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: palette.border
  },
  backButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.96 }]
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
    marginTop: 4
  }
});
