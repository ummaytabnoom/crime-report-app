import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../src/context/AuthContext";
import { ActivityIndicator } from "react-native-paper";

export default function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;
  if (!user) return <Redirect href="/(auth)/login" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
