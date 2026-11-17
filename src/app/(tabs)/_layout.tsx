import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Text, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
import { theme } from "@/constants/theme";

const ACTIVE_COLOR = "#083461"; 
const INACTIVE_COLOR = "#8E9EAB"; 
const HIGHLIGHT_COLOR = "#b4e7ff"; 

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const currentTheme = colorScheme === 'dark' ? theme.dark : theme.light;

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false, // Hides the default overflowing text
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
        tabBarStyle: {
          backgroundColor: currentTheme.navBackground,
          borderTopWidth: 0, // Removes the default top border
          elevation: 0, 
          height: 70, // Taller to fit the full pill shape comfortably
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 10,
        },
        headerShown: false, 
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: focused ? HIGHLIGHT_COLOR : "transparent",
                borderRadius: 50, // Keeps the smooth pill shape
                width: 100, 
                height: 52, // Tall enough for both icon and text
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column", // Stacks the icon above the text inside the pill
              }}
            >
              <Ionicons name="speedometer-outline" color={String(color)} size={28} />
              <Text style={{ 
                color: String(color), 
                fontSize: 12, 
                fontWeight: focused ? "bold" : "500",
                marginTop: 2 
              }}>
                Dashboard
              </Text>
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="vehicles"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: focused ? HIGHLIGHT_COLOR : "transparent",
                borderRadius: 50,
                width: 100, 
                height: 52,
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Ionicons name="car-outline" color={String(color)} size={28} />
              <Text style={{ 
                color: String(color), 
                fontSize: 12, 
                fontWeight: focused ? "bold" : "500",
                marginTop: 2 
              }}>
                Vehicles
              </Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}