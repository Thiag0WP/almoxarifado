import React from "react";
import { Text, TextInput, TextInputProps, View, ViewStyle } from "react-native";

import { theme } from "../styles/theme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  error,
  style,
  containerStyle,
  ...props
}: InputProps) {
  return (
    <View style={[{ marginBottom: theme.spacing.md }, containerStyle]}>
      {label ? (
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: theme.colors.text,
            marginBottom: theme.spacing.xs,
          }}
        >
          {label}
        </Text>
      ) : null}

      <TextInput
        style={[
          {
            borderWidth: 1,
            borderColor: error ? theme.colors.error : theme.colors.border,
            borderRadius: theme.borderRadius.medium,
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.md,
            fontSize: 16,
            backgroundColor: theme.colors.surface,
            color: theme.colors.text,
          },
          style,
        ]}
        placeholderTextColor={theme.colors.textSecondary}
        {...props}
      />

      {error ? (
        <Text
          style={{
            fontSize: 12,
            color: theme.colors.error,
            marginTop: theme.spacing.xs,
          }}
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
}
