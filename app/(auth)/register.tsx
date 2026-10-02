import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Button, SegmentedButtons, Text, TextInput, useTheme } from "react-native-paper";
import { useAuth } from "../../src/context/AuthContext";
import type { Role } from "../../src/types";

export default function Register() {
  const theme = useTheme();
  const { signUp } = useAuth();
  const [role, setRole] = useState<Role>("public");
  const [form, setForm] = useState({
    full_name: "",
    user_name: "",
    email: "",
    dob: "",
    mobile: "",
    police_id: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function setField(key: keyof typeof form, value: string) {
    setForm(current => ({ ...current, [key]: value }));
  }

  async function submit() {
    setError("");
    if (!form.full_name || !form.user_name || !form.email || !form.password) {
      setError("Please fill in the required fields.");
      return;
    }
    if (role === "police" && !form.police_id) {
      setError("Police ID is required.");
      return;
    }

    try {
      setLoading(true);
      await signUp({
        full_name: form.full_name,
        user_name: form.user_name,
        email: form.email,
        dob: form.dob || undefined,
        mobile: form.mobile || undefined,
        role,
        police_id: role === "police" ? form.police_id : undefined,
        password: form.password,
      });
      router.replace("/(app)/home");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Button icon="arrow-left" contentStyle={{ justifyContent: "flex-start" }} onPress={() => router.back()}>
          Back
        </Button>
        <Text variant="displaySmall" style={styles.title}>Create account</Text>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
          Join the reporting community.
        </Text>

        <SegmentedButtons
          value={role}
          onValueChange={value => setRole(value as Role)}
          buttons={[
            { value: "public", label: "Public", icon: "account" },
            { value: "police", label: "Police", icon: "shield-account" },
          ]}
        />

        <TextInput label="Full name *" mode="outlined" value={form.full_name} onChangeText={v => setField("full_name", v)} />
        <TextInput label="Username *" mode="outlined" autoCapitalize="none" value={form.user_name} onChangeText={v => setField("user_name", v)} />
        <TextInput label="Email *" mode="outlined" keyboardType="email-address" autoCapitalize="none" value={form.email} onChangeText={v => setField("email", v)} />
        <TextInput label="Date of birth" mode="outlined" placeholder="YYYY-MM-DD" value={form.dob} onChangeText={v => setField("dob", v)} />
        <TextInput label="Mobile" mode="outlined" keyboardType="phone-pad" value={form.mobile} onChangeText={v => setField("mobile", v)} />
        {role === "police" ? (
          <TextInput label="Police ID *" mode="outlined" value={form.police_id} onChangeText={v => setField("police_id", v)} />
        ) : null}
        <TextInput label="Password *" mode="outlined" secureTextEntry value={form.password} onChangeText={v => setField("password", v)} />

        {error ? <Text style={{ color: theme.colors.error }}>{error}</Text> : null}

        <Button mode="contained" onPress={submit} loading={loading} disabled={loading}>
          Create account
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 14, paddingBottom: 40 },
  title: { fontWeight: "800", marginTop: 10 },
});
