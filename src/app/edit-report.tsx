import { useEffect, useState } from "react";

import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

import {
    router,
    useLocalSearchParams,
} from "expo-router";

import { Picker } from "@react-native-picker/picker";

import { api } from "../services/api";

import AppButton from "../components/AppButton";

import {
    COLORS,
} from "../constants/themes";

import {
    CRIME_CATEGORIES,
    UPAZILLAS,
    ZILLAS,
} from "../constants/locations";

export default function EditReport() {
  const { crimeId } =
    useLocalSearchParams();

  const [report, setReport] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    loadReport();
  }, []);

  async function loadReport() {
    try {
      const result =
        await api("/api/my-reports");

      const found =
        result.reports.find(
          (r: any) =>
            String(r.crimeId) ===
            String(crimeId)
        );

      if (!found) {
        Alert.alert(
          "Error",
          "Report not found."
        );
        router.back();
        return;
      }

      setReport({
        ...found,
        roadName: found.roadName || "",
        roadNo: found.roadNo || "",
      });
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  }

  async function save() {
    try {
      setLoading(true);

      await api(
        `/api/reports/${crimeId}`,
        "PUT",
        {
          zilla: report.zilla,
          upazilla: report.upazilla,
          policeStation:
            report.policeStation,
          area: report.area,
          roadName:
            report.roadName,
          roadNo:
            report.roadNo,
          dateOfIncident:
            report.dateOfIncident,
          category:
            report.category,
          description:
            report.description,
          hideIdentity:
            report.hideIdentity === "YES" ||
            report.hideIdentity === true,
        }
      );

      Alert.alert(
        "Success",
        "Report updated.",
        [
          {
            text: "OK",
            onPress: () =>
              router.replace(
                "/my-reports"
              ),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        "Update Failed",
        error.message
      );
    } finally {
      setLoading(false);
    }
  }

  if (!report) {
    return (
      <View style={styles.loading}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (report.accepted !== "PENDING") {
    return (
      <View style={styles.loading}>
        <Text>
          This report can no longer be edited.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      <View style={styles.card}>
        <Text style={styles.title}>
          Edit Report
        </Text>

        <Text style={styles.label}>
          District
        </Text>

        <View style={styles.picker}>
          <Picker
            selectedValue={report.zilla}
            onValueChange={(value) =>
              setReport({
                ...report,
                zilla: value,
              })
            }
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
            selectedValue={report.upazilla}
            onValueChange={(value) =>
              setReport({
                ...report,
                upazilla: value,
              })
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

        <Input
          value={report.policeStation}
          placeholder="Police Station"
          onChangeText={(value: string) =>
            setReport({
              ...report,
              policeStation: value,
            })
          }
        />

        <Input
          value={report.area}
          placeholder="Area"
          onChangeText={(value: string) =>
            setReport({
              ...report,
              area: value,
            })
          }
        />

        <Input
          value={report.roadName}
          placeholder="Road Name"
          onChangeText={(value: string) =>
            setReport({
              ...report,
              roadName: value,
            })
          }
        />

        <Input
          value={report.roadNo}
          placeholder="Road Number"
          onChangeText={(value: string) =>
            setReport({
              ...report,
              roadNo: value,
            })
          }
        />

        <Input
          value={String(
            report.dateOfIncident || ""
          ).slice(0, 10)}
          placeholder="Date YYYY-MM-DD"
          onChangeText={(value: string) =>
            setReport({
              ...report,
              dateOfIncident: value,
            })
          }
        />

        <Text style={styles.label}>
          Category
        </Text>

        <View style={styles.picker}>
          <Picker
            selectedValue={report.category}
            onValueChange={(value) =>
              setReport({
                ...report,
                category: value,
              })
            }
          >
            {CRIME_CATEGORIES.map(
              (item) => (
                <Picker.Item
                  key={item}
                  label={item}
                  value={item}
                />
              )
            )}
          </Picker>
        </View>

        <TextInput
          style={styles.description}
          multiline
          value={report.description}
          placeholder="Description"
          onChangeText={(value) =>
            setReport({
              ...report,
              description: value,
            })
          }
        />

        <AppButton
          title="SAVE CHANGES"
          onPress={save}
          loading={loading}
        />
      </View>
    </ScrollView>
  );
}

function Input({
  value,
  placeholder,
  onChangeText,
}: any) {
  return (
    <TextInput
      style={styles.input}
      value={value}
      placeholder={placeholder}
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
    marginBottom: 15,
  },

  label: {
    fontWeight: "700",
    marginBottom: 5,
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
    height: 130,
    padding: 12,
    textAlignVertical: "top",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});