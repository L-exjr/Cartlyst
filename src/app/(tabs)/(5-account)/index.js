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
import { router } from "expo-router";
import {
  FontAwesome6,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import PropTypes from "prop-types";

const COLORS = {
  gold: "#d4af37",
  white: "#fff",
  black: "#000",
  gray: "#666",
  background: "#f5f5f5",
  silver: "#eee",
  shadow: "#000",
};

export default function AccountScreen() {
  const { logOut } = useAuthStore();
  const [photo, setPhoto] = useState();

  const handleSignOut = () => {
    logOut();
    router.replace("/sign-in");
  };

  const pickImage = async () => {
    try {
      // console.log("Camera icon pressed");
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      // console.log("Image picker result:", result);
      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (e) {
      console.error("Image picker error:", e);
    }
  };

  const handleSectionPress = () => {
    router.push("/(tabs)/(5-account)/modal");
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Account Screen</Text>
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
            <Text style={styles.greeting}>Welcome, User!</Text>
            <Text style={styles.email}>user@example.com</Text>
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
    </View>
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
    alignItems: "center",
    backgroundColor: COLORS.background,
    flex: 1,
    justifyContent: "center",
  },
  email: {
    fontSize: 16,
    fontWeight: "semibold",
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
  },
  greetingAndEmail: {
    flexDirection: "column",
  },
  iconStyle: { width: 30 },
  image: {
    backgroundColor: COLORS.silver,
    borderRadius: 75,
    height: 150,
    width: 150,
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 10,
    padding: 0,
  },
  language: {
    paddingHorizontal: 10,
  },
  notification: {
    paddingHorizontal: 10,
  },
  profile: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 0,
    paddingHorizontal: 10,
    width: "100%",
  },
  section1: {
    backgroundColor: COLORS.silver,
    // Android shadow
    elevation: 4,
    marginTop: 20,
    paddingHorizontal: 16,
    // iOS shadow
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    width: "100%",
  },
  section2: {
    backgroundColor: COLORS.silver,
    // Android shadow
    elevation: 4,
    marginTop: 20,

    paddingHorizontal: 16,
    // iOS shadow
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    width: "100%",
  },
  section3: {
    backgroundColor: COLORS.silver,
    // Android shadow
    elevation: 4,
    marginTop: 20,
    paddingHorizontal: 16,
    // iOS shadow
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    width: "100%",
  },
  sectionItem: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 5,
  },
  sectionLabel: {
    fontSize: 20,
    marginLeft: 10,
  },
  signoutBtn: {
    alignItems: "center",
    marginTop: 24,
  },
  signoutText: {
    color: COLORS.gold,
    fontSize: 18,
    fontWeight: "bold",
  },
  switchBtn: {
    alignItems: "center",
    marginBottom: 32,
    marginTop: 8,
  },
  switchText: {
    color: COLORS.black,
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    backgroundColor: COLORS.gold,
    color: COLORS.black,
    fontSize: 24,
    fontWeight: "bold",
    paddingHorizontal: 131,
    paddingTop: 50,
  },
});
