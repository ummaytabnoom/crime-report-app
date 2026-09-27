import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
} from "react-native";

import { COLORS } from "../constants/themes";

type Props = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  danger?: boolean;
};

export default function AppButton({
  title,
  onPress,
  loading = false,
  danger = false,
}: Props) {
  return (
    <Pressable
      style={[
        styles.button,
        {
          backgroundColor: danger
            ? COLORS.danger
            : COLORS.secondary,
        },
      ]}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
  },

  text: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});