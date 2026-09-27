import { useState } from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { router } from "expo-router";

import { api, saveToken } from "../services/api";

import { COLORS } from "../constants/themes";

export default function LoginScreen() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  console.log(process.env.EXPO_PUBLIC_API_URL);
 
async function loginUser() {
  if (!login.trim()) {
    Alert.alert(
      "Username Required",
      "Please enter your username or email."
    );
    return;
  }

  if (!password) {
    Alert.alert(
      "Password Required",
      "Please enter your password."
    );
    return;
  }

  try {
    setLoading(true);

    const result = await api("/api/auth/login", "POST", {
      userName: login.trim(),
      password,
    });

    console.log(
      "LOGIN RESPONSE JSON:",
      JSON.stringify(result, null, 2)
    );

    const token = result?.data?.token;
    const user = result?.data?.user;

    if (!token || !user) {
      Alert.alert(
        "Login Error",
        "Invalid login response from the server."
      );
      return;
    }

    await saveToken(token);

    const role = String(user.ROLE || "").toUpperCase();

    console.log("USER ROLE:", role);

    // Show success message
    Alert.alert(
      "Login Successful",
      `Welcome, ${user.FULL_NAME || user.USER_NAME}!`
    );

    // Redirect immediately
    if (role === "ADMIN") {
      router.push("/admin");
    } else if (role === "POLICE") {
      router.push("/police");
    } else {
      router.push("/dashboard");
    }

  } catch (error: any) {
    console.log("LOGIN ERROR:", error);

    Alert.alert(
      "Login Failed",
      error?.message || "Username or password is incorrect."
    );
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