import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

import { theme } from "../styles/theme";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "small" | "medium" | "large";
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  fullWidth?: boolean;
}

export function Button({
  title,
  variant = "primary",
  size = "medium",
  loading = false,
  icon,
  fullWidth = false,
  style,
  disabled,
  ...props
}: ButtonProps) {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: theme.borderRadius.medium,
      ...theme.shadows.small,
    };

    // Size
    switch (size) {
      case "small":
        baseStyle.paddingVertical = theme.spacing.sm;
        baseStyle.paddingHorizontal = theme.spacing.md;
        break;
      case "large":
        baseStyle.paddingVertical = theme.spacing.lg;
        baseStyle.paddingHorizontal = theme.spacing.xl;
        break;
      default:
        baseStyle.paddingVertical = theme.spacing.md;
        baseStyle.paddingHorizontal = theme.spacing.lg;
    }

    // Variant
    switch (variant) {
      case "primary":
        baseStyle.backgroundColor = disabled
          ? theme.colors.disabled
          : theme.colors.primary;
        break;
      case "secondary":
        baseStyle.backgroundColor = disabled
          ? theme.colors.disabled
          : theme.colors.secondary;
        break;
      case "danger":
        baseStyle.backgroundColor = disabled
          ? theme.colors.disabled
          : theme.colors.error;
        break;
      case "outline":
        baseStyle.backgroundColor = "transparent";
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = disabled
          ? theme.colors.disabled
          : theme.colors.primary;
        break;
    }

    if (fullWidth) {
      baseStyle.width = "100%";
    }

    return baseStyle;
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.surface;
    if (variant === "outline") return theme.colors.primary;
    return theme.colors.surface;
  };

  const getTextSize = () => {
    switch (size) {
      case "small":
        return 14;
      case "large":
        return 18;
      default:
        return 16;
    }
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getTextColor()}
          style={{ marginRight: icon || title ? theme.spacing.sm : 0 }}
        />
      ) : null}

      {icon && !loading ? (
        <Ionicons
          name={icon}
          size={getTextSize()}
          color={getTextColor()}
          style={{ marginRight: title ? theme.spacing.sm : 0 }}
        />
      ) : null}

      {title ? (
        <Text
          style={{
            color: getTextColor(),
            fontSize: getTextSize(),
            fontWeight: "600",
          }}
        >
          {title}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}
