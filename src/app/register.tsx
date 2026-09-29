import { useState } from "react";

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { router } from "expo-router";

import AppButton from "../components/AppButton";

import { api, saveToken } from "../services/api";

import { COLORS } from "../constants/themes";

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [dob, setDob] = useState("");
  const [policeId, setPoliceId] = useState("");

  const [loading, setLoading] = useState(false);

async function register() {
  if (
    !fullName.trim() ||
    !userName.trim() ||
    !email.trim() ||
    !password
  ) {
    Alert.alert(
      "Required Fields",
      "Please fill in Full Name, Username, Email and Password."
    );
    return;
  }

  if (password.length < 8) {
    Alert.alert(
      "Invalid Password",
      "Password must contain at least 8 characters."
    );
    return;
  }

  if (!email.includes("@")) {
    Alert.alert(
      "Invalid Email",
      "Please enter a valid email address."
    );
    return;
  }

  try {
    setLoading(true);

    const result = await api("/api/auth/register", "POST", {
      fullName: fullName.trim(),
      userName: userName.trim(),
      email: email.trim(),
      password,
      mobile: mobile.trim() || null,
      dob: dob.trim() || null,
      policeId: policeId.trim() || null,
    });

    console.log(
      "REGISTER RESPONSE:",
      JSON.stringify(result, null, 2)
    );

    // Save token if registration/login response contains one
    const token = result?.data?.token;

    if (token) {
      await saveToken(token);
      console.log("TOKEN SAVED");
    }

    console.log("REGISTRATION SUCCESS");
    console.log("GOING TO DASHBOARD");

    // Go directly to dashboard
    router.replace("/dashboard");

  } catch (error: any) {
    console.log("REGISTER ERROR:", error);

    Alert.alert(
      "Registration Failed",
      error?.message || "Unable to create account."
    );
  } finally {
    setLoading(false);
  }
}
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>

        <Text style={styles.info}>
          Leave Police ID empty if you want to create a public user
          account.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Full name *"
          placeholderTextColor="#94A3B8"
          value={fullName}
          onChangeText={setFullName}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Username *"
          placeholderTextColor="#94A3B8"
          value={userName}
          onChangeText={setUserName}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Email *"
          placeholderTextColor="#94A3B8"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password *"
          placeholderTextColor="#94A3B8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Mobile"
          placeholderTextColor="#94A3B8"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Date of Birth (YYYY-MM-DD)"
          placeholderTextColor="#94A3B8"
          value={dob}
          onChangeText={setDob}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Police ID (optional)"
          placeholderTextColor="#94A3B8"
          value={policeId}
          onChangeText={setPoliceId}
          autoCapitalize="characters"
          editable={!loading}
        />

        <AppButton
          title="CREATE ACCOUNT"
          onPress={register}
          loading={loading}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    backgroundColor: COLORS.background,
    flexGrow: 1,
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
  },

  title: {
    fontSize: 25,
    fontWeight: "900",
    color: COLORS.primary,
    marginBottom: 12,
  },

  info: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 13,
    marginBottom: 12,
    backgroundColor: "#fff",
    color: COLORS.text,
  },
});