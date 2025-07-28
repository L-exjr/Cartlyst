import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
  Image,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  SafeAreaView,
  Animated,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";
import {
  COLORS,
  SPACING,
  BORDER_RADIUS,
  TYPOGRAPHY,
} from "../../../utils/theme";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuthStore } from "../../../utils/authStore";
import { useCartStore } from "../../../utils/cartStore";
import { useWishlistStore } from "../../../utils/wishlistStore";
import { API_BASE_URL } from "../../../utils/config";
import ProductCard from "../../../components/ProductCard";
import CategoryCards from "../../../components/CategoryCards";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import i18n from "../../../utils/i18n";
const BOT_AVATAR = require("../../../../assets/aicon.png");

// Simple rule-based NLP helpers (expand as needed)
function extractFilters(text) {
  // Example: "laptop under 5000 cedis" => { query: 'laptop', maxPrice: 5000 }
  const priceMatch = text.match(/under (\d+)/i);
  const maxPrice = priceMatch ? parseInt(priceMatch[1]) : undefined;
  const query = text
    .replace(/under (\d+)/i, "")
    .replace(/cedis|ghc|gh\u20b5/gi, "")
    .trim();
  return { query, maxPrice };
}

function isComparison(text) {
  return /compare|vs|versus/i.test(text);
}

function extractComparison(text) {
  // Example: "compare iphone 12 and samsung s21"
  const match = text.match(/compare (.+) and (.+)/i);
  if (match) return [match[1].trim(), match[2].trim()];
  return null;
}

function isGiftRequest(text) {
  return /gift|present|for (my|a|an|the) (friend|mother|father|child|boy|girl|wife|husband|birthday|anniversary|occasion)/i.test(
    text,
  );
}

function isAccessoryRequest(text) {
  return /accessor(y|ies)|compatible|add-on|case|charger|cover|screen protector/i.test(
    text,
  );
}

function isEcoRequest(text) {
  return /eco|green|sustainable|environment|recycl/i.test(text);
}

function isTipRequest(text) {
  return /tip|usage|maintain|care|how to/i.test(text);
}

function isGreeting(text) {
  return /\b(hi|hello|hey|good morning|good afternoon|good evening|greetings)\b/i.test(
    text,
  );
}
function isThanks(text) {
  return /\b(thank you|thanks|appreciate|grateful)\b/i.test(text);
}
function isJokeRequest(text) {
  return /\b(joke|funny|make me laugh)\b/i.test(text);
}
function isHowAreYou(text) {
  return /how are you|how's it going|how do you do/i.test(text);
}
const jokes = [
  "Why did the computer go to the doctor? Because it had a virus!",
  "Why don't programmers like nature? It has too many bugs.",
  "Why did the smartphone need glasses? Because it lost its contacts!",
  "Why did the robot go on vacation? To recharge its batteries!",
];

// Add a helper to parse and render markdown-like bold and bullets
function renderFormattedText(text) {
  if (!text) return null;
  // Split into lines for bullet detection and spacing
  const lines = text.split(/\r?\n/);
  const paragraphs = [];
  let currentParagraph = [];
  lines.forEach((line) => {
    if (line.trim() === "---") {
      if (currentParagraph.length > 0) paragraphs.push(currentParagraph);
      currentParagraph = [];
    } else {
      currentParagraph.push(line);
    }
  });
  if (currentParagraph.length > 0) paragraphs.push(currentParagraph);
  return paragraphs.map((para, pIdx) => (
    <View
      key={pIdx}
      style={{ marginTop: pIdx === 0 ? 0 : 18, marginBottom: 2 }}
    >
      {para.map((line, idx) => {
        if (line.trim().startsWith("##")) {
          const bulletText = line.replace(/^##\s*/, "");
          return (
            <View
              key={idx}
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: 2,
              }}
            >
              <Text style={{ fontWeight: "bold", marginRight: 6 }}>•</Text>
              <Text style={{ flex: 1 }}>{renderBoldText(bulletText)}</Text>
            </View>
          );
        } else {
          return (
            <Text key={idx} style={{ marginBottom: 2 }}>
              {renderBoldText(line)}
            </Text>
          );
        }
      })}
    </View>
  ));
}

