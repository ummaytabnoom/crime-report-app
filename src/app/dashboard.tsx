import { useCallback, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { router, useFocusEffect } from "expo-router";

import { COLORS } from "../constants/themes";
import { api, removeToken } from "../services/api";

type Page = "home" | "profile";

type Report = {
  crimeId?: number;
  CRIME_ID?: number;

  category?: string;
  CATEGORY?: string;

  description?: string;
  DESCRIPTION?: string;

  area?: string;
  AREA?: string;

  zilla?: string;
  ZILLA?: string;

  upazilla?: string;
  UPAZILLA?: string;

  policeStation?: string;
  POLICE_STATION?: string;

  status?: string;
  STATUS?: string;

  policeId?: string;
  POLICE_ID?: string;

  upgradedBy?: string;
  UPGRADED_BY?: string;
};

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);

  const [reports, setReports] = useState<Report[]>([]);

  const [search, setSearch] = useState("");

  const [activeTab, setActiveTab] =
    useState<"public" | "my">("public");

  const [page, setPage] =
    useState<Page>("home");

  const [loading, setLoading] = useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  /*
   * ==========================================
   * LOAD USER
   * ==========================================
   */

  async function loadUser() {
    try {
      const result = await api("/api/auth/me");

      console.log(
        "ME RESPONSE:",
        JSON.stringify(result, null, 2)
      );

      const currentUser =
        result?.data?.user ||
        result?.data ||
        null;

      setUser(currentUser);
    } catch (error: any) {
      console.log("USER ERROR:", error);

      const message =
        error?.message?.toLowerCase() || "";

      if (
        message.includes("401") ||
        message.includes("unauthorized")
      ) {
        await removeToken();

        Alert.alert(
          "Session Expired",
          "Please login again.",
          [
            {
              text: "OK",
              onPress: () =>
                router.replace("/"),
            },
          ]
        );
      }
    }
  }

  /*
   * ==========================================
   * LOAD REPORTS
   * ==========================================
   */

  async function loadReports() {
    try {
      setLoading(true);

      /*
       * PUBLIC REPORTS
       */

      if (activeTab === "public") {
        const endpoint = search.trim()
          ? `/api/reports?area=${encodeURIComponent(
              search.trim()
            )}`
          : "/api/reports";

        const result = await api(endpoint);

        console.log(
          "PUBLIC REPORT RESPONSE:",
          JSON.stringify(result, null, 2)
        );

        const list =
          Array.isArray(result?.data)
            ? result.data
            : Array.isArray(
                result?.data?.reports
              )
            ? result.data.reports
            : Array.isArray(result?.reports)
            ? result.reports
            : [];

        setReports(list);
      }

      /*
       * MY REPORTS
       */

      if (activeTab === "my") {
        const result = await api(
          "/api/crimes/my"
        );

        console.log(
          "MY REPORT RESPONSE:",
          JSON.stringify(result, null, 2)
        );

        const list =
          Array.isArray(result?.data)
            ? result.data
            : Array.isArray(
                result?.data?.reports
              )
            ? result.data.reports
            : Array.isArray(result?.reports)
            ? result.reports
            : [];

        setReports(list);
      }
    } catch (error: any) {
      console.log(
        "REPORT ERROR:",
        error
      );

      setReports([]);

      const message =
        error?.message?.toLowerCase() || "";

      /*
       * Do not show alert for missing route.
       */

      if (!message.includes("route not found")) {
        Alert.alert(
          "Reports",
          error?.message ||
            "Unable to load reports."
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  /*
   * ==========================================
   * LOAD EVERYTHING
   * ==========================================
   */

  async function loadData() {
    setRefreshing(true);

    try {
      await loadUser();
      await loadReports();
    } finally {
      setRefreshing(false);
    }
  }

  /*
   * ==========================================
   * WHEN DASHBOARD OPENS
   * ==========================================
   */

  useFocusEffect(
    useCallback(() => {
      loadUser();
      loadReports();
    }, [activeTab])
  );

  /*
   * ==========================================
   * LOGOUT
   * ==========================================
   */

  async function logout() {
    try {
      await api(
        "/api/logout",
        "POST"
      );
    } catch (error) {
      console.log(
        "Logout API error:",
        error
      );
    }

    await removeToken();

    router.replace("/");
  }

  /*
   * ==========================================
   * ROLE
   * ==========================================
   */

  const role = String(
    user?.ROLE ||
      user?.role ||
      "PUBLIC"
  ).toUpperCase();

  const isAdmin = role === "ADMIN";

  const isPolice = role === "POLICE";

  /*
   * ==========================================
   * RENDER
   * ==========================================
   */

  return (
    <View style={styles.screen}>

      {/* ======================================
          TOP NAVBAR
      ======================================= */}

      <View style={styles.navbar}>

        <Pressable
          style={styles.menuButton}
          onPress={() =>
            Alert.alert(
              "Crime Report",
              "Navigation menu"
            )
          }
        >
          <Text style={styles.menuIcon}>
            ☰
          </Text>
        </Pressable>

        <View style={styles.navTitleBox}>

          <Text style={styles.navTitle}>
            Crime Report
          </Text>

          <Text style={styles.navSubtitle}>
            COMMUNITY SAFETY
          </Text>

        </View>

        <Pressable
          style={styles.navProfile}
          onPress={() =>
            setPage("profile")
          }
        >
          <Text style={styles.navProfileText}>
            👤
          </Text>
        </Pressable>

      </View>

      {/* ======================================
          MAIN SCROLL AREA
      ======================================= */}

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={
          styles.scrollContent
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadData}
          />
        }
      >

        {/* ====================================
            HOME
        ===================================== */}

        {page === "home" && (
          <>

            {/* WELCOME CARD */}

            <View style={styles.welcomeCard}>

              <View style={styles.welcomeLeft}>

                <Text style={styles.welcomeSmall}>
                  Welcome back
                </Text>

                <Text style={styles.welcomeName}>
                  {user?.FULL_NAME ||
                    user?.fullName ||
                    user?.USER_NAME ||
                    "User"}
                </Text>

              </View>

              <View style={styles.roleBadge}>

                <Text
                  style={styles.roleBadgeText}
                >
                  {role}
                </Text>

              </View>

            </View>

            {/* ==================================
                ADMIN / POLICE MANAGEMENT
            =================================== */}

            {(isAdmin || isPolice) && (
              <View style={styles.management}>

                <Text
                  style={styles.managementTitle}
                >
                  Management
                </Text>

                <View
                  style={styles.managementRow}
                >

                  {isAdmin && (
                    <Pressable
                      style={[
                        styles.managementButton,
                        styles.adminButton,
                      ]}
                      onPress={() =>
                        router.push("/admin")
                      }
                    >

                      <Text
                        style={
                          styles.managementIcon
                        }
                      >
                        ⚙
                      </Text>

                      <Text
                        style={
                          styles.managementText
                        }
                      >
                        Admin Panel
                      </Text>

                    </Pressable>
                  )}

                  {isPolice && (
                    <Pressable
                      style={[
                        styles.managementButton,
                        styles.policeButton,
                      ]}
                      onPress={() =>
                        router.push("/police")
                      }
                    >

                      <Text
                        style={
                          styles.managementIcon
                        }
                      >
                        👮
                      </Text>

                      <Text
                        style={
                          styles.managementText
                        }
                      >
                        Police Panel
                      </Text>

                    </Pressable>
                  )}

                </View>

              </View>
            )}

            {/* ==================================
                PUBLIC / MY REPORTS TOGGLE
            =================================== */}

            <View style={styles.toggle}>

              <Pressable
                style={[
                  styles.toggleItem,
                  activeTab === "public" &&
                    styles.toggleActive,
                ]}
                onPress={() =>
                  setActiveTab("public")
                }
              >

                <Text
                  style={[
                    styles.toggleText,
                    activeTab === "public" &&
                      styles.toggleTextActive,
                  ]}
                >
                  Public Reports
                </Text>

              </Pressable>

              <Pressable
                style={[
                  styles.toggleItem,
                  activeTab === "my" &&
                    styles.toggleActive,
                ]}
                onPress={() =>
                  setActiveTab("my")
                }
              >

                <Text
                  style={[
                    styles.toggleText,
                    activeTab === "my" &&
                      styles.toggleTextActive,
                  ]}
                >
                  My Reports
                </Text>

              </Pressable>

            </View>

            {/* ==================================
                SEARCH
            =================================== */}

            {activeTab === "public" && (
              <>
                <View style={styles.searchBox}>

                  <Text
                    style={styles.searchIcon}
                  >
                    🔍
                  </Text>

                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search reports by area..."
                    placeholderTextColor="#999"
                    value={search}
                    onChangeText={setSearch}
                    returnKeyType="search"
                    onSubmitEditing={
                      loadReports
                    }
                  />

                  {search.length > 0 && (
                    <Pressable
                      onPress={() => {
                        setSearch("");
                        setTimeout(
                          loadReports,
                          0
                        );
                      }}
                    >
                      <Text
                        style={styles.clear}
                      >
                        ✕
                      </Text>
                    </Pressable>
                  )}

                </View>

                <Pressable
                  style={styles.searchButton}
                  onPress={loadReports}
                >
                  <Text
                    style={
                      styles.searchButtonText
                    }
                  >
                    SEARCH
                  </Text>
                </Pressable>
              </>
            )}

            {/* ==================================
                REPORT HEADER
            =================================== */}

            <View style={styles.reportHeader}>

              <View>

                <Text
                  style={styles.reportTitle}
                >
                  {activeTab === "public"
                    ? "Approved Crime Reports"
                    : "My Reports"}
                </Text>

                <Text
                  style={
                    styles.reportSubtitle
                  }
                >
                  {activeTab === "public"
                    ? "Reports approved by administration"
                    : "Reports submitted by you"}
                </Text>

              </View>

              <View
                style={styles.countBadge}
              >
                <Text
                  style={styles.countText}
                >
                  {reports.length}
                </Text>
              </View>

            </View>

            {/* ==================================
                LOADING
            =================================== */}

            {loading && (
              <View
                style={styles.loadingBox}
              >

                <ActivityIndicator />

                <Text
                  style={styles.loadingText}
                >
                  Loading reports...
                </Text>

              </View>
            )}

            {/* ==================================
                EMPTY
            =================================== */}

            {!loading &&
              reports.length === 0 && (
                <View
                  style={styles.emptyBox}
                >

                  <Text
                    style={styles.emptyIcon}
                  >
                    📋
                  </Text>

                  <Text
                    style={styles.emptyTitle}
                  >
                    No reports found
                  </Text>

                  <Text
                    style={styles.emptyText}
                  >
                    {activeTab === "public"
                      ? "Approved crime reports will appear here."
                      : "Your submitted reports will appear here."}
                  </Text>

                </View>
              )}

            {/* ==================================
                REPORT CARDS
            =================================== */}

            {!loading &&
              reports.map(
                (report, index) => (
                  <ReportCard
                    key={
                      report.CRIME_ID ||
                      report.crimeId ||
                      index
                    }
                    report={report}
                  />
                )
              )}

          </>
        )}

        {/* ====================================
            PROFILE
        ===================================== */}

        {page === "profile" && (
          <ProfileContent
            user={user}
            onLogout={logout}
          />
        )}

      </ScrollView>

      {/* ======================================
          BOTTOM NAVIGATION

          HOME / REPORT / PROFILE
      ======================================= */}

      <View style={styles.bottomNav}>

        <BottomButton
          icon="⌂"
          label="Home"
          active={page === "home"}
          onPress={() =>
            setPage("home")
          }
        />

        <BottomButton
          icon="＋"
          label="Report"
          onPress={() =>
            router.push("/new-report")
          }
        />

        <BottomButton
          icon="👤"
          label="Profile"
          active={page === "profile"}
          onPress={() =>
            setPage("profile")
          }
        />

      </View>

    </View>
  );
}


/* =================================================
   REPORT CARD
================================================= */

function ReportCard({
  report,
}: {
  report: Report;
}) {
  const category =
    report.category ||
    report.CATEGORY ||
    "Crime Report";

  const description =
    report.description ||
    report.DESCRIPTION ||
    "No description available.";

  const area =
    report.area ||
    report.AREA ||
    "Not provided";

  const zilla =
    report.zilla ||
    report.ZILLA ||
    "";

  const upazilla =
    report.upazilla ||
    report.UPAZILLA ||
    "";

  const station =
    report.policeStation ||
    report.POLICE_STATION ||
    "";

  const status =
    report.status ||
    report.STATUS ||
    "Pending";

  const policeId =
    report.policeId ||
    report.POLICE_ID;

  const investigator =
    report.upgradedBy ||
    report.UPGRADED_BY;

  return (
    <View style={styles.reportCard}>

      <View style={styles.reportTop}>

        <View style={styles.reportIcon}>
          <Text
            style={styles.reportIconText}
          >
            ⚠
          </Text>
        </View>

        <View style={styles.reportInfo}>

          <Text style={styles.category}>
            {category}
          </Text>

          <Text style={styles.area}>
            {area}
          </Text>

        </View>

        <View style={styles.statusBadge}>

          <Text style={styles.statusText}>
            {status}
          </Text>

        </View>

      </View>

      <Text
        style={styles.description}
        numberOfLines={4}
      >
        {description}
      </Text>

      <View style={styles.divider} />

      <View style={styles.locationRow}>

        <Text
          style={styles.locationIcon}
        >
          📍
        </Text>

        <View>

          <Text
            style={styles.locationLabel}
          >
            Location
          </Text>

          <Text style={styles.location}>
            {zilla}
            {upazilla
              ? `, ${upazilla}`
              : ""}
          </Text>

          {station ? (
            <Text style={styles.station}>
              Police Station: {station}
            </Text>
          ) : null}

        </View>

      </View>

      {policeId && (
        <Text style={styles.extra}>
          Police ID: {policeId}
        </Text>
      )}

      {investigator && (
        <Text style={styles.extra}>
          Investigated by: {investigator}
        </Text>
      )}

    </View>
  );
}


/* =================================================
   PROFILE
================================================= */

function ProfileContent({
  user,
  onLogout,
}: {
  user: any;
  onLogout: () => Promise<void>;
}) {
  const name =
    user?.FULL_NAME ||
    user?.fullName ||
    user?.USER_NAME ||
    "User";

  const role = String(
    user?.ROLE ||
      user?.role ||
      "PUBLIC"
  ).toUpperCase();

  function confirmLogout() {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: onLogout,
        },
      ]
    );
  }

  return (
    <View>

      <Text style={styles.pageTitle}>
        My Profile
      </Text>

      <Text style={styles.pageSubtitle}>
        Your account information
      </Text>

      {/* PROFILE HEADER */}

      <View style={styles.profileCard}>

        <View style={styles.avatar}>

          <Text style={styles.avatarText}>
            {name
              .charAt(0)
              .toUpperCase()}
          </Text>

        </View>

        <Text style={styles.profileName}>
          {name}
        </Text>

        <Text style={styles.profileRole}>
          {role}
        </Text>

      </View>

      {/* PROFILE INFORMATION */}

      <View style={styles.profileInfo}>

        <ProfileRow
          label="Full Name"
          value={user?.FULL_NAME}
        />

        <ProfileRow
          label="Username"
          value={user?.USER_NAME}
        />

        <ProfileRow
          label="Email"
          value={user?.EMAIL}
        />

        <ProfileRow
          label="Mobile"
          value={user?.MOBILE}
        />

        <ProfileRow
          label="Date of Birth"
          value={user?.DOB}
        />

        <ProfileRow
          label="Police ID"
          value={
            user?.POLICE_ID ||
            "Not assigned"
          }
        />

        <ProfileRow
          label="Role"
          value={role}
        />

      </View>

      {/* EDIT PROFILE */}

      <Pressable
        style={styles.editProfile}
        onPress={() =>
          router.push("/profile")
        }
      >
        <Text
          style={styles.editProfileText}
        >
          Edit Profile
        </Text>
      </Pressable>

      {/* LOGOUT */}

      <Pressable
        style={styles.logoutButton}
        onPress={confirmLogout}
      >
        <Text style={styles.logoutText}>
          Logout
        </Text>
      </Pressable>

    </View>
  );
}


