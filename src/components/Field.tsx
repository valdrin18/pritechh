import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";

import { colors, radius, shadows, spacing } from "../theme";

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
    gap: spacing.sm
  },
  error: {
    color: colors.red,
    fontSize: 13,
    fontWeight: "600"
  },
  input: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderWidth: 1,
    color: colors.text,
    fontSize: 17,
    minHeight: 58,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    ...shadows.soft
  },
  inputError: {
    borderColor: colors.red
  },
  label: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  multiline: {
    minHeight: 160,
    textAlignVertical: "top"
  }
});
