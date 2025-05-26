import "@/global.css";
import { Slot } from "expo-router";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { ActivityIndicator, View } from "react-native";

export default function Layout() {
  const { isLoading } = useAuthCheck();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#e11d48" />
      </View>
    );
  }

  return <Slot />;
}
