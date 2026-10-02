import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Button, Card, Chip, Text, useTheme } from "react-native-paper";
import { AppHeader } from "../../src/components/AppHeader";
import { Screen } from "../../src/components/Screen";
import { RoleBadge } from "../../src/components/RoleBadge";
import { useAuth } from "../../src/context/AuthContext";

export default function Home() {
  const { user, refreshUser } = useAuth();
  const theme = useTheme();

  useFocusEffect(useCallback(() => { refreshUser().catch(() => {}); }, [refreshUser]));

  if (!user) return null;

  const isAdmin = user.role === "admin";
  const isPolice = user.role === "police";

  return (
    <>
      <AppHeader title="Crime Report" />
      <Screen>
        <Card style={styles.hero}>
          <Card.Content style={styles.heroContent}>
            <View style={{ flex: 1, gap: 5 }}>
              <Text variant="labelLarge" style={{ color: theme.colors.primary }}>WELCOME BACK</Text>
              <Text variant="headlineMedium" style={styles.name}>{user.full_name}</Text>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                {user.email}
              </Text>
            </View>
            <RoleBadge role={user.role} />
          </Card.Content>
        </Card>

        <View style={styles.grid}>
          <Card
            style={styles.tile}
            onPress={() => router.push("/search")}
>
          <Card.Content style={styles.tileContent}>
           <Text variant="headlineMedium">⌕</Text>
           <Text variant="titleMedium">Search reports</Text>
           <Text variant="bodySmall">
             Search public crime reports
          </Text>
          </Card.Content>
          </Card>
          <Card style={styles.tile} onPress={() => router.push("/report")}>
            <Card.Content style={styles.tileContent}>
              <Text variant="headlineMedium">＋</Text>
              <Text variant="titleMedium">Report crime</Text>
              <Text variant="bodySmall">Submit a new report</Text>
            </Card.Content>
          </Card>

          <Card style={styles.tile} onPress={() => router.push("/my-reports")}>
            <Card.Content style={styles.tileContent}>
              <Text variant="headlineMedium">▣</Text>
              <Text variant="titleMedium">My reports</Text>
              <Text variant="bodySmall">Track your submissions</Text>
            </Card.Content>
          </Card>

          <Card style={styles.tile} onPress={() => router.push("/global")}>
            <Card.Content style={styles.tileContent}>
              <Text variant="headlineMedium">◉</Text>
              <Text variant="titleMedium">Public reports</Text>
              <Text variant="bodySmall">See accepted reports</Text>
            </Card.Content>
          </Card>

          <Card style={styles.tile} onPress={() => router.push("/profile")}>
            <Card.Content style={styles.tileContent}>
              <Text variant="headlineMedium">◎</Text>
              <Text variant="titleMedium">Profile</Text>
              <Text variant="bodySmall">Account information</Text>
            </Card.Content>
          </Card>
        </View>

        {isPolice ? (
          <Card style={styles.roleCard} onPress={() => router.push("/police")}>
            <Card.Content style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text variant="titleMedium">Police workspace</Text>
                <Text variant="bodyMedium">Review reports and update investigation status.</Text>
              </View>
              <Chip icon="shield">Police</Chip>
            </Card.Content>
          </Card>
        ) : null}

        {isAdmin ? (
          <Card style={styles.roleCard} onPress={() => router.push("/admin")}>
            <Card.Content style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text variant="titleMedium">Admin workspace</Text>
                <Text variant="bodyMedium">Manage users and approve pending reports.</Text>
              </View>
              <Chip icon="shield-crown">Admin</Chip>
            </Card.Content>
          </Card>
        ) : null}

        <Button mode="outlined" icon="logout" onPress={() => router.push("/profile")}>
          Account & settings
        </Button>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: 22 },
  heroContent: { flexDirection: "row", alignItems: "center", gap: 12 },
  name: { fontWeight: "800" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  tile: { width: "48%", borderRadius: 18 },
  tileContent: { minHeight: 140, justifyContent: "center", gap: 6 },
  roleCard: { borderRadius: 18 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
});
