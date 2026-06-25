import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, SafeAreaView, StatusBar, StyleSheet } from "react-native";

import { fetchTaskIdeas } from "./src/api";
import { loadTasks, saveTasks } from "./src/storage";
import { colors } from "./src/theme";
import type { DraftTask, Screen, Task, TaskIdea } from "./src/types";
import { AddTaskScreen } from "./src/screens/AddTaskScreen";
import { TaskDetailScreen } from "./src/screens/TaskDetailScreen";
import { TaskListScreen } from "./src/screens/TaskListScreen";

const seedTasks: Task[] = [
  {
    id: "seed-brief",
    title: "Review PRITECH brief",
    description: "Confirm every required and bonus task is covered before submission.",
    completed: true,
    createdAt: new Date().toISOString(),
    source: "sample"
  },
  {
    id: "seed-polish",
    title: "Polish task flow",
    description: "Keep the interface calm, readable, and quick to use on a phone.",
    completed: false,
    createdAt: new Date().toISOString(),
    source: "sample"
  }
];

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(seedTasks);
  const [screen, setScreen] = useState<Screen>("list");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [ideas, setIdeas] = useState<TaskIdea[]>([]);
  const [ideasLoading, setIdeasLoading] = useState(true);
  const [ideasError, setIdeasError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [draftFromIdea, setDraftFromIdea] = useState<DraftTask | null>(null);

  useEffect(() => {
    let mounted = true;

    loadTasks()
      .then((storedTasks) => {
        if (!mounted) {
          return;
        }

        if (storedTasks) {
          setTasks(storedTasks);
        }
      })
      .catch(() => {
        Alert.alert("Storage unavailable", "The app could not load saved tasks on this device.");
      })
      .finally(() => {
        if (mounted) {
          setIsReady(true);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (isReady) {
      saveTasks(tasks).catch(() => {
        Alert.alert("Storage unavailable", "The app could not save the latest task changes.");
      });
    }
  }, [isReady, tasks]);

  const refreshIdeas = useCallback(() => {
    setIdeasLoading(true);
    setIdeasError(null);

    fetchTaskIdeas()
      .then(setIdeas)
      .catch(() => {
        setIdeasError("Could not load public task ideas. You can still create tasks manually.");
      })
      .finally(() => {
        setIdeasLoading(false);
      });
  }, []);

  useEffect(() => {
    refreshIdeas();
  }, [refreshIdeas]);

  const selectedTask = useMemo(
    () => tasks.find((task) => task.id === selectedTaskId) ?? null,
    [selectedTaskId, tasks]
  );

  const openDetails = (taskId: string) => {
    setSelectedTaskId(taskId);
    setScreen("detail");
  };

  const openAdd = (draft?: DraftTask) => {
    setDraftFromIdea(draft ?? null);
    setScreen("add");
  };

  const createTask = (draft: DraftTask) => {
    const task: Task = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: draft.title.trim(),
      description: draft.description.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      source: draft.source ?? "manual"
    };

    setTasks((current) => [task, ...current]);
    setDraftFromIdea(null);
    setSelectedTaskId(task.id);
    setScreen("detail");
  };

  const toggleTask = (taskId: string) => {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((current) => current.filter((task) => task.id !== taskId));
    setSelectedTaskId(null);
    setScreen("list");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      {screen === "list" ? (
        <TaskListScreen
          ideas={ideas}
          ideasError={ideasError}
          ideasLoading={ideasLoading}
          onAddPress={() => openAdd()}
          onIdeaPress={openAdd}
          onRefreshIdeas={refreshIdeas}
          onSelectTask={openDetails}
          onToggleTask={toggleTask}
          tasks={tasks}
        />
      ) : null}

      {screen === "add" ? (
        <AddTaskScreen
          initialDraft={draftFromIdea}
          onCancel={() => {
            setDraftFromIdea(null);
            setScreen("list");
          }}
          onCreateTask={createTask}
        />
      ) : null}

      {screen === "detail" && selectedTask ? (
        <TaskDetailScreen
          onBack={() => setScreen("list")}
          onDeleteTask={deleteTask}
          onToggleTask={toggleTask}
          task={selectedTask}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background
  }
});
