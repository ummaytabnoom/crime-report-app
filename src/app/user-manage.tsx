import {
    useEffect,
    useState,
} from "react";

import {
    ActivityIndicator,
    Alert,
    FlatList,
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    api,
    removeToken,
} from "../services/api";

import {
    router,
} from "expo-router";

type User = {
  ID: number;
  FULL_NAME: string;
  USER_NAME: string;
  EMAIL: string;
  DOB?: string | null;
  MOBILE?: string | null;
  ROLE?: string | null;
  POLICE_ID?: string | null;
  PROFILE_PICTURE?: string | null;
};

export default function ManageUser() {
  const [users, setUsers] =
    useState<User[]>([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [upgradingId, setUpgradingId] =
    useState<number | null>(null);

  // ============================================================
  // LOAD USERS
  // ============================================================

  const loadUsers = async (
    searchText = ""
  ) => {
    try {
      setLoading(true);

      const q =
        searchText.trim();

      const endpoint = q
        ? `/api/admin/users?q=${encodeURIComponent(q)}`
        : `/api/admin/users`;

      console.log(
        "GET USERS:",
        endpoint
      );

      const result = await api(
        endpoint,
        "GET"
      );

      console.log(
        "GET USERS RESPONSE:",
        JSON.stringify(
          result,
          null,
          2
        )
      );

      const rows =
        Array.isArray(result?.data)
          ? result.data
          : [];

      setUsers(rows);
    } catch (error: any) {
      console.log(
        "GET USERS ERROR:",
        error
      );

      Alert.alert(
        "Failed",
        error?.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    loadUsers();
  }, []);

  // ============================================================
  // SEARCH
  // ============================================================

  useEffect(() => {
    const timer =
      setTimeout(() => {
        loadUsers(search);
      }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  // ============================================================
  // UPGRADE POLICE TO ADMIN
  // ============================================================

  const upgradeToAdmin = (
    user: User
  ) => {
    Alert.alert(
      "Upgrade User",
      `Upgrade ${user.FULL_NAME} (${user.USER_NAME}) from police to admin?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Upgrade",
          onPress: async () => {
            try {
              setUpgradingId(
                user.ID
              );

              console.log(
                "UPGRADE USER ID:",
                user.ID
              );

              const result =
                await api(
                  `/api/admin/users/${user.ID}/role`,
                  "PATCH"
                );

              console.log(
                "UPGRADE RESPONSE:",
                JSON.stringify(
                  result,
                  null,
                  2
                )
              );

              Alert.alert(
                "Success",
                `${user.USER_NAME} is now an admin.`
              );

              await loadUsers(
                search
              );
            } catch (
              error: any
            ) {
              console.log(
                "UPGRADE ERROR:",
                error
              );

              Alert.alert(
                "Upgrade Failed",
                error?.message ||
                  "Failed to upgrade user."
              );
            } finally {
              setUpgradingId(
                null
              );
            }
          },
        },
      ]
    );
  };

  // ============================================================
  // DELETE USER
  // ============================================================

  const deleteUser = (
    user: User
  ) => {
    Alert.alert(
      "Delete User",
      `Delete ${user.FULL_NAME} (${user.USER_NAME})?`,
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
              setLoading(true);

              console.log(
                "DELETE USER ID:",
                user.ID
              );

              const result =
                await api(
                  `/api/admin/users/${user.ID}`,
                  "DELETE"
                );

              console.log(
                "DELETE USER RESPONSE:",
                JSON.stringify(
                  result,
                  null,
                  2
                )
              );

              Alert.alert(
                "Deleted",
                "User has been deleted."
              );

              await loadUsers(
                search
              );
            } catch (
              error: any
            ) {
              console.log(
                "DELETE USER ERROR:",
                error
              );

              Alert.alert(
                "Delete Failed",
                error?.message ||
                  "Failed to delete user."
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const logout = async () => {
    await removeToken();

    router.replace("/");
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (
    value?: string | null
  ) => {
    if (!value) {
      return "Not provided";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date.toLocaleDateString();
  };

  // ============================================================
  // ROLE
  // ============================================================

  const getRole = (
    role?: string | null
  ) => {
    return String(
      role || "user"
    )
      .trim()
      .toLowerCase();
  };

  // ============================================================
  // USER CARD
  // ============================================================

  const renderUser = ({
    item,
  }: {
    item: User;
  }) => {
    const role =
      getRole(item.ROLE);

    const isPolice =
      role === "police";

    const isAdmin =
      role === "admin";

    const isUpgrading =
      upgradingId === item.ID;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.userTitle}>
            <Text
              style={
                styles.fullName
              }
            >
              {item.FULL_NAME ||
                "No name"}
            </Text>

            <Text
              style={
                styles.username
              }
            >
              @{item.USER_NAME}
            </Text>
          </View>

          <View
            style={[
              styles.roleBadge,
              isAdmin &&
                styles.adminBadge,
              isPolice &&
                styles.policeBadge,
            ]}
          >
            <Text
              style={
                styles.roleText
              }
            >
              {role.toUpperCase()}
            </Text>
          </View>
        </View>

        <View
          style={styles.divider}
        />

        <View
          style={styles.infoRow}
        >
          <Text
            style={styles.label}
          >
            User ID
          </Text>

          <Text
            style={styles.value}
          >
            {item.ID}
          </Text>
        </View>

        <View
          style={styles.infoRow}
        >
          <Text
            style={styles.label}
          >
            Full Name
          </Text>

          <Text
            style={styles.value}
          >
            {item.FULL_NAME ||
              "Not provided"}
          </Text>
        </View>

        <View
          style={styles.infoRow}
        >
          <Text
            style={styles.label}
          >
            Username
          </Text>

          <Text
            style={styles.value}
          >
            {item.USER_NAME}
          </Text>
        </View>

        <View
          style={styles.infoRow}
        >
          <Text
            style={styles.label}
          >
            Email
          </Text>

          <Text
            style={styles.value}
          >
            {item.EMAIL ||
              "Not provided"}
          </Text>
        </View>

        <View
          style={styles.infoRow}
        >
          <Text
            style={styles.label}
          >
            Date of Birth
          </Text>

          <Text
            style={styles.value}
          >
            {formatDate(
              item.DOB
            )}
          </Text>
        </View>

        <View
          style={styles.infoRow}
        >
          <Text
            style={styles.label}
          >
            Mobile
          </Text>

          <Text
            style={styles.value}
          >
            {item.MOBILE ||
              "Not provided"}
          </Text>
        </View>

        <View
          style={styles.infoRow}
        >
          <Text
            style={styles.label}
          >
            Police ID
          </Text>

          <Text
            style={styles.value}
          >
            {item.POLICE_ID ||
              "Not applicable"}
          </Text>
        </View>

        <View
          style={styles.actions}
        >
          {isPolice && (
            <Pressable
              onPress={() =>
                upgradeToAdmin(
                  item
                )
              }
              disabled={
                isUpgrading
              }
              style={({ pressed }) => [
                styles.upgradeButton,
                pressed &&
                  styles.buttonPressed,
                isUpgrading &&
                  styles.disabledButton,
              ]}
            >
              {isUpgrading ? (
                <ActivityIndicator
                  color="#ffffff"
                />
              ) : (
                <Text
                  style={
                    styles.buttonText
                  }
                >
                  UPGRADE TO ADMIN
                </Text>
              )}
            </Pressable>
          )}

          {item.ID !== undefined && (
            <Pressable
              onPress={() =>
                deleteUser(
                  item
                )
              }
              style={({ pressed }) => [
                styles.deleteButton,
                pressed &&
                  styles.buttonPressed,
              ]}
            >
              <Text
                style={
                  styles.buttonText
                }
              >
                DELETE
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  };

  // ============================================================
  // MAIN
  // ============================================================

  return (
    <SafeAreaView
      style={styles.container}
    >
      <View
        style={styles.header}
      >
        <View>
          <Text
            style={styles.title}
          >
            Manage Users
          </Text>

          <Text
            style={
              styles.subtitle
            }
          >
            View and manage registered users
          </Text>
        </View>

        <Pressable
          onPress={logout}
          style={({ pressed }) => [
            styles.logoutButton,
            pressed &&
              styles.buttonPressed,
          ]}
        >
          <Text
            style={
              styles.logoutText
            }
          >
            LOGOUT
          </Text>
        </Pressable>
      </View>

      <View
        style={styles.searchContainer}
      >
        <TextInput
          value={search}
          onChangeText={
            setSearch
          }
          placeholder="Search by name or username..."
          placeholderTextColor="#888"
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <View
        style={styles.countContainer}
      >
        <Text
          style={
            styles.countText
          }
        >
          {users.length} user
          {users.length === 1
            ? ""
            : "s"}
        </Text>

        {loading && (
          <ActivityIndicator
            size="small"
          />
        )}
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) =>
          String(item.ID)
        }
        renderItem={renderUser}
        contentContainerStyle={
          styles.list
        }
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          !loading ? (
            <View
              style={
                styles.empty
              }
            >
              <Text
                style={
                  styles.emptyTitle
                }
              >
                No users found
              </Text>

              <Text
                style={
                  styles.emptyText
                }
              >
                Try a different name
                or username.
              </Text>
            </View>
          ) : null
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
    backgroundColor: "#f5f7fa",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 15,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#6b7280",
  },

  logoutButton: {
    backgroundColor: "#111827",
    paddingHorizontal: 15,
    minHeight: 42,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  logoutText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
  },

  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },

  searchInput: {
    height: 48,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 9,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#111827",
  },

  countContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  countText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,

    ...Platform.select({
      web: {
        boxShadow:
          "0 2px 8px rgba(0,0,0,0.08)",
      },
      default: {
        elevation: 2,
      },
    }),
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  userTitle: {
    flex: 1,
    paddingRight: 10,
  },

  fullName: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
  },

  username: {
    marginTop: 4,
    fontSize: 14,
    color: "#6b7280",
  },

  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#6b7280",
  },

  adminBadge: {
    backgroundColor: "#7c3aed",
  },

  policeBadge: {
    backgroundColor: "#2563eb",
  },

  roleText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "800",
  },

  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 14,
  },

  infoRow: {
    flexDirection: "row",
    marginBottom: 9,
  },

  label: {
    width: 120,
    fontSize: 13,
    fontWeight: "700",
    color: "#6b7280",
  },

  value: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },

  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  upgradeButton: {
    flex: 1,
    minHeight: 48,
    backgroundColor: "#2563eb",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  deleteButton: {
    flex: 1,
    minHeight: 48,
    backgroundColor: "#dc2626",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonPressed: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
  },

  empty: {
    paddingTop: 60,
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#374151",
  },

  emptyText: {
    marginTop: 6,
    fontSize: 14,
    color: "#6b7280",
  },
});