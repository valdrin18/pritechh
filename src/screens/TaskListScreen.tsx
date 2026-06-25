import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import { PrimaryButton } from "../components/PrimaryButton";
import { SegmentedControl } from "../components/SegmentedControl";
import { TaskCard } from "../components/TaskCard";
import { colors, radius, spacing } from "../theme";
import type { DraftTask, Task, TaskIdea, TaskStatus } from "../types";

type TaskListScreenProps = {
  ideas: TaskIdea[];
  ideasError: string | null;
  ideasLoading: boolean;
  onAddPress: () => void;
  onIdeaPress: (draft: DraftTask) => void;
  onRefreshIdeas: () => void;
  onSelectTask: (taskId: string) => void;
  onToggleTask: (taskId: string) => void;
  tasks: Task[];
};

export function TaskListScreen({
  ideas,
  ideasError,
  ideasLoading,
  onAddPress,
  onIdeaPress,
  onRefreshIdeas,
  onSelectTask,
  onToggleTask,
  tasks
}: TaskListScreenProps) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<TaskStatus>("all");

  const filteredTasks = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesQuery = normalizedQuery
        ? task.title.toLowerCase().includes(normalizedQuery)
        : true;
      const matchesStatus =
        status === "all" ||
        (status === "active" && !task.completed) ||
        (status === "completed" && task.completed);

      return matchesQuery && matchesStatus;
    });
  }, [query, status, tasks]);

  const completedCount = tasks.filter((task) => task.completed).length;
  const activeCount = tasks.length - completedCount;

  return (
    <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>PRITECH</Text>
          <Text style={styles.title}>Personal Tasks</Text>
        </View>
        <PrimaryButton label="Add" onPress={onAddPress} />
      </View>

      <View style={styles.summaryGrid}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{tasks.length}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{activeCount}</Text>
          <Text style={styles.summaryLabel}>Open</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{completedCount}</Text>
          <Text style={styles.summaryLabel}>Done</Text>
        </View>
      </View>

      <View style={styles.controls}>
        <TextInput
          autoCapitalize="none"
          clearButtonMode="while-editing"
          onChangeText={setQuery}
          placeholder="Search by title"
          placeholderTextColor={colors.textMuted}
          style={styles.search}
          value={query}
        />
        <SegmentedControl onChange={setStatus} value={status} />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Public API Ideas</Text>
        <Pressable accessibilityRole="button" onPress={onRefreshIdeas}>
          <Text style={styles.refresh}>Refresh</Text>
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.ideas}>
          {ideasLoading ? (
            <View style={styles.ideaState}>
              <ActivityIndicator color={colors.blue} />
              <Text style={styles.ideaStateText}>Loading ideas from JSONPlaceholder</Text>
            </View>
          ) : null}

          {!ideasLoading && ideasError ? (
            <View style={styles.ideaState}>
              <Text style={styles.ideaStateText}>{ideasError}</Text>
            </View>
          ) : null}

          {!ideasLoading && !ideasError
            ? ideas.map((idea) => (
                <Pressable
                  accessibilityRole="button"
                  key={idea.id}
                  onPress={() =>
                    onIdeaPress({
                      title: idea.title,
                      description: idea.description,
                      source: "api"
                    })
                  }
                  style={({ pressed }) => [styles.idea, pressed && styles.ideaPressed]}
                >
                  <Text numberOfLines={1} style={styles.ideaTitle}>
                    {idea.title}
                  </Text>
                  <Text numberOfLines={2} style={styles.ideaDescription}>
                    {idea.description}
                  </Text>
                </Pressable>
              ))
            : null}
        </View>
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Tasks</Text>
        <Text style={styles.count}>{filteredTasks.length} shown</Text>
      </View>

      <View style={styles.taskList}>
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              onPress={onSelectTask}
              onToggle={onToggleTask}
              task={task}
            />
          ))
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No matching tasks</Text>
            <Text style={styles.emptyText}>
              Add a new task or adjust the search and status filter.
            </Text>
            <PrimaryButton label="Create task" onPress={onAddPress} style={styles.emptyButton} />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    padding: spacing.lg,
    paddingBottom: 44
  },
  controls: {
    gap: spacing.sm
  },
  count: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "700"
  },
  empty: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.xl
  },
  emptyButton: {
    marginTop: spacing.sm
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center"
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800"
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  idea: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    gap: spacing.xs,
    padding: spacing.md,
    width: 230
  },
  ideaDescription: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19
  },
  ideaPressed: {
    opacity: 0.75
  },
  ideas: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingRight: spacing.lg
  },
  ideaState: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.md
  },
  ideaStateText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "600"
  },
  ideaTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "800"
  },
  kicker: {
    color: colors.blue,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0
  },
  refresh: {
    color: colors.blue,
    fontSize: 15,
    fontWeight: "800"
  },
  search: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: spacing.md
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "800"
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    gap: 2,
    padding: spacing.md
  },
  summaryGrid: {
    flexDirection: "row",
    gap: spacing.sm
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "700"
  },
  summaryNumber: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900"
  },
  taskList: {
    gap: spacing.md
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "900"
  }
});
