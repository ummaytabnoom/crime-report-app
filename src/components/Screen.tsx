import { PropsWithChildren } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

type Props = PropsWithChildren<{
  refreshing?: boolean;
  onRefresh?: () => void;
  scroll?: boolean;
}>;

export function Screen({
  children,
  refreshing = false,
  onRefresh,
  scroll = true,
}: Props) {
  const theme = useTheme();

  if (!scroll) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {children}
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.content}
      refreshControl={
        onRefresh ? (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        ) : undefined
      }
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 18,
    paddingBottom: 40,
    gap: 14,
  },
});
