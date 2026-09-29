import { useEffect, useState } from "react";

import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import AppButton from "../components/AppButton";

import { api } from "../services/api";

import { COLORS } from "../constants/themes";

export default function Profile() {
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const result =
        await api("/api/me");

      setEmail(result.user.email || "");
      setMobile(result.user.mobile || "");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  }

  async function saveProfile() {
    try {
      setLoading(true);

      await api(
        "/api/profile",
        "PUT",
        {
          email,
          mobile,
          ...(password
            ? { password }
            : {}),
        }
      );

      setPassword("");

      Alert.alert(
        "Success",
        "Profile updated successfully."
      );
    } catch (error: any) {
      Alert.alert(
        "Update Failed",
        error.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          My Profile
        </Text>

        <Text style={styles.label}>
          Email
        </Text>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>
          Mobile
        </Text>

        <TextInput
          style={styles.input}
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>
          New Password
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Leave empty to keep current password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <AppButton
          title="SAVE CHANGES"
          onPress={saveProfile}
          loading={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
  },

  title: {
    fontSize: 25,
    fontWeight: "900",
    color: COLORS.primary,
    marginBottom: 20,
  },

  label: {
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 5,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    padding: 13,
    marginBottom: 15,
  },
});