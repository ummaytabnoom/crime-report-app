import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

const TOKEN_KEY = "crime_report_token";

export async function saveToken(token: string) {
  console.log("SAVING TOKEN");

  await AsyncStorage.setItem(TOKEN_KEY, token);

  const saved = await AsyncStorage.getItem(TOKEN_KEY);

  console.log("TOKEN SAVED:", !!saved);
}

export async function getToken() {
  const token = await AsyncStorage.getItem(TOKEN_KEY);

  console.log("TOKEN FROM STORAGE:", !!token);

  return token;
}

export async function removeToken() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

export async function api(
  endpoint: string,
  method: string = "GET",
  data?: any
) {
  const token = await getToken();

  console.log("API REQUEST:", endpoint);
  console.log("HAS TOKEN:", !!token);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // Add authentication token
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  console.log(
    "AUTH HEADER:",
    token ? "Bearer token attached" : "NO TOKEN"
  );

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });

  const result = await response.json().catch(() => ({}));

  console.log("API STATUS:", response.status);
  console.log(
    "API RESPONSE:",
    JSON.stringify(result, null, 2)
  );

  if (!response.ok) {
    throw new Error(
      result.message ||
        result.error ||
        `Request failed: ${response.status}`
    );
  }

  return result;
}