import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { FontAwesome6 } from "@expo/vector-icons";
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from "../utils/theme";
import { commonStyles } from "../utils/styles";

export default function SwipeableWishlistItem({ item, onRemove, onAddToCart }) {
  const renderItem = () => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={() => onAddToCart(item)}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderHiddenItem = () => (
    <View style={styles.hiddenContainer}>
      <TouchableOpacity
        style={[styles.hiddenButton, styles.addToCartSwipeButton]}
        onPress={() => onAddToCart(item)}
      >
        <FontAwesome6 name="cart-plus" size={20} color={COLORS.text.inverse} />
        <Text style={styles.hiddenButtonText}>Add to Cart</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.hiddenButton, styles.removeButton]}
        onPress={() => onRemove(item.id)}
      >
        <FontAwesome6 name="trash" size={20} color={COLORS.text.inverse} />
        <Text style={styles.hiddenButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SwipeListView
      data={[{ key: item.id.toString(), ...item }]}
      renderItem={renderItem}
      renderHiddenItem={renderHiddenItem}
      rightOpenValue={-150}
      leftOpenValue={75}
      previewRowKey={item.id.toString()}
      previewOpenValue={-40}
      previewOpenDelay={3000}
      disableLeftSwipe={false}
      disableRightSwipe={false}
      keyExtractor={(item) => item.key}
      style={styles.swipeList}
    />
  );
}

const styles = StyleSheet.create({
  addToCartButton: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  addToCartSwipeButton: {
    backgroundColor: COLORS.primary,
  },
  addToCartText: {
    color: COLORS.text.inverse,
    ...TYPOGRAPHY.caption,
    fontWeight: "bold",
  },
  hiddenButton: {
    alignItems: "center",
    borderRadius: BORDER_RADIUS.md,
    height: 80,
    justifyContent: "center",
    padding: SPACING.sm,
    width: 70,
  },
  hiddenButtonText: {
    color: COLORS.text.inverse,
    ...TYPOGRAPHY.caption,
    marginTop: SPACING.xs,
  },
  hiddenContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  image: {
    backgroundColor: COLORS.gray[200],
    borderRadius: BORDER_RADIUS.md,
    height: 80,
    marginRight: SPACING.md,
    width: 80,
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  itemContainer: {
    backgroundColor: COLORS.card,
    borderRadius: BORDER_RADIUS.lg,
    flexDirection: "row",
    marginBottom: SPACING.sm,
    padding: SPACING.md,
    ...commonStyles.shadow,
  },
  price: {
    color: COLORS.primary,
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.sm,
  },
  removeButton: {
    backgroundColor: COLORS.error,
  },
  swipeList: {
    flex: 1,
  },
  title: {
    color: COLORS.text.primary,
    ...TYPOGRAPHY.body,
    fontWeight: "bold",
    marginBottom: SPACING.xs,
  },
});
