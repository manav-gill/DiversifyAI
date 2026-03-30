import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import EarningsScreen from '../screens/EarningsScreen';
import ChatRoomsScreen from '../screens/ChatRoomsScreen';
import ChatScreen from '../screens/ChatScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();
const ChatStack = createNativeStackNavigator();

function ChatStackScreen() {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen 
        name="ChatRoomsList" 
        component={ChatRoomsScreen} 
        options={{ title: 'Messages' }} 
      />
      <ChatStack.Screen 
        name="Chat" 
        component={ChatScreen} 
        options={({ route }) => ({ title: route.params?.counterPartyName || 'Chat' })} 
      />
    </ChatStack.Navigator>
  );
}

export default function AdvisorTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Earnings') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'ChatRooms') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
      })}
    >
      <Tab.Screen name="Earnings" component={EarningsScreen} />
      <Tab.Screen 
        name="ChatRooms" 
        component={ChatStackScreen} 
        options={{ headerShown: false, title: 'Messages' }} 
      />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
