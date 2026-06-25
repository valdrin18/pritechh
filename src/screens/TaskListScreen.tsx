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
import { colors, radius, shadows, spacing } from "../theme";
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
  const completionRate = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
  const nextTask = tasks.find((task) => !task.completed) ?? tasks[0] ?? null;
  const todayLabel = new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "long"
  }).format(new Date());

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroPanel}>
        <View style={styles.heroTop}>
          <View style={styles.heroCopy}>
            <Text style={styles.kicker}>PRITECH TASKS</Text>
            <Text style={styles.title}>Today</Text>
            <Text style={styles.subtitle}>{todayLabel}</Text>
          </View>
          <Pressable
            accessibilityLabel="Add task"
            accessibilityRole="button"
            onPress={onAddPress}
            style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
          >
            <Text style={styles.addButtonText}>+</Text>
          </Pressable>
        </View>

        <View style={styles.focusRow}>
          <View style={styles.progressCard}>
            <Text style={styles.progressNumber}>{completionRate}%</Text>
            <Text style={styles.progressLabel}>Complete</Text>
          </View>
          <View style={styles.nextCard}>
            <Text style={styles.nextLabel}>Next up</Text>
            <Text numberOfLines={2} style={styles.nextTitle}>
              {nextTask ? nextTask.title : "Create your first task"}
            </Text>
            <Text style={styles.nextMeta}>
              {activeCount > 0 ? `${activeCount} open` : "Nothing open"}
            </Text>
          </View>
        </View>

        <View style={styles.summaryGrid}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{tasks.length}</Text>
            <Text style={styles.summaryLabel}>Total</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{activeCount}</Text>
            <Text style={styles.summaryLabel}>Open</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{completedCount}</Text>
            <Text style={styles.summaryLabel}>Done</Text>
          </View>
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
        <View>
          <Text style={styles.sectionTitle}>Suggestions</Text>
          <Text style={styles.sectionSubtitle}>Fresh prompts for momentum</Text>
        </View>
        <Pressable accessibilityRole="button" onPress={onRefreshIdeas} style={styles.refreshButton}>
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
                  <View style={styles.ideaTopLine}>
                    <Text style={styles.ideaBadge}>API</Text>
                    <Text style={styles.ideaAction}>Use</Text>
                  </View>
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
        <View>
          <Text style={styles.sectionTitle}>Task Stack</Text>
          <Text style={styles.sectionSubtitle}>The work ahead, calmly arranged</Text>
        </View>
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
  addButton: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: radius.pill,
    height: 58,
    justifyContent: "center",
    width: 58,
    ...shadows.card
  },
  addButtonText: {
    color: colors.surface,
    fontSize: 34,
    fontWeight: "500",
    lineHeight: 38
  },
  content: {
    gap: spacing.xl,
    padding: spacing.lg,
    paddingBottom: 48
  },
  controls: {
    gap: spacing.md
  },
  count: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "800"
  },
  empty: {
    alignItems: "center",
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.md,
    padding: spacing.xxl,
    ...shadows.card
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
    fontSize: 22,
    fontWeight: "900"
  },
  focusRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md
  },
  heroCopy: {
    flex: 1
  },
  heroPanel: {
    backgroundColor: colors.backgroundSoft,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.xl,
    overflow: "hidden",
    padding: spacing.lg,
    ...shadows.card
  },
  heroTop: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  idea: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.sm,
    padding: spacing.lg,
    width: 258,
    ...shadows.soft
  },
  ideaAction: {
    color: colors.blue,
    fontSize: 13,
    fontWeight: "900"
  },
  ideaBadge: {
    backgroundColor: colors.violetMuted,
    borderRadius: radius.pill,
    color: colors.violet,
    fontSize: 12,
    fontWeight: "900",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    overflow: "hidden"
  },
  ideaDescription: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 21
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
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flexDirection: "row",
    gap: spacing.sm,
    padding: spacing.lg
  },
  ideaStateText: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "600"
  },
  ideaTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "900",
    lineHeight: 22
  },
  ideaTopLine: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  kicker: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0
  },
  nextCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    flex: 1,
    minHeight: 138,
    padding: spacing.lg
  },
  nextLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "900"
  },
  nextMeta: {
    color: colors.violet,
    fontSize: 13,
    fontWeight: "900",
    marginTop: spacing.sm
  },
  nextTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: "900",
    lineHeight: 25,
    marginTop: spacing.xs
  },
  pressed: {
    opacity: 0.78,
    transform: [{ scale: 0.98 }]
  },
  progressCard: {
    alignItems: "center",
    backgroundColor: colors.text,
    borderRadius: radius.lg,
    height: 138,
    justifyContent: "center",
    width: 118
  },
  progressLabel: {
    color: "#D9D4CA",
    fontSize: 12,
    fontWeight: "800",
    marginTop: spacing.xs
  },
  progressNumber: {
    color: colors.surface,
    fontSize: 32,
    fontWeight: "900"
  },
  refresh: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "900"
  },
  refreshButton: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  search: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderRadius: radius.pill,
    borderWidth: 1,
    color: colors.text,
    fontSize: 17,
    minHeight: 56,
    paddingHorizontal: spacing.lg,
    ...shadows.soft
  },
  sectionHeader: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  sectionSubtitle: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 3
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "900"
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 18,
    fontWeight: "700",
    marginTop: spacing.xs
  },
  summaryDivider: {
    alignSelf: "stretch",
    backgroundColor: colors.border,
    width: 1
  },
  summaryGrid: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.lg,
    flexDirection: "row",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.md
  },
  summaryItem: {
    alignItems: "center",
    flex: 1,
    gap: 2
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "800"
  },
  summaryNumber: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "900"
  },
  taskList: {
    gap: spacing.lg
  },
  title: {
    color: colors.text,
    fontSize: 48,
    fontWeight: "900",
    lineHeight: 54
  }
});
