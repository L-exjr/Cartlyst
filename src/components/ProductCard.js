import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { FontAwesome, Feather, Entypo } from '@expo/vector-icons';

export default function ProductCard({
  image,
  title,
  price,
  discount = 0,
  rating = 0,
  onPress,
  onPressHeart,
  onAddToCart,
  isFavorite = false,
}) {
  const discountedPrice = price - (price * discount) / 100;

  return (
    <Pressable style={styles.card} onPress={onPress} android_ripple={{ color: '#f1f1f1' }}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />

        {discount > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discount}%</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.heartIcon}
          onPress={onPressHeart}
          activeOpacity={0.7}
        >
          <Feather
            name="heart"
            color={isFavorite ? '#ff4444' : '#fff'}
            size={20}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
          {title}
        </Text>

        <View style={styles.priceContainer}>
          <Text style={styles.discountedPrice}>${discountedPrice.toFixed(2)}</Text>
          {discount > 0 && (
            <Text style={styles.originalPrice}>${price.toFixed(2)}</Text>
          )}
        </View>

        <View style={styles.ratingRow}>
          <View style={styles.starsContainer}>
            {[...Array(5)].map((_, index) => (
              <FontAwesome
                key={index}
                name="star"
                size={14}
                color={index < rating ? '#ffd700' : '#808080'}
              />
            ))}
          </View>

          <TouchableOpacity onPress={onAddToCart} style={styles.cartIconWrapper}>
            <Feather name="shopping-cart" size={20} color="#000" />
            <Entypo
              name="plus"
              size={12}
              color="#000"
              style={styles.plusOverlay}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#d9d9d9',
    borderRadius: 15,
    marginBottom: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 169,
    backgroundColor: '#d2d0d0',
    borderRadius: 15,
  },
  heartIcon: {
    position: 'absolute',
    width: 45,
    height: 45,
    top: '2.5%',
    right: '1%',
    backgroundColor: 'rgba(0,0,0,0.05)',
    padding: 6,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  discountBadge: {
    position: 'absolute',
    bottom: '2%',
    right: '2%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    paddingVertical: 6,
    paddingHorizontal: 6,
    
  },
  discountText: {
    color: '#ffd700',
    fontSize: 14,
    fontWeight: 'bold',
  },
  detailsContainer: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
    color: '#333',
    marginBottom: 4,
    lineHeight: 18,
  },
  
  discountedPrice: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
  },
  originalPrice: {
    fontSize: 13,
    color: '#555',
    textDecorationLine: 'line-through',
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  cartIconWrapper: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusOverlay: {
    position: 'absolute',
    top: 0,
    right: '-1.5%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 1,
  },
});
