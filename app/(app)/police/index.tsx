import { useCallback, useState } from "react";
import { Alert, View } from "react-native";
import { useFocusEffect } from "expo-router";
import { Button, Menu, Text } from "react-native-paper";
import { AppHeader } from "../../../src/components/AppHeader";
import { CrimeCard } from "../../../src/components/CrimeCard";
import { EmptyState } from "../../../src/components/EmptyState";
import { ErrorBox } from "../../../src/components/ErrorBox";
import { Loading } from "../../../src/components/Loading";
import { Screen } from "../../../src/components/Screen";
import { api } from "../../../src/api";
import { useAuth } from "../../../src/context/AuthContext";
import { useApiList } from "../../../src/hooks/useApiList";

const statuses = ["Pending", "Accepted", "Under Investigation"];

export default function PoliceHome() {
  const { user } = useAuth();
  const loader = useCallback(() => user ? api.pendingCrimes(user.id) : Promise.resolve([]), [user]);
  const { data, loading, error, reload } = useApiList(loader, !!user);
  const [menuId, setMenuId] = useState<number | null>(null);

  useFocusEffect(useCallback(() => { reload(); }, [reload]));

  async function setStatus(id: number, status: string) {
    if (!user) return;
    try {
      setMenuId(null);
      await api.updateCrimeStatus(user.id, id, status);
      await reload();
    } catch (e) {
      Alert.alert("Could not update", e instanceof Error ? e.message : "Something went wrong");
    }
  }

  return (
    <>
      <AppHeader title="Police workspace" back />
      <Screen refreshing={loading} onRefresh={reload}>
        <Text variant="headlineSmall">Report queue</Text>
        <Text variant="bodyMedium">Review reports and keep investigation status current.</Text>
        {error ? <ErrorBox message={error} onRetry={reload} /> : null}
        {loading && !data.length ? <Loading /> : null}
        {!loading && !data.length ? <EmptyState title="Queue is clear" text="There are no pending reports right now." /> : null}

        {data.map(crime => (
          <CrimeCard
            key={crime.crime_id}
            crime={crime}
            action={
              <View>
                <Menu
                  visible={menuId === crime.crime_id}
                  onDismiss={() => setMenuId(null)}
                  anchor={<Button mode="outlined" onPress={() => setMenuId(crime.crime_id)}>Change status</Button>}
                >
                  {statuses.map(status => (
                    <Menu.Item key={status} title={status} onPress={() => setStatus(crime.crime_id, status)} />
                  ))}
                </Menu>
              </View>
            }
          />
        ))}
      </Screen>
    </>
  );
}
