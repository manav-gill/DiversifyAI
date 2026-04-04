import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TestScreen from '../screens/TestScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTintColor: '#000000',
        headerTitleStyle: {
          fontWeight: '600',
        },
        cardStyle: {
          backgroundColor: '#ffffff',
        },
      }}
    >
      <Stack.Screen
        name="TestScreen"
        component={TestScreen}
        options={{
          title: 'PortfolioPilot Mobile',
        }}
      />
    </Stack.Navigator>
  );
}
