import { Stack, router } from "expo-router";
import { View, Text, Pressable, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme, ui } from "@/constants/theme";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const currentTheme = colorScheme === 'dark' ? theme.dark : theme.light;
  const insets = useSafeAreaInsets();

  const renderFloatingPillHeader = (title: string) => (
    <View style={[ui.layout.headerWrapper, { paddingTop: insets.top + 8 }]}>
      <View
        style={[
          ui.navigation.pillHeaderContainer, ui.shadows.floatingPill,
          { backgroundColor: currentTheme.glassyBackground, borderColor: currentTheme.glassyBorder },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          style={[ui.controls.HeaderButton, { backgroundColor: currentTheme.tabHighlight }]}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={22} color={currentTheme.tabActive} />
        </Pressable>

        <Text style={[ui.typography.headerTitle, { color: currentTheme.text }]}>
          {title}
        </Text>

        <View style={ui.controls.HeaderSpacer} />
      </View>
    </View>
  );

  return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />

        <Stack.Screen
          name="modals/add-vehicle"
          options={{
            presentation: "transparentModal",
            headerShown: true,
            headerTransparent: true,
            header: () => renderFloatingPillHeader("New Vehicle Profile"),
          }}
        />
        <Stack.Screen
          name="modals/log-service"
          options={{
            presentation: "transparentModal",
            headerShown: true,
            headerTransparent: true,
            header: () => renderFloatingPillHeader("Record Vehicle Service"),
          }}
        />
      </Stack>
  );
}