import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../screens/DashboardScreen';
import PortfolioScreen from '../screens/PortfolioScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import AdvisorsScreen from '../screens/AdvisorsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const iconByRoute = {
  Dashboard: 'home',
  Portfolio: 'briefcase',
  Analysis: 'bar-chart',
  Advisors: 'people',
  Profile: 'person',
};

export default function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={({ route }) => ({
        headerTitleAlign: 'center',
        tabBarActiveTintColor: '#00C896',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={iconByRoute[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Portfolio" component={PortfolioScreen} />
      <Tab.Screen name="Analysis" component={AnalysisScreen} />
      <Tab.Screen name="Advisors" component={AdvisorsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    height: 68,
    paddingTop: 8,
    paddingBottom: 8,
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 2,
  },
});
