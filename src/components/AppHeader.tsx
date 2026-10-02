import { Appbar } from "react-native-paper";
import { router } from "expo-router";

type Props = {
  title: string;
  back?: boolean;
  actionIcon?: string;
  onAction?: () => void;
};

export function AppHeader({ title, back, actionIcon, onAction }: Props) {
  return (
    <Appbar.Header elevated>
      {back ? <Appbar.BackAction onPress={() => router.back()} /> : null}
      <Appbar.Content title={title} />
      {actionIcon && onAction ? (
        <Appbar.Action icon={actionIcon} onPress={onAction} />
      ) : null}
    </Appbar.Header>
  );
}
