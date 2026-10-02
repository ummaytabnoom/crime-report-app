import { useCallback, useState } from "react";
import { Alert, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { Card, Chip, Menu, Text, useTheme } from "react-native-paper";
import { AppHeader } from "../../../src/components/AppHeader";
import { ErrorBox } from "../../../src/components/ErrorBox";
import { Loading } from "../../../src/components/Loading";
import { Screen } from "../../../src/components/Screen";
import { api } from "../../../src/api";
import { useAuth } from "../../../src/context/AuthContext";
import { useApiList } from "../../../src/hooks/useApiList";
import type { Role } from "../../../src/types";

const roles: Role[] = ["public", "police", "admin"];

export default function AdminUsers() {
  const { user } = useAuth();
  const theme = useTheme();
  const loader = useCallback(() => user ? api.listUsers(user.id) : Promise.resolve([]), [user]);
  const { data, loading, error, reload } = useApiList(loader, !!user);
  const [menuId, setMenuId] = useState<number | null>(null);

  useFocusEffect(useCallback(() => { reload(); }, [reload]));

  async function changeRole(id: number, role: Role) {
    if (!user) return;
    try {
      setMenuId(null);
      await api.updateUserRole(user.id, id, role);
      await reload();
    } catch (e) {
      Alert.alert("Could not change role", e instanceof Error ? e.message : "Something went wrong");
    }
  }

  async function remove(id: number) {
    if (!user) return;
    Alert.alert("Delete user?", "This will also remove that user's crime reports.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.deleteUser(user.id, id);
            await reload();
          } catch (e) {
            Alert.alert("Could not delete", e instanceof Error ? e.message : "Something went wrong");
          }
        },
      },
    ]);
  }

  return (
    <>
      <AppHeader title="Users" back />
      <Screen refreshing={loading} onRefresh={reload}>
        {error ? <ErrorBox message={error} onRetry={reload} /> : null}
        {loading && !data.length ? <Loading /> : null}
        {data.map(item => (
          <Card key={item.id} style={{ borderRadius: 18 }}>
            <Card.Content style={{ gap: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text variant="titleMedium">{item.full_name}</Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    @{item.user_name} • {item.email}
                  </Text>
                </View>
                <Chip compact>{item.role}</Chip>
              </View>
              {item.police_id ? <Text variant="bodySmall">Police ID: {item.police_id}</Text> : null}
              <Menu
                visible={menuId === item.id}
                onDismiss={() => setMenuId(null)}
                anchor={<Text onPress={() => setMenuId(item.id)} style={{ color: theme.colors.primary }}>Change role</Text>}
              >
                {roles.map(role => (
                  <Menu.Item key={role} title={role} onPress={() => changeRole(item.id, role)} />
                ))}
              </Menu>
              <Text onPress={() => remove(item.id)} style={{ color: theme.colors.error }}>
                Delete user
              </Text>
            </Card.Content>
          </Card>
        ))}
      </Screen>
    </>
  );
}
