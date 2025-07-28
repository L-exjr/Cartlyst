import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { COLORS, SPACING, TYPOGRAPHY } from "../../../utils/theme";
import { commonStyles } from "../../../utils/styles";

import Currency from "./modalContent/Currency";
import Orders from "./modalContent/Orders";
import Vouchers from "./modalContent/Vouchers";
import RatingsAndReviews from "./modalContent/RatingsAndReviews";
import Interests from "./modalContent/Interests";
import RecentlyViewed from "./modalContent/RecentlyViewed";
import RecentlySearched from "./modalContent/RecentlySearched";
import BuyAgain from "./modalContent/BuyAgain";
import ListAndRegistries from "./modalContent/ListAndRegistries";
import PaymentSettings from "./modalContent/PaymentSettings";
import AddressBook from "./modalContent/AddressBook";
import LegalAndAbout from "./modalContent/LegalAndAbout";
import RateApp from "./modalContent/RateApp";

export default function ModalScreens() {
  const router = useRouter();
  const ModalScreen = ({ visible, onClose, modalType }) => {
    const renderContent = () => {
      switch (modalType) {
        case "currency":
          return <Currency />;
        case "orders":
          return <Orders />;
        case "vouchers":
          return <Vouchers />;
        case "ratingsAndReviews":
          return <RatingsAndReviews />;
        case "interests":
          return <Interests />;
        case "recentlyViewed":
          return <RecentlyViewed />;
        case "recentlySearched":
          return <RecentlySearched />;
        case "buyAgain":
          return <BuyAgain />;
        case "listAndRegistries":
          return <ListAndRegistries />;
        case "paymentSettings":
          return <PaymentSettings />;
        case "addressBook":
          return <AddressBook />;
        case "legalAndAbout":
          return <LegalAndAbout />;
        case "rateOurApp":
          return <RateApp />;
        default:
          return <Text>Unknown Content</Text>;
      }
    };
  };
  return (
    <SafeAreaView style={styles.modalContainer}>
      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={onClose}
        transparent={true}
      >
        <View style={styles.content}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.close}>Close</Text>
          </TouchableOpacity>
          {renderContent()}
        </View>
      </Modal>
    </SafeAreaView>
  );
}
