import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from '../screens/DashboardScreen';
import PortfolioScreen from '../screens/PortfolioScreen';
import AddStockScreen from '../screens/AddStockScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AdvisorsScreen from '../screens/AdvisorsScreen';
import AdvisorDetailScreen from '../screens/AdvisorDetailScreen';
import ChatRoomsScreen from '../screens/ChatRoomsScreen';
import ChatScreen from '../screens/ChatScreen';

const Tab = createBottomTabNavigator();
const PortfolioStack = createNativeStackNavigator();
const AdvisorsStack = createNativeStackNavigator();
const ChatStack = createNativeStackNavigator();

function PortfolioStackScreen() {
  return (
    <PortfolioStack.Navigator>
      <PortfolioStack.Screen 
        name="PortfolioList" 
        component={PortfolioScreen} 
        options={{ title: 'My Portfolio' }} 
      />
      <PortfolioStack.Screen 
        name="AddStock" 
        component={AddStockScreen} 
        options={{ title: 'Add Stock', presentation: 'modal' }} 
      />
    </PortfolioStack.Navigator>
  );
}

function AdvisorsStackScreen() {
  return (
    <AdvisorsStack.Navigator>
      <AdvisorsStack.Screen 
        name="AdvisorsList" 
        component={AdvisorsScreen} 
        options={{ title: 'Advisors' }} 
      />
      <AdvisorsStack.Screen 
        name="AdvisorDetail" 
        component={AdvisorDetailScreen} 
        options={{ title: 'Advisor Profile', headerBackTitle: 'Back' }} 
      />
    </AdvisorsStack.Navigator>
  );
}

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

export default function ClientTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Portfolio') {
            iconName = focused ? 'pie-chart' : 'pie-chart-outline';
          } else if (route.name === 'Advisors') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'ChatRooms') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Insights') {
            iconName = focused ? 'bulb' : 'bulb-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
        headerShown: true, // Show headers on tabs natively
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen 
        name="Portfolio" 
        component={PortfolioStackScreen} 
        options={{ headerShown: false }} 
      />
      <Tab.Screen 
        name="Advisors" 
        component={AdvisorsStackScreen} 
        options={{ headerShown: false }} 
      />
      <Tab.Screen 
        name="ChatRooms" 
        component={ChatStackScreen} 
        options={{ headerShown: false, title: 'Messages' }} 
      />
      <Tab.Screen name="Insights" component={AnalysisScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
