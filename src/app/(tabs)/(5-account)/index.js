import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "../../../utils/authStore";
import { API_BASE_URL } from "../../../utils/config";
import { router } from "expo-router";
import {
  FontAwesome6,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import PropTypes from "prop-types";
import { COLORS, SPACING, TYPOGRAPHY, SHADOWS } from "../../../utils/theme";
import { commonStyles } from "../../../utils/styles";
import { SafeAreaView } from "react-native-safe-area-context";
import i18n from "../../../utils/i18n";
import { useTranslation } from "react-i18next";
import { useCurrencyStore } from "../../../utils/currencyStore";
import { Picker } from "@react-native-picker/picker";

export default function AccountScreen() {
  const { logOut, userId } = useAuthStore();
  // Remove reloadKey and related logic
  // Always use user.profileImageUrl from the backend as the image source
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [imageTimeoutId, setImageTimeoutId] = useState(null);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [cacheBustKey, setCacheBustKey] = useState(0);
  const { t } = useTranslation();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const languages = [
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
    { code: "es", label: "Español" },
    { code: "ar", label: "العربية" },
    { code: "zh", label: "中文" },
    { code: "ha", label: "Hausa" },
    { code: "pt", label: "Português" },
    { code: "ru", label: "Русский" },
    { code: "hi", label: "हिन्दी" },
    { code: "sw", label: "Kiswahili" },
    { code: "de", label: "Deutsch" },
    { code: "it", label: "Italiano" },
    { code: "tr", label: "Türkçe" },
    { code: "ja", label: "日本語" },
    { code: "ko", label: "한국어" },
    { code: "nl", label: "Nederlands" },
    { code: "yo", label: "Yorùbá" },
    { code: "ig", label: "Igbo" },
    { code: "bn", label: "বাংলা" },
    { code: "vi", label: "Tiếng Việt" },
  ];
  const { selectedCurrency, setCurrency, fetchRates } = useCurrencyStore();
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
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
  ];

  // Fetch user on mount and after update/delete
  const fetchUser = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setImageError(false);
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUser();
  }, [userId]);

  const handleRetryImage = () => {
    setImageError(false);
    setLoadingImage(true);
    fetchUser();
  };

  const handleDeleteImage = async () => {
    setShowImageOptions(false);
    if (!userId) return;
    Alert.alert(t("deleteProfileImage"), t("deleteProfileImageConfirm"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          try {
            const response = await fetch(
              `${API_BASE_URL}/api/users/${userId}/profile-image`,
              {
                method: "DELETE",
              },
            );
            if (response.ok) {
              setImageError(false);
              setCacheBustKey((k) => k + 1);
              fetchUser();
              Alert.alert(t("success"), t("profileImageDeleted"));
              setShowFullScreen(false);
            } else {
              Alert.alert(t("error"), t("failedToDeleteProfileImage"));
            }
          } catch (e) {
            Alert.alert(t("error"), t("failedToDeleteProfileImage"));
          }
        },
      },
    ]);
  };

  const handleUpdateImage = () => {
    setShowImageOptions(false);
    pickAndUploadImage();
  };

  const handleSignOut = () => {
    logOut();
    router.replace("/sign-in");
  };

  const updateProfileImage = async (imageUrl) => {
    if (!userId) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/users/${userId}/profile-image`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            profileImageUrl: imageUrl,
          }),
        },
      );

      if (response.ok) {
        Alert.alert(t("success"), t("profileImageUpdated"));
        setCacheBustKey((k) => k + 1);
        fetchUser();
      } else {
        Alert.alert(t("error"), t("failedToUpdateProfileImage"));
      }
    } catch (error) {
      Alert.alert(t("error"), t("failedToUpdateProfileImage"));
    }
  };

  const pickAndUploadImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setUploading(true);
        const uri = result.assets[0].uri;

        try {
          console.log("Starting upload through backend");

          // Create FormData for file upload
          const formData = new FormData();
          formData.append("file", {
            uri: uri,
            type: "image/jpeg",
            name: `profile-${userId}-${Date.now()}.jpg`,
          });

          // Try Supabase upload first
          let uploadResponse = await fetch(`${API_BASE_URL}/files/upload`, {
            method: "POST",
            body: formData,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          let uploadResult;
          let imageUrl;

          if (!uploadResponse.ok) {
            console.log("Supabase upload failed, trying local upload...");

            // Try local upload as fallback
            uploadResponse = await fetch(`${API_BASE_URL}/files/upload-local`, {
              method: "POST",
              body: formData,
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            if (!uploadResponse.ok) {
              throw new Error("Both Supabase and local upload failed");
            }

            uploadResult = await uploadResponse.json();
            console.log("Local upload result:", uploadResult);
          } else {
            uploadResult = await uploadResponse.json();
            console.log("Supabase upload result:", uploadResult);
          }

          imageUrl = uploadResult.downloadUrl;

          if (!imageUrl) {
            throw new Error("No download URL received from upload");
          }

          // Update profile image in backend
          await updateProfileImage(imageUrl);
        } catch (e) {
          console.error("Upload error details:", e);
          Alert.alert(
            t("uploadFailed"),
            t("failedToUploadImage", { error: e.message }),
          );
        } finally {
          setUploading(false);
        }
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert(t("error"), t("failedToPickImage"));
      setUploading(false);
    }
  };

  const handleOrders = () =>
    router.push("/(tabs)/(5-account)/modalContent/Orders");
  const handleVouchers = () =>
    router.push("/(tabs)/(5-account)/modalContent/Vouchers");
  const handleRatings = () =>
    router.push("/(tabs)/(5-account)/modalContent/RatingsAndReviews");
  const handleInterests = () =>
    router.push("/(tabs)/(5-account)/modalContent/Interests");
  const handleRecentlyViewed = () =>
    router.push("/(tabs)/(5-account)/modalContent/RecentlyViewed");
  const handleRecentlySearched = () =>
    router.push("/(tabs)/(5-account)/modalContent/RecentlySearched");
  const handleBuyAgain = () =>
    router.push("/(tabs)/(5-account)/modalContent/BuyAgain");
  const handleLists = () =>
    router.push("/(tabs)/(5-account)/modalContent/ListAndRegistries");
  const handlePayment = () =>
    router.push("/(tabs)/(5-account)/modalContent/PaymentSettings");
  const handleAddress = () =>
    router.push("/(tabs)/(5-account)/modalContent/AddressBook");
  const handleLegal = () =>
    router.push("/(tabs)/(5-account)/modalContent/LegalAndAbout");
  const handleRate = () =>
    router.push("/(tabs)/(5-account)/modalContent/RateApp");
  const handleSwitchToSeller = () => {
    router.replace("/seller");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Profile Image */}
        <View style={styles.imageContainer}>
          <View>
            <TouchableOpacity
              onPress={() => setShowFullScreen(true)}
              disabled={uploading}
            >
              <Image
                style={[styles.image, uploading && styles.imageUploading]}
                source={
                  !imageError && user && user.profileImageUrl
                    ? { uri: user.profileImageUrl + "?cb=" + cacheBustKey }
                    : require("../../../../assets/placeholder.png")
                }
                onLoadStart={() => {
                  if (!imageError) {
                    setLoadingImage(true);
                    if (imageTimeoutId) clearTimeout(imageTimeoutId);
                    const timeout = setTimeout(() => {
                      setLoadingImage(false);
                      setImageError(true);
                    }, 5000);
                    setImageTimeoutId(timeout);
                  }
                }}
                onError={() => {
                  setLoadingImage(false);
                  setImageError(true);
                  if (imageTimeoutId) clearTimeout(imageTimeoutId);
                }}
                onLoad={() => {
                  setLoadingImage(false);
                  setImageError(false);
                  if (imageTimeoutId) clearTimeout(imageTimeoutId);
                }}
              />
              {/* Camera Icon */}
              <TouchableOpacity
                style={styles.cameraIcon}
                onPress={() => setShowImageOptions(true)}
                disabled={uploading}
              >
                <MaterialCommunityIcons
                  name="camera"
                  size={30}
                  color="#666"
                  style={{ transform: [{ scaleX: -1 }] }}
                />
              </TouchableOpacity>
              {loadingImage && (
                <View style={styles.uploadingOverlay}>
                  <ActivityIndicator color="#fff" />
                  <Text style={styles.uploadingText}>{t("loading")}</Text>
                </View>
              )}
            </TouchableOpacity>
            {/* Image Options Modal */}
            <Modal
              visible={showImageOptions}
              transparent
              animationType="fade"
              onRequestClose={() => setShowImageOptions(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                onPress={() => setShowImageOptions(false)}
                activeOpacity={1}
              >
                <View style={styles.optionsMenu}>
                  <TouchableOpacity
                    onPress={handleUpdateImage}
                    style={styles.optionBtn}
                  >
                    <Text style={styles.optionText}>
                      {t("updateProfileImage")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleDeleteImage}
                    style={styles.optionBtn}
                  >
                    <Text style={[styles.optionText, { color: COLORS.error }]}>
                      {t("deleteProfileImage")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setShowImageOptions(false)}
                    style={styles.optionBtn}
                  >
                    <Text style={styles.optionText}>{t("cancel")}</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Modal>
            {/* Full Screen Image Modal */}
            <Modal
              visible={showFullScreen}
              transparent
              animationType="fade"
              onRequestClose={() => setShowFullScreen(false)}
            >
              <TouchableOpacity
                style={styles.fullScreenOverlay}
                onPress={() => setShowFullScreen(false)}
                activeOpacity={1}
              >
                <Image
                  style={styles.fullScreenImage}
                  source={
                    !imageError && user && user.profileImageUrl
                      ? { uri: user.profileImageUrl + "?cb=" + cacheBustKey }
                      : require("../../../../assets/placeholder.png")
                  }
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </Modal>
          </View>
        </View>

        {/* Profile */}
        <View style={styles.profile}>
          <View style={styles.greetingAndEmail}>
            <Text style={styles.greeting}>
              {loading
                ? t("loading")
                : user
                  ? t("welcomeUser", {
                      name: (user.fullName || t("user")).split(" ")[0],
                    })
                  : t("welcome")}
            </Text>
            <Text style={styles.email}>
              {loading ? "" : user ? user.email : ""}
            </Text>
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.notification}>
              <FontAwesome6 name="bell" size={24}></FontAwesome6>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.language}
              onPress={() =>
                router.push("/(tabs)/(5-account)/modalContent/Language")
              }
            >
              <MaterialIcons name="language" size={24}></MaterialIcons>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section List Example */}

        <View style={styles.section}>
          <SectionItem
            IconComponent={FontAwesome6}
            iconName="money-bill-transfer"
            label={`Currency: ${selectedCurrency}`}
            onPress={() =>
              router.push("/(tabs)/(5-account)/modalContent/Currency")
            }
          />
          <SectionItem
            IconComponent={MaterialIcons}
            iconName="storefront"
            label={t("orders")}
            onPress={handleOrders}
          />
          <SectionItem
            IconComponent={MaterialCommunityIcons}
            iconName="ticket-confirmation-outline"
            label={t("vouchers")}
            onPress={handleVouchers}
          />
          <SectionItem
            IconComponent={MaterialIcons}
            iconName="rate-review"
            label={t("ratings")}
            onPress={handleRatings}
          />
          <SectionItem
            IconComponent={MaterialIcons}
            iconName="interests"
            label={t("interests")}
            onPress={handleInterests}
          />
        </View>
        <View style={styles.section}>
          <SectionItem
            IconComponent={FontAwesome6}
            iconName="eye"
            label={t("recentlyViewed")}
            onPress={handleRecentlyViewed}
          />
          <SectionItem
            IconComponent={MaterialIcons}
            iconName="youtube-searched-for"
            label={t("recentlySearched")}
            onPress={handleRecentlySearched}
          />
          <SectionItem
            IconComponent={MaterialIcons}
            iconName="shopping-basket"
            label={t("buyAgain")}
            onPress={handleBuyAgain}
          />
          <SectionItem
            IconComponent={MaterialCommunityIcons}
            iconName="view-list-outline"
            label={t("lists")}
            onPress={handleLists}
          />
        </View>
        <View style={styles.section}>
          <SectionItem
            IconComponent={FontAwesome6}
            iconName="money-check-dollar"
            label={t("payment")}
            onPress={handlePayment}
          />
          <SectionItem
            IconComponent={FontAwesome6}
            iconName="location-dot"
            label={t("address")}
            onPress={handleAddress}
          />
          <SectionItem
            IconComponent={MaterialIcons}
            iconName="policy"
            label={t("legal")}
            onPress={handleLegal}
          />
          <SectionItem
            IconComponent={FontAwesome6}
            iconName="star"
            label={t("rate")}
            onPress={handleRate}
          />
        </View>

        {/* Sign Out & Switch Account */}
        <TouchableOpacity style={styles.signoutBtn} onPress={handleSignOut}>
          <Text style={styles.signoutText}>{t("logout")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.switchBtn}
          onPress={handleSwitchToSeller}
        >
          <View style={styles.switchBtn}>
            <Text style={styles.switchText}>{t("switch")}</Text>
            <MaterialCommunityIcons name="transit-transfer" size={22} />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionItem({ IconComponent, iconName, label, onPress }) {
  return (
    <TouchableOpacity style={styles.sectionItem} onPress={onPress}>
      <IconComponent name={iconName} size={26} style={styles.iconStyle} />
      <Text style={styles.sectionLabel}>{label}</Text>
      <FontAwesome6
        name="chevron-right"
        size={18}
        style={styles.chevronStyle}
      />
    </TouchableOpacity>
  );
}

SectionItem.propTypes = {
  IconComponent: PropTypes.elementType.isRequired,
  iconName: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  buttons: {
    flexDirection: "row",
  },
  cameraIcon: {
    bottom: 10,
    position: "absolute",
    right: 10,
    zIndex: 1,
  },
  chevronStyle: { marginLeft: "auto" },
  container: {
    ...commonStyles.container,
    backgroundColor: COLORS.background,
  },
  email: {
    ...TYPOGRAPHY.body,
    fontWeight: "semibold",
  },
  fullScreenImage: {
    height: "100%",
    width: "100%",
  },
  fullScreenOverlay: {
    alignItems: "center",
    backgroundColor: COLORS.overlayLight,
    flex: 1,
    justifyContent: "center",
  },
  greeting: {
    ...TYPOGRAPHY.h3,
    fontWeight: "bold",
  },
  greetingAndEmail: {
    flexDirection: "column",
  },
  iconStyle: { width: 30 },
  image: {
    backgroundColor: COLORS.gray[200],
    borderRadius: 75,
    height: 150,
    width: 150,
  },
  imageContainer: {
    alignItems: "center",
    marginTop: SPACING.sm,
    padding: 0,
  },
  imageUploading: {
    opacity: 0.7,
  },
  language: {
    paddingHorizontal: SPACING.sm,
  },
  modalOverlay: {
    alignItems: "center",
    backgroundColor: COLORS.overlayLight,
    flex: 1,
    justifyContent: "center",
  },
  notification: {
    paddingHorizontal: SPACING.sm,
  },
  optionBtn: {
    alignItems: "center",
    paddingVertical: 12,
    width: "100%",
  },
  optionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    fontWeight: "bold",
  },
  optionsMenu: {
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 20,
    width: 250,
  },
  profile: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 0,
    paddingHorizontal: SPACING.sm,
    width: "100%",
  },
  section: {
    backgroundColor: COLORS.background,
    ...SHADOWS.medium,
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.md,
    width: "100%",
  },
  sectionItem: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 5,
  },
  sectionLabel: {
    ...TYPOGRAPHY.h3,
    marginLeft: SPACING.sm,
  },
  signoutBtn: {
    alignItems: "center",
    marginTop: SPACING.xl,
  },
  signoutText: {
    color: COLORS.primary,
    ...TYPOGRAPHY.h1,
    fontWeight: "bold",
  },
  switchBtn: {
    alignItems: "center",
    marginBottom: SPACING.xl,
    marginTop: SPACING.sm,
  },
  switchText: {
    color: COLORS.text.primary,
    ...TYPOGRAPHY.h2,
    fontWeight: "bold",
  },
  uploadingOverlay: {
    alignItems: "center",
    backgroundColor: COLORS.overlayLight,
    borderRadius: 75,
    bottom: 0,
    justifyContent: "center",
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
  },
  uploadingText: {
    color: COLORS.text.inverse,
    ...TYPOGRAPHY.caption,
    fontWeight: "bold",
  },
});
