import { View, Text, useColorScheme } from 'react-native';
import { theme, ui } from '@/constants/theme';
import { Link } from 'expo-router';

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const currentTheme = colorScheme === 'dark' ? theme.dark : theme.light;

  return (
    <View style={[ui.layout.screenCenter, { backgroundColor: currentTheme.background }]}>
      <Text style={[ui.typography.title, { color: currentTheme.text }]}>Dashboard Tab</Text>
      <Text style={[ui.typography.subtitle, { color: currentTheme.text }]}>Health scores will go here</Text>
      <Link
        href="/modals/add-vehicle"
        style={[ui.controls.LinkButton, { color: currentTheme.text, backgroundColor: currentTheme.btnBackground }]}
      >
        Test Add Vehicle Modal
      </Link>
      <Link
        href="/modals/log-service"
        style={[ui.controls.LinkButton, { color: currentTheme.text, backgroundColor: currentTheme.btnBackground }]}
      >
        Test Log Service Modal
      </Link>
    </View>
  );
}