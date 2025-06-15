import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import{MaterialCommunityIcons,MaterialIcons,FontAwesome5} from '@expo/vector-icons';
const iconMap = {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
};

export default function CategoryCircles({ categories = [], onPress }) {
  return (
    <View style={styles.container}>
      {categories.map((category, index) => {
        const IconComponent = iconMap[category.iconFamily];
        if (!IconComponent) return null;

        return (
          <TouchableOpacity
            key={index}
            style={styles.categoryItem}
            onPress={() => onPress?.(category)}
          >
            <View style={styles.circle}>
              <IconComponent name={category.icon} size={26} color="black" />
            </View>
            <Text style={styles.categoryText} numberOfLines={2}>
              {category.name}
            </Text>
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
    marginBottom: 20,
  },
  categoryItem: {
    alignItems: 'center',
    width: '20%',
    marginBottom: 15,
  },
  circle: {
    width: 45,
    height: 45,
    borderRadius: '50%',
    backgroundColor: '#d9d9d9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
    fontWeight: '500',
  },
});
