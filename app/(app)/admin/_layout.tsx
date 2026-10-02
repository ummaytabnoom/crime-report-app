import { Redirect, Stack } from "expo-router";
import { ActivityIndicator } from "react-native-paper";
import { useAuth } from "../../../src/context/AuthContext";

export default function AdminLayout() {
  const { user, loading } = useAuth();
  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;
  if (!user || user.role !== "admin") return <Redirect href="/(app)/home" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
