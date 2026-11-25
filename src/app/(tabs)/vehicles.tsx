// Imports: React Native UI primitives, theme tokens, and VehicleController actions
import { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  useColorScheme,
} from "react-native";
import { theme, ui } from "@/constants/theme";
import { VehicleProfile } from "@/models";
import {
  createVehicleProfileAsync,
  ensureVehicleStoreReadyAsync,
  listVehicleProfilesAsync,
  inspectDatabaseStateAsync,
} from "@/controllers/VehicleController";

export default function VehiclesScreen() {
  const colorScheme = useColorScheme();
  const currentTheme = colorScheme === "dark" ? theme.dark : theme.light;

  const [vehicles, setVehicles] = useState<VehicleProfile[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>("Idle");
  const [dbInfo, setDbInfo] = useState<string>("Not checked yet");

  const refreshVehicles = useCallback(async () => {
    const result = await listVehicleProfilesAsync();
    if (result.ok) {
      setVehicles(result.data);
    } else {
      setStatusMessage(result.error);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const ready = await ensureVehicleStoreReadyAsync();
      if (!ready.ok) {
        setStatusMessage(ready.error);
        return;
      }
      setStatusMessage("SQLite ready");
      await refreshVehicles();
    })();
  }, [refreshVehicles]);

  const handleAddTestVehicle = async () => {
    setStatusMessage("Saving test vehicle...");
    const res = await createVehicleProfileAsync({
      make: "Toyota",
      model: "Camry Hybrid",
      year: 2022,
      current_mileage: 38400,
      registration: "ABC123",
    });

    if (!res.ok) {
      setStatusMessage(res.error);
      return;
    }

    setStatusMessage(
      `Saved #${res.data.vehicle_id}: ${res.data.make} ${res.data.model}`,
    );
    await refreshVehicles();
  };

  const handleCheckDb = async () => {
    const info = await inspectDatabaseStateAsync();
    if (!info.ok) {
      setDbInfo(info.error);
      return;
    }

    setDbInfo(
      `FK: ${info.data.foreignKeysEnabled ? "ON" : "OFF"} | Rows: ${
        info.data.vehicleCount
      } | Tables (${info.data.tables.length}): ${info.data.tables.join(", ")}`,
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: currentTheme.background }}
      contentContainerStyle={ui.layout.screenCenter}
    >
      <Text style={[ui.typography.title, { color: currentTheme.text }]}>
        Vehicles Tab
      </Text>
      <Text style={[ui.typography.subtitle, { color: currentTheme.text }]}>
        Status: {statusMessage}
      </Text>

      <Pressable
        onPress={handleAddTestVehicle}
        style={[
          ui.controls.primaryButton,
          { backgroundColor: currentTheme.btnBackground },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Create test vehicle"
      >
        <Text style={[ui.typography.headerTitle, { color: currentTheme.text }]}>
          Test Create Vehicle
        </Text>
      </Pressable>

      {vehicles.map((item) => (
        <Text
          key={item.vehicle_id}
          style={[
            ui.typography.subtitle,
            { color: currentTheme.text, marginTop: 8 },
          ]}
        >
          #{item.vehicle_id} - {item.year} {item.make} {item.model} (
          {item.registration}) · {item.current_mileage} km
        </Text>
      ))}

      <Pressable
        onPress={handleCheckDb}
        style={[
          ui.controls.primaryButton,
          { backgroundColor: currentTheme.btnBackground, marginTop: 12 },
        ]}
        accessibilityRole="button"
        accessibilityLabel="Inspect database tables and foreign keys"
      >
        <Text style={[ui.typography.headerTitle, { color: currentTheme.text }]}>
          Check DB Tables
        </Text>
      </Pressable>

      <Text
        style={[
          ui.typography.subtitle,
          { color: currentTheme.text, marginTop: 12, textAlign: "center" },
        ]}
      >
        {dbInfo}
      </Text>
    </ScrollView>
  );
}