/* =================================================
   PROFILE ROW
================================================= */

function ProfileRow({
  label,
  value,
}: {
  label: string;
  value?: any;
}) {
  return (
    <View style={styles.profileRow}>

      <Text
        style={styles.profileLabel}
      >
        {label}
      </Text>

      <Text
        style={styles.profileValue}
      >
        {value || "Not provided"}
      </Text>

    </View>
  );
}


/* =================================================
   BOTTOM BUTTON
================================================= */

function BottomButton({
  icon,
  label,
  active,
  onPress,
}: {
  icon: string;
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={styles.bottomButton}
      onPress={onPress}
    >

      <Text
        style={[
          styles.bottomIcon,
          active &&
            styles.bottomActive,
        ]}
      >
        {icon}
      </Text>

      <Text
        style={[
          styles.bottomLabel,
          active &&
            styles.bottomActive,
        ]}
      >
        {label}
      </Text>

    </Pressable>
  );
}


/* =================================================
   STYLES
================================================= */

const styles = StyleSheet.create({

  /* ============================
     SCREEN
  ============================ */

  screen: {
    flex: 1,
    backgroundColor:
      COLORS.background,
  },

  /* ============================
     NAVBAR
  ============================ */

  navbar: {
    height: 68,
    backgroundColor:
      COLORS.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    elevation: 6,
  },

  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor:
      "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  menuIcon: {
    color: "#fff",
    fontSize: 22,
  },

  navTitleBox: {
    flex: 1,
    marginLeft: 12,
  },

  navTitle: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "900",
  },

  navSubtitle: {
    color:
      "rgba(255,255,255,0.7)",
    fontSize: 9,
    fontWeight: "700",
    marginTop: 2,
  },

  navProfile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  navProfileText: {
    fontSize: 19,
  },

  /* ============================
     SCROLL
  ============================ */

  scroll: {
    flex: 1,
  },

  scrollContent: {
    padding: 15,
    paddingBottom: 100,
  },

  /* ============================
     WELCOME
  ============================ */

  welcomeCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
    marginBottom: 15,
    elevation: 2,
  },

  welcomeLeft: {
    flex: 1,
  },

  welcomeSmall: {
    color: COLORS.muted,
    fontSize: 12,
  },

  welcomeName: {
    color: COLORS.primary,
    fontSize: 21,
    fontWeight: "900",
    marginTop: 3,
  },

  roleBadge: {
    backgroundColor:
      COLORS.secondary,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 20,
  },

  roleBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "900",
  },

  /* ============================
     MANAGEMENT
  ============================ */

  management: {
    marginBottom: 15,
  },

  managementTitle: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 7,
  },

  managementRow: {
    flexDirection: "row",
    gap: 10,
  },

  managementButton: {
    flex: 1,
    minHeight: 65,
    borderRadius: 13,
    padding: 12,
    justifyContent:
      "center",
  },

  adminButton: {
    backgroundColor:
      COLORS.primary,
  },

  policeButton: {
    backgroundColor:
      COLORS.secondary,
  },

  managementIcon: {
    fontSize: 19,
    marginBottom: 3,
  },

  managementText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "900",
  },

  /* ============================
     TOGGLE
  ============================ */

  toggle: {
    flexDirection: "row",
    backgroundColor:
      "#E7EAED",
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
  },

  toggleItem: {
    flex: 1,
    paddingVertical: 11,
    alignItems: "center",
    borderRadius: 9,
  },

  toggleActive: {
    backgroundColor: "#fff",
    elevation: 2,
  },

  toggleText: {
    color: COLORS.muted,
    fontSize: 13,
    fontWeight: "700",
  },

  toggleTextActive: {
    color: COLORS.primary,
    fontWeight: "900",
  },

  /* ============================
     SEARCH
  ============================ */

  searchBox: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  searchIcon: {
    fontSize: 17,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    color: "#222",
    fontSize: 14,
  },

  clear: {
    color: COLORS.muted,
    fontSize: 16,
  },

  searchButton: {
    backgroundColor:
      COLORS.primary,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },

  searchButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "900",
  },

  /* ============================
     REPORT HEADER
  ============================ */

  reportHeader: {
    marginTop: 21,
    marginBottom: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  reportTitle: {
    color: COLORS.primary,
    fontSize: 19,
    fontWeight: "900",
  },

  reportSubtitle: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 2,
  },

  countBadge: {
    backgroundColor:
      COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  countText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "900",
  },

  /* ============================
     REPORT CARD
  ============================ */

  reportCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
  },

  reportTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  reportIcon: {
    width: 43,
    height: 43,
    borderRadius: 12,
    backgroundColor:
      "#F0F2F4",
    alignItems: "center",
    justifyContent: "center",
  },

  reportIconText: {
    fontSize: 20,
  },

  reportInfo: {
    flex: 1,
    marginLeft: 10,
  },

  category: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "900",
  },

  area: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 2,
  },

  statusBadge: {
    backgroundColor:
      "#EEF5F0",
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  statusText: {
    color: COLORS.secondary,
    fontSize: 10,
    fontWeight: "900",
  },

  description: {
    color: "#333",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 12,
  },

  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 12,
  },

  locationRow: {
    flexDirection: "row",
  },

  locationIcon: {
    fontSize: 17,
    marginRight: 8,
  },

  locationLabel: {
    color: COLORS.muted,
    fontSize: 10,
    fontWeight: "700",
  },

  location: {
    color: "#333",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
  },

  station: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 2,
  },

  extra: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 7,
  },

  /* ============================
     LOADING / EMPTY
  ============================ */

  loadingBox: {
    backgroundColor: "#fff",
    borderRadius: 13,
    padding: 25,
    alignItems: "center",
  },

  loadingText: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 8,
  },

  emptyBox: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 35,
    alignItems: "center",
  },

  emptyIcon: {
    fontSize: 32,
  },

  emptyTitle: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: "900",
    marginTop: 8,
  },

  emptyText: {
    color: COLORS.muted,
    fontSize: 11,
    textAlign: "center",
    marginTop: 5,
  },

  /* ============================
     PROFILE
  ============================ */

  pageTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.primary,
    marginTop: 5,
  },

  pageSubtitle: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 3,
    marginBottom: 18,
  },

  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 25,
    alignItems: "center",
    elevation: 2,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor:
      COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "900",
  },

  profileName: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: "900",
    marginTop: 12,
  },

  profileRole: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: "800",
    marginTop: 4,
  },

  profileInfo: {
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingHorizontal: 15,
    marginTop: 15,
    elevation: 2,
  },

  profileRow: {
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  profileLabel: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: "700",
  },

  profileValue: {
    color: "#222",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 3,
  },

  editProfile: {
    backgroundColor:
      COLORS.primary,
    borderRadius: 11,
    padding: 14,
    alignItems: "center",
    marginTop: 15,
  },

  editProfileText: {
    color: "#fff",
    fontWeight: "900",
  },

  /* ============================
     LOGOUT
  ============================ */

  logoutButton: {
    backgroundColor: "#D32F2F",
    borderRadius: 11,
    padding: 14,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },

  logoutText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 15,
  },

  /* ============================
     BOTTOM NAV
  ============================ */

  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    elevation: 10,
  },

  bottomButton: {
    alignItems: "center",
    justifyContent: "center",
    minWidth: 70,
  },

  bottomIcon: {
    fontSize: 20,
    color: COLORS.muted,
  },

  bottomLabel: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: "700",
    marginTop: 3,
  },

  bottomActive: {
    color: COLORS.primary,
  },

});