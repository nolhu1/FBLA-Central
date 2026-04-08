import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { AppScreen } from "@/components/common/AppScreen";
import { GlassCard } from "@/components/cards/GlassCard";
import { TextField } from "@/components/forms/TextField";
import { DEMO_MODE } from "@/constants/config";
import { useSignInMutation } from "@/store/services/fblaApi";
import { setUser } from "@/store/slices/sessionSlice";
import { useAppDispatch } from "@/store/hooks";
import { palette, theme } from "@/theme";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const SignInScreen = () => {
  const dispatch = useAppDispatch();
  const [signIn, { isLoading }] = useSignInMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const normalizedEmail = email.trim();
  const emailError =
    !normalizedEmail && attemptedSubmit
      ? "Enter your email address."
      : normalizedEmail && !EMAIL_PATTERN.test(normalizedEmail)
        ? "Enter a valid email address."
        : null;

  const handleSignIn = async (createIfNeeded = DEMO_MODE) => {
    setAttemptedSubmit(true);
    setError(null);
    if (emailError) return;

    try {
      const user = await signIn({ email: normalizedEmail, password, createIfNeeded }).unwrap();
      dispatch(setUser(user));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <AppScreen
      title="Sign in"
      eyebrow="FBLA Central"
      subtitle="Use your email and password to continue."
    >
      <GlassCard title="Welcome back" subtitle="Enter your credentials to access your account.">
        <TextField
          label="Email"
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            if (error) setError(null);
          }}
          placeholder="member@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          error={emailError ?? undefined}
        />
        <TextField
          label="Password"
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            if (error) setError(null);
          }}
          placeholder="Enter your password"
          secureTextEntry
          autoCapitalize="none"
          autoComplete="password"
          textContentType="password"
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.actions}>
          <Pressable
            disabled={Boolean(emailError) || isLoading}
            onPress={() => void handleSignIn()}
            style={[styles.primaryButton, (Boolean(emailError) || isLoading) && styles.disabled]}
          >
            <Text style={styles.primaryButtonText}>{isLoading ? "Signing in..." : "Sign in"}</Text>
          </Pressable>
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
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: theme.radius.md,
    alignItems: "center",
    justifyContent: "center"
  },
  disabled: {
    opacity: 0.7
  },
  primaryButtonText: {
    ...theme.typography.label,
    color: palette.ink,
    fontSize: 14
  },
  error: {
    ...theme.typography.label,
    color: palette.danger
  }
});
