import { useCallback } from "react";
import { router } from "expo-router";
import { Card, Text } from "react-native-paper";
import { AppHeader } from "../../../src/components/AppHeader";
import { Screen } from "../../../src/components/Screen";
import { useAuth } from "../../../src/context/AuthContext";

export default function AdminHome() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <>
      <AppHeader title="Admin workspace" back />
      <Screen>
        <Text variant="headlineSmall">Control center</Text>
        <Text variant="bodyMedium">Moderate reports and manage registered accounts.</Text>
        <Card style={{ borderRadius: 18 }} onPress={() => router.push("/admin/reports")}>
          <Card.Content style={{ gap: 6 }}>
            <Text variant="titleLarge">Pending reports</Text>
            <Text variant="bodyMedium">Review and accept reports before they become public.</Text>
          </Card.Content>
        </Card>
        <Card style={{ borderRadius: 18 }} onPress={() => router.push("/admin/users")}>
          <Card.Content style={{ gap: 6 }}>
            <Text variant="titleLarge">Users</Text>
            <Text variant="bodyMedium">View accounts, change roles and remove users.</Text>
          </Card.Content>
        </Card>
      </Screen>
    </>
  );
}
