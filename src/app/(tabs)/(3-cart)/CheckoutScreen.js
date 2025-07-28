import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
} from "react-native";
import { useCartStore } from "../../../utils/cartStore";
import { useAuthStore } from "../../../utils/authStore";
import { useRouter } from "expo-router";
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  TYPOGRAPHY,
} from "../../../utils/theme";
import { FontAwesome6 } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { API_BASE_URL } from "../../../utils/config";
import { WebView } from "react-native-webview";
import { SafeAreaView } from "react-native-safe-area-context";
import momo from "../../../../assets/momo.png";
import card from "../../../../assets/card.png";
import { useTranslation } from "react-i18next";
import Price from "../../../components/Price";

console.log("FontAwesome6:", FontAwesome6);
console.log("useCartStore:", useCartStore);
console.log("useAuthStore:", useAuthStore);
console.log("COLORS:", COLORS);

const DELIVERY_FEE = 5.0;

// Helper to get discounted price
function getDiscountedPrice(product) {
  if (!product) return 0;
  let discount = product.discount || 0;
  let price = product.price || 0;
  if (discount > 0 && discount < 1) {
    return price * (1 - discount);
  } else if (discount >= 1 && discount <= 100) {
    return price * (1 - discount / 100);
  } else {
    return price - discount;
  }
}

