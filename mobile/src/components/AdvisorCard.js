import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function getInitials(name) {
  if (!name) return '--';
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function AdvisorCard({ advisor, onBook }) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.identityRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(advisor.name)}</Text>
          </View>

          <View>
            <Text style={styles.name}>{advisor.name}</Text>
            <Text style={styles.specialization}>{advisor.specialization}</Text>
          </View>
        </View>

        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>★ {advisor.rating}</Text>
        </View>
      </View>

      <View style={styles.priceBadge}>
        <Text style={styles.priceText}>₹2000 / session</Text>
      </View>

      <View style={styles.detailsWrap}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Experience</Text>
          <Text style={styles.detailValue}>{advisor.experience} years</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Clients handled</Text>
          <Text style={styles.detailValue}>{advisor.clients}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Languages</Text>
          <Text style={styles.detailValue}>{advisor.languages}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.bookButton}
        onPress={() => onBook(advisor.id)}
      >
        <Text style={styles.bookButtonText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8EEF4',
    padding: 16,
    marginBottom: 14,
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  identityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E9F1F9',
    borderWidth: 1,
    borderColor: '#D4E1EE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  specialization: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  ratingBadge: {
    backgroundColor: '#E8FBF3',
    borderWidth: 1,
    borderColor: '#C8F3E2',
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F8A5F',
  },
  priceBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#DBEAFE',
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  priceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  detailsWrap: {
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  bookButton: {
    height: 46,
    borderRadius: 12,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
