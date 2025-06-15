import { View, Text, StyleSheet, Button } from "react-native";
import { useAuthStore } from "../../../utils/authStore";
import { router } from "expo-router";

export default function AccountScreen() {
  const { logOut } = useAuthStore();

  const handleSignOut = () => {
    logOut();
    router.replace('/sign-in');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Account Screen
      </Text>
      <Button title="Sign out" onPress={handleSignOut} />
    </View>
  );
}

const styles = StyleSheet.create({
   container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
})