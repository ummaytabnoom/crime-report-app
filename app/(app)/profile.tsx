import { StyleSheet } from "react-native";
import { router } from "expo-router";
import { Button, Card, List, Text } from "react-native-paper";
import { AppHeader } from "../../src/components/AppHeader";
import { RoleBadge } from "../../src/components/RoleBadge";
import { Screen } from "../../src/components/Screen";
import { useAuth } from "../../src/context/AuthContext";

export default function Profile() {
  const { user, signOut } = useAuth();
  if (!user) return null;

  async function logout() {
    await signOut();
    router.replace("/(auth)/login");
  }

  return (
    <>
      <AppHeader title="Profile" back />
      <Screen>
        <Card style={styles.card}>
          <Card.Content style={styles.head}>
            <Text variant="headlineSmall">{user.full_name}</Text>
            <RoleBadge role={user.role} />
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <List.Item title="Username" description={user.user_name} left={p => <List.Icon {...p} icon="account" />} />
          <List.Item title="Email" description={user.email} left={p => <List.Icon {...p} icon="email" />} />
          <List.Item title="Mobile" description={user.mobile || "Not provided"} left={p => <List.Icon {...p} icon="phone" />} />
          <List.Item title="Police ID" description={user.police_id || "Not applicable"} left={p => <List.Icon {...p} icon="shield-account" />} />
        </Card>
        <Button mode="outlined" icon="logout" onPress={logout}>Sign out</Button>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 18 },
  head: { gap: 10 },
});