// Helper to render bold text between ** and **
function renderBoldText(text) {
  if (!text) return null;
  // First, split by bold (**...**)
  const boldParts = text.split(/(\*\*[^*]+\*\*)/g);
  return boldParts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      // Bold
      return (
        <Text key={i} style={{ fontWeight: "bold" }}>
          {renderItalics(part.slice(2, -2))}
        </Text>
      );
    } else {
      // May contain italics
      return <Text key={i}>{renderItalics(part)}</Text>;
    }
  });
}

// Helper to render italics for *text*
function renderItalics(text) {
  if (!text) return null;
  const italicParts = text.split(/(\*[^*]+\*)/g);
  return italicParts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <Text key={i} style={{ fontStyle: "italic" }}>
          {part.slice(1, -1)}
        </Text>
      );
    } else {
      return <Text key={i}>{part}</Text>;
    }
  });
}

const countryToCurrency = {
  GH: "GHS",
  NG: "NGN",
  US: "USD",
  GB: "GBP",
  FR: "EUR",
  DE: "EUR",
  IT: "EUR",
  ES: "EUR",
  NL: "EUR",
  JP: "JPY",
  CN: "CNY",
  IN: "INR",
  CA: "CAD",
  AU: "AUD",
  KE: "KES",
  ZA: "ZAR", // ... add more as needed
};
const currencySymbols = {
  USD: "$",
  GHS: "GH₵",
  NGN: "₦",
  GBP: "£",
  EUR: "€",
  JPY: "¥",
  CNY: "¥",
  INR: "₹",
  CAD: "C$",
  AUD: "A$",
  KES: "Ksh",
  ZAR: "R", // ... add more as needed
};

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

