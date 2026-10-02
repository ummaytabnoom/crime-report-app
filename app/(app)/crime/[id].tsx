import { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Chip, Text } from "react-native-paper";
import { AppHeader } from "../../../src/components/AppHeader";
import { ErrorBox } from "../../../src/components/ErrorBox";
import { Loading } from "../../../src/components/Loading";
import { Screen } from "../../../src/components/Screen";
import { api } from "../../../src/api";
import { useAuth } from "../../../src/context/AuthContext";
import type { Crime } from "../../../src/types";

export default function CrimeDetails() {
  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [crime, setCrime] = useState<Crime | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!user || !id) return;
    try {
      setError("");
      setCrime(await api.crime(user.id, Number(id)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load report");
    }
  }, [user, id]);

  useEffect(() => { load(); }, [load]);

  return (
    <>
      <AppHeader title={`Report #${id}`} back />
      <Screen refreshing={false} onRefresh={load}>
        {error ? <ErrorBox message={error} onRetry={load} /> : null}
        {!crime && !error ? <Loading /> : null}
        {crime ? (
          <>
            <Chip icon="progress-clock">{crime.status || "Pending"}</Chip>
            <Text variant="headlineSmall" style={styles.title}>{crime.category || "Crime report"}</Text>
            <Text variant="bodyLarge">{crime.description || "No description provided."}</Text>
            <Text variant="titleMedium">Location</Text>
            <Text variant="bodyMedium">
              {crime.area || "Area not provided"}, {crime.road_name || "Road not provided"} {crime.road_no || ""}
            </Text>
            <Text variant="bodyMedium">
              {crime.upazilla}, {crime.zilla}
            </Text>
            <Text variant="bodyMedium">Police station: {crime.police_station}</Text>
            <Text variant="titleMedium">Incident date</Text>
            <Text variant="bodyMedium">{String(crime.date_of_incident).slice(0, 10)}</Text>
            <Text variant="bodyMedium">Visibility: {crime.accepted}</Text>
          </>
        ) : null}
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  title: { fontWeight: "800" },
});
