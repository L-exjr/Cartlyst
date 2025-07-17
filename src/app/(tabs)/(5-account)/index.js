import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
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

export default function AccountScreen() {
  const { logOut, userId } = useAuthStore();
  const [photo, setPhoto] = useState();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (e) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleSignOut = () => {
    logOut();
    router.replace("/sign-in");
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (e) {
      // Handle image picker error silently or show a toast
    }
  };

  const handleSectionPress = () => {
    router.push("/(tabs)/(5-account)/modal");
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
            <TouchableOpacity onPress={pickImage}>
              <Image
                style={styles.image}
                source={
                  photo
                    ? { uri: photo }
                    : require("../../../../assets/placeholder.png")
                }
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile */}
        <View style={styles.profile}>
          <View style={styles.greetingAndEmail}>
            <Text style={styles.greeting}>
              {loading
                ? "Loading..."
                : user
                ? `Welcome, ${(user.fullName || "User").split(" ")[0]}!`
                : "Welcome!"}
            </Text>
            <Text style={styles.email}>
              {loading ? "" : user ? user.email : ""}
            </Text>
          </View>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.notification}>
              <FontAwesome6 name="bell" size={24}></FontAwesome6>
            </TouchableOpacity>
            <TouchableOpacity style={styles.language}>
              <MaterialIcons name="language" size={24}></MaterialIcons>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section List Example */}
        <View style={styles.section1}>
          <SectionItem
            IconComponent={MaterialIcons}
            iconName="storefront"
            label="Orders"
            onPress={handleSectionPress}
          />
          <SectionItem
            IconComponent={MaterialCommunityIcons}
            iconName="ticket-confirmation-outline"
            label="Vouchers"
            onPress={handleSectionPress}
          />
          <SectionItem
            IconComponent={MaterialIcons}
            iconName="rate-review"
            label="Ratings & Reviews"
            onPress={handleSectionPress}
          />
          <SectionItem
            IconComponent={MaterialIcons}
            iconName="interests"
            label="Interests"
            onPress={handleSectionPress}
          />
        </View>
        <View style={styles.section2}>
          <SectionItem
            IconComponent={FontAwesome6}
            iconName="eye"
            label="Recently Viewed"
            onPress={handleSectionPress}
          />
          <SectionItem
            IconComponent={MaterialIcons}
            iconName="youtube-searched-for"
            label="Recently Searched"
            onPress={handleSectionPress}
          />
          <SectionItem
            IconComponent={MaterialIcons}
            iconName="shopping-basket"
            label="But Again"
            onPress={handleSectionPress}
          />
          <SectionItem
            IconComponent={MaterialCommunityIcons}
            iconName="view-list-outline"
            label="Lists and Registries"
            onPress={handleSectionPress}
          />
        </View>
        <View style={styles.section3}>
          <SectionItem
            IconComponent={FontAwesome6}
            iconName="money-check-dollar"
            label="Payment Settings"
            onPress={handleSectionPress}
          />
          <SectionItem
            IconComponent={FontAwesome6}
            iconName="location-dot"
            label="Address Book"
            onPress={handleSectionPress}
          />
          <SectionItem
            IconComponent={MaterialIcons}
            iconName="policy"
            label="Legal & About"
            onPress={handleSectionPress}
          />
          <SectionItem
            IconComponent={FontAwesome6}
            iconName="star"
            label="Rate Our App"
            onPress={handleSectionPress}
          />
        </View>

        {/* Sign Out & Switch Account */}
        <TouchableOpacity style={styles.signoutBtn} onPress={handleSignOut}>
          <Text style={styles.signoutText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.switchBtn}>
          <Text style={styles.switchText}>
            Switch <MaterialCommunityIcons name="transit-transfer" size={16} />
          </Text>
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
  chevronStyle: { marginLeft: "auto" },
  container: {
    ...commonStyles.container,
    backgroundColor: COLORS.background,
  },
  email: {
    ...TYPOGRAPHY.body,
    fontWeight: "semibold",
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
  language: {
    paddingHorizontal: SPACING.sm,
  },
  notification: {
    paddingHorizontal: SPACING.sm,
  },
  profile: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 0,
    paddingHorizontal: SPACING.sm,
    width: "100%",
  },
  section1: {
    backgroundColor: COLORS.background,
    ...SHADOWS.medium,
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.md,
    width: "100%",
  },
  section2: {
    backgroundColor: COLORS.background,
    ...SHADOWS.medium,
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.md,
    width: "100%",
  },
  section3: {
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
    ...TYPOGRAPHY.h3,
    fontWeight: "bold",
  },
});
