import { Tabs } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ 
            headerShown: false,
            tabBarActiveTintColor: '#d4af37'
        }}>
            <Tabs.Screen 
                name="(home)" 
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => <FontAwesome6 name="house" size={24} color={color} />
                }}
            />
            <Tabs.Screen 
                name="(categories)" 
                options={{
                    title: "Categories",
                    tabBarIcon: ({ color }) => <FontAwesome6 name="table-cells-large" size={24} color={color} />
                }}
            />
            <Tabs.Screen
                name="(cart)"
                options={{
                    title: "Cart",
                    tabBarIcon: ({ color }) => <FontAwesome6 name="cart-shopping" size={24} color={color} />
                }}
            />
            <Tabs.Screen 
                name="(wishlist)" 
                options={{
                    title: "Wishlist",
                    tabBarIcon: ({ color }) => <FontAwesome6 name="heart" size={24} color={color} />
                }}
            />
            <Tabs.Screen 
                name="(account)" 
                options={{
                    title: "Account",
                    tabBarIcon: ({ color }) => <FontAwesome6 name="user" size={24} color={color} />
                }}
            />
        </Tabs>
    );
}