import React from "react";
import { Text, View, ViewStyle } from "react-native";

import { theme } from "../styles/theme";

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  title?: string;
}

export function Card({ children, style, title }: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.card,
          borderRadius: theme.borderRadius.large,
          padding: theme.spacing.md,
          marginBottom: theme.spacing.md,
          ...theme.shadows.medium,
        },
        style,
      ]}
    >
      {title ? (
        <Text
          style={{
            ...theme.typography.h3,
            color: theme.colors.text,
            marginBottom: theme.spacing.md,
          }}
        >
          {title}
        </Text>
      ) : null}
      {children}
    </View>
  );
}
