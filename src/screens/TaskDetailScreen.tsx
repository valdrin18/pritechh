import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "../components/PrimaryButton";
import { formatDate } from "../components/TaskCard";
import { colors, radius, shadows, spacing } from "../theme";
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
  const sourceLabel =
    task.source === "api" ? "Live API" : task.source === "sample" ? "Starter" : "Personal";

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

      <View style={styles.heroPanel}>
        <Text style={styles.kicker}>{task.source === "api" ? "PUBLIC API TASK" : "PERSONAL TASK"}</Text>
        <Text style={styles.title}>{task.title}</Text>
        <View style={styles.metaGrid}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Created</Text>
            <Text style={styles.metaValue}>{formatDate(task.createdAt)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Source</Text>
            <Text style={styles.metaValue}>{sourceLabel}</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Description</Text>
        <Text style={styles.description}>{task.description}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Status</Text>
        <View style={styles.statusRow}>
          <View style={[styles.statusMark, task.completed ? styles.statusMarkDone : styles.statusMarkOpen]} />
          <Text style={styles.statusCopy}>
            {task.completed
              ? "Completed and safely stored on this device."
              : "Open and ready for the next action."}
          </Text>
        </View>
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
    gap: spacing.md
  },
  badge: {
    borderRadius: radius.pill,
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
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.lg,
    ...shadows.card
  },
  cardLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase"
  },
  content: {
    gap: spacing.xl,
    padding: spacing.lg,
    paddingBottom: 44
  },
  description: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 30
  },
  heroPanel: {
    backgroundColor: colors.backgroundSoft,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.lg,
    padding: spacing.lg,
    ...shadows.card
  },
  kicker: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0
  },
  metaGrid: {
    flexDirection: "row",
    gap: spacing.sm
  },
  metaItem: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    gap: spacing.xs,
    padding: spacing.md
  },
  metaLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "900"
  },
  metaValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "900"
  },
  statusCopy: {
    color: colors.textMuted,
    flex: 1,
    fontSize: 17,
    fontWeight: "700",
    lineHeight: 25
  },
  statusMark: {
    borderRadius: radius.pill,
    height: 38,
    width: 38
  },
  statusMarkDone: {
    backgroundColor: colors.green
  },
  statusMarkOpen: {
    backgroundColor: colors.amber
  },
  statusRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md
  },
  title: {
    color: colors.text,
    fontSize: 42,
    fontWeight: "900",
    lineHeight: 47
  },
  topBar: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  }
});
