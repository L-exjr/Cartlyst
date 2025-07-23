import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function NotFoundScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.container}>
        <Text style={styles.heading}>404 - Not Found</Text>
        <Text style={styles.text}>The page you are looking for does not exist.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f4c430',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
}); 