export default function Cartlyst() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi there👋, Cartlyst here, ready to speed things up🔥. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { userId } = useAuthStore();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const addToCart = useCartStore((s) => s.addToCart);
  const addToWishlist = useWishlistStore((s) => s.addToWishlist);
  const [sessionMemory, setSessionMemory] = useState({}); // For remembering context
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [chatHistory, setChatHistory] = useState([]); // For OpenAI context
  const [sessionId, setSessionId] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarAnim = useRef(new Animated.Value(-300)).current; // Sidebar width
  const [userCurrency, setUserCurrency] = useState("USD");
  const [exchangeRates, setExchangeRates] = useState({});
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [shouldScrollToEnd, setShouldScrollToEnd] = useState(false);

  // Update header title when sessionInfo changes
  useEffect(() => {
    if (sessionInfo && sessionInfo.sessionName) {
      router.setParams({ sessionName: sessionInfo.sessionName });
    } else if (params.sessionName) {
      router.setParams({ sessionName: params.sessionName });
    }
  }, [sessionInfo?.sessionName]);

  // Fetch session list
  const fetchSessions = async (userId) => {
    const res = await fetch(
      `${API_BASE_URL}/assistant/sessions?userId=${userId}`,
    );
    if (res.ok) {
      const data = await res.json();
      setSessions(data);
    }
  };

  // Start a new session
  const startNewSession = async () => {
    const userId = useAuthStore.getState().userId;
    const sessionRes = await fetch(`${API_BASE_URL}/assistant/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const sessionData = await sessionRes.json();
    setSessionId(sessionData.sessionId);
    setSessionInfo({ createdAt: new Date().toISOString(), sessionName: null });
    await AsyncStorage.setItem("chatSessionId", sessionData.sessionId);
    setMessages([
      {
        role: "assistant",
        text: "Hi there👋, Cartlyst here, ready to speed things up🔥. How can I help you today?",
      },
    ]);
    // Fetch updated sessions
    fetchSessions(userId);
  };

  // Switch to a selected session
  const switchSession = async (session) => {
    setSessionId(session.id);
    setSessionInfo(session);
    await AsyncStorage.setItem("chatSessionId", session.id);
    const res = await fetch(
      `${API_BASE_URL}/assistant/session/${session.id}/history`,
    );
    if (res.ok) {
      const history = await res.json();
      setMessages(
        history.map((msg) => {
          let extra = {};
          try {
            extra = msg.extraData ? JSON.parse(msg.extraData) : {};
          } catch {
            extra = {};
          }
          return {
            role: msg.role,
            text: msg.text,
            products: extra.products,
            categories: extra.categories,
          };
        }),
      );
    }
    setShowSessionModal(false);
  };

  useEffect(() => {
    // On mount, load or create session and fetch history
    (async () => {
      const userId = useAuthStore.getState().userId;
      if (!userId) return;
      let storedSessionId = await AsyncStorage.getItem("chatSessionId");
      let session = null;
      if (storedSessionId) {
        // Try to fetch session history
        const res = await fetch(
          `${API_BASE_URL}/assistant/session/${storedSessionId}/history`,
        );
        if (res.ok) {
          const history = await res.json();
          setSessionId(storedSessionId);
          setSessionInfo({ id: storedSessionId });
          setMessages(
            history.map((msg) => {
              let extra = {};
              try {
                extra = msg.extraData ? JSON.parse(msg.extraData) : {};
              } catch {
                extra = {};
              }
              return {
                role: msg.role,
                text: msg.text,
                products: extra.products,
                categories: extra.categories,
              };
            }),
          );
          return;
        }
      }
      // No valid session, create a new one
      await startNewSession();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      // Get user location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        let loc = await Location.getCurrentPositionAsync({});
        let geocode = await Location.reverseGeocodeAsync(loc.coords);
        if (geocode && geocode[0] && geocode[0].isoCountryCode) {
          const currency =
            countryToCurrency[geocode[0].isoCountryCode] || "USD";
          setUserCurrency(currency);
        }
      }
      // Fetch exchange rates
      try {
        const res = await fetch(
          `${API_BASE_URL.replace("/assistant", "")}/api/exchange/rates`,
        );
        if (res.ok) {
          const rates = await res.json();
          setExchangeRates(rates);
        }
      } catch {}
    })();
  }, []);

  // Fetch user profile from backend
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      setLoadingUser(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (e) {
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, [userId]);

  // Fetch session history when sidebar opens
  useEffect(() => {
    if (sidebarOpen) {
      const userId = useAuthStore.getState().userId;
      if (userId) fetchSessions(userId);
    }
  }, [sidebarOpen]);

  // Only scroll to end if not user scrolling and shouldScrollToEnd is true
  useEffect(() => {
    if (shouldScrollToEnd && !isUserScrolling && flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
      setShouldScrollToEnd(false);
    }
  }, [messages.length, isUserScrolling, shouldScrollToEnd]);

  // Animate sidebar open/close
  useEffect(() => {
    Animated.timing(sidebarAnim, {
      toValue: sidebarOpen ? 0 : -300,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [sidebarOpen]);

  // Update sendMessage and handleAssistant to support products/categories
  const sendMessage = async () => {
    if (!input.trim() || !sessionId) return;
    const userMsg = { role: "user", text: input };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    Keyboard.dismiss();
    setLoading(true);
    setShouldScrollToEnd(true); // Set flag for scroll
    // Save user message to backend
    const userId = useAuthStore.getState().userId;
    const userPayload = { userId, role: "user", text: input };
    console.log("Sending user message payload:", userPayload);
    let userMsgSaved = false;
    try {
      const res = await fetch(
        `${API_BASE_URL}/assistant/session/${sessionId}/message`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userPayload),
        },
      );
      if (!res.ok) {
        const errText = await res.text();
        console.error("Failed to save user message:", errText);
        alert("Failed to send your message. Please try again.");
        setLoading(false);
        return;
      }
      userMsgSaved = true;
    } catch (e) {
      console.error("Error saving user message:", e);
      alert("Network error. Please try again.");
      setLoading(false);
      return;
    }
    // Only proceed if user message was saved
    if (userMsgSaved) {
      // Get assistant response
      const response = await handleAssistant(input);
      setShouldScrollToEnd(true); // Set flag for scroll
      // Save assistant message to backend
      const assistantPayload = {
        userId,
        role: "assistant",
        text: response.text,
        extraData: JSON.stringify({
          products: response.products,
          categories: response.categories,
        }),
      };
      console.log("Sending assistant message payload:", assistantPayload);
      try {
        const res = await fetch(
          `${API_BASE_URL}/assistant/session/${sessionId}/message`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(assistantPayload),
          },
        );
        if (!res.ok) {
          const errText = await res.text();
          console.error("Failed to save assistant message:", errText);
          alert("Failed to save assistant reply.");
        }
      } catch (e) {
        console.error("Error saving assistant message:", e);
        alert("Network error saving assistant reply.");
      }
      setMessages((msgs) => [
        ...msgs,
        {
          role: "assistant",
          text: response.text,
          actions: response.actions,
          products: response.products,
          categories: response.categories,
        },
      ]);
    }
    setLoading(false);
  };

  async function handleAssistant(text) {
    const userId = useAuthStore.getState().userId;
    const cart = useCartStore.getState().cart;
    const wishlist = useWishlistStore.getState().wishlist;
    // Get selected currency and language from AsyncStorage if available
    let currency = userCurrency;
    let language = i18n.language;
    try {
      const storedCurrency = await AsyncStorage.getItem("selectedCurrency");
      const storedLanguage = await AsyncStorage.getItem("selectedLanguage");
      if (storedCurrency) currency = storedCurrency;
      if (storedLanguage) language = storedLanguage;
    } catch (e) {
      /* fallback to current state */
    }
    const userData = { userId, cart, wishlist, currency, language };
    try {
      const url = `${API_BASE_URL}/assistant/rag-chat`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: text, userData }),
      });
      const data = await res.json();
      return {
        text: data.reply,
        products: data.products,
        categories: data.categories,
      };
    } catch (e) {
      return { text: "Error: " + e.message };
    }
  }

  // Helper to convert price
  function convertPrice(price, fromCurrency, toCurrency) {
    if (!exchangeRates || !exchangeRates[toCurrency]) return price;
    // Assume base is USD
    return (price / exchangeRates["USD"]) * exchangeRates[toCurrency];
  }

  // Handle action buttons (add to cart/wishlist, view details)
  const handleAction = (action) => {
    if (action.type === "view") {
      // Navigate to product detail screen
      router.push({
        pathname: "/(tabs)/(1-home)/product/" + action.product.id,
      });
    }
    if (action.type === "addToCart") {
      addToCart(userId, action.product, 1);
      setMessages((msgs) => [
        ...msgs,
        {
          role: "assistant",
          text: `Added ${action.product.title} to your cart.`,
        },
      ]);
    }
    if (action.type === "addToWishlist") {
      addToWishlist(userId, action.product);
      setMessages((msgs) => [
        ...msgs,
        {
          role: "assistant",
          text: `Added ${action.product.title} to your wishlist.`,
        },
      ]);
    }
  };

  const { width } = Dimensions.get("window");
  const PRODUCT_CARD_WIDTH = 400;
  const CATEGORY_CARD_WIDTH = 400;
  const CARD_GAP = 8;
  // Render message with product/category cards and avatars
  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageRow,
        item.role === "assistant" ? styles.assistantRow : styles.userRow,
      ]}
    >
      {item.role === "assistant" && (
        <View style={styles.avatarCircle}>
          <Image source={BOT_AVATAR} style={{ width: 32, height: 32 }} />
        </View>
      )}
      <View
        style={[
          styles.bubble,
          item.role === "assistant"
            ? styles.assistantBubble
            : styles.userBubble,
        ]}
      >
        <Text style={styles.messageText}>{renderFormattedText(item.text)}</Text>
        {/* Render product cards as horizontal carousel if present */}
        {item.products && item.products.length > 0 && (
          <FlatList
            data={item.products}
            keyExtractor={(product) => product.id?.toString()}
            renderItem={({ item: product }) => (
              <View style={{ width: PRODUCT_CARD_WIDTH }}>
                <ProductCard
                  product={product}
                  image={product.image}
                  title={product.title}
                  price={
                    !product.currency || product.currency === "USD"
                      ? convertPrice(Number(product.price), "USD", userCurrency)
                      : Number(product.price)
                  }
                  discount={product.discount}
                  rating={product.rating}
                  onPress={() =>
                    router.push({
                      pathname: "/(tabs)/(1-home)/product/" + product.id,
                    })
                  }
                  onAddToCart={() => addToCart(userId, product, 1)}
                  onPressHeart={() => addToWishlist(userId, product)}
                  isFavorite={
                    !!(
                      user &&
                      user.wishlist &&
                      user.wishlist.some((w) => w.id === product.id)
                    )
                  }
                />
              </View>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 8, marginBottom: 8 }}
            getItemLayout={(_, index) => ({
              length: PRODUCT_CARD_WIDTH + CARD_GAP,
              offset: (PRODUCT_CARD_WIDTH + CARD_GAP) * index,
              index,
            })}
            ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
            contentContainerStyle={{ paddingHorizontal: 0 }}
          />
        )}
        {/* Render category cards as horizontal carousel if present */}
        {item.categories && item.categories.length > 0 && (
          <FlatList
            data={item.categories}
            keyExtractor={(cat) => cat.id?.toString()}
            renderItem={({ item: category }) => (
              <View style={{ width: CATEGORY_CARD_WIDTH }}>
                <CategoryCards
                  categories={[category]}
                  onPress={(cat) =>
                    router.push({
                      pathname: "/(tabs)/(2-categories)/products/" + cat.id,
                    })
                  }
                />
              </View>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 8, marginBottom: 8 }}
            getItemLayout={(_, index) => ({
              length: CATEGORY_CARD_WIDTH + CARD_GAP,
              offset: (CATEGORY_CARD_WIDTH + CARD_GAP) * index,
              index,
            })}
            ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
            contentContainerStyle={{ paddingHorizontal: 0 }}
          />
        )}
        {item.actions && item.actions.length > 0 && (
          <View style={styles.actionsRow}>
            {item.actions.map((action, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.actionBtn}
                onPress={() => handleAction(action)}
              >
                <Text style={styles.actionBtnText}>
                  {action.type === "view" && "View"}
                  {action.type === "addToCart" && "Add to Cart"}
                  {action.type === "addToWishlist" && "Wishlist"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
      {item.role === "user" &&
        (user && user.profileImageUrl ? (
          <View style={styles.avatarCircleUser}>
            <Image
              source={{ uri: user.profileImageUrl }}
              style={{ width: 32, height: 32, borderRadius: 16 }}
            />
          </View>
        ) : (
          <View
            style={[
              styles.avatarCircleUser,
              { backgroundColor: COLORS.primary },
            ]}
          >
            <FontAwesome6 name="user" size={22} color={COLORS.text.inverse} />
          </View>
        ))}
    </View>
  );

  // Set a higher keyboardVerticalOffset to account for the keyboard banner
  const KEYBOARD_BANNER_HEIGHT = 100; // Adjust as needed for your keyboard/banner
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Hamburger menu */}
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 200,
          backgroundColor: "#fff",
          borderRadius: 20,
          padding: 10,
          elevation: 4,
        }}
        onPress={() => setSidebarOpen(true)}
      >
        <FontAwesome6 name="bars" size={24} color={COLORS.primary} />
      </TouchableOpacity>
      {/* Sidebar overlay */}
      {sidebarOpen && (
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 99,
          }}
          activeOpacity={1}
          onPress={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: 300,
          backgroundColor: "#fff",
          zIndex: 201,
          elevation: 10,
          paddingTop: 60,
          paddingHorizontal: 16,
          transform: [{ translateX: sidebarAnim }],
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 20,
            color: COLORS.primary,
            marginBottom: 24,
          }}
        >
          Chat Sessions
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: 8,
            padding: 12,
            marginBottom: 16,
          }}
          onPress={async () => {
            setSidebarOpen(false);
            await startNewSession();
          }}
        >
          <Text
            style={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}
          >
            New Session
          </Text>
        </TouchableOpacity>
        <Text style={{ fontWeight: "bold", fontSize: 16, marginBottom: 8 }}>
          Session History
        </Text>
        <ScrollView style={{ flex: 1 }}>
          {sessions
            .slice()
            .sort((a, b) => new Date(b.lastActiveAt) - new Date(a.lastActiveAt))
            .map((session) => (
              <TouchableOpacity
                key={session.id}
                style={{
                  paddingVertical: 10,
                  borderBottomWidth: 1,
                  borderColor: COLORS.gray[200],
                }}
                onPress={async () => {
                  setSidebarOpen(false);
                  await switchSession(session);
                }}
              >
                <Text style={{ color: COLORS.primary, fontWeight: "bold" }}>
                  {session.sessionName ? session.sessionName : "Session"}
                </Text>
                <Text style={{ color: COLORS.text.secondary, fontSize: 12 }}>
                  Started: {new Date(session.createdAt).toLocaleString()}
                </Text>
                <Text style={{ color: COLORS.text.secondary, fontSize: 12 }}>
                  Last Active: {new Date(session.lastActiveAt).toLocaleString()}
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </Animated.View>
      {/* Main chat area and input, wrapped in KeyboardAvoidingView */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={KEYBOARD_BANNER_HEIGHT}
      >
        <View style={{ flex: 1 }}>
          <FlatList
            ref={flatListRef}
            data={messages.slice().reverse()}
            renderItem={renderMessage}
            keyExtractor={(_, i) => i.toString()}
            contentContainerStyle={styles.chatContent}
            inverted
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={() => setIsUserScrolling(true)}
            onScrollEndDrag={() => setIsUserScrolling(false)}
            onMomentumScrollEnd={() => setIsUserScrolling(false)}
          />
          {loading && (
            <View style={styles.loadingRow}>
              <ActivityIndicator size="small" color={COLORS.primary} />
              <Text style={styles.loadingText}>Cartlyst is thinking...</Text>
            </View>
          )}
        </View>
        <View
          style={[
            styles.inputRow,
            isInputFocused && { borderColor: COLORS.primary },
          ]}
        >
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            onSubmitEditing={sendMessage}
            editable={!loading}
            multiline
            blurOnSubmit={false}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
          />
          <TouchableOpacity
            style={styles.sendBtn}
            onPress={sendMessage}
            disabled={loading || !input.trim()}
          >
            <FontAwesome6
              name="arrow-up"
              size={20}
              color={COLORS.text.inverse}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  actionBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: 4,
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  actionBtnText: {
    color: COLORS.text.inverse,
    fontWeight: "bold",
  },
  actionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: SPACING.sm,
  },
  assistantBubble: {
    alignSelf: "flex-start",
    backgroundColor: COLORS.card,
  },
  assistantRow: {
    justifyContent: "flex-start",
  },
  avatarCircle: {
    alignItems: "center",
    backgroundColor: "transparent",
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  avatarCircleUser: {
    alignItems: "center",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  bubble: {
    borderRadius: BORDER_RADIUS.lg,
    marginHorizontal: 8,
    maxWidth: "75%",
    padding: SPACING.md,
  },
  chatContent: {
    padding: SPACING.md,
    paddingBottom: 80,
  },
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.md,
    color: COLORS.text.primary,
    flex: 1,
    padding: SPACING.sm,
    ...TYPOGRAPHY.body,
    maxHeight: 100,
    minHeight: 40,
  },
  inputRow: {
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderColor: COLORS.gray[200],
    borderTopWidth: 2,
    flexDirection: "row",
    padding: SPACING.md,
  },
  loadingRow: {
    alignItems: "center",
    flexDirection: "row",
    paddingBottom: 4,
    paddingHorizontal: SPACING.md,
  },
  loadingText: {
    color: COLORS.primary,
    marginLeft: 8,
    ...TYPOGRAPHY.caption,
  },
  messageRow: {
    alignItems: "flex-end",
    flexDirection: "row",
    marginBottom: SPACING.md,
  },
  messageText: {
    color: COLORS.text.primary,
    ...TYPOGRAPHY.body,
  },
  sendBtn: {
    alignItems: "center",
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    justifyContent: "center",
    marginLeft: SPACING.sm,
    padding: 10,
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: COLORS.primary,
  },
  userRow: {
    alignSelf: "flex-end",
    justifyContent: "flex-end",
  },
});
