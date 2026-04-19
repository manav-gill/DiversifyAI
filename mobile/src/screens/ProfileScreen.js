import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const accountOptions = [
  { id: 'o1', label: 'Edit Profile', icon: 'person-outline' },
  { id: 'o2', label: 'My Portfolio', icon: 'briefcase-outline' },
  { id: 'o3', label: 'Settings', icon: 'settings-outline' },
  { id: 'o4', label: 'Help & Support', icon: 'help-circle-outline' },
];

export default function ProfileScreen({ onLogout }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('@diversify_ai_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user info:', error.message);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    console.log('User logged out');

    if (typeof onLogout === 'function') {
      await onLogout();
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View>
        <View style={styles.userCard}>
          {loading ? (
            <ActivityIndicator size="small" color="#00C896" />
          ) : user ? (
            <>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
                </Text>
              </View>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </>
          ) : (
            <Text style={styles.userName}>Profile not found</Text>
          )}
        </View>

        <View style={styles.optionsCard}>
          {accountOptions.map((option, index) => {
            const isLast = index === accountOptions.length - 1;

            return (
              <TouchableOpacity
                key={option.id}
                style={[styles.optionRow, isLast && styles.optionRowLast]}
                activeOpacity={0.75}
              >
                <View style={styles.optionLeft}>
                  <Ionicons
                    name={option.icon}
                    size={20}
                    color="#334155"
                    style={styles.optionIcon}
                  />
                  <Text style={styles.optionLabel}>{option.label}</Text>
                </View>

                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color="#94A3B8"
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 26,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8EEF4',
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 18,
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#E7EEF7',
    borderWidth: 1,
    borderColor: '#D5E0EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  optionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8EEF4',
    paddingHorizontal: 14,
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.07,
    shadowRadius: 11,
    elevation: 4,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2F6',
  },
  optionRowLast: {
    borderBottomWidth: 0,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 10,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  logoutButton: {
    marginTop: 22,
    height: 50,
    borderRadius: 13,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7F1D1D',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
