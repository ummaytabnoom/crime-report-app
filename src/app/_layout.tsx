import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />

      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#123B5D",
          },

          headerTintColor: "#FFFFFF",

          headerTitleStyle: {
            fontWeight: "700",
          },

          contentStyle: {
            backgroundColor: "#F4F7FA",
          },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="register"
          options={{
            title: "Create Account",
          }}
        />

        <Stack.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
          }}
        />

        <Stack.Screen
          name="new-report"
          options={{
            title: "Report Crime",
          }}
        />

        <Stack.Screen
          name="my-reports"
          options={{
            title: "My Reports",
          }}
        />

        <Stack.Screen
          name="edit-report"
          options={{
            title: "Edit Report",
          }}
        />

        <Stack.Screen
          name="profile"
          options={{
            title: "My Profile",
          }}
        />

        <Stack.Screen
          name="admin"
          options={{
            title: "Admin Panel",
          }}
        />

        <Stack.Screen
          name="police"
          options={{
            title: "Police Panel",
          }}
        />

        <Stack.Screen
          name="directory"
          options={{
            title: "Directory",
          }}
        />
      </Stack>
    </>
  );
}