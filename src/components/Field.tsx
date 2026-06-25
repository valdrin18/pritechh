import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

import { colors, radius, spacing } from "../theme";

type FieldProps = TextInputProps & {
  error?: string;
  label: string;
};

export function Field({ error, label, style, ...inputProps }: FieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          inputProps.multiline && styles.multiline,
          error && styles.inputError,
          style
        ]}
        {...inputProps}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs
  },
  error: {
    color: colors.red,
    fontSize: 13,
    fontWeight: "600"
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.text,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  inputError: {
    borderColor: colors.red
  },
  label: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "700"
  },
  multiline: {
    minHeight: 118,
    textAlignVertical: "top"
  }
});
