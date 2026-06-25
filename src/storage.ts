import AsyncStorage from "@react-native-async-storage/async-storage";

import type { Task } from "./types";

const TASKS_KEY = "pritech.tasks.v1";

const isTask = (value: unknown): value is Task => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const task = value as Partial<Task>;

  return (
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    typeof task.description === "string" &&
    typeof task.completed === "boolean" &&
    typeof task.createdAt === "string"
  );
};

export const loadTasks = async (): Promise<Task[] | null> => {
  const raw = await AsyncStorage.getItem(TASKS_KEY);

  if (!raw) {
    return null;
  }

  const parsed: unknown = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    return null;
  }

  return parsed.filter(isTask);
};

export const saveTasks = async (tasks: Task[]) => {
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};
