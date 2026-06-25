export type TaskStatus = "all" | "active" | "completed";

export type Screen = "list" | "add" | "detail";

export type TaskSource = "manual" | "api" | "sample";

export type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  source: TaskSource;
};

export type DraftTask = {
  title: string;
  description: string;
  source?: TaskSource;
};

export type TaskIdea = {
  id: string;
  title: string;
  description: string;
};
