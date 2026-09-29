import { useEffect, useState } from "react";

import {
    Alert,
    FlatList,
    Pressable,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import { router } from "expo-router";

import { api, removeToken } from "../services/api";


type Crime = {
  CRIME_ID: number;
  ID: number;

  USER_NAME?: string;
  FULL_NAME?: string;
  EMAIL?: string;
  MOBILE?: string;

  ZILLA?: string;
  UPAZILLA?: string;
  POLICE_STATION?: string;
  AREA?: string;
  ROAD_NAME?: string;
  ROAD_NO?: string;

  DATE_OF_INCIDENT?: string;
  CATEGORY?: string;
  DESCRIPTION?: string;

  STATUS?: string;
  HIDE_IDENTITY?: string;
  ACCEPTED?: string;
  ACCEPTED_BY?: string;

  POLICE_ID?: string;
  UPGRADED_BY?: string;
  MEDIA_TYPE?: string;
};

export default function ReportManage() {
  const [reports, setReports] = useState<Crime[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // ============================================================
  // LOAD REPORTS
  // ============================================================

  const loadReports = async () => {
    try {
      setLoading(true);

      console.log("LOADING CRIME REPORTS...");

      const result = await api("/api/crimes", "GET");

      console.log(
        "CRIMES API RESPONSE:",
        JSON.stringify(result, null, 2)
      );

      let rows: Crime[] = [];

      if (Array.isArray(result?.data)) {
        rows = result.data;
      } else if (Array.isArray(result)) {
        rows = result;
      }

      console.log("REPORT ROWS:", rows.length);

      setReports(rows);
    } catch (error: any) {
      console.log("LOAD REPORTS ERROR:", error);

      Alert.alert(
        "Error",
        error?.message || "Failed to load reports."
      );

      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // LOAD WHEN SCREEN OPENS
  // ============================================================

  useEffect(() => {
    loadReports();
  }, []);

  // ============================================================
  // CHECK IF REPORT IS ACCEPTED
  // ============================================================

  const isAccepted = (report: Crime) => {
    const accepted = String(
      report.ACCEPTED || ""
    )
      .trim()
      .toLowerCase();

    return (
      accepted === "accepted" ||
      accepted === "yes" ||
      accepted === "true" ||
      accepted === "1"
    );
  };

  // ============================================================
  // ALLOW POST
  // ============================================================

  const allowPost = async (crimeId: number) => {
  console.log("========== ALLOW POST ==========");
  console.log("Crime ID:", crimeId);

  try {
    const result = await api(
      `/api/admin/crimes/${crimeId}/accept`,
      "PATCH"
    );

    console.log(
      "ALLOW API RESULT:",
      JSON.stringify(result, null, 2)
    );

    Alert.alert(
      "Success",
      "Crime report approved successfully."
    );

    // Reload reports
    await loadReports();

  } catch (error: any) {
    console.log(
      "ALLOW API ERROR:",
      error
    );

    Alert.alert(
      "Allow Failed",
      error?.message ||
        "Failed to approve the crime report."
    );
  }
};

  // ============================================================
  // CONFIRM ALLOW
  // ============================================================

 const confirmAllow = (crimeId: number) => {
  Alert.alert(
    "Allow Post",
    `Do you want to allow Crime #${crimeId}?`,
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Allow",
        onPress: () => {
          allowPost(crimeId);
        },
      },
    ]
  );
};

  // ============================================================
  // DELETE REPORT
  // ============================================================

const deleteReport = async (crimeId: number) => {
  console.log("========== DELETE REPORT ==========");
  console.log("Crime ID:", crimeId);

  try {
    const result = await api(
      `/api/admin/crimes/${crimeId}/delete`,
      "DELETE"
    );

    console.log(
      "DELETE API RESULT:",
      JSON.stringify(result, null, 2)
    );

    Alert.alert(
      "Success",
      "Crime report deleted successfully."
    );

    // Reload reports
    await loadReports();

  } catch (error: any) {
    console.log(
      "DELETE API ERROR:",
      error
    );

    Alert.alert(
      "Delete Failed",
      error?.message ||
        "Failed to delete the crime report."
    );
  }
};

  // ============================================================
  // CONFIRM DELETE
  // ============================================================

  const confirmDelete = (crimeId: number) => {
  Alert.alert(
    "Delete Report",
    `Are you sure you want to delete Crime #${crimeId}?`,
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteReport(crimeId);
        },
      },
    ]
  );
};

  // ============================================================
  // LOGOUT
  // ============================================================

  const logout = async () => {
    try {
      await removeToken();
    } catch (error) {
      console.log(
        "LOGOUT ERROR:",
        error
      );
    }

    router.replace("/");
  };

  // ============================================================
  // SEARCH
  // ============================================================

  const filteredReports =
    reports.filter((report) => {
      const query = search
        .trim()
        .toLowerCase();

      if (!query) {
        return true;
      }

      const searchableText = [
        report.USER_NAME,
        report.FULL_NAME,
        report.CATEGORY,
        report.AREA,
        report.POLICE_STATION,
        report.ZILLA,
        report.UPAZILLA,
        report.STATUS,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(
        query
      );
    });

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (
    date?: string
  ) => {
    if (!date) {
      return "N/A";
    }

    try {
      return new Date(
        date
      ).toLocaleDateString();
    } catch {
      return date;
    }
  };

  // ============================================================
  // REPORT CARD
  // ============================================================

  const renderReport = ({
    item,
  }: {
    item: Crime;
  }) => {
    const accepted =
      isAccepted(item);

    const hiddenIdentity =
      String(
        item.HIDE_IDENTITY || ""
      )
        .trim()
        .toLowerCase() === "yes";

    const reporterName =
      hiddenIdentity
        ? "Anonymous"
        : item.FULL_NAME ||
          item.USER_NAME ||
          "Unknown";

    return (
      <View style={styles.card}>
        {/* ==================================================
            HEADER
        ================================================== */}

        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.category}>
              {item.CATEGORY ||
                "Crime Report"}
            </Text>

            <Text style={styles.crimeId}>
              Crime #{item.CRIME_ID}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              accepted
                ? styles.acceptedBadge
                : styles.pendingBadge,
            ]}
          >
            <Text style={styles.statusText}>
              {accepted
                ? "ACCEPTED"
                : "PENDING"}
            </Text>
          </View>
        </View>

        {/* ==================================================
            REPORTER
        ================================================== */}

        <View style={styles.section}>
          <Text style={styles.label}>
            REPORTER
          </Text>

          <Text style={styles.value}>
            {reporterName}
          </Text>

          {!hiddenIdentity &&
          item.USER_NAME ? (
            <Text style={styles.smallValue}>
              Username:{" "}
              {item.USER_NAME}
            </Text>
          ) : null}

          {!hiddenIdentity &&
          item.EMAIL ? (
            <Text style={styles.smallValue}>
              Email: {item.EMAIL}
            </Text>
          ) : null}

          {!hiddenIdentity &&
          item.MOBILE ? (
            <Text style={styles.smallValue}>
              Mobile: {item.MOBILE}
            </Text>
          ) : null}
        </View>

        {/* ==================================================
            LOCATION
        ================================================== */}

        <View style={styles.section}>
          <Text style={styles.label}>
            LOCATION
          </Text>

          <Text style={styles.value}>
            {item.ZILLA || "N/A"}

            {item.UPAZILLA
              ? `, ${item.UPAZILLA}`
              : ""}
          </Text>

          {item.POLICE_STATION ? (
            <Text style={styles.smallValue}>
              Police Station:{" "}
              {item.POLICE_STATION}
            </Text>
          ) : null}

          {item.AREA ? (
            <Text style={styles.smallValue}>
              Area: {item.AREA}
            </Text>
          ) : null}

          {item.ROAD_NAME ? (
            <Text style={styles.smallValue}>
              Road: {item.ROAD_NAME}

              {item.ROAD_NO
                ? ` ${item.ROAD_NO}`
                : ""}
            </Text>
          ) : null}
        </View>

        {/* ==================================================
            DATE
        ================================================== */}

        <View style={styles.section}>
          <Text style={styles.label}>
            DATE OF INCIDENT
          </Text>

          <Text style={styles.value}>
            {formatDate(
              item.DATE_OF_INCIDENT
            )}
          </Text>
        </View>

        {/* ==================================================
            DESCRIPTION
        ================================================== */}

        <View style={styles.section}>
          <Text style={styles.label}>
            DESCRIPTION
          </Text>

          <Text style={styles.description}>
            {item.DESCRIPTION ||
              "No description provided."}
          </Text>
        </View>

        {/* ==================================================
            ACCEPTED BY
        ================================================== */}

        {accepted &&
        item.ACCEPTED_BY ? (
          <View style={styles.section}>
            <Text style={styles.label}>
              ACCEPTED BY
            </Text>

            <Text style={styles.value}>
              {item.ACCEPTED_BY}
            </Text>
          </View>
        ) : null}

        {/* ==================================================
            POLICE
        ================================================== */}

        {item.POLICE_ID ? (
          <View style={styles.section}>
            <Text style={styles.label}>
              POLICE ID
            </Text>

            <Text style={styles.value}>
              {item.POLICE_ID}
            </Text>
          </View>
        ) : null}

        {/* ==================================================
            MEDIA
        ================================================== */}

        {item.MEDIA_TYPE ? (
          <View style={styles.section}>
            <Text style={styles.label}>
              MEDIA
            </Text>

            <Text style={styles.value}>
              {item.MEDIA_TYPE}
            </Text>
          </View>
        ) : null}

        {/* ==================================================
            ACTION BUTTONS
        ================================================== */}

        <View style={styles.actions}>
          {/* ALLOW POST */}

          {!accepted ? (
    <Pressable
      onPress={() => {
        console.log(
          "ALLOW BUTTON PRESSED:",
          item.CRIME_ID
        );

        confirmAllow(item.CRIME_ID);
      }}
      style={({ pressed }) => [
        styles.allowButton,
        pressed && styles.buttonPressed,
      ]}
    >
      <Text style={styles.buttonText}>
        ALLOW POST
      </Text>
    </Pressable>
  ) : (
    <View style={styles.acceptedButton}>
      <Text style={styles.buttonText}>
        ACCEPTED
      </Text>
    </View>
  )}

  <Pressable
    onPress={() => {
      console.log(
        "DELETE BUTTON PRESSED:",
        item.CRIME_ID
      );

      confirmDelete(item.CRIME_ID);
    }}
    style={({ pressed }) => [
      styles.deleteButton,
      pressed && styles.buttonPressed,
    ]}
  >
    <Text style={styles.buttonText}>
      DELETE
    </Text>
  </Pressable>
        </View>
      </View>
    );
  };

  // ============================================================
  // MAIN SCREEN
  // ============================================================

  return (
    <SafeAreaView
      style={styles.container}
    >
      {/* ==================================================
          NAVBAR
      ================================================== */}

      <View style={styles.navbar}>
        <Text style={styles.navTitle}>
          Manage Reports
        </Text>

        <View
          style={styles.navButtons}
        >
          <Pressable
            style={styles.navButton}
            onPress={() =>
              router.push("/admin")
            }
          >
            <Text
              style={
                styles.navButtonText
              }
            >
              Dashboard
            </Text>
          </Pressable>

          <Pressable
            style={styles.logoutButton}
            onPress={logout}
          >
            <Text
              style={
                styles.navButtonText
              }
            >
              Logout
            </Text>
          </Pressable>
        </View>
      </View>

      {/* ==================================================
          SEARCH
      ================================================== */}

      <View
        style={styles.searchContainer}
      >
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search username, name, category, area..."
          placeholderTextColor="#777777"
          style={styles.searchInput}
        />

        <Pressable
          style={
            styles.refreshButton
          }
          onPress={loadReports}
          disabled={loading}
        >
          <Text
            style={styles.refreshText}
          >
            Refresh
          </Text>
        </Pressable>
      </View>

      {/* ==================================================
          TITLE
      ================================================== */}

      <View
        style={styles.titleContainer}
      >
        <Text style={styles.title}>
          All Reported Crimes
        </Text>

        <Text style={styles.count}>
          {filteredReports.length}{" "}
          reports
        </Text>
      </View>

      {/* ==================================================
          LIST
      ================================================== */}

      <FlatList
        data={filteredReports}
        keyExtractor={(item) =>
          String(item.CRIME_ID)
        }
        renderItem={renderReport}
        contentContainerStyle={
          styles.list
        }
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadReports}
          />
        }
        ListEmptyComponent={
          <View
            style={
              styles.emptyContainer
            }
          >
            <Text
              style={styles.emptyText}
            >
              No crime reports found.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f6f8",
  },

  navbar: {
    backgroundColor: "#111827",
    paddingHorizontal: 18,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  navTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },

  navButtons: {
    flexDirection: "row",
    gap: 8,
  },

  navButton: {
    backgroundColor: "#374151",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 7,
  },

  logoutButton: {
    backgroundColor: "#991b1b",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 7,
  },

  navButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },

  searchContainer: {
    flexDirection: "row",
    padding: 15,
    gap: 10,
    backgroundColor: "#ffffff",
  },

  searchInput: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 14,
    color: "#111827",
    backgroundColor: "#ffffff",
  },

  refreshButton: {
    height: 45,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
  },

  refreshText: {
    color: "#ffffff",
    fontWeight: "700",
  },

  titleContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  count: {
    color: "#6b7280",
    fontSize: 14,
  },

  list: {
    padding: 15,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
  },

  headerLeft: {
    flex: 1,
  },

  category: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  crimeId: {
    marginTop: 4,
    color: "#6b7280",
    fontSize: 13,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  pendingBadge: {
    backgroundColor: "#fef3c7",
  },

  acceptedBadge: {
    backgroundColor: "#dcfce7",
  },

  statusText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#111827",
  },

  section: {
    marginBottom: 12,
  },

  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6b7280",
    marginBottom: 3,
    textTransform: "uppercase",
  },

  value: {
    fontSize: 15,
    color: "#111827",
  },

  smallValue: {
    marginTop: 3,
    fontSize: 13,
    color: "#4b5563",
  },

  description: {
    fontSize: 14,
    lineHeight: 21,
    color: "#374151",
  },

  /* =========================================
     ACTION BUTTONS
  ========================================= */

  actions: {
    flexDirection: "row",
    width: "100%",
    marginTop: 15,
    gap: 10,
  },

  allowButton: {
    flex: 1,
    minHeight: 50,
    backgroundColor: "#16a34a",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  acceptedButton: {
    flex: 1,
    minHeight: 50,
    backgroundColor: "#6b7280",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  deleteButton: {
    flex: 1,
    minHeight: 50,
    backgroundColor: "#dc2626",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  buttonPressed: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },

  emptyContainer: {
    paddingVertical: 50,
    alignItems: "center",
  },

  emptyText: {
    color: "#6b7280",
    fontSize: 15,
  },
});