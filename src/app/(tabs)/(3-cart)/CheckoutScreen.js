import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Pressable } from "react-native";
import { useCartStore } from "../../../utils/cartStore";
import { useAuthStore } from "../../../utils/authStore";
import { useRouter } from "expo-router";
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from "../../../utils/theme";
import { FontAwesome6 } from "@expo/vector-icons";
import PaystackWebView from "react-native-paystack-webview";

console.log("PaystackWebView:", PaystackWebView);
console.log("FontAwesome6:", FontAwesome6);
console.log("useCartStore:", useCartStore);
console.log("useAuthStore:", useAuthStore);
console.log("COLORS:", COLORS);

const DELIVERY_FEE = 5.0;

export default function CheckoutScreen() {
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const userId = useAuthStore((state) => state.userId);
  const router = useRouter();

  const [promoCode, setPromoCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("debit_card");
  const [showPaystack, setShowPaystack] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (item.quantity || 0), 0);
  const total = subtotal + DELIVERY_FEE;

  // Dummy email for test mode
  const billingEmail = "student@example.com";

  const handleContinue = () => {
    if (paymentMethod === "debit_card") {
      setShowPaystack(true);
    } else {
      Alert.alert("Mobile Money", "Mobile Money test integration is not implemented in this demo.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <FontAwesome6 name="arrow-left" size={20} color={COLORS.text.inverse} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      {/* Order Summary */}
      <Text style={styles.sectionTitle}>Order Summary</Text>
      <View style={styles.summaryTable}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Items Total</Text>
          <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fees</Text>
          <Text style={styles.summaryValue}>${DELIVERY_FEE.toFixed(2)}</Text>
        </View>
        {cart.map((item) => (
          <View style={styles.summaryRow} key={item.id}>
            <Text style={styles.summaryLabel}>{item.title}</Text>
            <Text style={styles.summaryValue}>${(Number(item.price) * item.quantity).toFixed(2)}</Text>
          </View>
        ))}
        <View style={styles.summaryRowTotal}>
          <Text style={styles.summaryLabelTotal}>Total</Text>
          <Text style={styles.summaryValueTotal}>${total.toFixed(2)}</Text>
        </View>
      </View>

      {/* Payment Method */}
      <Text style={styles.sectionTitle}>Select a payment method</Text>
      <View style={styles.paymentRow}>
        <Text style={styles.paymentLabel}>Paying With</Text>
        <TouchableOpacity>
          <Text style={styles.addNew}>+ Add New</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.paymentOptions}>
        <Pressable
          style={[styles.paymentOption, paymentMethod === "mobile_money" && styles.paymentOptionSelected]}
          onPress={() => setPaymentMethod("mobile_money")}
        >
          <FontAwesome6 name="mobile" size={18} color={COLORS.primary} style={{ marginRight: 8 }} />
          <Text>Mobile Money</Text>
        </Pressable>
        <Pressable
          style={[styles.paymentOption, paymentMethod === "debit_card" && styles.paymentOptionSelected]}
          onPress={() => setPaymentMethod("debit_card")}
        >
          <FontAwesome6 name="credit-card" size={18} color={COLORS.primary} style={{ marginRight: 8 }} />
          <Text>Debit Card</Text>
          <FontAwesome6 name="cc-visa" size={18} color="#1a1f71" style={{ marginLeft: 8 }} />
          <FontAwesome6 name="cc-mastercard" size={18} color="#eb001b" style={{ marginLeft: 4 }} />
        </Pressable>
      </View>

      {/* Promo Code */}
      <View style={styles.promoBox}>
        <Text style={styles.promoLabel}>Add voucher, gift card or promo code</Text>
        <TextInput
          style={styles.promoInput}
          placeholder="Enter Code"
          value={promoCode}
          onChangeText={setPromoCode}
        />
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>

      {/* Paystack WebView */}
      {showPaystack && (
        <PaystackWebView
          paystackKey="pk_test_efbcae4b0a420a7d4edf634f4f1a7eac9bbf1e14"
          amount={total}
          billingEmail={billingEmail}
          activityIndicatorColor="gold"
          onSuccess={transaction => {
            setShowPaystack(false);
            clearCart(userId);
            Alert.alert('Payment Successful', 'Your order has been placed successfully.', [
              { text: 'OK', onPress: () => router.replace('/(tabs)/(1-home)') }
            ]);
          }}
          onCancel={() => {
            setShowPaystack(false);
            Alert.alert('Payment Cancelled');
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.text.primary,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginBottom: 12,
    borderRadius: BORDER_RADIUS.md,
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    color: COLORS.text.inverse,
    fontWeight: "bold",
    fontSize: 20,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 8,
  },
  summaryTable: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: 12,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  summaryLabel: {
    color: COLORS.text.primary,
    ...TYPOGRAPHY.body,
  },
  summaryValue: {
    color: COLORS.text.primary,
    ...TYPOGRAPHY.body,
  },
  summaryRowTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    paddingTop: 8,
  },
  summaryLabelTotal: {
    fontWeight: "bold",
    fontSize: 16,
  },
  summaryValueTotal: {
    fontWeight: "bold",
    fontSize: 16,
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  paymentLabel: {
    ...TYPOGRAPHY.body,
    fontWeight: "bold",
  },
  addNew: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  paymentOptions: {
    flexDirection: "row",
    marginBottom: 16,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    borderRadius: BORDER_RADIUS.md,
    padding: 10,
    marginRight: 12,
    backgroundColor: COLORS.surface,
  },
  paymentOptionSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.gray[100],
  },
  promoBox: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: 12,
    marginBottom: 16,
  },
  promoLabel: {
    ...TYPOGRAPHY.body,
    marginBottom: 4,
  },
  promoInput: {
    backgroundColor: COLORS.gray[100],
    borderRadius: BORDER_RADIUS.md,
    fontSize: 16,
    height: 44,
    padding: SPACING.md,
  },
  continueBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    alignItems: "center",
    marginTop: 12,
  },
  continueText: {
    color: COLORS.text.inverse,
    fontWeight: "bold",
    fontSize: 18,
  },
}); 