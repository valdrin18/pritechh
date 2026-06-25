import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, shadows, spacing } from "../theme";
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
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.xs,
    padding: 5
  },
  label: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "800"
  },
  labelActive: {
    color: colors.text
  },
  option: {
    alignItems: "center",
    borderRadius: radius.pill,
    flex: 1,
    minHeight: 42,
    justifyContent: "center"
  },
  optionActive: {
    backgroundColor: colors.surface,
    ...shadows.soft
  }
});
