import { useEffect, useRef, useState } from "react";
import {
  Animated,
  AutoCapitalize,
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  TextInputAutoComplete,
  TextInputProps,
  View
} from "react-native";

import { motionTokens } from "@/motion/tokens";
import { useReducedMotion } from "@/motion/useReducedMotion";
import { palette, theme } from "@/theme";

interface TextFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  error?: string;
  editable?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: AutoCapitalize;
  autoComplete?: TextInputAutoComplete;
  textContentType?: TextInputProps["textContentType"];
}

export const TextField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  multiline,
  error,
  editable = true,
  keyboardType,
  autoCapitalize,
  autoComplete,
  textContentType
}: TextFieldProps) => {
  const reducedMotion = useReducedMotion();
  const [focused, setFocused] = useState(false);
  const focusAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reducedMotion) return;
    Animated.timing(focusAnim, {
      toValue: focused ? 1 : 0,
      duration: motionTokens.duration.fast,
      useNativeDriver: true
    }).start();
  }, [focusAnim, focused, reducedMotion]);

  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, focused ? styles.labelFocused : null]}>{label}</Text>
      <Animated.View
        style={[
          styles.inputShell,
          focused ? styles.inputShellFocused : null,
          !reducedMotion
            ? {
                transform: [
                  {
                    scale: focusAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.01]
                    })
                  }
                ]
              }
            : null
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={palette.slate}
          underlineColorAndroid="transparent"
          editable={editable}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          textContentType={textContentType}
          autoCorrect={false}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[
            styles.input,
            multiline ? styles.multilineInput : null,
            focused ? styles.inputFocused : null,
            error ? styles.inputError : null
          ]}
        />
      </Animated.View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: 8
  },
  label: {
    ...theme.typography.label,
    color: palette.mist
  },
  labelFocused: {
    color: palette.sky
  },
  inputShell: {
    borderRadius: theme.radius.md
  },
  inputShellFocused: {
    shadowColor: "#75B8FF",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2
  },
  input: {
    minHeight: 44,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: palette.border,
    backgroundColor: "rgba(255,255,255,0.05)",
    paddingHorizontal: 14,
    paddingVertical: 11,
    margin: 0,
    color: palette.cream,
    fontSize: 15,
    lineHeight: 20,
    includeFontPadding: false
  },
  inputFocused: {
    borderColor: "rgba(117,184,255,0.46)",
    backgroundColor: "rgba(255,255,255,0.06)"
  },
  multilineInput: {
    minHeight: 112,
    textAlignVertical: "top"
  },
  inputError: {
    borderColor: palette.danger
  },
  error: {
    ...theme.typography.label,
    color: palette.danger
  }
});
