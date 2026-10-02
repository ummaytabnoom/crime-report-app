import { useState } from "react";

import {
  FlatList,
  StyleSheet,
  View,
} from "react-native";

import {
  Button,
  Searchbar,
  Text,
  useTheme,
} from "react-native-paper";

import { AppHeader } from "../../src/components/AppHeader";
import { CrimeCard } from "../../src/components/CrimeCard";
import { EmptyState } from "../../src/components/EmptyState";
import { ErrorBox } from "../../src/components/ErrorBox";
import { Loading } from "../../src/components/Loading";
import { api } from "../../src/api";

import type { Crime } from "../../src/types";

export default function SearchReports() {
  const theme = useTheme();

  const [query, setQuery] = useState("");
  const [data, setData] = useState<Crime[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchReports = async () => {
    const value = query.trim();

    if (!value) {
      setData([]);
      setError("");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const reports = await api.searchCrimes(value);

      setData(reports);
    } catch (err) {
      setData([]);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to search reports",
      );
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setData([]);
    setError("");
  };

  return (
    <>
      <AppHeader title="Search reports" back />

      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.background,
          },
        ]}
      >
        <FlatList
          data={data}
          keyExtractor={(crime) => String(crime.crime_id)}
          renderItem={({ item }) => (
            <CrimeCard crime={item} />
          )}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <View style={styles.header}>
              <Searchbar
                placeholder="Name, username, district, area..."
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={searchReports}
                onClearIconPress={clearSearch}
                style={styles.search}
              />

              <Button
                mode="contained"
                icon="magnify"
                loading={loading}
                disabled={loading || !query.trim()}
                onPress={searchReports}
                style={styles.button}
              >
                Search
              </Button>

              {error ? (
                <ErrorBox
                  message={error}
                  onRetry={searchReports}
                />
              ) : null}

              {loading && !data.length ? (
                <Loading />
              ) : null}

              {!loading && !error && !data.length && query.trim() ? (
                <EmptyState
                  title="No reports found"
                  text="Try a different name, username, district, police station, area, or road."
                />
              ) : null}

              {!loading && data.length > 0 ? (
                <Text
                  variant="bodyMedium"
                  style={{
                    color: theme.colors.onSurfaceVariant,
                    marginBottom: 4,
                  }}
                >
                  {data.length}{" "}
                  {data.length === 1
                    ? "report"
                    : "reports"}{" "}
                  found
                </Text>
              ) : null}
            </View>
          }
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    padding: 18,
    paddingBottom: 8,
    gap: 12,
  },

  search: {
    marginBottom: 4,
  },

  button: {
    marginBottom: 4,
  },

  list: {
    paddingBottom: 30,
  },
});