import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, spacing } from "../theme";
import type { Task } from "../types";
import { PrimaryButton } from "./PrimaryButton";

type TaskCardProps = {
  task: Task;
  onPress: (taskId: string) => void;
  onToggle: (taskId: string) => void;
};

export function TaskCard({ onPress, onToggle, task }: TaskCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(task.id)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <View style={[styles.statusDot, task.completed ? styles.statusDone : styles.statusOpen]} />
        <Text numberOfLines={1} style={[styles.title, task.completed && styles.titleDone]}>
          {task.title}
        </Text>
      </View>
      <Text numberOfLines={2} style={styles.description}>
        {task.description}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.meta}>{formatDate(task.createdAt)}</Text>
        <PrimaryButton
          label={task.completed ? "Reopen" : "Done"}
          onPress={() => onToggle(task.id)}
          style={styles.toggle}
          tone={task.completed ? "quiet" : "success"}
        />
      </View>
    </Pressable>
  );
}

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(date));

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.md,
    shadowColor: colors.shadow,
    shadowOffset: { height: 6, width: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 14
  },
  description: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  meta: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600"
  },
  pressed: {
    opacity: 0.82
  },
  statusDot: {
    borderRadius: 5,
    height: 10,
    width: 10
  },
  statusDone: {
    backgroundColor: colors.green
  },
  statusOpen: {
    backgroundColor: colors.blue
  },
  title: {
    color: colors.text,
    flex: 1,
    fontSize: 18,
    fontWeight: "800"
  },
  titleDone: {
    color: colors.textMuted,
    textDecorationLine: "line-through"
  },
  toggle: {
    minHeight: 36,
    paddingHorizontal: spacing.md
  },
  topRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm
  }
});
