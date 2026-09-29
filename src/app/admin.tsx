import { useCallback, useState } from "react";

import {
  Alert,
  Image,
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

import { COLORS } from "../constants/themes";

export default function AdminPanel() {
  const [reports, setReports] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  /*
   * ==========================================
   * LOAD ADMIN INFORMATION
   * ==========================================
   */

  async function loadAdminInfo() {
    try {
      const result = await api("/api/auth/me");

      console.log(
        "ADMIN USER:",
        JSON.stringify(result, null, 2)
      );

      const user =
        result?.data?.user ||
        result?.data ||
        null;

      setCurrentUser(user);
    } catch (error) {
      console.log(
        "ADMIN INFO ERROR:",
        error
      );
    }
  }

  /*
   * ==========================================
   * LOAD REPORTS + USERS
   * ==========================================
   */

  async function loadData() {
    try {
      const reportResult = await api(
        `/api/admin/reports?q=${encodeURIComponent(
          search
        )}`
      );

      const userResult = await api(
        `/api/admin/users?q=${encodeURIComponent(
          search
        )}`
      );

      console.log(
        "ADMIN REPORTS:",
        JSON.stringify(reportResult, null, 2)
      );

      console.log(
        "ADMIN USERS:",
        JSON.stringify(userResult, null, 2)
      );

      const reportList =
        Array.isArray(reportResult?.data)
          ? reportResult.data
          : Array.isArray(
              reportResult?.data?.reports
            )
          ? reportResult.data.reports
          : Array.isArray(
              reportResult?.reports
            )
          ? reportResult.reports
          : [];

      const userList =
        Array.isArray(userResult?.data)
          ? userResult.data
          : Array.isArray(
              userResult?.data?.users
            )
          ? userResult.data.users
          : Array.isArray(
              userResult?.users
            )
          ? userResult.users
          : [];

      setReports(reportList);
      setUsers(userList);
    } catch (error: any) {
      console.log(
        "ADMIN DATA ERROR:",
        error
      );

      Alert.alert(
        "Admin Error",
        error?.message ||
          "Unable to load admin data."
      );

      setReports([]);
      setUsers([]);
    }
  }

  /*
   * ==========================================
   * LOAD WHEN PAGE OPENS
   * ==========================================
   */

  useFocusEffect(
    useCallback(() => {
      loadAdminInfo();
      loadData();
    }, [search])
  );

  /*
   * ==========================================
   * APPROVE REPORT
   * ==========================================
   */

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
      Alert.alert(
        "Error",
        error?.message ||
          "Unable to approve report."
      );
    }
  }

  /*
   * ==========================================
   * DELETE REPORT
   * ==========================================
   */

  function deleteReport(
    crimeId: number
  ) {
    Alert.alert(
      "Delete Report",
      "Are you sure you want to delete this report?",
      [
        {
          text: "Cancel",
          style: "cancel",
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

              Alert.alert(
                "Deleted",
                "Report deleted."
              );

              loadData();
            } catch (error: any) {
              Alert.alert(
                "Error",
                error?.message ||
                  "Unable to delete report."
              );
            }
          },
        },
      ]
    );
  }

  /*
   * ==========================================
   * PROMOTE USER
   * ==========================================
   */

  async function promoteUser(
    id: number
  ) {
    try {
      await api(
        `/api/admin/users/${id}/promote`,
        "POST"
      );

      Alert.alert(
        "Success",
        "User promoted to admin."
      );

      loadData();
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.message ||
          "Unable to promote user."
      );
    }
  }

  /*
   * ==========================================
   * DELETE USER
   * ==========================================
   */

  function deleteUser(id: number) {
    Alert.alert(
      "Delete User",
      "Are you sure you want to delete this user?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",

          onPress: async () => {
            try {
              await api(
                `/api/admin/users/${id}/delete`,
                "POST"
              );

              Alert.alert(
                "Deleted",
                "User deleted."
              );

              loadData();
            } catch (error: any) {
              Alert.alert(
                "Error",
                error?.message ||
                  "Unable to delete user."
              );
            }
          },
        },
      ]
    );
  }

  /*
   * ==========================================
   * LOGOUT
   * ==========================================
   */

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
          onPress: async () => {
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
          },
        },
      ]
    );
  }

  /*
   * ==========================================
   * PROFILE PICTURE
   * ==========================================
   */

  const profilePicture =
    currentUser?.PROFILE_PICTURE ||
    currentUser?.profilePicture ||
    null;

  const username =
    currentUser?.USER_NAME ||
    currentUser?.userName ||
    currentUser?.FULL_NAME ||
    "Admin";

  return (
    <View style={styles.screen}>

      {/* ======================================
          NAVBAR
      ======================================= */}

      <View style={styles.navbar}>

        <View style={styles.userInfo}>

          {profilePicture ? (
            <Image
              source={{
                uri: profilePicture,
              }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.defaultAvatar}>
              <Text
                style={styles.avatarText}
              >
                {String(username)
                  .charAt(0)
                  .toUpperCase()}
              </Text>
            </View>
          )}

          <Text
            style={styles.username}
            numberOfLines={1}
          >
            {username}
          </Text>

        </View>

        <Pressable
          style={styles.menuIcon}
          onPress={() =>
            setMenuOpen(!menuOpen)
          }
        >
          <Text
            style={styles.menuIconText}
          >
            ☰
          </Text>
        </Pressable>

        {menuOpen && (
          <View style={styles.dropdown}>

            <Pressable
              style={styles.dropdownItem}
              onPress={() => {
                setMenuOpen(false);
                router.push("/profile");
              }}
            >
              <Text
                style={styles.dropdownText}
              >
                Settings
              </Text>
            </Pressable>

            <Pressable
              style={styles.dropdownItem}
              onPress={() => {
                setMenuOpen(false);
                confirmLogout();
              }}
            >
              <Text
                style={[
                  styles.dropdownText,
                  styles.logoutDropdownText,
                ]}
              >
                Logout
              </Text>
            </Pressable>

          </View>
        )}

      </View>

      {/* ======================================
          CONTENT
      ======================================= */}

      <ScrollView
        style={styles.container}
        contentContainerStyle={
          styles.content
        }
      >

        {/* ====================================
            USER DASHBOARD BUTTON
        ===================================== */}

        <Pressable
          style={styles.dashboardButton}
          onPress={() =>
            router.push("/dashboard")
          }
        >
          <Text
            style={styles.dashboardButtonText}
          >
            User Dashboard
          </Text>
        </Pressable>

        {/* ====================================
            WELCOME
        ===================================== */}

        <View style={styles.welcomeBox}>

          <Text style={styles.welcomeTitle}>
            Welcome
          </Text>

          <Text
            style={styles.welcomeName}
          >
            {username}!
          </Text>

        </View>

        {/* ====================================
            SEARCH
        ===================================== */}

        <TextInput
          style={styles.search}
          placeholder="Search full name or username"
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />

        {/* ====================================
            MAIN ACTION BUTTONS
        ===================================== */}

        <View style={styles.actionGrid}>

          <Pressable
            style={styles.actionButton}
            onPress={() =>
              router.push("/user-manage")
            }
          >
            <Text
              style={styles.actionIcon}
            >
              👥
            </Text>

            <Text
              style={styles.actionButtonText}
            >
              Manage Users
            </Text>
          </Pressable>

          <Pressable
            style={styles.actionButton}
            onPress={() =>
              router.push("/report-manage")
            }
          >
            <Text
              style={styles.actionIcon}
            >
              📋
            </Text>

            <Text
              style={styles.actionButtonText}
            >
              Manage Reports
            </Text>
          </Pressable>

          <Pressable
            style={styles.actionButton}
            onPress={() =>
              router.push(
                "/directory?kind=admins"
              )
            }
          >
            <Text
              style={styles.actionIcon}
            >
              👤
            </Text>

            <Text
              style={styles.actionButtonText}
            >
              All Admin Information
            </Text>
          </Pressable>

          <Pressable
            style={styles.actionButton}
            onPress={() =>
              router.push(
                "/directory?kind=police"
              )
            }
          >
            <Text
              style={styles.actionIcon}
            >
              👮
            </Text>

            <Text
              style={styles.actionButtonText}
            >
              All Police Information
            </Text>
          </Pressable>

        </View>

        {/* ====================================
            LOGOUT
        ===================================== */}

        <Pressable
          style={styles.logoutButton}
          onPress={confirmLogout}
        >
          <Text
            style={styles.logoutText}
          >
            LOGOUT
          </Text>
        </Pressable>

        {/* ====================================
            REPORTS
        ===================================== */}

        <Text style={styles.section}>
          Reports
        </Text>

        {reports.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text
              style={styles.emptyText}
            >
              No reports found.
            </Text>
          </View>
        ) : (
          reports.map((report, index) => {

            const crimeId =
              report.crimeId ||
              report.CRIME_ID ||
              index;

            const category =
              report.category ||
              report.CATEGORY ||
              "Crime Report";

            const description =
              report.description ||
              report.DESCRIPTION ||
              "";

            const fullName =
              report.fullName ||
              report.FULL_NAME ||
              "";

            const userName =
              report.userName ||
              report.USER_NAME ||
              "";

            const area =
              report.area ||
              report.AREA ||
              "";

            const accepted =
              report.accepted ||
              report.ACCEPTED ||
              report.status ||
              report.STATUS ||
              "Pending";

            return (
              <View
                style={styles.card}
                key={crimeId}
              >

                <Text
                  style={styles.cardTitle}
                >
                  {category}
                </Text>

                <Text
                  style={styles.description}
                >
                  {description}
                </Text>

                <Text
                  style={styles.info}
                >
                  User: {fullName}
                </Text>

                <Text
                  style={styles.info}
                >
                  Username: @{userName}
                </Text>

                <Text
                  style={styles.info}
                >
                  Area: {area}
                </Text>

                <Text
                  style={styles.info}
                >
                  Status: {accepted}
                </Text>

                <View
                  style={styles.actionRow}
                >

                  <Pressable
                    style={styles.allow}
                    onPress={() =>
                      allowReport(
                        Number(crimeId)
                      )
                    }
                  >
                    <Text
                      style={styles.actionText}
                    >
                      ALLOW
                    </Text>
                  </Pressable>

                  <Pressable
                    style={styles.delete}
                    onPress={() =>
                      deleteReport(
                        Number(crimeId)
                      )
                    }
                  >
                    <Text
                      style={styles.actionText}
                    >
                      DELETE
                    </Text>
                  </Pressable>

                </View>

              </View>
            );
          })
        )}

        {/* ====================================
            USERS
        ===================================== */}

        <Text style={styles.section}>
          Users
        </Text>

        {users.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text
              style={styles.emptyText}
            >
              No users found.
            </Text>
          </View>
        ) : (
          users.map((user, index) => {

            const id =
              user.id ||
              user.ID ||
              index;

            const fullName =
              user.fullName ||
              user.FULL_NAME ||
              "";

            const userName =
              user.userName ||
              user.USER_NAME ||
              "";

            const email =
              user.email ||
              user.EMAIL ||
              "";

            const role =
              user.role ||
              user.ROLE ||
              "PUBLIC";

            return (
              <View
                style={styles.card}
                key={id}
              >

                <Text
                  style={styles.cardTitle}
                >
                  {fullName}
                </Text>

                <Text>
                  @{userName}
                </Text>

                <Text
                  style={styles.info}
                >
                  {email}
                </Text>

                <Text
                  style={styles.info}
                >
                  Role: {role}
                </Text>

                {String(role).toUpperCase() !==
                  "ADMIN" && (
                  <Pressable
                    style={styles.allow}
                    onPress={() =>
                      promoteUser(
                        Number(id)
                      )
                    }
                  >
                    <Text
                      style={styles.actionText}
                    >
                      MAKE ADMIN
                    </Text>
                  </Pressable>
                )}

                <Pressable
                  style={styles.delete}
                  onPress={() =>
                    deleteUser(
                      Number(id)
                    )
                  }
                >
                  <Text
                    style={styles.actionText}
                  >
                    DELETE USER
                  </Text>
                </Pressable>

              </View>
            );
          })
        )}

      </ScrollView>

    </View>
  );
}


