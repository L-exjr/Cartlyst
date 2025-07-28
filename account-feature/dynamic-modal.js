import React from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';

import RecentlySearched from './modalContent/RecentlySearched';
import RecentlyPurchased from './modalContent/RecentlyPurchased';
import Interests from './modalContent/Interests';
import LegalAndAbout from './modalContent/Legal';
import RateApp from './modalContent/RateApp';

const DynamicModal = ({ visible, onClose, modalType }) => {
  const renderContent = () => {
    switch (modalType) {
      case 'currency':
        return <Currency />;
      case 'orders':
        return <Orders />;
      case 'vouchers':
        return <Vouchers />;
      case 'ratingsAndReviews':
        return <RatingsAndReviews />;
      case 'interests':
        return <Interests />;
      case 'recentlyViewed':
        return <RecentlyViewed />;
      case 'recentlySearched':
        return <RecentlySearched />;
      case 'buyAgain':
        return <RecentlyPurchased />;
      case 'listAndRegistries':
        return <ListAndRegistries />;
      case 'paymentSettings':
        return <PaymentSettings />;
      case 'addressBook':
        return <AddressBook />;
      case 'legalAndAbout':
        return <LegalAndAbout />;
      case 'rateOurApp':
        return <RateApp />;
      default:
        return <Text>Unknown Content</Text>;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={true}
    >
      <View style={{ flex: 1, backgroundColor: 'white', marginTop: 50, padding: 20 }}>
        <TouchableOpacity onPress={onClose}>
          <Text style={{ color: 'blue' }}>Close</Text>
        </TouchableOpacity>
        {renderContent()}
      </View>
    </Modal>
  );
};

export default DynamicModal;
