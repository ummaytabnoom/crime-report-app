export type Role = "public" | "police" | "admin";

export type User = {
  id: number;
  full_name: string;
  user_name: string;
  email: string;
  dob?: string | null;
  mobile?: string | null;
  role: Role;
  police_id?: string | null;
  profile_picture?: string | null;
};

export type Crime = {
  crime_id: number;
  id: number;
  user_name: string;
  full_name: string;
  zilla: string;
  upazilla: string;
  police_station: string;
  area?: string | null;
  road_name?: string | null;
  road_no?: string | null;
  date_of_incident: string;
  category?: string | null;
  description?: string | null;
  status?: string | null;
  media_file?: string | null;
  hide_identity?: string | null;
  accepted: string;
  police_id?: string | null;
  upgraded_by?: string | null;
  accepted_by?: string | null;
  media_type?: string | null;
};

export type RegisterInput = {
  full_name: string;
  user_name: string;
  email: string;
  dob?: string;
  mobile?: string;
  role?: Role;
  police_id?: string;
  password: string;
};

export type CrimeInput = {
  zilla: string;
  upazilla: string;
  police_station: string;
  area?: string;
  road_name?: string;
  road_no?: string;
  date_of_incident: string;
  category?: string;
  description?: string;
  hide_identity?: string;
};
