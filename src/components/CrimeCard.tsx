import { StyleSheet, View } from "react-native";
import type { ReactNode } from "react";

import {
  Card,
  Chip,
  Divider,
  Text,
  useTheme,
} from "react-native-paper";

import { router } from "expo-router";

import type { Crime } from "../types";

type Props = {
  crime: Crime;
  action?: ReactNode;
};

function value(value: unknown) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Not provided";
  }

  return String(value);
}

function getField(
  crime: Crime,
  lower: string,
  upper: string,
) {
  const data = crime as any;

  return data[lower] ?? data[upper];
}

export function CrimeCard({
  crime,
  action,
}: Props) {
  const theme = useTheme();

  const crimeId = getField(
    crime,
    "crime_id",
    "CRIME_ID",
  );

  const userName = getField(
    crime,
    "user_name",
    "USER_NAME",
  );

  const fullName = getField(
    crime,
    "full_name",
    "FULL_NAME",
  );

  const zilla = getField(
    crime,
    "zilla",
    "ZILLA",
  );

  const upazilla = getField(
    crime,
    "upazilla",
    "UPAZILLA",
  );

  const policeStation = getField(
    crime,
    "police_station",
    "POLICE_STATION",
  );

  const area = getField(
    crime,
    "area",
    "AREA",
  );

  const roadName = getField(
    crime,
    "road_name",
    "ROAD_NAME",
  );

  const roadNo = getField(
    crime,
    "road_no",
    "ROAD_NO",
  );

  const dateOfIncident = getField(
    crime,
    "date_of_incident",
    "DATE_OF_INCIDENT",
  );

  const category = getField(
    crime,
    "category",
    "CATEGORY",
  );

  const description = getField(
    crime,
    "description",
    "DESCRIPTION",
  );

  const status = getField(
    crime,
    "status",
    "STATUS",
  );

  const accepted = getField(
    crime,
    "accepted",
    "ACCEPTED",
  );

  const hideIdentity = getField(
    crime,
    "hide_identity",
    "HIDE_IDENTITY",
  );

  const acceptedBy = getField(
    crime,
    "accepted_by",
    "ACCEPTED_BY",
  );

  const upgradedBy = getField(
    crime,
    "upgraded_by",
    "UPGRADED_BY",
  );

  const policeId = getField(
    crime,
    "police_id",
    "POLICE_ID",
  );

  const mediaType = getField(
    crime,
    "media_type",
    "MEDIA_TYPE",
  );

  const road = [
    roadName,
    roadNo,
  ]
    .filter(
      (item) =>
        item !== undefined &&
        item !== null &&
        item !== "",
    )
    .join(" • ");

  return (
    <Card
      style={styles.card}
      onPress={() =>
        router.push(`/crime/${crimeId}`)
      }
    >
      <Card.Content>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text
              variant="titleLarge"
              style={styles.title}
            >
              {value(category) === "Not provided"
                ? "Crime Report"
                : value(category)}
            </Text>

            <Text
              variant="bodySmall"
              style={{
                color:
                  theme.colors.onSurfaceVariant,
              }}
            >
              Crime ID: {value(crimeId)}
            </Text>
          </View>

          <Chip>
            {value(status)}
          </Chip>
        </View>

        <Divider style={styles.divider} />

        {/* Description */}
        <Text variant="titleMedium">
          Description
        </Text>

        <Text
          variant="bodyMedium"
          style={[
            styles.description,
            {
              color:
                theme.colors.onSurfaceVariant,
            },
          ]}
        >
          {value(description)}
        </Text>

        <Divider style={styles.divider} />

        {/* Reporter */}
        <Text variant="titleMedium">
          Reporter
        </Text>

        <InfoRow
          label="Full name"
          value={fullName}
        />

        <InfoRow
          label="Username"
          value={userName}
        />

        {hideIdentity ? (
          <InfoRow
            label="Identity hidden"
            value={hideIdentity}
          />
        ) : null}

        <Divider style={styles.divider} />

        {/* Location */}
        <Text variant="titleMedium">
          Location
        </Text>

        <InfoRow
          label="District"
          value={zilla}
        />

        <InfoRow
          label="Upazila"
          value={upazilla}
        />

        <InfoRow
          label="Police station"
          value={policeStation}
        />

        <InfoRow
          label="Area"
          value={area}
        />

        <InfoRow
          label="Road"
          value={road}
        />

        <Divider style={styles.divider} />

        {/* Incident */}
        <Text variant="titleMedium">
          Incident
        </Text>

        <InfoRow
          label="Incident date"
          value={dateOfIncident}
        />

        <InfoRow
          label="Category"
          value={category}
        />

        <Divider style={styles.divider} />

        {/* Processing */}
        <Text variant="titleMedium">
          Processing
        </Text>

        <InfoRow
          label="Accepted"
          value={accepted}
        />

        <InfoRow
          label="Accepted by"
          value={acceptedBy}
        />

        <InfoRow
          label="Upgraded by"
          value={upgradedBy}
        />

        <InfoRow
          label="Police ID"
          value={policeId}
        />

        <InfoRow
          label="Media type"
          value={mediaType}
        />

      </Card.Content>

      {/* Optional action button */}
      {action ? (
        <Card.Actions style={styles.actions}>
          {action}
        </Card.Actions>
      ) : null}
    </Card>
  );
}

function InfoRow({
  label,
  value: textValue,
}: {
  label: string;
  value: unknown;
}) {
  return (
    <View style={styles.infoRow}>
      <Text
        variant="bodyMedium"
        style={styles.label}
      >
        {label}
      </Text>

      <Text
        variant="bodyMedium"
        style={styles.value}
      >
        {value(textValue)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    marginBottom: 12,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  titleContainer: {
    flex: 1,
  },

  title: {
    fontWeight: "700",
  },

  divider: {
    marginVertical: 14,
  },

  description: {
    marginTop: 6,
    lineHeight: 21,
  },

  infoRow: {
    flexDirection: "row",
    paddingVertical: 5,
    gap: 12,
  },

  label: {
    width: 125,
    fontWeight: "600",
  },

  value: {
    flex: 1,
  },

  actions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});