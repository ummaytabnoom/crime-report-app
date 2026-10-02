import { StyleSheet, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";

export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const theme = useTheme();
  return (
    <View style={[styles.box, { backgroundColor: theme.colors.errorContainer }]}>
      <Text style={{ color: theme.colors.onErrorContainer, flex: 1 }}>{message}</Text>
      {onRetry ? <Button compact onPress={onRetry}>Retry</Button> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
