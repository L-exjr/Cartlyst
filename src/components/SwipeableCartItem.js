import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { FontAwesome6 } from "@expo/vector-icons";
import { COLORS, SPACING, BORDER_RADIUS, TYPOGRAPHY } from "../utils/theme";
import { commonStyles } from "../utils/styles";
import PropTypes from "prop-types";
import Price from "./Price";

// Helper to get discounted price
function getDiscountedPrice(product) {
  if (!product) return 0;
  let discount = product.discount || 0;
  let price = product.price || 0;
  if (discount > 0 && discount < 1) {
    return price * (1 - discount);
  } else if (discount >= 1 && discount <= 100) {
    return price * (1 - discount / 100);
  } else {
    return price - discount;
  }
}

export default function SwipeableCartItem({
  item,
  onRemove,
  onUpdateQuantity,
  onMoveToWishlist,
}) {
  const renderItem = () => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Price amount={getDiscountedPrice(item)} style={styles.price} />
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() =>
              onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
            }
          >
            <FontAwesome6 name="minus" size={12} color={COLORS.text.primary} />
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity
            style={styles.qtyButton}
            onPress={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            <FontAwesome6 name="plus" size={12} color={COLORS.text.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderHiddenItem = () => (
    <View style={styles.hiddenContainer}>
      <TouchableOpacity
        style={[styles.hiddenButton, styles.moveToWishlistButton]}
        onPress={() => onMoveToWishlist(item)}
      >
        <FontAwesome6 name="heart" size={20} color={COLORS.text.inverse} />
        <Text style={styles.hiddenButtonText}>Wishlist</Text>
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
      rightOpenValue={-100}
      leftOpenValue={100}
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
  hiddenButton: {
    alignItems: "center",
    borderRadius: BORDER_RADIUS.md,
    height: 100,
    justifyContent: "center",
    padding: SPACING.sm,
    width: 90,
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
    marginHorizontal: SPACING.md, // Added for consistent horizontal margin
    padding: SPACING.md,
    ...commonStyles.shadow,
  },
  moveToWishlistButton: {
    backgroundColor: COLORS.primary,
  },
  price: {
    color: COLORS.primary,
    ...TYPOGRAPHY.body,
    marginBottom: SPACING.sm,
  },
  qtyButton: {
    alignItems: "center",
    backgroundColor: COLORS.gray[100],
    borderRadius: BORDER_RADIUS.sm,
    height: 30,
    justifyContent: "center",
    padding: SPACING.xs,
    width: 30,
  },
  quantity: {
    color: COLORS.text.primary,
    ...TYPOGRAPHY.body,
    marginHorizontal: SPACING.md,
    minWidth: 20,
    textAlign: "center",
  },
  quantityContainer: {
    alignItems: "center",
    flexDirection: "row",
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

SwipeableCartItem.propTypes = {
  item: PropTypes.object.isRequired,
  onRemove: PropTypes.func.isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
  onMoveToWishlist: PropTypes.func.isRequired,
};
