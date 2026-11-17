import { View, Text, StyleSheet } from 'react-native';

export default function VehiclesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vehicles Tab</Text>
      <Text style={styles.subtitle}>List of vehicle profiles will go here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F8', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0A2540', 
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E9EAB',
  }
});