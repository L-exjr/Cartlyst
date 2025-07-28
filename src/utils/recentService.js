
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCAL_RECENT_KEY = 'local_recent_items';

export const getLocalRecentItems = async () => {
  const items = await AsyncStorage.getItem(LOCAL_RECENT_KEY);
  return items ? JSON.parse(items) : [];
};

export const addLocalRecentItem = async (item) => {
  const items = await getLocalRecentItems();
  const updated = [item, ...items.filter(i => i.itemId !== item.itemId)].slice(0, 10);
  await AsyncStorage.setItem(LOCAL_RECENT_KEY, JSON.stringify(updated));
};

const API_BASE_URL = {API_BASE_URL};
export const getRecentItems = async (userId, limit = 10) => {
  try {
    const response = await axios.get(`${API_BASE_URL}?userId=${userId}&limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recent items:', error);
    return [];
  }
};

export const addRecentItem = async (userId, itemId, itemType) => {
  try {
    const response = await axios.post(API_BASE_URL, {
      userId,
      itemId,
      itemType
    });
    return response.data;
  } catch (error) {
    console.error('Error adding recent item:', error);
  }
};

export const clearRecentItems = async (userId, itemType) => {
  try {
    await axios.delete(`${API_BASE_URL}?userId=${userId}&itemType=${itemType}`);
  } catch (error) {
    console.error('Error clearing recent items:', error);
  }
};