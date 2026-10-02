import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export function EmptyState({ title, text }: { title: string; text: string }) {
  const theme = useTheme();
  return (
    <View style={styles.wrap}>
      <MaterialCommunityIcons
        name="file-search-outline"
        size={52}
        color={theme.colors.primary}
      />
      <Text variant="titleMedium">{title}</Text>
      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant, textAlign: "center" }}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minHeight: 220,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: 20,
  },
});
