import { useCallback } from "react";
import { Text } from "react-native-paper";
import { AppHeader } from "../../src/components/AppHeader";
import { CrimeCard } from "../../src/components/CrimeCard";
import { EmptyState } from "../../src/components/EmptyState";
import { ErrorBox } from "../../src/components/ErrorBox";
import { Loading } from "../../src/components/Loading";
import { Screen } from "../../src/components/Screen";
import { api } from "../../src/api";
import { useApiList } from "../../src/hooks/useApiList";

export default function Global() {
  const loader = useCallback(() => api.globalCrimes(), []);
  const { data, loading, error, reload } = useApiList(loader);

  return (
    <>
      <AppHeader title="Public reports" back />
      <Screen refreshing={loading} onRefresh={reload}>
        <Text variant="bodyMedium">
          Only reports accepted by an admin appear here.
        </Text>
        {error ? <ErrorBox message={error} onRetry={reload} /> : null}
        {loading && !data.length ? <Loading /> : null}
        {!loading && !data.length ? (
          <EmptyState title="Nothing public yet" text="Accepted reports will appear here." />
        ) : null}
        {data.map(crime => <CrimeCard key={crime.crime_id} crime={crime} />)}
      </Screen>
    </>
  );
}
