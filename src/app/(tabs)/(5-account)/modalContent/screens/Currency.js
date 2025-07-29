import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { COLORS, SPACING, TYPOGRAPHY } from "../../../../../utils/theme";
import { commonStyles } from "../../../../../utils/styles";
import { useCurrencyStore } from "../../../../../utils/currencyStore";
import { Picker } from "@react-native-picker/picker";

const currencyList = [
  "USD",
  "EUR",
  "GBP",
  "GHS",
  "NGN",
  "KES",
  "ZAR",
  "INR",
  "CNY",
  "JPY",
  "CAD",
  "AUD",
  "BRL",
  "CHF",
  "SEK",
  "NOK",
  "DKK",
  "RUB",
  "SGD",
  "HKD",
  "TRY",
  "PLN",
  "MXN",
  "IDR",
  "MYR",
  "PHP",
  "THB",
  "VND",
  "KRW",
  "TWD",
  "SAR",
  "AED",
  "EGP",
  "ILS",
  "PKR",
  "UAH",
  "CZK",
  "HUF",
  "RON",
  "BGN",
  "HRK",
  "CLP",
  "COP",
  "PEN",
  "ARS",
  "LKR",
  "BDT",
  "MAD",
  "DZD",
  "TZS",
  "UGX",
  "XOF",
  "XAF",
  "GMD",
  "BWP",
  "MUR",
  "MZN",
  "ZMW",
  "NAD",
  "SZL",
  "BHD",
  "OMR",
  "QAR",
  "KWD",
  "JOD",
  "LBP",
  "SDG",
  "SYP",
  "YER",
  "LYD",
  "TND",
  "MRU",
  "SOS",
  "DJF",
  "ETB",
  "ERN",
  "SCR",
  "KMF",
  "MGA",
  "MWK",
  "ZWL",
  "LSL",
  "SLL",
  "GHS",
  "NGN",
  "KES",
  "ZAR",
];

export default function CurrencyModal() {
  const router = useRouter();
  const { selectedCurrency, setCurrency, fetchRates, rates } =
    useCurrencyStore();
  const [selected, setSelected] = useState(selectedCurrency);

  return (
    <View style={styles.modalContainer}>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.back()}
      >
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Select Currency</Text>
      <Picker
        selectedValue={selected}
        onValueChange={async (value) => {
          setSelected(value);
          setCurrency(value);
          await fetchRates();
          router.back();
        }}
        style={styles.picker}
      >
        {currencyList.map((cur) => (
          <Picker.Item key={cur} label={cur} value={cur} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    padding: SPACING.sm,
    position: "absolute",
    right: SPACING.xl,
    top: 40,
    zIndex: 10,
  },
  closeText: {
    color: COLORS.primary,
    ...TYPOGRAPHY.body,
    fontWeight: "bold",
  },
  modalContainer: {
    ...commonStyles.centered,
    backgroundColor: COLORS.surface,
    flex: 1,
    padding: SPACING.xl,
  },
  picker: {
    width: 220,
  },
  title: {
    color: COLORS.text.primary,
    ...TYPOGRAPHY.h1,
    marginBottom: SPACING.md,
  },
});