/* =================================================
   STYLES
================================================= */

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  /*
   * NAVBAR
   */

  navbar: {
    height: 68,
    backgroundColor: "#FF8C00",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    elevation: 6,
    zIndex: 100,
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  profileImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: "#fff",
  },

  defaultAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#005F5F",
    fontSize: 20,
    fontWeight: "900",
  },

  username: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "900",
    marginLeft: 10,
    maxWidth: 220,
  },

  menuIcon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },

  menuIconText: {
    color: "#fff",
    fontSize: 29,
    fontWeight: "900",
  },

  /*
   * DROPDOWN
   */

  dropdown: {
    position: "absolute",
    top: 58,
    right: 16,
    backgroundColor: "#fff",
    width: 190,
    borderRadius: 8,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    zIndex: 999,
    overflow: "hidden",
  },

  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  dropdownText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "700",
  },

  logoutDropdownText: {
    color: "#D32F2F",
  },

  /*
   * CONTENT
   */

  container: {
    flex: 1,
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  /*
   * USER DASHBOARD
   */

  dashboardButton: {
    backgroundColor: "#005F5F",
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderRadius: 9,
    alignSelf: "flex-end",
    marginBottom: 18,
  },

  dashboardButtonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 13,
  },

  /*
   * WELCOME
   */

  welcomeBox: {
    alignItems: "center",
    marginBottom: 20,
  },

  welcomeTitle: {
    color: "#222",
    fontSize: 17,
    fontWeight: "700",
  },

  welcomeName: {
    color: "#222",
    fontSize: 25,
    fontWeight: "900",
    marginTop: 2,
  },

  /*
   * SEARCH
   */

  search: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 13,
    fontSize: 14,
    color: COLORS.text,
  },

  /*
   * ACTION BUTTONS
   */

  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },

  actionButton: {
    width: "48%",
    minHeight: 125,
    backgroundColor: "#005F5F",
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    elevation: 4,
  },

  actionIcon: {
    fontSize: 28,
    marginBottom: 10,
  },

  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center",
  },

  /*
   * LOGOUT
   */

  logoutButton: {
    backgroundColor: "#D32F2F",
    padding: 14,
    borderRadius: 10,
    marginTop: 18,
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
  },

  /*
   * SECTIONS
   */

  section: {
    fontSize: 20,
    fontWeight: "900",
    color: COLORS.primary,
    marginTop: 28,
    marginBottom: 10,
  },

  /*
   * CARDS
   */

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: COLORS.primary,
    marginBottom: 5,
  },

  description: {
    color: "#333",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 5,
  },

  info: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 6,
  },

  /*
   * ACTIONS
   */

  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },

  allow: {
    flex: 1,
    backgroundColor: COLORS.success,
    padding: 11,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },

  delete: {
    flex: 1,
    backgroundColor: COLORS.danger,
    padding: 11,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },

  actionText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 12,
  },

  /*
   * EMPTY
   */

  emptyCard: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 12,
    alignItems: "center",
  },

  emptyText: {
    color: COLORS.muted,
    fontSize: 13,
  },

});