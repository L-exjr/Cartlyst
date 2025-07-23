import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { COLORS, SPACING, TYPOGRAPHY } from "../../../utils/theme";
import { commonStyles } from "../../../utils/styles";
import i18n from '../../../utils/i18n';
import { useTranslation } from 'react-i18next';

export default function LanguageModal() {
  const router = useRouter();
  const { t } = useTranslation();
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' },
    { code: 'es', label: 'Español' },
    { code: 'ar', label: 'العربية' },
    { code: 'zh', label: '中文' },
    { code: 'ha', label: 'Hausa' },
    { code: 'pt', label: 'Português' },
    { code: 'ru', label: 'Русский' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'sw', label: 'Kiswahili' },
    { code: 'de', label: 'Deutsch' },
    { code: 'it', label: 'Italiano' },
    { code: 'tr', label: 'Türkçe' },
    { code: 'ja', label: '日本語' },
    { code: 'ko', label: '한국어' },
    { code: 'nl', label: 'Nederlands' },
    { code: 'yo', label: 'Yorùbá' },
    { code: 'ig', label: 'Igbo' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'vi', label: 'Tiếng Việt' },
    { code: 'tw', label: 'Twi' },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Text style={styles.closeText}>{t('cancel') || 'Close'}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{t('Select Language') || 'Select Language'}</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {languages.map(lang => (
          <TouchableOpacity
            key={lang.code}
            style={styles.languageOption}
            onPress={() => { i18n.changeLanguage(lang.code); router.back(); }}
          >
            <Text style={styles.languageLabel}>{lang.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...commonStyles.container,
    backgroundColor: COLORS.background,
    flex: 1,
    paddingTop: SPACING.lg,
    alignItems: 'center',
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginRight: SPACING.md,
    marginBottom: SPACING.md,
  },
  closeText: {
    color: COLORS.error,
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    ...TYPOGRAPHY.h2,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: SPACING.xl,
  },
  languageOption: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
    width: 240,
    alignItems: 'center',
  },
  languageLabel: {
    fontSize: 18,
    color: COLORS.text.primary,
  },
}); 