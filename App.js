import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
import { requestPermissions } from './src/utils/notifications';
import HomeScreen from './src/screens/HomeScreen';
import AddMedicineScreen from './src/screens/AddMedicineScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    (async () => {
      const granted = await requestPermissions();
      if (!granted) {
        Alert.alert(
          'Notifications Disabled',
          'MediKarp needs notification permissions to send medicine reminders. Please enable them in your phone settings.',
          [{ text: 'OK' }]
        );
      }
    })();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#1A1A1A' },
          headerTintColor: '#FF6B2B',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 18, color: '#FFFFFF' },
          headerBackTitle: 'Back',
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddMedicine"
          component={AddMedicineScreen}
          options={({ route }) => ({
            title: route.params?.medicine ? 'Edit Medicine' : 'Add Medicine',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
