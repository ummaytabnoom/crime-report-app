import { Chip } from "react-native-paper";
import type { Role } from "../types";

export function RoleBadge({ role }: { role: Role }) {
  return <Chip compact icon="account-circle">{role}</Chip>;
}
