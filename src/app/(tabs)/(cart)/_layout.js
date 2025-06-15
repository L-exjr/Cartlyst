import { Stack } from 'expo-router';

export default function CartLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="cart"
                options={{
                    title: "Cart",
                    headerShown: false
                }}
            />
        </Stack>
    );
}
