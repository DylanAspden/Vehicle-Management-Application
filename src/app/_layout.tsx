import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        
        <Stack.Screen 
          name="modals/add-vehicle" 
          options={{ 
            presentation: "modal", 
            title: "Add New Vehicle",
            headerShown: true 
          }} 
        />
        <Stack.Screen 
          name="modals/log-service" 
          options={{ 
            presentation: "modal", 
            title: "Log Service Event",
            headerShown: true
          }} 
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}