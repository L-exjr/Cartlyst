import React from 'react';
import { Text } from 'react-native';
import { useCurrencyStore } from '../utils/currencyStore';

const currencySymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  GHS: 'GH₵', // Ghana Cedi
  NGN: '₦',   // Nigerian Naira
  KES: 'KSh', // Kenyan Shilling
  ZAR: 'R',   // South African Rand
  INR: '₹',
  CNY: '¥',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
  BRL: 'R$',
  CHF: 'Fr.',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  RUB: '₽',
  SGD: 'S$',
  HKD: 'HK$',
  TRY: '₺',
  PLN: 'zł',
  MXN: 'Mex$',
  IDR: 'Rp',
  MYR: 'RM',
  PHP: '₱',
  THB: '฿',
  VND: '₫',
  KRW: '₩',
  TWD: 'NT$',
  SAR: '﷼',
  AED: 'د.إ',
  EGP: 'E£',
  ILS: '₪',
  PKR: '₨',
  UAH: '₴',
  CZK: 'Kč',
  HUF: 'Ft',
  RON: 'lei',
  BGN: 'лв',
  HRK: 'kn',
  CLP: 'CLP$',
  COP: 'COL$',
  PEN: 'S/',
  ARS: 'AR$',
  LKR: 'Rs',
  BDT: '৳',
  MAD: 'د.م.',
  DZD: 'دج',
  TZS: 'TSh',
  UGX: 'USh',
  XOF: 'CFA',
  XAF: 'CFA',
  GMD: 'D',
  BWP: 'P',
  MUR: '₨',
  MZN: 'MT',
  ZMW: 'ZK',
  NAD: 'N$',
  SZL: 'E',
  BHD: 'BD',
  OMR: 'ر.ع.',
  QAR: 'ر.ق',
  KWD: 'د.ك',
  JOD: 'JD',
  LBP: 'ل.ل',
  SDG: 'ج.س.',
  SYP: '£S',
  YER: '﷼',
  LYD: 'ل.د',
  TND: 'د.ت',
  MRU: 'UM',
  SOS: 'S',
  DJF: 'Fdj',
  ETB: 'Br',
  ERN: 'Nfk',
  SCR: 'SR',
  KMF: 'CF',
  MGA: 'Ar',
  MWK: 'MK',
  ZWL: 'Z$',
  LSL: 'L',
  SLL: 'Le',
};

export default function Price({ amount, from = 'USD', style }) {
  const { selectedCurrency, convert } = useCurrencyStore();
  const symbol = currencySymbols[selectedCurrency] || selectedCurrency;
  let converted = amount;
  if (from !== selectedCurrency) {
    converted = convert(amount, from, selectedCurrency);
  }
  if (typeof converted !== 'number' || isNaN(converted)) {
    converted = 0;
  }
  return (
    <Text style={style}>
      {symbol} {converted.toFixed(2)}
    </Text>
  );
}
 
 