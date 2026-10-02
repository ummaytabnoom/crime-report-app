import { Redirect } from "expo-router";
import { ActivityIndicator } from "react-native-paper";
import { useAuth } from "../src/context/AuthContext";

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;

  if (!user) return <Redirect href="/(auth)/login" />;
  return <Redirect href="/(app)/home" />;
}
