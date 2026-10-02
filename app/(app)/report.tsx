import { useState } from "react";
import { StyleSheet } from "react-native";
import { router } from "expo-router";
import { Button, Menu, Text, TextInput } from "react-native-paper";
import { AppHeader } from "../../src/components/AppHeader";
import { Screen } from "../../src/components/Screen";
import { useAuth } from "../../src/context/AuthContext";
import { api } from "../../src/api";

const categories = ["Theft", "Robbery", "Assault", "Fraud", "Missing Person", "Other"];

export default function Report() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    zilla: "",
    upazilla: "",
    police_station: "",
    area: "",
    road_name: "",
    road_no: "",
    date_of_incident: "",
    category: "",
    description: "",
    hide_identity: "NO",
  });
  const [menu, setMenu] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  function setField(key: keyof typeof form, value: string) {
    setForm(v => ({ ...v, [key]: value }));
  }

  async function submit() {
    setError("");
    if (!form.zilla || !form.upazilla || !form.police_station || !form.date_of_incident) {
      setError("Zilla, Upazilla, Police Station and incident date are required.");
      return;
    }
    try {
      setLoading(true);
      await api.createCrime(user.id, form);
      router.replace("/my-reports");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not submit report");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <AppHeader title="Report a crime" back />
      <Screen>
        <Text variant="bodyLarge">Give us the details. Your report will be reviewed before becoming public.</Text>
        <TextInput label="Zilla *" mode="outlined" value={form.zilla} onChangeText={v => setField("zilla", v)} />
        <TextInput label="Upazilla *" mode="outlined" value={form.upazilla} onChangeText={v => setField("upazilla", v)} />
        <TextInput label="Police station *" mode="outlined" value={form.police_station} onChangeText={v => setField("police_station", v)} />
        <TextInput label="Area" mode="outlined" value={form.area} onChangeText={v => setField("area", v)} />
        <TextInput label="Road name" mode="outlined" value={form.road_name} onChangeText={v => setField("road_name", v)} />
        <TextInput label="Road no." mode="outlined" value={form.road_no} onChangeText={v => setField("road_no", v)} />
        <TextInput label="Incident date *" mode="outlined" placeholder="YYYY-MM-DD" value={form.date_of_incident} onChangeText={v => setField("date_of_incident", v)} />
        <Menu
          visible={menu}
          onDismiss={() => setMenu(false)}
          anchor={
            <Button mode="outlined" icon="chevron-down" onPress={() => setMenu(true)}>
              {form.category || "Select category"}
            </Button>
          }
        >
          {categories.map(category => (
            <Menu.Item
              key={category}
              onPress={() => { setField("category", category); setMenu(false); }}
              title={category}
            />
          ))}
        </Menu>
        <TextInput
          label="Description"
          mode="outlined"
          multiline
          numberOfLines={6}
          value={form.description}
          onChangeText={v => setField("description", v)}
        />
        <Button
          mode="outlined"
          icon={form.hide_identity === "YES" ? "eye-off" : "eye"}
          onPress={() => setField("hide_identity", form.hide_identity === "YES" ? "NO" : "YES")}
        >
          {form.hide_identity === "YES" ? "Identity hidden" : "Identity visible"}
        </Button>
        {error ? <Text style={{ color: "#B3261E" }}>{error}</Text> : null}
        <Button mode="contained" onPress={submit} loading={loading} disabled={loading}>
          Submit report
        </Button>
      </Screen>
    </>
  );
}
