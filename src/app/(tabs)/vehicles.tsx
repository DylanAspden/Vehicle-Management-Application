import { View, Text, useColorScheme } from 'react-native';
import { theme, ui } from '@/constants/theme';
import { Link } from 'expo-router';

export default function VehiclesScreen() {
  const colorScheme = useColorScheme();
  const currentTheme = colorScheme === 'dark' ? theme.dark : theme.light;

  return (
    <View style={[ui.layout.screenCenter, { backgroundColor: currentTheme.background }]}>
      <Text style={[ui.typography.title, { color: currentTheme.text }]} >Vehicles Tab</Text>
      <Text style={[ui.typography.subtitle, { color: currentTheme.text }]} >List of vehicle profiles will go here</Text>
    </View>
  );
}