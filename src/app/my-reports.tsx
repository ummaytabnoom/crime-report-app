import { useCallback, useState } from "react";

import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useFocusEffect } from "expo-router";

import { COLORS } from "../constants/themes";
import { api } from "../services/api";

export default function MyReports() {
  const [reports, setReports] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  async function loadReports() {
    try {
      setRefreshing(true);

      const result = await api("/api/crimes/my");

      console.log(
        "MY REPORTS RESPONSE:",
        JSON.stringify(result, null, 2)
      );

      // Backend returns { success: true, data: [...] }
      const data = Array.isArray(result?.data)
        ? result.data
        : [];

      setReports(data);
    } catch (error: any) {
      console.log("MY REPORTS ERROR:", error);

      setReports([]);

      Alert.alert(
        "Error",
        error?.message || "Could not load your reports."
      );
    } finally {
      setRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadReports();
    }, [])
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={loadReports}
        />
      }
    >
      <Text style={styles.title}>My Reports</Text>

      {reports.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            You have not submitted any crime reports.
          </Text>
        </View>
      ) : (
        reports.map((report, index) => (
          <View
            key={report.CRIME_ID || index}
            style={styles.card}
          >
            <Text style={styles.heading}>
              Report #{report.CRIME_ID}
            </Text>

            <Text style={styles.info}>
              Category: {report.CATEGORY || "Not provided"}
            </Text>

            <Text style={styles.info}>
              Status: {report.STATUS || "Pending"}
            </Text>

            <Text style={styles.info}>
              Accepted: {report.ACCEPTED || "Not Accepted"}
            </Text>

            <Text style={styles.info}>
              Zilla: {report.ZILLA || "Not provided"}
            </Text>

            <Text style={styles.info}>
              Upazilla: {report.UPAZILLA || "Not provided"}
            </Text>

            <Text style={styles.info}>
              Police Station:{" "}
              {report.POLICE_STATION || "Not provided"}
            </Text>

            <Text style={styles.info}>
              Area: {report.AREA || "Not provided"}
            </Text>

            <Text style={styles.info}>
              Road: {report.ROAD_NAME || "Not provided"}
            </Text>

            <Text style={styles.info}>
              Road No: {report.ROAD_NO || "Not provided"}
            </Text>

            <Text style={styles.info}>
              Incident Date:{" "}
              {report.DATE_OF_INCIDENT
                ? String(report.DATE_OF_INCIDENT)
                : "Not provided"}
            </Text>

            <Text style={styles.info}>
              Police ID:{" "}
              {report.POLICE_ID || "Not assigned"}
            </Text>

            <Text style={styles.info}>
              Investigator:{" "}
              {report.UPGRADED_BY || "Not assigned"}
            </Text>

            <Text style={styles.description}>
              {report.DESCRIPTION || "No description"}
            </Text>

            {report.ACCEPTED_BY && (
              <Text style={styles.info}>
                Accepted by: {report.ACCEPTED_BY}
              </Text>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 16,
  },

  emptyBox: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  emptyText: {
    color: COLORS.muted,
    fontSize: 15,
  },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  heading: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 10,
  },

  info: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 6,
  },

  description: {
    fontSize: 14,
    color: COLORS.text,
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});