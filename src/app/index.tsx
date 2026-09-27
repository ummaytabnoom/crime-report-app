import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from "react-native";

import { router } from "expo-router";

import { api, saveToken } from "../services/api";

import { COLORS } from "../constants/themes";

export default function LoginScreen() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function loginUser() {
    if (!login || !password) {
      Alert.alert("Error", "Please enter username/email and password.");
      return;
    }

    try {
      setLoading(true);

      const result = await api("/api/login", "POST", {
        login,
        password,
      });

      await saveToken(result.token);

      const role = result.user.role;

      if (role === "ADMIN") {
        router.replace("/admin");
      } else if (role === "POLICE") {
        router.replace("/police");
      } else {
        router.replace("/dashboard");
      }
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>CR</Text>
        </View>

        <Text style={styles.title}>Crime Report</Text>

        <Text style={styles.subtitle}>
          Report. Protect. Stay Safe.
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Username or Email</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter username or email"
            placeholderTextColor="#94A3B8"
            value={login}
            onChangeText={setLogin}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Pressable
            style={styles.loginButton}
            onPress={loginUser}
            disabled={loading}
          >
            <Text style={styles.loginText}>
              {loading ? "Logging in..." : "LOGIN"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/register")}
            style={styles.registerButton}
          >
            <Text style={styles.registerText}>
              Don't have an account? Register
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },

  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  logoText: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "900",
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: COLORS.primary,
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    color: COLORS.muted,
    marginTop: 5,
    marginBottom: 25,
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 18,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  label: {
    color: COLORS.text,
    fontWeight: "700",
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 13,
    marginBottom: 15,
    color: COLORS.text,
    backgroundColor: "#fff",
  },

  loginButton: {
    backgroundColor: COLORS.secondary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  loginText: {
    color: "#fff",
    fontWeight: "800",
  },

  registerButton: {
    alignItems: "center",
    marginTop: 18,
  },

  registerText: {
    color: COLORS.secondary,
    fontWeight: "700",
  },
});