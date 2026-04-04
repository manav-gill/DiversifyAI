import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TestScreen from '../screens/TestScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="TestScreen">
      <Stack.Screen
        name="TestScreen"
        component={TestScreen}
        options={{ title: 'PortfolioPilot Mobile' }}
      />
    </Stack.Navigator>
  );
}
