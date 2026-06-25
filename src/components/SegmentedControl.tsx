import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "../theme";
import type { TaskStatus } from "../types";

const options: Array<{ label: string; value: TaskStatus }> = [
  { label: "All", value: "all" },
  { label: "Open", value: "active" },
  { label: "Done", value: "completed" }
];

type SegmentedControlProps = {
  value: TaskStatus;
  onChange: (value: TaskStatus) => void;
};

export function SegmentedControl({ value, onChange }: SegmentedControlProps) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const active = value === option.value;

        return (
          <Pressable
            accessibilityRole="button"
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[styles.option, active && styles.optionActive]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    flexDirection: "row",
    gap: spacing.xs,
    padding: 4
  },
  label: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "700"
  },
  labelActive: {
    color: colors.text
  },
  option: {
    alignItems: "center",
    borderRadius: radius.sm,
    flex: 1,
    minHeight: 36,
    justifyContent: "center"
  },
  optionActive: {
    backgroundColor: colors.surface
  }
});
