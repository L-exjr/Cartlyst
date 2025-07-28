// app/(tabs)/_layout.jsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#f4c430",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopColor: "#eee",
          height: 60,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case "index":
              iconName = "home";
              break;
            case "analytics":
              iconName = "bar-chart";
              break;
            case "offers":
              iconName = "pricetag";
              break;
            case "orders":
              iconName = "cube";
              break;
            default:
              iconName = "ellipse";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: 6,
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="analytics" options={{ title: "Analytics" }} />
      <Tabs.Screen name="offers" options={{ title: "Offers" }} />
      <Tabs.Screen name="orders" options={{ title: "Orders" }} />
    </Tabs>
  );
}