export default function CheckoutScreen() {
  const cart = useCartStore((state) => state.cart);
  const clearCart = useCartStore((state) => state.clearCart);
  const userId = useAuthStore((state) => state.userId);
  const router = useRouter();
  const { t } = useTranslation();

  const [promoCode, setPromoCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("debit_card");
  const [showPaystack, setShowPaystack] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [shippingName, setShippingName] = useState("");

  // Use discounted price for subtotal and total
  const subtotal = cart.reduce(
    (sum, item) => sum + getDiscountedPrice(item) * (item.quantity || 0),
    0,
  );
  const total = subtotal + DELIVERY_FEE;

  // Dummy email for test mode
  const billingEmail = "student@example.com";

  const handleContinue = async () => {
    if (
      !shippingName.trim() ||
      !shippingAddress.trim() ||
      !shippingPhone.trim()
    ) {
      Alert.alert(t("missingInfo"), t("enterShippingDetails"));
      return;
    }
    if (paymentMethod === "debit_card") {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/paystack/init`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: billingEmail, amount: total }),
        });
        const data = await response.json();
        setLoading(false);
        if (data.url) {
          setPaymentUrl(data.url); // Show WebView
        } else {
          Alert.alert(t("paymentError"), t("failedToGetPaymentLink"));
        }
      } catch (error) {
        setLoading(false);
        Alert.alert(t("paymentError"), t("failedToInitPayment"));
      }
    } else {
      Alert.alert(t("mobileMoney"), t("mobileMoneyNotImplemented"));
    }
  };

  const handleOrder = async () => {
    try {
      const orderPayload = {
        userId,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingName,
        shippingAddress,
        shippingPhone,
      };
      const response = await fetch(`${API_BASE_URL}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      // Optionally check response status or data
    } catch (e) {
      // Optionally handle error
    }
  };

  const handleWebViewNavChange = async (navState) => {
    const url = navState.url;
    console.log("WebView navState.url:", url);
    // Adjust these patterns to match your Paystack callback/success/cancel URLs
    const isSuccess =
      url.includes("paystack/success") ||
      url.includes("callback") ||
      url.includes("success");
    const isCancel =
      url.includes("paystack.com/close") || url.includes("cancel");
    if (isSuccess) {
      setPaymentUrl(null);
      try {
        await handleOrder();
        clearCart(userId);
        Alert.alert(t("paymentSuccessful"), t("orderPlaced"), [
          { text: t("ok"), onPress: () => router.replace("/(tabs)/(1-home)") },
        ]);
      } catch (e) {
        Alert.alert(t("orderError"), t("paymentSucceededOrderFailed"));
      }
    } else if (isCancel) {
      setPaymentUrl(null);
      Alert.alert(t("paymentClosed"));
    }
  };

  return paymentUrl ? (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ backgroundColor: COLORS.primary }} edges={["top"]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => setPaymentUrl(null)}
            style={styles.backBtn}
          >
            <FontAwesome6
              name="arrow-left"
              size={20}
              color={COLORS.text.primary}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>{t("payWithPaystack")}</Text>
        </View>
      </SafeAreaView>
      <View
        style={{ flex: 1, borderRadius: BORDER_RADIUS.md, overflow: "hidden" }}
      >
        <WebView
          source={{ uri: paymentUrl }}
          style={{ flex: 1, backgroundColor: COLORS.background }}
          onNavigationStateChange={handleWebViewNavChange}
          onError={() => {
            setPaymentUrl(null);
            Alert.alert("Payment Error", "WebView failed to load.");
          }}
        />
      </View>
    </View>
  ) : (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <SafeAreaView style={{ backgroundColor: COLORS.primary }} edges={["top"]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <FontAwesome6
              name="arrow-left"
              size={20}
              color={COLORS.text.primary}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>{t("checkout")}</Text>
        </View>
      </SafeAreaView>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView style={styles.checkoutContent}>
          {/* Order Summary */}
          <Text style={styles.sectionTitle}>{t("orderSummary")}</Text>
          <View style={styles.summaryTable}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t("itemsTotal")}</Text>
              <Price amount={subtotal} />
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{t("deliveryFees")}</Text>
              <Price amount={DELIVERY_FEE} />
            </View>
            {cart.map((item) => (
              <View style={styles.summaryRow} key={item.id}>
                <Text style={styles.summaryLabel}>{item.title}</Text>
                <Price amount={getDiscountedPrice(item) * item.quantity} />
              </View>
            ))}
            <View style={styles.summaryRowTotal}>
              <Text style={styles.summaryLabelTotal}>{t("total")}</Text>
              <Price amount={total} />
            </View>
          </View>
          {/* Shipping Address */}
          <Text style={styles.sectionTitle}>{t("shippingDetails")}</Text>
          <TextInput
            style={styles.promoInput}
            placeholder={t("shippingName")}
            value={shippingName}
            onChangeText={setShippingName}
          />
          <TextInput
            style={styles.promoInput}
            placeholder={t("shippingAddress")}
            value={shippingAddress}
            onChangeText={setShippingAddress}
          />
          <TextInput
            style={styles.promoInput}
            placeholder={t("shippingPhone")}
            value={shippingPhone}
            onChangeText={setShippingPhone}
            keyboardType="phone-pad"
          />
          {/* Payment Method */}
          <Text style={styles.sectionTitle}>{t("selectPaymentMethod")}</Text>
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>{t("payWith")}</Text>
          </View>
          <View style={styles.paymentOptions}>
            {/* Mobile Money Icon */}
            <View
              style={[
                styles.paymentOption,
                {
                  backgroundColor: "#fff",
                  borderWidth: 0,
                  padding: 0,
                  borderRadius: "50%",
                },
              ]}
            >
              <Image source={momo} style={styles.paymentImage} />
            </View>
            {/* Debit Card Icon */}
            <View
              style={[
                styles.paymentOption,
                {
                  backgroundColor: "#fff",
                  borderWidth: 0,
                  padding: 0,
                  borderRadius: "50%",
                },
              ]}
            >
              <Image source={card} style={styles.paymentImage} />
            </View>
          </View>
          {/* Promo Code */}
          <View style={styles.promoBox}>
            <Text style={styles.promoLabel}>{t("addVoucherGiftPromo")}</Text>
            <TextInput
              style={styles.promoInput}
              placeholder={t("enterCode")}
              value={promoCode}
              onChangeText={setPromoCode}
            />
          </View>
          {/* Continue Button */}
          <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
            <Text style={styles.continueText}>{t("continue")}</Text>
          </TouchableOpacity>
          {loading && (
            <View style={{ alignItems: "center", marginVertical: 10 }}>
              <Text>{t("generatingPaymentLink")}</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  addNew: {
    color: COLORS.text.primary,
    fontWeight: "bold",
  },
  backBtn: {
    marginRight: 12,
    padding: 4,
  },
  checkoutContent: {
    flex: 1,
    padding: SPACING.md,
  },
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
    padding: SPACING.md,
  },
  continueBtn: {
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    marginTop: 12,
    padding: SPACING.md,
  },
  continueText: {
    color: COLORS.text.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
  headerRow: {
    alignItems: "center",
    backgroundColor: COLORS.primary,
    flexDirection: "row",
    height: 56,
    paddingHorizontal: SPACING.md,
  },
  headerText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.text.primary,
    fontWeight: "bold",
  },
  headerTitle: {
    color: COLORS.text.inverse,
    fontSize: 20,
    fontWeight: "bold",
  },
  paymentImage: {
    borderRadius: 28,
    height: 56,
    margin: 8,
    resizeMode: "cover",
    width: 56,
  },
  paymentLabel: {
    ...TYPOGRAPHY.body,
    fontWeight: "bold",
  },
  paymentOption: {
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderColor: COLORS.gray[200],
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    flexDirection: "row",
    marginRight: 12,
    padding: 10,
  },
  paymentOptionSelected: {
    backgroundColor: COLORS.gray[100],
    borderColor: COLORS.primary,
  },
  paymentOptionText: {
    color: COLORS.text.primary,
    fontWeight: "bold",
  },
  paymentOptions: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
    marginBottom: 16,
  },
  paymentRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  paymentRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  promoBox: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: 16,
    padding: 12,
  },
  promoInput: {
    backgroundColor: COLORS.gray[100],
    borderRadius: BORDER_RADIUS.md,
    fontSize: 16,
    height: 44,
    marginBottom: 8,
    padding: SPACING.md,
  },
  promoLabel: {
    ...TYPOGRAPHY.body,
    marginBottom: 4,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h3,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 12,
  },
  summaryLabel: {
    color: COLORS.text.primary,
    ...TYPOGRAPHY.body,
  },
  summaryLabelTotal: {
    fontSize: 16,
    fontWeight: "bold",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  summaryRowTotal: {
    borderTopColor: COLORS.gray[200],
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    paddingTop: 8,
  },
  summaryTable: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: 16,
    padding: 12,
  },
  summaryValue: {
    color: COLORS.text.primary,
    ...TYPOGRAPHY.body,
  },
  summaryValueTotal: {
    fontSize: 16,
    fontWeight: "bold",
  },
  webviewHeader: {
    alignItems: "center",
    backgroundColor: COLORS.text.primary,
    borderTopLeftRadius: BORDER_RADIUS.md,
    borderTopRightRadius: BORDER_RADIUS.md,
    flexDirection: "row",
    padding: 12,
    paddingTop: Platform.OS === "ios" ? 44 : 12, // Safe area for iOS
  },
  webviewWrapper: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    flex: 1,
    margin: 8,
    overflow: "hidden",
  },
});
