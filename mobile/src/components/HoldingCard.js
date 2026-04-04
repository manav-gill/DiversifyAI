import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

function formatCurrency(value) {
  return '₹' + Number(value || 0).toLocaleString('en-IN');
}

export default function HoldingCard({ holding, onDelete }) {
  return (
    <View style={styles.card}>
      <View style={styles.contentWrap}>
        <View style={styles.topRow}>
          <Text style={styles.symbol}>{holding.symbol}</Text>
          <Text style={styles.currentValue}>{formatCurrency(holding.currentValue)}</Text>
        </View>

        <View style={styles.middleRow}>
          <Text style={styles.metaText}>Qty: {holding.quantity}</Text>
          <Text style={styles.metaText}>Buy: {formatCurrency(holding.buyPrice)}</Text>
        </View>

        <View style={styles.bottomRow}>
          <View style={styles.sectorBadge}>
            <Text style={styles.sectorText}>{holding.sector}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(holding.id)}
      >
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8EEF4',
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  contentWrap: {
    flex: 1,
    marginRight: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  symbol: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  currentValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#00A86B',
  },
  middleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginRight: 14,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectorBadge: {
    backgroundColor: '#E8FBF3',
    borderWidth: 1,
    borderColor: '#BEEFD9',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  sectorText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F8A5F',
  },
  deleteButton: {
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECACD',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  deleteText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
});
