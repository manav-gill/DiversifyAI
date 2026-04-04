import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import HoldingCard from '../components/HoldingCard';

const initialHoldings = [
  {
    id: 'h1',
    symbol: 'RELIANCE',
    quantity: 110,
    buyPrice: 2520,
    currentValue: 304150,
    sector: 'Energy',
  },
  {
    id: 'h2',
    symbol: 'HDFCBANK',
    quantity: 180,
    buyPrice: 1585,
    currentValue: 311220,
    sector: 'Banking',
  },
  {
    id: 'h3',
    symbol: 'TCS',
    quantity: 70,
    buyPrice: 3640,
    currentValue: 272440,
    sector: 'IT',
  },
  {
    id: 'h4',
    symbol: 'SUNPHARMA',
    quantity: 120,
    buyPrice: 1410,
    currentValue: 179880,
    sector: 'Pharma',
  },
];

export default function PortfolioScreen() {
  const [stockQuery, setStockQuery] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [holdings, setHoldings] = useState(initialHoldings);

  const handleAddStock = () => {
    const trimmedSymbol = stockQuery.trim().toUpperCase();
    const parsedQuantity = Number(quantity);
    const parsedBuyPrice = Number(buyPrice);

    if (!trimmedSymbol || !parsedQuantity || !parsedBuyPrice) {
      return;
    }

    const newHolding = {
      id: Date.now().toString(),
      symbol: trimmedSymbol,
      quantity: parsedQuantity,
      buyPrice: parsedBuyPrice,
      currentValue: Math.round(parsedQuantity * parsedBuyPrice * 1.06),
      sector: 'Unassigned',
    };

    setHoldings((prev) => [newHolding, ...prev]);
    setStockQuery('');
    setQuantity('');
    setBuyPrice('');
  };

  const handleDeleteStock = (id) => {
    setHoldings((prev) => prev.filter((item) => item.id !== id));
  };

  const renderHoldingItem = ({ item }) => (
    <HoldingCard holding={item} onDelete={handleDeleteStock} />
  );

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.headerSection}>
        <Text style={styles.headerTitle}>Portfolio Management</Text>
        <Text style={styles.headerSubtitle}>
          Add holdings, review stock-level exposure, and manage your portfolio
        </Text>
      </View>

      <View style={styles.addCard}>
        <Text style={styles.sectionTitle}>Add New Holding</Text>

        <TextInput
          style={styles.input}
          placeholder="Search Stock (e.g. RELI)"
          placeholderTextColor="#94A3B8"
          value={stockQuery}
          onChangeText={setStockQuery}
          autoCapitalize="characters"
        />

        <TextInput
          style={styles.input}
          placeholder="Quantity"
          placeholderTextColor="#94A3B8"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Buy Price"
          placeholderTextColor="#94A3B8"
          value={buyPrice}
          onChangeText={setBuyPrice}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.addButton} onPress={handleAddStock}>
          <Text style={styles.addButtonText}>Add Stock</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.holdingsSection}>
        <Text style={styles.sectionTitle}>Current Holdings</Text>
        <Text style={styles.holdingsSubtitle}>Total Investment: ₹2,900,806</Text>

        <FlatList
          data={holdings}
          keyExtractor={(item) => item.id}
          renderItem={renderHoldingItem}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyStateCard}>
              <Text style={styles.emptyStateText}>No holdings added yet.</Text>
            </View>
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 30,
  },
  headerSection: {
    marginBottom: 18,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '500',
    color: '#475569',
  },
  addCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E8EEF4',
    padding: 16,
    marginBottom: 22,
    shadowColor: '#0F172A',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  input: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCE5EE',
    backgroundColor: '#FBFDFF',
    paddingHorizontal: 14,
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
    marginBottom: 10,
  },
  addButton: {
    marginTop: 6,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#00C896',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  holdingsSection: {
    marginBottom: 8,
  },
  holdingsSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginTop: -4,
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 6,
  },
  emptyStateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8EEF4',
    paddingVertical: 20,
    paddingHorizontal: 14,
  },
  emptyStateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
    textAlign: 'center',
  },
});
