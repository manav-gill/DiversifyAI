import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import ChatScreen from '../screens/ChatScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator({ onLogout }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs">
        {(props) => <TabNavigator {...props} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={({ route }) => ({
          headerShown: true,
          title: route.params?.advisorName ? `${route.params.advisorName} Chat` : 'Consultation'
        })}
      />
    </Stack.Navigator>
  );
}
