import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { theme } from '@/constants/theme';
import { Link } from 'expo-router';

export default function DashboardScreen() {
  const colorScheme = useColorScheme();
  const currentTheme = colorScheme === 'dark' ? theme.dark : theme.light;

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.background }]}>
      <Text style={[styles.title, { color: currentTheme.text }]}>Dashboard Tab</Text>
      <Text style={[styles.subtitle, { color: currentTheme.text }]}>Health scores will go here</Text>
      <Link
        href="/modals/add-vehicle"
        style={[styles.link, { color: currentTheme.text, backgroundColor: currentTheme.btnBackground }]}
      >
        Test Add Vehicle Modal
      </Link>
      <Link
        href="/modals/log-service"
        style={[styles.link, { color: currentTheme.text, backgroundColor: currentTheme.btnBackground }]}
      >
        Test Log Service Modal
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  link: {
    marginTop: 20,
    fontWeight: 'bold',
    padding: 10,
    borderRadius: theme.borderRadius.default,
  }
});