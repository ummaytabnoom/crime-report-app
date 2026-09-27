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
    if (!fullName || !userName || !email || !password) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      Alert.alert(
        "Password",
        "Password must contain at least 8 characters."
      );
      return;
    }

    try {
      setLoading(true);

      const result = await api("/api/register", "POST", {
        fullName,
        userName,
        email,
        password,
        mobile,
        dob: dob || null,
        policeId: policeId || null,
      });

      await saveToken(result.token);

      if (result.user.role === "POLICE") {
        router.replace("/police");
      } else {
        router.replace("/dashboard");
      }
    } catch (error: any) {
      Alert.alert("Registration Failed", error.message);
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
          value={fullName}
          onChangeText={setFullName}
        />

        <TextInput
          style={styles.input}
          placeholder="Username *"
          value={userName}
          onChangeText={setUserName}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Email *"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password *"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TextInput
          style={styles.input}
          placeholder="Mobile"
          value={mobile}
          onChangeText={setMobile}
        />

        <TextInput
          style={styles.input}
          placeholder="Date of Birth (YYYY-MM-DD)"
          value={dob}
          onChangeText={setDob}
        />

        <TextInput
          style={styles.input}
          placeholder="Police ID (optional)"
          value={policeId}
          onChangeText={setPoliceId}
          autoCapitalize="characters"
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
  },
});