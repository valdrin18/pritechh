import type { TaskIdea } from "./types";

type JsonPlaceholderTodo = {
  id: number;
  title: string;
  userId: number;
};

const API_URL = "https://jsonplaceholder.typicode.com/todos?_limit=4";

export const fetchTaskIdeas = async (): Promise<TaskIdea[]> => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Unable to fetch task ideas");
  }

  const todos = (await response.json()) as JsonPlaceholderTodo[];

  return todos.map((todo) => ({
    id: `api-${todo.id}`,
    title: sentenceCase(todo.title),
    description: `Public API suggestion from JSONPlaceholder, assigned to demo user ${todo.userId}.`
  }));
};

const sentenceCase = (value: string) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return "Untitled idea";
  }

  return `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}`;
};
