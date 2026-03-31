import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppScreen } from "@/components/common/AppScreen";
import { GlassCard } from "@/components/cards/GlassCard";
import { TextField } from "@/components/forms/TextField";
import { APP_MODE_LABEL, DEMO_MODE } from "@/constants/config";
import { useSignInMutation } from "@/store/services/fblaApi";
import { setUser } from "@/store/slices/sessionSlice";
import { useAppDispatch } from "@/store/hooks";
import { palette, theme } from "@/theme";

export const SignInScreen = () => {
  const dispatch = useAppDispatch();
  const [signIn, { isLoading }] = useSignInMutation();
  const [email, setEmail] = useState("member@fblacentral.app");
  const [password, setPassword] = useState("fbla-central");
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (createIfNeeded = DEMO_MODE) => {
    setError(null);
    try {
      const user = await signIn({ email, password, createIfNeeded }).unwrap();
      dispatch(setUser(user));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <AppScreen
      title="Your member command center"
      eyebrow={`FBLA Central ${APP_MODE_LABEL}`}
      subtitle="Official-style updates, event planning, study support, community discussion, and grounded AI guidance in one connected mobile experience."
    >
      <GlassCard
        title="Choose your launch path"
        subtitle={
          DEMO_MODE
            ? "Demo mode ships with seeded content and local persistence only. Production mode uses Firebase authentication, Firestore, Cloud Functions, and push-ready service wiring."
            : "Production mode is enabled. Sign in with Firebase credentials or create an account to enter the full connected workflow."
        }
      >
        <TextField label="Email" value={email} onChangeText={setEmail} placeholder="member@example.com" />
        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.actions}>
          <Pressable onPress={() => handleSignIn(true)} style={[styles.primaryButton, isLoading && styles.disabled]}>
            <Text style={styles.primaryButtonText}>
              {DEMO_MODE ? "Enter demo workspace" : "Sign in or create account"}
            </Text>
          </Pressable>
          {!DEMO_MODE ? (
            <Pressable onPress={() => handleSignIn(false)} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Use existing production account</Text>
            </Pressable>
          ) : null}
        </View>
      </GlassCard>
    </AppScreen>
  );
};

const styles = StyleSheet.create({
  actions: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm
  },
  primaryButton: {
    backgroundColor: palette.gold,
    paddingVertical: 14,
    borderRadius: theme.radius.md,
    alignItems: "center"
  },
  disabled: {
    opacity: 0.7
  },
  primaryButtonText: {
    ...theme.typography.label,
    color: palette.ink,
    fontSize: 14
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: palette.border,
    paddingVertical: 14,
    borderRadius: theme.radius.md,
    alignItems: "center"
  },
  secondaryButtonText: {
    ...theme.typography.label,
    color: palette.cream
  },
  error: {
    ...theme.typography.label,
    color: palette.danger
  }
});
