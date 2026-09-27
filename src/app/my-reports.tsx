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

import { api } from "../services/api";

import { COLORS } from "../constants/themes";

export default function MyReports() {
  const [reports, setReports] =
    useState<any[]>([]);

  async function loadReports() {
    try {
      const result =
        await api("/api/my-reports");

      setReports(result.reports);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [])
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>
        My Reports
      </Text>

      {reports.length === 0 ? (
        <Text style={styles.empty}>
          You have not submitted any reports.
        </Text>
      ) : (
        reports.map((report) => (
          <View
            key={report.crimeId}
            style={styles.card}
          >
            <Text style={styles.title}>
              {report.category}
            </Text>

            <Text>
              {report.description}
            </Text>

            <Text style={styles.info}>
              Area: {report.area || "N/A"}
            </Text>

            <Text style={styles.info}>
              Status: {report.status}
            </Text>

            <Text style={styles.info}>
              Admin:
              {" "}
              {report.acceptedBy || "Not assigned"}
            </Text>

            <Text style={styles.info}>
              Police:
              {" "}
              {report.policeId || "Not assigned"}
            </Text>

            {report.upgradedBy && (
              <Text style={styles.info}>
                Investigated by:
                {" "}
                {report.upgradedBy}
              </Text>
            )}

            {report.accepted === "PENDING" && (
              <Pressable
                style={styles.editButton}
                onPress={() =>
                  router.push({
                    pathname: "/edit-report",
                    params: {
                      crimeId: String(
                        report.crimeId
                      ),
                    },
                  })
                }
              >
                <Text style={styles.editText}>
                  EDIT REPORT
                </Text>
              </Pressable>
            )}
          </View>
        ))
      )}
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

  empty: {
    textAlign: "center",
    color: COLORS.muted,
    marginTop: 30,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 13,
    marginBottom: 12,
  },

  title: {
    fontSize: 17,
    fontWeight: "900",
    color: COLORS.primary,
    marginBottom: 7,
  },

  info: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 7,
  },

  editButton: {
    backgroundColor: COLORS.secondary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
  },

  editText: {
    color: "#fff",
    fontWeight: "800",
  },
});