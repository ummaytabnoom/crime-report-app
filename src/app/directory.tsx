import { useEffect, useState } from "react";

import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { useLocalSearchParams } from "expo-router";

import { api } from "../services/api";

import { COLORS } from "../constants/themes";

export default function Directory() {
  const { kind } =
    useLocalSearchParams<{
      kind: string;
    }>();

  const [users, setUsers] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadUsers();
  }, [kind]);

  async function loadUsers() {
    try {
      const result =
        await api(
          `/api/directories?kind=${kind}`
        );

      setUsers(result.users);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message
      );
    }
  }

  const filtered = users.filter(
    (user) =>
      `${user.fullName} ${user.userName}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const title =
    kind === "police"
      ? "Police Officers"
      : "Administrators";

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>
        {title}
      </Text>

      <TextInput
        style={styles.search}
        placeholder="Search full name or username"
        value={search}
        onChangeText={setSearch}
      />

      {filtered.map((user) => (
        <View
          style={styles.card}
          key={user.id}
        >
          <Text style={styles.name}>
            {user.fullName}
          </Text>

          <Text style={styles.username}>
            @{user.userName}
          </Text>

          <Text style={styles.info}>
            Email: {user.email}
          </Text>

          <Text style={styles.info}>
            Mobile: {user.mobile || "N/A"}
          </Text>

          <Text style={styles.info}>
            Role: {user.role}
          </Text>

          {user.policeId && (
            <Text style={styles.info}>
              Police ID: {user.policeId}
            </Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  heading: {
    fontSize: 25,
    fontWeight: "900",
    color: COLORS.primary,
    marginBottom: 15,
  },

  search: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    padding: 13,
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },

  name: {
    fontSize: 17,
    fontWeight: "900",
    color: COLORS.primary,
  },

  username: {
    color: COLORS.secondary,
    fontWeight: "700",
    marginTop: 3,
  },

  info: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 6,
  },
});