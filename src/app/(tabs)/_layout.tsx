import { Tabs } from "expo-router";
import { View, Text, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons"; 
import { theme, ui } from "@/constants/theme";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const currentTheme = colorScheme === 'dark' ? theme.dark : theme.light;

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: currentTheme.tabActive,
        tabBarInactiveTintColor: currentTheme.tabInactive,
        tabBarStyle: [ui.navigation.tabBar, { backgroundColor: currentTheme.navBackground }],
        headerShown: false,
        animation: "shift",
        sceneStyle: { backgroundColor: currentTheme.background },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={[ui.controls.iconBtn, {
                backgroundColor: focused ? currentTheme.tabHighlight : "transparent",
                borderRadius: theme.borderRadius.default,
              }]}
            >
              <Ionicons name="speedometer-outline" color={String(color)} size={28} />
              <Text style={[ui.typography.tabLabel, { 
                color: String(color), 
                fontWeight: focused ? "bold" : "500",
              }]}>
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
              style={[ui.controls.iconBtn, {
                backgroundColor: focused ? currentTheme.tabHighlight : "transparent",
                borderRadius: theme.borderRadius.default,
              }]}
            >
              <Ionicons name="car-outline" color={String(color)} size={28} />
              <Text style={[ui.typography.tabLabel, { 
                color: String(color), 
                fontWeight: focused ? "bold" : "500",
              }]}>
                Vehicles
              </Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}