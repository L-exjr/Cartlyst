// modal.js
import React, { Suspense } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import PropTypes from "prop-types";
import { COLORS, SPACING, TYPOGRAPHY } from "../../../utils/theme";
import { commonStyles } from "../../../utils/styles";

// Dynamically import modal screens
const LazyCurrency = React.lazy(
  () => import("./modalContent/screens/Currency"),
);
const LazyOrders = React.lazy(() => import("./modalContent/screens/Orders"));
const LazyVouchers = React.lazy(
  () => import("./modalContent/screens/Vouchers"),
);
const LazyRatings = React.lazy(
  () => import("./modalContent/screens/RatingsAndReviews"),
);
const LazyInterests = React.lazy(
  () => import("./modalContent/screens/Interests"),
);
const LazyViewed = React.lazy(
  () => import("./modalContent/screens/RecentlyViewed"),
);
const LazySearched = React.lazy(
  () => import("./modalContent/screens/RecentlySearched"),
);
const LazyBuyAgain = React.lazy(
  () => import("./modalContent/screens/BuyAgain"),
);
const LazyLists = React.lazy(
  () => import("./modalContent/screens/ListAndRegistries"),
);
const LazyPayment = React.lazy(
  () => import("./modalContent/screens/PaymentSettings"),
);
const LazyAddress = React.lazy(
  () => import("./modalContent/screens/AddressBook"),
);
const LazyLegal = React.lazy(
  () => import("./modalContent/screens/LegalAndAbout"),
);
const LazyRateApp = React.lazy(() => import("./modalContent/screens/RateApp"));

export default function ModalScreens({ visible, onClose, modalType }) {
  const renderContent = () => {
    switch (modalType) {
      case "currency":
        return <LazyCurrency />;
      case "orders":
        return <LazyOrders />;
      case "vouchers":
        return <LazyVouchers />;
      case "ratingsAndReviews":
        return <LazyRatings />;
      case "interests":
        return <LazyInterests />;
      case "recentlyViewed":
        return <LazyViewed />;
      case "recentlySearched":
        return <LazySearched />;
      case "buyAgain":
        return <LazyBuyAgain />;
      case "listAndRegistries":
        return <LazyLists />;
      case "paymentSettings":
        return <LazyPayment />;
      case "addressBook":
        return <LazyAddress />;
      case "legalAndAbout":
        return <LazyLegal />;
      case "rateOurApp":
        return <LazyRateApp />;
      default:
        return <Text>Unknown Content</Text>;
    }
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

          <Suspense fallback={<ActivityIndicator size="large" color="#000" />}>
            {renderContent()}
          </Suspense>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

ModalScreens.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  modalType: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  close: {
    ...TYPOGRAPHY.h2,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
    textAlign: "right",
  },
  content: {
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    margin: SPACING.md,
    padding: SPACING.md,
  },
  modalContainer: {
    backgroundColor: COLORS.overlay,
    flex: 1,
    justifyContent: "center",
  },
});
