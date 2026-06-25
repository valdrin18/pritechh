import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "../components/PrimaryButton";
import { formatDate } from "../components/TaskCard";
import { colors, radius, spacing } from "../theme";
import type { Task } from "../types";

type TaskDetailScreenProps = {
  onBack: () => void;
  onDeleteTask: (taskId: string) => void;
  onToggleTask: (taskId: string) => void;
  task: Task;
};

export function TaskDetailScreen({
  onBack,
  onDeleteTask,
  onToggleTask,
  task
}: TaskDetailScreenProps) {
  const confirmDelete = () => {
    Alert.alert("Delete task?", "This action removes the task from local storage.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => onDeleteTask(task.id) }
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <PrimaryButton label="Back" onPress={onBack} tone="quiet" />
        <View style={[styles.badge, task.completed ? styles.badgeDone : styles.badgeOpen]}>
          <Text
            style={[
              styles.badgeText,
              task.completed ? styles.badgeDoneText : styles.badgeOpenText
            ]}
          >
            {task.completed ? "Completed" : "Open"}
          </Text>
        </View>
      </View>

      <View style={styles.hero}>
        <Text style={styles.kicker}>{task.source === "api" ? "PUBLIC API TASK" : "PERSONAL TASK"}</Text>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.date}>Created {formatDate(task.createdAt)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Description</Text>
        <Text style={styles.description}>{task.description}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Status</Text>
        <Text style={styles.statusCopy}>
          {task.completed
            ? "This task is currently marked as completed."
            : "This task is still open and ready for action."}
        </Text>
      </View>

      <View style={styles.actions}>
        <PrimaryButton
          label={task.completed ? "Mark as open" : "Mark as completed"}
          onPress={() => onToggleTask(task.id)}
          tone={task.completed ? "quiet" : "success"}
        />
        <PrimaryButton label="Delete task" onPress={confirmDelete} tone="danger" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: spacing.sm
  },
  badge: {
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  badgeDone: {
    backgroundColor: colors.greenMuted
  },
  badgeDoneText: {
    color: colors.green
  },
  badgeOpen: {
    backgroundColor: colors.blueMuted
  },
  badgeOpenText: {
    color: colors.blue
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "800"
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg
  },
  cardLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  content: {
    gap: spacing.lg,
    padding: spacing.lg,
    paddingBottom: 44
  },
  date: {
    color: colors.textMuted,
    fontSize: 15,
    fontWeight: "700"
  },
  description: {
    color: colors.text,
    fontSize: 18,
    lineHeight: 27
  },
  hero: {
    gap: spacing.sm
  },
  kicker: {
    color: colors.blue,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0
  },
  statusCopy: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 24
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "900"
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  }
});
