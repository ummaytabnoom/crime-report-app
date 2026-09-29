import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:3000";

type Admin = {
  ID: number;
  FULL_NAME: string;
  USER_NAME: string;
  EMAIL: string;
  DOB?: string | null;
  MOBILE?: string | null;
  ROLE: string;
  POLICE_ID?: string | null;
  PROFILE_PICTURE?: string | null;
};

export default function AdminInfo() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadAdmins = useCallback(
    async (searchText = "") => {
      try {
        setError("");

        const token =
          await AsyncStorage.getItem("token");

        if (!token) {
          setError("You are not logged in.");
          return;
        }

        const query = searchText.trim()
          ? `?q=${encodeURIComponent(
              searchText.trim()
            )}`
          : "";

        const response = await fetch(
          `${API_URL}/api/admin/users${query}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to load admins"
          );
        }

        setAdmins(
  Array.isArray(data?.data) ? data.data : []
);
      } catch (err: any) {
        console.error(
          "ADMIN INFO ERROR:",
          err
        );

        setError(
          err?.message ||
            "Unable to load admin information"
        );

        setAdmins([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadAdmins();
  }, [loadAdmins]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAdmins(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search, loadAdmins]);

  const onRefresh = () => {
    setRefreshing(true);
    loadAdmins(search);
  };

  const formatDate = (
    date?: string | null
  ) => {
    if (!date) return "Not provided";

    const parsed = new Date(date);

    if (isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString();
  };

  const getProfileImage = (
    profilePicture?: string | null
  ) => {
    if (!profilePicture) {
      return null;
    }

    if (
      profilePicture.startsWith(
        "data:image"
      )
    ) {
      return profilePicture;
    }

    return `data:image/jpeg;base64,${profilePicture}`;
  };

  const renderAdmin = ({
    item,
  }: {
    item: Admin;
  }) => {
    const image = getProfileImage(
      item.PROFILE_PICTURE
    );

    return (
      <View style={styles.card}>
        <View style={styles.header}>
          {image ? (
            <Image
              source={{ uri: image }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text
                style={
                  styles.avatarText
                }
              >
                {item.FULL_NAME
                  ?.charAt(0)
                  ?.toUpperCase() || "A"}
              </Text>
            </View>
          )}

          <View style={styles.headerInfo}>
            <Text
              style={styles.name}
              numberOfLines={1}
            >
              {item.FULL_NAME ||
                "Unnamed Admin"}
            </Text>

            <Text
              style={styles.username}
            >
              @{item.USER_NAME}
            </Text>

            <View
              style={styles.adminBadge}
            >
              <Text
                style={
                  styles.adminBadgeText
                }
              >
                ADMIN
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <InfoRow
          label="Email"
          value={
            item.EMAIL || "Not provided"
          }
        />

        <InfoRow
          label="Mobile"
          value={
            item.MOBILE || "Not provided"
          }
        />

        <InfoRow
          label="Date of Birth"
          value={formatDate(item.DOB)}
        />

        <InfoRow
          label="Police ID"
          value={
            item.POLICE_ID ||
            "Not assigned"
          }
        />

        <InfoRow
          label="User ID"
          value={String(item.ID)}
        />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading admin information...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Text style={styles.title}>
          Admin Information
        </Text>

        <Text style={styles.subtitle}>
          {admins.length} admin
          {admins.length !== 1
            ? "s"
            : ""} found
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search admins..."
          placeholderTextColor="#888"
          style={styles.searchInput}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {search.length > 0 && (
          <Text
            style={styles.clearText}
            onPress={() => setSearch("")}
          >
            ✕
          </Text>
        )}
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            {error}
          </Text>
        </View>
      ) : null}

      <FlatList
        data={admins}
        keyExtractor={(item) =>
          String(item.ID)
        }
        renderItem={renderAdmin}
        contentContainerStyle={
          admins.length === 0
            ? styles.emptyContainer
            : styles.list
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>
              👤
            </Text>

            <Text
              style={styles.emptyTitle}
            >
              No admins found
            </Text>

            <Text
              style={styles.emptyText}
            >
              {search
                ? `No admins match "${search}".`
                : "There are currently no admin accounts."}
            </Text>
          </View>
        }
      />
    </View>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>
        {label}
      </Text>

      <Text
        style={styles.value}
        numberOfLines={2}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6f8",
  },

  titleSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "#6b7280",
  },

  searchContainer: {
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#d9dde3",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#111827",
  },

  clearText: {
    fontSize: 18,
    color: "#6b7280",
    padding: 5,
  },

  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 5,

    elevation: 2,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: "#e5e7eb",
  },

  avatarPlaceholder: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: "#1f2937",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: "#ffffff",
    fontSize: 25,
    fontWeight: "700",
  },

  headerInfo: {
    flex: 1,
    marginLeft: 14,
  },

  name: {
    fontSize: 19,
    fontWeight: "700",
    color: "#111827",
  },

  username: {
    marginTop: 3,
    fontSize: 14,
    color: "#6b7280",
  },

  adminBadge: {
    alignSelf: "flex-start",
    marginTop: 7,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#eef2ff",
  },

  adminBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4338ca",
  },

  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 15,
  },

  infoRow: {
    flexDirection: "row",
    paddingVertical: 7,
  },

  label: {
    width: 110,
    fontSize: 14,
    fontWeight: "600",
    color: "#6b7280",
  },

  value: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f6f8",
  },

  loadingText: {
    marginTop: 12,
    color: "#6b7280",
  },

  errorBox: {
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fee2e2",
  },

  errorText: {
    color: "#991b1b",
    fontSize: 14,
  },

  emptyContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },

  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },

  emptyIcon: {
    fontSize: 42,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#111827",
  },

  emptyText: {
    marginTop: 6,
    textAlign: "center",
    color: "#6b7280",
    fontSize: 14,
  },
});