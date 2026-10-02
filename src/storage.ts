import AsyncStorage from "@react-native-async-storage/async-storage";
import type { User } from "./types";

const USER_KEY = "crime-report-user";

export async function saveUser(user: User) {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function getSavedUser(): Promise<User | null> {
  const value = await AsyncStorage.getItem(USER_KEY);
  return value ? JSON.parse(value) : null;
}

export async function clearSavedUser() {
  await AsyncStorage.removeItem(USER_KEY);
}
