import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import { Button, Card, Text, TextInput, useTheme } from "react-native-paper";
import { useAuth } from "../../src/context/AuthContext";

export default function Login() {
  const theme = useTheme();
  const { signIn } = useAuth();
  const [value, setValue] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    if (!value.trim() || !password) {
      setError("Enter your username/email and password.");
      return;
    }
    try {
      setLoading(true);
      await signIn(value.trim(), password);
      router.replace("/(app)/home");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.page, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.hero}>
        <View style={[styles.logo, { backgroundColor: theme.colors.primaryContainer }]}>
          <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>CR</Text>
        </View>
        <Text variant="displaySmall" style={styles.title}>Crime Report</Text>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant, textAlign: "center" }}>
          Report. Track. Stay informed.
        </Text>
      </View>

      <Card style={styles.card}>
        <Card.Content style={styles.form}>
          <Text variant="headlineSmall">Welcome back</Text>
          <TextInput
            label="Username or email"
            value={value}
            onChangeText={setValue}
            mode="outlined"
            autoCapitalize="none"
          />
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry
          />
          {error ? <Text style={{ color: theme.colors.error }}>{error}</Text> : null}
          <Button mode="contained" onPress={submit} loading={loading} disabled={loading}>
            Sign in
          </Button>
          <Button mode="text" onPress={() => router.push("/(auth)/register")}>
            Create an account
          </Button>
        </Card.Content>
      </Card>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, justifyContent: "center", padding: 20 },
  hero: { alignItems: "center", marginBottom: 28, gap: 8 },
  logo: {
    width: 74, height: 74, borderRadius: 24,
    alignItems: "center", justifyContent: "center", marginBottom: 4,
  },
  title: { fontWeight: "800" },
  card: { borderRadius: 24 },
  form: { gap: 14 },
});
