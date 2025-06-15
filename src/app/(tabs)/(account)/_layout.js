import { Stack } from 'expo-router';

export default function AccountLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="account"
                options={{
                    title: "Account",
                    headerShown: false
                }}
            />
        </Stack>
    );
}
