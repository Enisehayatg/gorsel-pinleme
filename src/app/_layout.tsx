import "@/global.css";
import {Slot, Stack} from "expo-router";

export default function Layout() {

  return (
      <Stack screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="index" options={{ animation: 'none' }} />
        <Stack.Screen name="(auth)" options={{ animation: 'none' }} />
        <Stack.Screen name="(dashboard)" options={{ animation: 'none' }} />
      </Stack>
  );
}
