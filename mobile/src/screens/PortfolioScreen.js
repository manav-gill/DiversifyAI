import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import HoldingCard from '../components/HoldingCard';
import { addStock, getPortfolio } from '../services/portfolioService';

function formatCurrency(value) {
  return '₹' + Number(value || 0).toLocaleString('en-IN');
}

function normalizeHolding(item, index) {
  const symbol = item?.symbol || item?.stockSymbol || item?.name || 'N/A';
  const quantity = Number(item?.quantity) || 0;
  const buyPrice = Number(item?.buyPrice || item?.purchasePrice || item?.avgBuyPrice) || 0;
  const currentValue = Number(item?.currentValue || item?.totalValue || item?.marketValue) || 0;

  return {
    id: String(item?._id || item?.id || symbol + '-' + index),
    symbol,
    quantity,
    buyPrice,
    currentValue,
    sector: item?.sector || 'Unassigned',
  };
}

export default function PortfolioScreen() {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockSymbol, setStockSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const fetchPortfolioData = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getPortfolio();
      const rawHoldings = Array.isArray(data)
        ? data
        : data?.stocks || data?.holdings || [];

      const normalizedHoldings = rawHoldings.map(normalizeHolding);
      setHoldings(normalizedHoldings);

      if (typeof data?.totalInvestment === 'number') {
        setTotalInvestment(data.totalInvestment);
      } else {
        const computedTotal = normalizedHoldings.reduce(
          (sum, item) => sum + item.buyPrice * item.quantity,
          0
        );
        setTotalInvestment(computedTotal);
      }
    } catch (error) {
      console.error(
        'Failed to fetch portfolio:',
        error.response?.data?.message || error.message
      );
      setHoldings([]);
      setTotalInvestment(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  const handleAddStock = async () => {
    const trimmedSymbol = stockSymbol.trim().toUpperCase();
    const parsedQuantity = Number(quantity);
    const parsedBuyPrice = Number(buyPrice);

    if (!trimmedSymbol || parsedQuantity <= 0 || parsedBuyPrice <= 0) {
      console.error('Invalid stock input values');
      return;
    }

    setSubmitting(true);

    try {
      await addStock({
        stockSymbol: trimmedSymbol,
        quantity: parsedQuantity,
        buyPrice: parsedBuyPrice,
      });

      setStockSymbol('');
      setQuantity('');
      setBuyPrice('');

      await fetchPortfolioData();
    } catch (error) {
      console.error(
        'Failed to add stock:',
        error.response?.data?.message || error.message
      );
    } finally {
      setSubmitting(false);
    }
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
          value={stockSymbol}
          onChangeText={setStockSymbol}
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

        <TouchableOpacity
          style={[styles.addButton, submitting && styles.addButtonDisabled]}
          onPress={handleAddStock}
          disabled={submitting}
        >
          <Text style={styles.addButtonText}>
            {submitting ? 'Adding...' : 'Add Stock'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.holdingsSection}>
        <Text style={styles.sectionTitle}>Current Holdings</Text>
        <Text style={styles.holdingsSubtitle}>
          Total Investment: {formatCurrency(totalInvestment)}
        </Text>

        {loading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator size="large" color="#00C896" />
            <Text style={styles.loadingText}>Loading holdings...</Text>
          </View>
        ) : (
          <FlatList
            data={holdings}
            keyExtractor={(item) => item.id}
            renderItem={renderHoldingItem}
            scrollEnabled={false}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyStateCard}>
                <Text style={styles.emptyStateText}>No holdings yet</Text>
              </View>
            }
          />
        )}
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
  addButtonDisabled: {
    opacity: 0.65,
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
  loadingState: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8EEF4',
    paddingVertical: 22,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
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
