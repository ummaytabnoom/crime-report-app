import { useCallback } from "react";
import { Alert, View } from "react-native";

import { useFocusEffect } from "expo-router";
import { Button } from "react-native-paper";

import { AppHeader } from "../../../src/components/AppHeader";
import { CrimeCard } from "../../../src/components/CrimeCard";
import { EmptyState } from "../../../src/components/EmptyState";
import { ErrorBox } from "../../../src/components/ErrorBox";
import { Loading } from "../../../src/components/Loading";
import { Screen } from "../../../src/components/Screen";
import { api } from "../../../src/api";
import { useAuth } from "../../../src/context/AuthContext";
import { useApiList } from "../../../src/hooks/useApiList";

export default function AdminReports() {
  const { user } = useAuth();

  const loader = useCallback(
    () =>
      user
        ? api.pendingCrimes(user.id)
        : Promise.resolve([]),
    [user],
  );

  const {
    data,
    loading,
    error,
    reload,
  } = useApiList(loader, !!user);

  useFocusEffect(
    useCallback(() => {
      reload();
    }, [reload]),
  );

  async function accept(crimeId: number) {
    if (!user) return;

    try {
      await api.acceptCrime(user.id, crimeId);

      Alert.alert(
        "Success",
        "Report accepted successfully.",
      );

      await reload();
    } catch (e) {
      Alert.alert(
        "Could not accept",
        e instanceof Error
          ? e.message
          : "Something went wrong",
      );
    }
  }

  return (
    <>
      <AppHeader title="Pending reports" back />

      <Screen
        refreshing={loading}
        onRefresh={reload}
      >
        {error ? (
          <ErrorBox
            message={error}
            onRetry={reload}
          />
        ) : null}

        {loading && !data.length ? (
          <Loading />
        ) : null}

        {!loading && !data.length ? (
          <EmptyState
            title="No pending reports"
            text="All submitted reports have been reviewed."
          />
        ) : null}

        {data.map((crime) => (
  <CrimeCard
    key={crime.crime_id}
    crime={crime}
    action={
      <Button
        mode="contained"
        onPress={() =>
          accept(crime.crime_id)
        }
      >
        Accept report
      </Button>
    }
  />
))}
      </Screen>
    </>
  );
}

const styles = {
  acceptButton: {
    marginBottom: 16,
  },
};