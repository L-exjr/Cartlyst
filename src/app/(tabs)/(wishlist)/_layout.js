import { Stack } from 'expo-router';

export default function WishlistLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    title: "Wishlist",
                    headerShown: false
                }}
            />
        </Stack>
    );
}
