import { View, Text, useColorScheme } from 'react-native';
import { theme, ui } from '@/constants/theme';

export default function LogServiceModal() {
  const colorScheme = useColorScheme();
  const currentTheme = colorScheme === 'dark' ? theme.dark : theme.light;

  return (
    <View style={[ui.layout.screenCenter, { backgroundColor: currentTheme.background }]}>
      <Text style={[ui.typography.title, { color: currentTheme.text }]} >Log Service Event</Text>
      <Text style={[ui.typography.subtitle, { color: currentTheme.text }]} >ServiceLogForm and file upload will go here</Text>
    </View>
  );
}