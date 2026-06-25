import { useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";

import { Field } from "../components/Field";
import { PrimaryButton } from "../components/PrimaryButton";
import { colors, spacing } from "../theme";
import type { DraftTask } from "../types";

type AddTaskScreenProps = {
  initialDraft: DraftTask | null;
  onCancel: () => void;
  onCreateTask: (draft: DraftTask) => void;
};

type Errors = {
  title?: string;
  description?: string;
};

export function AddTaskScreen({ initialDraft, onCancel, onCreateTask }: AddTaskScreenProps) {
  const [title, setTitle] = useState(initialDraft?.title ?? "");
  const [description, setDescription] = useState(initialDraft?.description ?? "");
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo(() => validate(title, description), [description, title]);
  const showErrors = submitted;

  const handleSubmit = () => {
    setSubmitted(true);

    const currentErrors = validate(title, description);

    if (currentErrors.title || currentErrors.description) {
      return;
    }

    onCreateTask({
      title,
      description,
      source: initialDraft?.source ?? "manual"
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.keyboard}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.kicker}>{initialDraft?.source === "api" ? "API IDEA" : "NEW TASK"}</Text>
          <Text style={styles.title}>Create Task</Text>
          <Text style={styles.subtitle}>
            Keep it short, specific, and easy to finish later.
          </Text>
        </View>

        <View style={styles.form}>
          <Field
            autoFocus
            error={showErrors ? errors.title : undefined}
            label="Title"
            onChangeText={setTitle}
            placeholder="Example: Send project update"
            returnKeyType="next"
            value={title}
          />
          <Field
            error={showErrors ? errors.description : undefined}
            label="Description"
            multiline
            onChangeText={setDescription}
            placeholder="Add enough context so the next action is clear."
            value={description}
          />
        </View>

        <View style={styles.actions}>
          <PrimaryButton label="Create task" onPress={handleSubmit} />
          <PrimaryButton label="Cancel" onPress={onCancel} tone="quiet" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const validate = (title: string, description: string): Errors => {
  const errors: Errors = {};

  if (title.trim().length < 2) {
    errors.title = "Enter at least 2 characters.";
  }

  if (description.trim().length < 8) {
    errors.description = "Enter at least 8 characters.";
  }

  return errors;
};

const styles = StyleSheet.create({
  actions: {
    gap: spacing.sm
  },
  content: {
    gap: spacing.xl,
    padding: spacing.lg,
    paddingBottom: 44
  },
  form: {
    gap: spacing.lg
  },
  header: {
    gap: spacing.xs
  },
  keyboard: {
    flex: 1
  },
  kicker: {
    color: colors.blue,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 23
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "900"
  }
});
