import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "../../../utils/authStore";
import { router } from "expo-router";
import { FontAwesome6, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

export default function AccountScreen() {
  const { logOut } = useAuthStore();
  const [photo, setPhoto] = useState();
  

  const handleSignOut = () => {
    logOut();
    router.replace('/sign-in');
  };

  const pickImage = async () => {
    try {
      // console.log("Camera icon pressed");
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
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

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>
        Account Screen
      </Text>
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      {/* Profile Image */}
      <View style={styles.imageContainer}>
        <View>
          <TouchableOpacity onPress={pickImage}>
            <Image style={styles.image} source={ photo ? { uri: photo } : require('../../../../assets/placeholder.png')} />
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
        <SectionItem IconComponent={MaterialIcons} iconName="storefront" label="Orders" />
        <SectionItem IconComponent={MaterialCommunityIcons} iconName="ticket-confirmation-outline" label="Vouchers" />
        <SectionItem IconComponent={MaterialIcons} iconName="rate-review" label="Ratings & Reviews" />
        <SectionItem IconComponent={MaterialIcons} iconName="interests" label="Interests" />
      </View>
      <View style={styles.section2}>
        <SectionItem IconComponent={FontAwesome6} iconName="eye" label="Recently Viewed" />
        <SectionItem IconComponent={MaterialIcons} iconName="youtube-searched-for" label="Recently Searched" />
        <SectionItem IconComponent={MaterialIcons} iconName="shopping-basket" label="But Again" />
        <SectionItem IconComponent={MaterialCommunityIcons} iconName="view-list-outline" label="Lists and Registries" />
      </View>
      <View style={styles.section3}>
        <SectionItem IconComponent={FontAwesome6} iconName="money-check-dollar" label="Payment Settings" />
        <SectionItem IconComponent={FontAwesome6} iconName="location-dot" label="Address Book" />
        <SectionItem IconComponent={MaterialIcons} iconName="policy" label="Legal & About" />
        <SectionItem IconComponent={FontAwesome6} iconName="star" label="Rate Our App" />
      </View>

      {/* Sign Out & Switch Account */}
      <TouchableOpacity style={styles.signoutBtn} onPress={handleSignOut}>
        <Text style={styles.signoutText}>Logout</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.switchBtn}>
        <Text style={styles.switchText}>Switch <MaterialCommunityIcons name="transit-transfer" size={16} /></Text>
      </TouchableOpacity>
    </ScrollView>
    </View>
  );
}

function SectionItem({ IconComponent, iconName, label }) {
  return (
    <TouchableOpacity style={styles.sectionItem}>
      <IconComponent name={iconName} size={26} style={{ width: 30 }} />
      <Text style={styles.sectionLabel}>{label}</Text>
      <FontAwesome6 name="chevron-right" size={18} style={{ marginLeft: 'auto' }} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: 'eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    paddingTop: 50,
    paddingHorizontal: 131,
    fontWeight: 'bold',
    color: '#000',
    backgroundColor: '#d4af37',
  },
  imageContainer: {
    marginTop: 10,
    padding: 0,
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#eee',
  },
  profile: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 0,
    paddingHorizontal: 10,
  },
  greetingAndEmail: {
    flexDirection: "column",
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
  },
  email: {
    fontSize: 16,
    fontWeight: "semibold",
  },
  buttons: {
    flexDirection: "row"
  },
  notification: {
    paddingHorizontal: 10,
  },
  language: {
    paddingHorizontal: 10,
  },
  section1: {
    width: "100%",
    marginTop: 20,
    paddingHorizontal: 16,
    backgroundColor: "#eee",
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 4,
    shadowOpacity: 0.5,
    // Android shadow
    elevation: 4,
  },
  section2: {
  width: "100%",
  marginTop: 20,
  paddingHorizontal: 16,
  backgroundColor: "#eee",
  // iOS shadow
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 0,
  },
  shadowRadius: 4,
  shadowOpacity: 0.5,
  // Android shadow
  elevation: 4,
},
  section3: {
    width: "100%",
    marginTop: 20,
    paddingHorizontal: 16,
    backgroundColor: "#eee",
    // iOS shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 4,
    shadowOpacity: 0.5,
    // Android shadow
    elevation: 4,
    },
  sectionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  sectionLabel: {
    fontSize: 20,
    marginLeft: 10,
  },
  signoutBtn: {
    marginTop: 24,
    alignItems: 'center',
  },
  signoutText: {
    color: '#d4af37',
    fontWeight: 'bold',
    fontSize: 18,
  },
  switchBtn: {
    marginTop: 8,
    alignItems: 'center',
    marginBottom: 32,
  },
  switchText: {
    color: '#18171B',
    fontWeight: 'bold',
    fontSize: 16,
  },
})