import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useAnalyticsStore } from '../../store/analyticsStore.js';
import CustomHeader from '../components/CustomHeader';

const FILTERS = ['weekly', 'monthly', 'yearly'];
const screenWidth = Dimensions.get('window').width - 32;

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(244, 196, 48, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForBackgroundLines: {
    stroke: '#eee',
  },
};

const AnalyticsScreen = () => {
  const { earningsData } = useAnalyticsStore();
  const [filter, setFilter] = useState('monthly');

  const data = useMemo(() => earningsData[filter], [filter]);
  const total = useMemo(() => data.reduce((sum, item) => sum + item.earnings, 0), [data]);

  // Prepare data for BarChart
  const barData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        data: data.map((d) => d.earnings),
      },
    ],
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <CustomHeader />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Total Earnings</Text>
        <Text style={styles.total}>₵ {total.toLocaleString()}</Text>

        {/* Filter Buttons */}
        <View style={styles.filterRow}>
          {FILTERS.map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setFilter(item)}
              style={[styles.filterBtn, filter === item && styles.activeFilterBtn]}
            >
              <Text style={[styles.filterText, filter === item && styles.activeFilterText]}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bar Chart */}
        <BarChart
          data={barData}
          width={screenWidth}
          height={300}
          yAxisLabel={'₵'}
          chartConfig={chartConfig}
          fromZero
          showValuesOnTopOfBars
          style={{ borderRadius: 16, marginVertical: 8 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnalyticsScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 6,
  },
  total: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 12,
  },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  activeFilterBtn: {
    backgroundColor: '#f4c430',
  },
  filterText: {
    fontSize: 12,
    color: '#555',
  },
  activeFilterText: {
    color: '#000',
    fontWeight: '600',
  },
});
