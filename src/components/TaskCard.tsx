import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radius, shadows, spacing } from "../theme";
import type { Task } from "../types";

type TaskCardProps = {
  task: Task;
  onPress: (taskId: string) => void;
  onToggle: (taskId: string) => void;
};

export function TaskCard({ onPress, onToggle, task }: TaskCardProps) {
  const sourceLabel =
    task.source === "api" ? "Live API" : task.source === "sample" ? "Starter" : "Personal";

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(task.id)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <Pressable
          accessibilityLabel={task.completed ? "Mark task as open" : "Mark task as completed"}
          accessibilityRole="button"
          onPress={(event) => {
            event.stopPropagation();
            onToggle(task.id);
          }}
          style={[styles.check, task.completed ? styles.checkDone : styles.checkOpen]}
        >
          <View style={task.completed ? styles.checkDotDone : styles.checkDotOpen} />
        </Pressable>
        <View style={styles.titleBlock}>
          <Text numberOfLines={2} style={[styles.title, task.completed && styles.titleDone]}>
            {task.title}
          </Text>
          <Text style={styles.meta}>{formatDate(task.createdAt)} - {sourceLabel}</Text>
        </View>
      </View>

      <Text numberOfLines={2} style={styles.description}>
        {task.description}
      </Text>

      <View style={styles.footer}>
        <View style={[styles.statusPill, task.completed ? styles.statusDone : styles.statusOpen]}>
          <Text style={[styles.statusText, task.completed ? styles.statusTextDone : styles.statusTextOpen]}>
            {task.completed ? "Completed" : "In progress"}
          </Text>
        </View>
        <Text style={styles.detailCue}>Details</Text>
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
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
    ...shadows.card
  },
  check: {
    alignItems: "center",
    borderRadius: radius.pill,
    height: 42,
    justifyContent: "center",
    width: 42
  },
  checkDone: {
    backgroundColor: colors.green
  },
  checkDotDone: {
    backgroundColor: colors.surface,
    borderRadius: 6,
    height: 12,
    width: 12
  },
  checkDotOpen: {
    backgroundColor: colors.blue,
    borderRadius: 6,
    height: 12,
    width: 12
  },
  checkOpen: {
    backgroundColor: colors.blueMuted
  },
  description: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24
  },
  detailCue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "800"
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md
  },
  meta: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700",
    marginTop: spacing.xs
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.995 }]
  },
  statusDone: {
    backgroundColor: colors.greenMuted
  },
  statusOpen: {
    backgroundColor: colors.amberMuted
  },
  statusPill: {
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs
  },
  statusText: {
    fontSize: 13,
    fontWeight: "800"
  },
  statusTextDone: {
    color: "#248A3D"
  },
  statusTextOpen: {
    color: "#A45F00"
  },
  title: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 25
  },
  titleBlock: {
    flex: 1
  },
  titleDone: {
    color: colors.textMuted
  }
});
