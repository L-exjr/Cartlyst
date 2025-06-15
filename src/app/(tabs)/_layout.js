import { Tabs } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";

export default function TabsLayout() {
    return (
        <Tabs screenOptions={{ headerShown: false}}>
            <Tabs.Screen 
                name="index" 
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => <FontAwesome6 name="house" size={24} color={color} />
                }}
            />
            <Tabs.Screen 
                name="(categories)" 
                options={{
                    title: "Categories",
                    tabBarIcon: ({ color }) => <FontAwesome6 name="list" size={24} color={color} />
                }}
            />
            <Tabs.Screen 
                name="account" 
                options={{
                    title: "Account",
                    tabBarIcon: ({ color }) => <FontAwesome6 name="user" size={24} color={color} />
                }}
            />
        </Tabs>
    );
}