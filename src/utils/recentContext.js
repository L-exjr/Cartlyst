import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getRecentItems,
  addRecentItem,
  clearRecentItems,
} from "./recentService";

const RecentContext = createContext();

export const RecentProvider = ({ children, userId }) => {
  const [recentSearches, setRecentSearches] = useState([]);
  const [recentViews, setRecentViews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadRecentItems = async () => {
    try {
      setIsLoading(true);
      const searches = await getRecentItems(userId, 5, "search");
      const views = await getRecentItems(userId, 5, "product");
      setRecentSearches(searches || []);
      setRecentViews(views || []);
      setError(null);
    } catch (err) {
      console.error("Failed to load recent items:", err);
      setError(err.message);
      setRecentSearches([]);
      setRecentViews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addRecentSearch = async (searchTerm) => {
    try {
      await addRecentItem(userId, searchTerm, "search");
      await loadRecentItems();
    } catch (err) {
      console.error("Failed to add recent search:", err);
    }
  };

  const addRecentView = async (productId) => {
    try {
      await addRecentItem(userId, productId, "product");
      await loadRecentItems();
    } catch (err) {
      console.error("Failed to add recent view:", err);
    }
  };

  const clearRecentSearches = async () => {
    try {
      await clearRecentItems(userId, "search");
      setRecentSearches([]);
    } catch (err) {
      console.error("Failed to clear recent searches:", err);
    }
  };

  useEffect(() => {
    if (userId) {
      loadRecentItems();
    } else {
      // Clear data if no userId (user logged out)
      setRecentSearches([]);
      setRecentViews([]);
    }
  }, [userId]);

  return (
    <RecentContext.Provider
      value={{
        recentSearches,
        recentViews,
        addRecentSearch,
        addRecentView,
        clearRecentSearches,
        isLoading,
        error,
      }}
    >
      {children}
    </RecentContext.Provider>
  );
};

// Enhanced hook with better error handling
export const useRecent = () => {
  const context = useContext(RecentContext);
  if (context === undefined) {
    throw new Error("useRecent must be used within a RecentProvider");
  }
  return context;
};
