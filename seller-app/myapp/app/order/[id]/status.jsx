import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useOrderStore } from '../../../store/orderStore';
import SimpleHeader from '../../components/SimpleHeader';
import { Ionicons } from '@expo/vector-icons';

const STATUSES = [
  { key: 'Received', label: 'Received' },
  { key: 'Dispatched', label: 'Dispatched' },
  { key: 'Transit', label: 'Transit' },
  { key: 'Delivered', label: 'Delivered' },
];

const OrderStatusScreen = () => {
  const { id } = useLocalSearchParams();
  const order = useOrderStore((state) =>
    state.orders.find((o) => o.id === parseInt(id))
  );
  const updateStatus = useOrderStore((state) => state.updateStatus);
  const [loading, setLoading] = React.useState(false);

  const currentStep = STATUSES.findIndex(s => s.key === order.status);

  const handleDone = async () => {
    if (order.status !== 'Delivered') {
      const nextStep = STATUSES[currentStep + 1];
      if (nextStep) {
        setLoading(true);
        await updateStatus(order.id, nextStep.key);
        setLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <SimpleHeader title="Order Status" />
      <View style={styles.container}>
        <Text style={styles.boldTitle}>Delivered by Cartlyst</Text>
        <Text style={styles.orderId}>Order ID: {order.id}</Text>
        <View style={styles.trackerWrap}>
          {STATUSES.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            const isPending = idx > currentStep;
            const isLast = idx === STATUSES.length - 1;
            return (
              <View key={step.key} style={styles.trackerRow}>
                <View style={styles.trackerCol}>
                  <View style={styles.iconAlignRow}>
                    {isCompleted ? (
                      <View style={styles.circleDone}>
                        <Ionicons name="checkmark" size={18} color="#fff" />
                      </View>
                    ) : (
                      <View style={styles.squarePending}><Text style={styles.squareText}>{idx + 1}</Text></View>
                    )}
                  </View>
                  {/* Vertical line logic: */}
                  {!isLast && (
                    idx === currentStep - 1 ? (
                      // Special case: split line (top gold, bottom gray)
                      <View style={styles.verticalLineSplit}>
                        <View style={styles.lineGoldHalf} />
                        <View style={styles.lineGrayHalf} />
                      </View>
                    ) : (
                      <View style={[
                        styles.verticalLine,
                        isCompleted ? styles.lineGold : styles.lineGray,
                      ]} />
                    )
                  )}
                </View>
                <View style={styles.labelCol}>
                  <Text style={styles.trackerLabel}>{step.label}</Text>
                  {!isLast && isCurrent && (
                    <>
                      {step.key === 'Transit' && (
                        <Text style={styles.trackerMsg}>Your order is currently in transit</Text>
                      )}
                      <TouchableOpacity style={styles.doneBtn} onPress={handleDone} disabled={loading}>
                        {loading ? (
                          <ActivityIndicator color="#222" />
                        ) : (
                          <Text style={styles.doneBtnText}>Done</Text>
                        )}
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 18,
  },
  boldTitle: {
    fontWeight: '700',
    fontSize: 17,
    marginBottom: 2,
    marginTop: 4,
  },
  orderId: {
    fontSize: 15,
    marginBottom: 18,
  },
  trackerWrap: {
    marginBottom: 32,
    marginTop: 8,
  },
  trackerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  trackerCol: {
    alignItems: 'center',
    width: 36,
    position: 'relative',
    marginTop: 2,
  },
  iconAlignRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelCol: {
    flex: 1,
    justifyContent: 'flex-start',
    minHeight: 36,
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginLeft: 12,
  },
  trackerLabel: {
    fontSize: 16,
    color: '#111',
    fontWeight: '400',
    marginBottom: 2,
    textAlign: 'left',
  },
  trackerMsg: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
    marginBottom: 8,
    textAlign: 'left',
    width: '100%',
  },
  circleDone: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#D4AF37',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  squarePending: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#B0B0B0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  squareText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  verticalLine: {
    width: 2,
    height: 32,
    position: 'absolute',
    top: 28,
    left: 13,
    zIndex: -1,
  },
  lineGold: {
    backgroundColor: '#D4AF37',
  },
  lineGray: {
    backgroundColor: '#B0B0B0',
  },
  verticalLineSplit: {
    width: 2,
    height: 32,
    position: 'absolute',
    top: 28,
    left: 13,
    zIndex: -1,
    flexDirection: 'column',
  },
  lineGoldHalf: {
    backgroundColor: '#D4AF37',
    height: 16,
    width: 2,
  },
  lineGrayHalf: {
    backgroundColor: '#B0B0B0',
    height: 16,
    width: 2,
  },
  doneBtn: {
    backgroundColor: '#D4AF37',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 16,
    width: '100%',
    alignSelf: 'flex-start',
  },
  doneBtnText: {
    fontWeight: '700',
    fontSize: 20,
    color: '#222',
  },
});

export default OrderStatusScreen; 