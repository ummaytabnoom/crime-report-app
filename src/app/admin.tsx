import {
    useCallback,
    useState,
} from "react";

import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    router,
    useFocusEffect,
} from "expo-router";

import {
    api,
    removeToken,
} from "../services/api";

import {
    COLORS,
} from "../constants/themes";

export default function AdminPanel() {
  const [reports, setReports] =
    useState<any[]>([]);

  const [users, setUsers] =
    useState<any[]>([]);

  const [search, setSearch] =
    useState("");

  async function loadData() {
    try {
      const reportResult =
        await api(
          `/api/admin/reports?q=${encodeURIComponent(
            search
          )}`
        );

      const userResult =
        await api(
          `/api/admin/users?q=${encodeURIComponent(
            search
          )}`
        );

      setReports(reportResult.reports);
      setUsers(userResult.users);
    } catch (error: any) {
      Alert.alert(
        "Admin Error",
        error.message
      );
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [search])
  );

  async function allowReport(
    crimeId: number
  ) {
    try {
      await api(
        `/api/admin/reports/${crimeId}/allow`,
        "POST",
        {}
      );

      Alert.alert(
        "Success",
        "Report approved."
      );

      loadData();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  }

  async function deleteReport(
    crimeId: number
  ) {
    Alert.alert(
      "Delete Report",
      "Are you sure?",
      [
        {
          text: "Cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api(
                `/api/admin/reports/${crimeId}/delete`,
                "POST"
              );

              loadData();
            } catch (error: any) {
              Alert.alert(
                "Error",
                error.message
              );
            }
          },
        },
      ]
    );
  }

  async function promoteUser(id: number) {
    try {
      await api(
        `/api/admin/users/${id}/promote`,
        "POST"
      );

      loadData();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  }

  async function deleteUser(id: number) {
    try {
      await api(
        `/api/admin/users/${id}/delete`,
        "POST"
      );

      loadData();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  }

  async function logout() {
    await api(
      "/api/logout",
      "POST"
    ).catch(() => {});

    await removeToken();

    router.replace("/");
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>
        Admin Panel
      </Text>

      <TextInput
        style={styles.search}
        placeholder="Search full name or username"
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.menuRow}>
        <Pressable
          style={styles.menuButton}
          onPress={() =>
            router.push(
              "/directory?kind=admins"
            )
          }
        >
          <Text style={styles.menuText}>
            Admins
          </Text>
        </Pressable>

        <Pressable
          style={styles.menuButton}
          onPress={() =>
            router.push(
              "/directory?kind=police"
            )
          }
        >
          <Text style={styles.menuText}>
            Police
          </Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.logout}
        onPress={logout}
      >
        <Text style={styles.logoutText}>
          LOGOUT
        </Text>
      </Pressable>

      <Text style={styles.section}>
        Reports
      </Text>

      {reports.map((report) => (
        <View
          style={styles.card}
          key={report.crimeId}
        >
          <Text style={styles.cardTitle}>
            {report.category}
          </Text>

          <Text>
            {report.description}
          </Text>

          <Text style={styles.info}>
            User: {report.fullName}
          </Text>

          <Text style={styles.info}>
            Username: @{report.userName}
          </Text>

          <Text style={styles.info}>
            Area: {report.area}
          </Text>

          <Text style={styles.info}>
            Status: {report.accepted}
          </Text>

          <View style={styles.actionRow}>
            <Pressable
              style={styles.allow}
              onPress={() =>
                allowReport(
                  report.crimeId
                )
              }
            >
              <Text style={styles.actionText}>
                ALLOW
              </Text>
            </Pressable>

            <Pressable
              style={styles.delete}
              onPress={() =>
                deleteReport(
                  report.crimeId
                )
              }
            >
              <Text style={styles.actionText}>
                DELETE
              </Text>
            </Pressable>
          </View>
        </View>
      ))}

      <Text style={styles.section}>
        Users
      </Text>

      {users.map((user) => (
        <View
          style={styles.card}
          key={user.id}
        >
          <Text style={styles.cardTitle}>
            {user.fullName}
          </Text>

          <Text>
            @{user.userName}
          </Text>

          <Text style={styles.info}>
            {user.email}
          </Text>

          <Text style={styles.info}>
            Role: {user.role}
          </Text>

          {user.role !== "ADMIN" && (
            <Pressable
              style={styles.allow}
              onPress={() =>
                promoteUser(user.id)
              }
            >
              <Text style={styles.actionText}>
                MAKE ADMIN
              </Text>
            </Pressable>
          )}

          <Pressable
            style={styles.delete}
            onPress={() =>
              deleteUser(user.id)
            }
          >
            <Text style={styles.actionText}>
              DELETE USER
            </Text>
          </Pressable>
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
    fontSize: 26,
    fontWeight: "900",
    color: COLORS.primary,
  },

  search: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    padding: 13,
    marginTop: 15,
  },

  menuRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },

  menuButton: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    padding: 12,
    borderRadius: 9,
    alignItems: "center",
  },

  menuText: {
    color: "#fff",
    fontWeight: "800",
  },

  logout: {
    backgroundColor: COLORS.lightBlue,
    padding: 12,
    borderRadius: 9,
    marginTop: 10,
    alignItems: "center",
  },

  logoutText: {
    color: COLORS.primary,
    fontWeight: "800",
  },

  section: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.primary,
    marginTop: 25,
    marginBottom: 8,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: COLORS.primary,
    marginBottom: 5,
  },

  info: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 6,
  },

  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },

  allow: {
    backgroundColor: COLORS.success,
    padding: 11,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },

  delete: {
    backgroundColor: COLORS.danger,
    padding: 11,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },

  actionText: {
    color: "#fff",
    fontWeight: "800",
  },
});