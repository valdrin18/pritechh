import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

import { colors, radius, spacing } from "../theme";

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  tone?: "primary" | "quiet" | "danger" | "success";
  style?: ViewStyle;
};

export function PrimaryButton({ label, onPress, tone = "primary", style }: PrimaryButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        toneStyles[tone],
        pressed && styles.pressed,
        style
      ]}
    >
      <Text style={[styles.label, labelToneStyles[tone]]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: radius.md,
    justifyContent: "center",
    minHeight: 46,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm
  },
  label: {
    fontSize: 16,
    fontWeight: "700"
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.99 }]
  }
});

const toneStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.blue
  },
  quiet: {
    backgroundColor: colors.surfaceMuted
  },
  danger: {
    backgroundColor: colors.redMuted
  },
  success: {
    backgroundColor: colors.greenMuted
  }
});

const labelToneStyles = StyleSheet.create({
  primary: {
    color: colors.surface
  },
  quiet: {
    color: colors.text
  },
  danger: {
    color: colors.red
  },
  success: {
    color: colors.green
  }
});
