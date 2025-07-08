import { Tabs } from 'expo-router';
import { Home, Grid3X3, ShoppingCart, Heart, User } from 'lucide-react-native';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useCartStore } from '../../src/utils/cartStore';
import { useWishlistStore } from '../../src/utils/wishlistStore';
import { useAuthStore } from '../../src/utils/authStore';
import { COLORS, SPACING, TYPOGRAPHY } from '../../src/utils/theme';

function TabBarBadge({ count }: { count: number }) {
  if (count === 0) return null;
  
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>
        {count > 99 ? '99+' : count.toString()}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const cart = useCartStore((state) => state.cart);
  const wishlist = useWishlistStore((state) => state.wishlist);
  const { isGuest } = useAuthStore();

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.text.secondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopWidth: 1,
          borderTopColor: COLORS.gray[200],
          paddingTop: SPACING.xs,
          paddingBottom: Platform.OS === 'ios' ? SPACING.lg : SPACING.sm,
          height: Platform.OS === 'ios' ? 90 : 70,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, size }) => (
            <Grid3X3 color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <ShoppingCart color={color} size={size} strokeWidth={2} />
              {!isGuest && <TabBarBadge count={cartItemCount} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: 'Wishlist',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.iconContainer}>
              <Heart color={color} size={size} strokeWidth={2} />
              {!isGuest && <TabBarBadge count={wishlistCount} />}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -8,
    top: -4,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  badgeText: {
    color: COLORS.text.inverse,
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  iconContainer: {
    position: 'relative',
  },
});