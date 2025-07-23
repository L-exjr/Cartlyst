import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';

export default function CustomHeader({ showBack = false, onSwitch }) {
  const router = useRouter();
  return (
    <View style={styles.header}>
      <View style={styles.leftRow}>
        {showBack && (
          <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn} accessibilityLabel="Go back" accessibilityRole="button">
            <Ionicons name="arrow-back" size={24} color="#222" />
          </TouchableOpacity>
        )}
        <Text style={styles.title}>Cartlyst</Text>
      </View>
      <TouchableOpacity onPress={onSwitch} style={styles.iconBtn} accessibilityLabel="Switch" accessibilityRole="button">
        <Text style={styles.switchText}>Switch</Text>
        <MaterialCommunityIcons name="transit-transfer" size={24} color="#222" style={{ marginLeft: 4 }} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
    height: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginRight: 8,
  },
  switchText: {
    fontSize: 16,
    color: '#222',
    fontWeight: '500',
  },
}); 