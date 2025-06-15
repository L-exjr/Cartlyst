import { Stack } from 'expo-router';

export default function CategoriesLayout() {
    return (
        <Stack>
            <Stack.Screen
                name="CategoriesScreen"
                options={{
                    title: "Categories",
                    headerShown: true
                }}
            />
        </Stack>
    );
}
