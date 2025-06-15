import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const iconMap = {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
};

export default function CategoryCards({ categories, onPress }) {
  return (
    <View style={styles.container}>
      {categories.map((category, index) => {
        const IconComponent = iconMap[category.iconFamily];

        return (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => onPress?.(category)}
            activeOpacity={0.8}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: category.image }}
                style={styles.cardImage}
                resizeMode="cover"
              />

              {IconComponent && (
                <View style={styles.iconCircle}>
                  <IconComponent name={category.icon} size={24} color="black" />
                </View>
              )}
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.categoryText} numberOfLines={1}>
                {category.name}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  card: {
    width: '48%',
    backgroundColor: '#d9d9d9',
    borderRadius: 15,
    marginBottom: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 15,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: width * 0.4,
    backgroundColor: '#d2d0d0',
  },
  iconCircle: {
    position: 'absolute',
    top: width * 0.025,
    right: width * 0.01,
    backgroundColor: 'rgba(255,255,255,0.7)',
    width: width * 0.1145,
    height: width * 0.1145,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  textContainer: {
    height: width * 0.1,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
});
