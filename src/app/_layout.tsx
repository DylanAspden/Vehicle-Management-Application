import { useCallback, useEffect, useRef, useState } from "react";
import { Stack, router } from "expo-router";
import {
  View,
  Text,
  Pressable,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { theme, ui } from "@/constants/theme";
import {
  authenticateDeviceAsync,
  initializeAppServicesAsync,
} from "@/services/AppGate";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const currentTheme = colorScheme === "dark" ? theme.dark : theme.light;
  const insets = useSafeAreaInsets();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isBootReady, setIsBootReady] = useState(false);
  const isAuthenticatingRef = useRef(false);

  const authenticateUser = useCallback(async () => {
    if (isAuthenticatingRef.current) return;
    isAuthenticatingRef.current = true;
    setIsAuthenticated(null);

    try {
      const status = await authenticateDeviceAsync();
      setIsAuthenticated(status === "unlocked");
    } finally {
      isAuthenticatingRef.current = false;
    }
  }, []);

  useEffect(() => {
    authenticateUser();
  }, [authenticateUser]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const initializeApp = async () => {
      try {
        await initializeAppServicesAsync();
      } catch (error) {
        console.error("Error during app initialization:", error);
      } finally {
        setIsBootReady(true);
      }
    };
    initializeApp();
  }, [isAuthenticated]);

  const renderFloatingPillHeader = (title: string) => (
    <View style={[ui.layout.headerWrapper, { paddingTop: insets.top + 8 }]}>
      <View
        style={[
          ui.navigation.pillHeaderContainer,
          ui.shadows.floatingPill,
          {
            backgroundColor: currentTheme.glassyBackground,
            borderColor: currentTheme.glassyBorder,
          },
        ]}
      >
        <Pressable
          onPress={() => router.back()}
          style={[
            ui.controls.HeaderButton,
            { backgroundColor: currentTheme.tabHighlight },
          ]}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={currentTheme.tabActive}
          />
        </Pressable>

        <Text style={[ui.typography.headerTitle, { color: currentTheme.text }]}>
          {title}
        </Text>

        <View style={ui.controls.HeaderSpacer} />
      </View>
    </View>
  );

  if (isAuthenticated === false) {
    return (
      <View
        style={[
          ui.layout.screenCenter,
          { backgroundColor: currentTheme.background },
        ]}
      >
        <Text style={[ui.typography.title, { color: currentTheme.text }]}>
          App Locked
        </Text>
        <Text style={[ui.typography.subtitle, { color: currentTheme.text }]}>
          Verify with your device PIN or biometrics to continue
        </Text>
        <Pressable
          onPress={authenticateUser}
          style={[
            ui.controls.primaryButton,
            { backgroundColor: currentTheme.btnBackground },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Unlock application"
        >
          <Text
            style={[ui.typography.headerTitle, { color: currentTheme.text }]}
          >
            Tap to Unlock
          </Text>
        </Pressable>
      </View>
    );
  }

  if (!isBootReady || isAuthenticated === null) {
    return (
      <View
        style={[
          ui.layout.screenCenter,
          { backgroundColor: currentTheme.background },
        ]}
      >
        <ActivityIndicator size="large" color={currentTheme.tabActive} />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        contentStyle: { backgroundColor: currentTheme.background },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          animation: "none",
          contentStyle: { backgroundColor: currentTheme.background },
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          animation: "fade",
          contentStyle: { backgroundColor: currentTheme.background },
        }}
      />

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
