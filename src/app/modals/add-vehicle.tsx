import { View, Text, StyleSheet } from 'react-native';

export default function AddVehicleModal() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Vehicle</Text>
      <Text style={styles.subtitle}>VehicleProfileForm will go here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Modals usually have a clean white background
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0A2540',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E9EAB',
  }
});