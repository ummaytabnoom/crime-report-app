import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:3000";

const TOKEN_KEY = "crime_report_token";

export async function saveToken(token: string) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getToken() {
  return await AsyncStorage.getItem(TOKEN_KEY);
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

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    },
    ...(data !== undefined
      ? {
          body: JSON.stringify(data),
        }
      : {}),
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error || "Something went wrong");
  }

  return result;
}