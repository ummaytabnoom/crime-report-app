import { useCallback, useMemo, useState } from "react";

import { router, useFocusEffect } from "expo-router";

import {
  Button,
  Searchbar,
  Text,
} from "react-native-paper";

import { AppHeader } from "../../src/components/AppHeader";
import { CrimeCard } from "../../src/components/CrimeCard";
import { EmptyState } from "../../src/components/EmptyState";
import { ErrorBox } from "../../src/components/ErrorBox";
import { Loading } from "../../src/components/Loading";
import { Screen } from "../../src/components/Screen";
import { api } from "../../src/api";
import { useAuth } from "../../src/context/AuthContext";
import { useApiList } from "../../src/hooks/useApiList";

import type { Crime } from "../../src/types";

export default function MyReports() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");

  const loader = useCallback(
    () =>
      user
        ? api.myCrimes(user.id)
        : Promise.resolve([] as Crime[]),
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

  const filteredReports = useMemo(() => {
    const value = query.trim().toLowerCase();

    if (!value) {
      return data;
    }

    return data.filter((crime) => {
      const searchableText = [
        crime.category,
        crime.description,
        crime.zilla,
        crime.upazilla,
        crime.police_station,
        crime.area,
        crime.road_name,
        crime.road_no,
        crime.status,
        crime.accepted,
        crime.user_name,
        crime.full_name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(value);
    });
  }, [data, query]);

  return (
    <>
      <AppHeader title="My reports" back />

      <Screen
        refreshing={loading}
        onRefresh={reload}
      >
        {/* SEARCH */}
        <Searchbar
          placeholder="Search your reports..."
          value={query}
          onChangeText={setQuery}
          style={{
            marginBottom: 4,
          }}
        />

        {query.trim() ? (
          <Text variant="bodyMedium">
            {filteredReports.length}{" "}
            {filteredReports.length === 1
              ? "report"
              : "reports"}{" "}
            found
          </Text>
        ) : null}

        {error ? (
          <ErrorBox
            message={error}
            onRetry={reload}
          />
        ) : null}

        {loading && !data.length ? (
          <Loading />
        ) : null}

        {!loading &&
        !error &&
        !data.length ? (
          <EmptyState
            title="No reports yet"
            text="Your submitted crime reports will appear here."
          />
        ) : null}

        {!loading &&
        data.length > 0 &&
        filteredReports.length === 0 ? (
          <EmptyState
            title="No matching reports"
            text="Try category, location, police station, status, or description."
          />
        ) : null}

        {/* ALL / FILTERED REPORTS */}
        {filteredReports.map((crime) => (
          <CrimeCard
            key={crime.crime_id}
            crime={crime}
          />
        ))}

        {/* NEW REPORT */}
        <Button
          mode="contained"
          onPress={() => router.push("/report")}
        >
          New report
        </Button>
      </Screen>
    </>
  );
}