import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  RecentlySearched,
  RecentlyPurchased,
  Interests,
  Legal,
  RateApp,
} from './modalContent';
import DynamicModal from './dynamic-modal';

const AccountScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentModalType, setCurrentModalType] = useState(null);

  const openModal = (type) => {
    setCurrentModalType(type);
    setModalVisible(true);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <TouchableOpacity onPress={() => openModal('recentlySearched')}>
        <Text>Recently Searched</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => openModal('recentlyPurchased')}>
        <Text>Recently Purchased</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => openModal('interests')}>
        <Text>Interests</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => openModal('legal')}>
        <Text>Legal & About</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => openModal('rate')}>
        <Text>Rate My App</Text>
      </TouchableOpacity>

      <DynamicModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        modalType={currentModalType}
      />
    </View>
  );
};

export default AccountScreen;
