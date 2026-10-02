import type { Crime, CrimeInput, RegisterInput, Role, User } from "./types";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

async function request<T>(
  path: string,
  options: RequestInit = {},
  userId?: number,
): Promise<T> {
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (userId) {
    headers.set("x-user-id", String(userId));
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text || "Unexpected server response" };
  }

  if (!response.ok) {
    throw new Error(data?.message || `Request failed (${response.status})`);
  }

  return data as T;
}

export const api = {
  register: (input: RegisterInput) =>
    request<{ message: string; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  login: (value: string, password: string) =>
    request<{ message: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ user_name: value, password }),
    }),

  me: (userId: number) => request<User>("/users/me", {}, userId),

  listUsers: (userId: number) => request<User[]>("/users", {}, userId),

  updateUserRole: (userId: number, targetId: number, role: Role) =>
    request<User>(
      `/users/${targetId}/role`,
      {
        method: "PATCH",
        body: JSON.stringify({ role }),
      },
      userId,
    ),

  deleteUser: (userId: number, targetId: number) =>
    request<{ message: string }>(
      `/users/${targetId}`,
      {
        method: "DELETE",
      },
      userId,
    ),

  createCrime: (userId: number, input: CrimeInput) =>
    request<Crime>(
      "/crimes",
      {
        method: "POST",
        body: JSON.stringify(input),
      },
      userId,
    ),

  myCrimes: (userId: number) => request<Crime[]>("/crimes/mine", {}, userId),

  globalCrimes: () => request<Crime[]>("/crimes/global"),

  searchCrimes: (query: string) =>
  request<Crime[]>(
    `/crimes/search?q=${encodeURIComponent(query)}`,
  ),

  crime: (userId: number, crimeId: number) =>
    request<Crime>(`/crimes/${crimeId}`, {}, userId),

  updateCrime: (userId: number, crimeId: number, input: Partial<CrimeInput>) =>
    request<Crime>(
      `/crimes/${crimeId}`,
      {
        method: "PATCH",
        body: JSON.stringify(input),
      },
      userId,
    ),

  deleteCrime: (userId: number, crimeId: number) =>
    request<{ message: string }>(
      `/crimes/${crimeId}`,
      {
        method: "DELETE",
      },
      userId,
    ),

  pendingCrimes: (userId: number) =>
    request<Crime[]>("/crimes/pending", {}, userId),

  acceptCrime: (userId: number, crimeId: number) =>
    request<Crime>(
      `/crimes/${crimeId}/accept`,
      {
        method: "PATCH",
      },
      userId,
    ),

  updateCrimeStatus: (userId: number, crimeId: number, status: string) =>
    request<Crime>(
      `/crimes/${crimeId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      },
      userId,
    ),
};
