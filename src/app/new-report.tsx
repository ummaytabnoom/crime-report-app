import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import AppButton from "../components/AppButton";
import {
  CRIME_CATEGORIES,
  UPAZILLAS,
  ZILLAS,
} from "../constants/locations";
import { COLORS } from "../constants/themes";
import { api } from "../services/api";

export default function NewReport() {
  const [zilla, setZilla] = useState(ZILLAS[0]);
  const [upazilla, setUpazilla] = useState(UPAZILLAS[0]);

  const [policeStation, setPoliceStation] = useState("");
  const [area, setArea] = useState("");
  const [roadName, setRoadName] = useState("");
  const [roadNo, setRoadNo] = useState("");

  const [dateOfIncident, setDateOfIncident] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [category, setCategory] = useState(CRIME_CATEGORIES[0]);
  const [description, setDescription] = useState("");

  const [hideIdentity, setHideIdentity] = useState(false);

  const [media, setMedia] = useState<{
    base64: string | null;
    type: "image" | "video";
    name: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);

  async function chooseMedia() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: false,
        quality: 0.7,
        base64: true,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const file = result.assets[0];

      setMedia({
        base64: file.base64 || null,
        type: file.type === "video" ? "video" : "image",
        name: file.fileName || "evidence",
      });
    } catch (error) {
      console.log("MEDIA PICKER ERROR:", error);

      Alert.alert(
        "Media Error",
        "Unable to select the image or video."
      );
    }
  }

  async function submitReport() {
  if (!policeStation.trim()) {
    Alert.alert(
      "Missing Information",
      "Please enter the police station."
    );
    return;
  }

  if (!area.trim()) {
    Alert.alert(
      "Missing Information",
      "Please enter the reported area."
    );
    return;
  }

  if (!description.trim()) {
    Alert.alert(
      "Missing Information",
      "Please describe what happened."
    );
    return;
  }

  if (!dateOfIncident.trim()) {
    Alert.alert(
      "Missing Information",
      "Please enter the incident date."
    );
    return;
  }

  try {
    setLoading(true);

    const requestBody = {
      zilla,
      upazilla,
      policeStation: policeStation.trim(),
      area: area.trim(),
      roadName: roadName.trim(),
      roadNo: roadNo.trim(),
      dateOfIncident: dateOfIncident.trim(),
      category,
      description: description.trim(),

      hideIdentity: hideIdentity ? "Yes" : "No",

      mediaFile: media?.base64 || null,
      fileName: media?.name || "evidence",

      mediaType: media
        ? media.type.toUpperCase()
        : null,
    };

    console.log("SUBMITTING REPORT...");

    const result = await api(
      "/api/crimes",
      "POST",
      requestBody
    );

    console.log(
      "REPORT SUBMITTED:",
      JSON.stringify(result, null, 2)
    );

    // IMPORTANT:
    // If api() reaches this point without throwing,
    // the request was successful.

    setLoading(false);

    // Go directly to My Reports
    router.replace("/my-reports");

  } catch (error: any) {
    console.log("SUBMIT REPORT ERROR:", error);

    setLoading(false);

    Alert.alert(
      "Submission Failed",
      error?.message ||
        "Failed to submit the crime report."
    );
  }
}

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <Text style={styles.title}>
          Submit Crime Report
        </Text>

        {/* ZILLA */}
        <Text style={styles.label}>
          District / Zilla
        </Text>

        <View style={styles.picker}>
          <Picker
            selectedValue={zilla}
            onValueChange={(value) => setZilla(value)}
          >
            {ZILLAS.map((item) => (
              <Picker.Item
                key={item}
                label={item}
                value={item}
              />
            ))}
          </Picker>
        </View>

        {/* UPAZILLA */}
        <Text style={styles.label}>
          Upazilla
        </Text>

        <View style={styles.picker}>
          <Picker
            selectedValue={upazilla}
            onValueChange={(value) =>
              setUpazilla(value)
            }
          >
            {UPAZILLAS.map((item) => (
              <Picker.Item
                key={item}
                label={item}
                value={item}
              />
            ))}
          </Picker>
        </View>

        {/* POLICE STATION */}
        <Input
          placeholder="Police Station"
          value={policeStation}
          onChangeText={setPoliceStation}
        />

        {/* AREA */}
        <Input
          placeholder="Reported Area"
          value={area}
          onChangeText={setArea}
        />

        {/* ROAD NAME */}
        <Input
          placeholder="Road Name"
          value={roadName}
          onChangeText={setRoadName}
        />

        {/* ROAD NUMBER */}
        <Input
          placeholder="Road Number"
          value={roadNo}
          onChangeText={setRoadNo}
        />

        {/* INCIDENT DATE */}
        <Input
          placeholder="Incident Date YYYY-MM-DD"
          value={dateOfIncident}
          onChangeText={setDateOfIncident}
        />

        {/* CATEGORY */}
        <Text style={styles.label}>
          Crime Category
        </Text>

        <View style={styles.picker}>
          <Picker
            selectedValue={category}
            onValueChange={(value) =>
              setCategory(value)
            }
          >
            {CRIME_CATEGORIES.map((item) => (
              <Picker.Item
                key={item}
                label={item}
                value={item}
              />
            ))}
          </Picker>
        </View>

        {/* DESCRIPTION */}
        <TextInput
          style={styles.description}
          placeholder="Describe what happened..."
          multiline
          value={description}
          onChangeText={setDescription}
          textAlignVertical="top"
        />

        {/* HIDE IDENTITY */}
        <Pressable
          style={styles.option}
          onPress={() =>
            setHideIdentity(!hideIdentity)
          }
        >
          <Text style={styles.optionText}>
            {hideIdentity ? "✓ " : ""}
            Hide my identity
          </Text>
        </Pressable>

        {/* MEDIA */}
        <Pressable
          style={styles.mediaButton}
          onPress={chooseMedia}
        >
          <Text style={styles.mediaText}>
            {media
              ? `✓ ${media.type === "video" ? "Video" : "Image"} Selected`
              : "Choose Image / Video"}
          </Text>
        </Pressable>

        {/* SUBMIT */}
        <AppButton
          title="SUBMIT REPORT"
          onPress={submitReport}
          loading={loading}
        />
      </View>
    </ScrollView>
  );
}

function Input({
  placeholder,
  value,
  onChangeText,
}: {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}) {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },

  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 15,
  },

  title: {
    fontSize: 24,
    fontWeight: "900",
    color: COLORS.primary,
    marginBottom: 18,
  },

  label: {
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 5,
    marginTop: 5,
  },

  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    padding: 12,
    marginBottom: 10,
  },

  picker: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    overflow: "hidden",
    marginBottom: 10,
  },

  description: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    padding: 12,
    height: 130,
    marginTop: 10,
  },

  option: {
    backgroundColor: COLORS.lightBlue,
    padding: 13,
    borderRadius: 9,
    marginTop: 12,
  },

  optionText: {
    color: COLORS.primary,
    fontWeight: "700",
    textAlign: "center",
  },

  mediaButton: {
    backgroundColor: COLORS.lightBlue,
    padding: 13,
    borderRadius: 9,
    marginTop: 10,
  },

  mediaText: {
    textAlign: "center",
    color: COLORS.primary,
    fontWeight: "700",
  },
});