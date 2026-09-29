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

import { COLORS } from "../constants/themes";

export default function PolicePanel() {
  const [reports, setReports] =
    useState<any[]>([]);

  async function loadReports() {
    try {
      const result =
        await api("/api/reports");

      setReports(result.reports);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message
      );
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [])
  );

  async function updateStatus(
    crimeId: number,
    status: string
  ) {
    try {
      await api(
        "/api/police/status",
        "POST",
        {
          crimeId,
          status,
        }
      );

      loadReports();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message
      );
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
        Police Dashboard
      </Text>

      <View style={styles.menuRow}>
        <Pressable
          style={styles.menu}
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
          style={styles.menu}
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
        <Text>LOGOUT</Text>
      </Pressable>

      <Text style={styles.section}>
        Assigned Reports
      </Text>

      {reports.length === 0 ? (
        <Text style={styles.empty}>
          No reports assigned to your location.
        </Text>
      ) : (
        reports.map((report) => (
          <View
            style={styles.card}
            key={report.crimeId}
          >
            <Text style={styles.title}>
              {report.category}
            </Text>

            <Text>
              {report.description}
            </Text>

            <Text style={styles.info}>
              Area: {report.area}
            </Text>

            <Text style={styles.info}>
              Location: {report.zilla},{" "}
              {report.upazilla}
            </Text>

            <Text style={styles.info}>
              Police Station:{" "}
              {report.policeStation}
            </Text>

            <Text style={styles.status}>
              Current Status:{" "}
              {report.status}
            </Text>

            <Text style={styles.info}>
              Approved by:{" "}
              {report.acceptedBy || "Admin"}
            </Text>

            <View style={styles.statusRow}>
              <StatusButton
                title="Pending"
                onPress={() =>
                  updateStatus(
                    report.crimeId,
                    "Pending"
                  )
                }
              />

              <StatusButton
                title="Investigation"
                onPress={() =>
                  updateStatus(
                    report.crimeId,
                    "Under Investigation"
                  )
                }
              />

              <StatusButton
                title="Solved"
                onPress={() =>
                  updateStatus(
                    report.crimeId,
                    "Solved"
                  )
                }
              />
            </View>

            {report.upgradedBy && (
              <Text style={styles.investigator}>
                Investigated by Police user:{" "}
                {report.upgradedBy}
              </Text>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

function StatusButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={styles.statusButton}
      onPress={onPress}
    >
      <Text style={styles.statusButtonText}>
        {title}
      </Text>
    </Pressable>
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

  menuRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 15,
  },

  menu: {
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
    alignItems: "center",
    borderRadius: 9,
    marginTop: 9,
  },

  section: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.primary,
    marginTop: 25,
  },

  empty: {
    color: COLORS.muted,
    textAlign: "center",
    marginTop: 20,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 13,
    marginTop: 12,
  },

  title: {
    fontSize: 17,
    fontWeight: "900",
    color: COLORS.primary,
  },

  info: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 7,
  },

  status: {
    marginTop: 10,
    color: COLORS.secondary,
    fontWeight: "800",
  },

  statusRow: {
    flexDirection: "row",
    gap: 5,
    marginTop: 12,
  },

  statusButton: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    padding: 9,
    borderRadius: 7,
    alignItems: "center",
  },

  statusButtonText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },

  investigator: {
    color: COLORS.success,
    fontWeight: "700",
    fontSize: 12,
    marginTop: 10,
  },

  statusButtonDisabled: {},
});