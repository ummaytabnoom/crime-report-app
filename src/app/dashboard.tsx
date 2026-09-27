import React, { useCallback, useState } from "react";

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  RefreshControl,
} from "react-native";

import { router, useFocusEffect } from "expo-router";

import {
  api,
  clearToken,
} from "../services/api";

import { COLORS } from "../constants/themes";

export default function Dashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [area, setArea] = useState("");
  const [user, setUser] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  async function loadData() {
    try {
      setRefreshing(true);

      const userResult = await api("/api/me");

      const reportResult = await api(
        area
          ? `/api/reports?area=${encodeURIComponent(area)}`
          : "/api/reports"
      );

      setUser(userResult.user);
      setReports(reportResult.reports);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [area])
  );

  async function logout() {
    try {
      await api("/api/logout", "POST");
    } catch {}

    await clearToken();

    router.replace("/");
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={loadData}
        />
      }
    >
      <Text style={styles.welcome}>
        Welcome, {user?.fullName || "User"}
      </Text>

      <Text style={styles.role}>
        Account type: {user?.role || "PUBLIC"}
      </Text>

      <View style={styles.grid}>
        <MenuButton
          title="Report Crime"
          onPress={() => router.push("/new-report")}
        />

        <MenuButton
          title="My Reports"
          onPress={() => router.push("/my-reports")}
        />

        <MenuButton
          title="My Profile"
          onPress={() => router.push("/profile")}
        />

        <MenuButton
          title="Logout"
          onPress={logout}
        />
      </View>

      <Text style={styles.sectionTitle}>
        Search Reports
      </Text>

      <TextInput
        style={styles.search}
        placeholder="Search by reported area..."
        value={area}
        onChangeText={setArea}
      />

      <Text style={styles.sectionTitle}>
        Approved Crime Reports
      </Text>

      {reports.length === 0 ? (
        <Text style={styles.empty}>
          No approved reports found.
        </Text>
      ) : (
        reports.map((report) => (
          <View
            style={styles.reportCard}
            key={report.crimeId}
          >
            <Text style={styles.reportTitle}>
              {report.category}
            </Text>

            <Text style={styles.description}>
              {report.description}
            </Text>

            <Text style={styles.info}>
              Area: {report.area || "Not provided"}
            </Text>

            <Text style={styles.info}>
              Location: {report.zilla},{" "}
              {report.upazilla}
            </Text>

            <Text style={styles.status}>
              Status: {report.status}
            </Text>

            <Text style={styles.info}>
              Police ID: {report.policeId || "Not assigned"}
            </Text>

            {report.upgradedBy && (
              <Text style={styles.info}>
                Investigated by: {report.upgradedBy}
              </Text>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

function MenuButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={styles.menuButton}
      onPress={onPress}
    >
      <Text style={styles.menuText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.background,
  },

  welcome: {
    fontSize: 25,
    fontWeight: "900",
    color: COLORS.primary,
  },

  role: {
    color: COLORS.muted,
    marginTop: 4,
    marginBottom: 18,
  },

  grid: {
    gap: 8,
  },

  menuButton: {
    backgroundColor: COLORS.secondary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  menuText: {
    color: "#fff",
    fontWeight: "800",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.primary,
    marginTop: 22,
    marginBottom: 9,
  },

  search: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 13,
  },

  empty: {
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 20,
  },

  reportCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 13,
    marginBottom: 12,
  },

  reportTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: COLORS.primary,
  },

  description: {
    marginTop: 7,
    lineHeight: 20,
  },

  info: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 7,
  },

  status: {
    color: COLORS.secondary,
    fontWeight: "800",
    marginTop: 8,
  },
});