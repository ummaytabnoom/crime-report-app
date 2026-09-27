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

import { Picker } from "@react-native-picker/picker";

import * as ImagePicker from "expo-image-picker";

import { router } from "expo-router";

import AppButton from "../components/AppButton";

import { api } from "../services/api";

import {
    COLORS,
} from "../constants/themes";

import {
    CRIME_CATEGORIES,
    UPAZILLAS,
    ZILLAS,
} from "../constants/locations";

export default function NewReport() {
  const [zilla, setZilla] = useState(ZILLAS[0]);
  const [upazilla, setUpazilla] = useState(UPAZILLAS[0]);

  const [policeStation, setPoliceStation] =
    useState("");

  const [area, setArea] = useState("");
  const [roadName, setRoadName] = useState("");
  const [roadNo, setRoadNo] = useState("");

  const [dateOfIncident, setDateOfIncident] =
    useState(
      new Date().toISOString().slice(0, 10)
    );

  const [category, setCategory] =
    useState(CRIME_CATEGORIES[0]);

  const [description, setDescription] =
    useState("");

  const [hideIdentity, setHideIdentity] =
    useState(false);

  const [media, setMedia] = useState<any>(null);

  const [loading, setLoading] = useState(false);

  async function chooseMedia() {
    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images", "videos"],
        allowsEditing: false,
        quality: 0.7,
        base64: true,
      });

    if (!result.canceled) {
      const file = result.assets[0];

      setMedia({
        base64: file.base64,
        type:
          file.type === "video"
            ? "video"
            : "image",
        name: file.fileName,
      });
    }
  }

  async function submitReport() {
    if (
      !policeStation ||
      !area ||
      !description
    ) {
      Alert.alert(
        "Missing Information",
        "Please fill in police station, area and description."
      );

      return;
    }

    try {
      setLoading(true);

      await api("/api/reports", "POST", {
        zilla,
        upazilla,
        policeStation,
        area,
        roadName,
        roadNo,
        dateOfIncident,
        category,
        description,
        hideIdentity,

        mediaBase64: media?.base64 || null,
        mediaType: media?.type || null,
      });

      Alert.alert(
        "Report Submitted",
        "Your report is now waiting for admin approval.",
        [
          {
            text: "OK",
            onPress: () =>
              router.replace("/my-reports"),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        "Submission Failed",
        error.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>
          Submit Crime Report
        </Text>

        <Text style={styles.label}>
          District / Zilla
        </Text>

        <View style={styles.picker}>
          <Picker
            selectedValue={zilla}
            onValueChange={setZilla}
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

        <Text style={styles.label}>
          Upazilla
        </Text>

        <View style={styles.picker}>
          <Picker
            selectedValue={upazilla}
            onValueChange={setUpazilla}
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

        <Input
          placeholder="Police Station"
          value={policeStation}
          onChangeText={setPoliceStation}
        />

        <Input
          placeholder="Reported Area"
          value={area}
          onChangeText={setArea}
        />

        <Input
          placeholder="Road Name"
          value={roadName}
          onChangeText={setRoadName}
        />

        <Input
          placeholder="Road Number"
          value={roadNo}
          onChangeText={setRoadNo}
        />

        <Input
          placeholder="Incident Date YYYY-MM-DD"
          value={dateOfIncident}
          onChangeText={setDateOfIncident}
        />

        <Text style={styles.label}>
          Crime Category
        </Text>

        <View style={styles.picker}>
          <Picker
            selectedValue={category}
            onValueChange={setCategory}
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

        <TextInput
          style={styles.description}
          placeholder="Describe what happened..."
          multiline
          value={description}
          onChangeText={setDescription}
        />

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

        <Pressable
          style={styles.mediaButton}
          onPress={chooseMedia}
        >
          <Text style={styles.mediaText}>
            {media
              ? "✓ Media Selected"
              : "Choose Image / Video"}
          </Text>
        </Pressable>

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
}: any) {
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
    textAlignVertical: "top",
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