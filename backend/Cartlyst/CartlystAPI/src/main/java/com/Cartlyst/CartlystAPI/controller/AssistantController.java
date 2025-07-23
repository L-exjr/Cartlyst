package com.Cartlyst.CartlystAPI.controller;

import com.Cartlyst.CartlystAPI.model.Product;
import com.Cartlyst.CartlystAPI.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.regex.*;
import java.util.stream.Collectors;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import org.springframework.web.client.RestTemplate;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import opennlp.tools.tokenize.SimpleTokenizer;
import opennlp.tools.sentdetect.SentenceDetectorME;
import opennlp.tools.sentdetect.SentenceModel;
import com.rivescript.RiveScript;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Scanner;
import org.springframework.beans.factory.annotation.Value;
import com.Cartlyst.CartlystAPI.repository.CategoryRepository;
import com.Cartlyst.CartlystAPI.repository.UserRepository;
import com.Cartlyst.CartlystAPI.model.Category;
import com.Cartlyst.CartlystAPI.model.User;
import com.Cartlyst.CartlystAPI.repository.ChatSessionRepository;
import com.Cartlyst.CartlystAPI.repository.ChatMessageRepository;
import com.Cartlyst.CartlystAPI.model.ChatSession;
import com.Cartlyst.CartlystAPI.model.ChatMessage;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import org.w3c.dom.*;
import javax.xml.parsers.*;
import java.io.StringReader;
import org.xml.sax.InputSource;
import com.Cartlyst.CartlystAPI.service.ExchangeRateService;

@RestController
@RequestMapping("/assistant")
public class AssistantController {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ChatSessionRepository chatSessionRepository;
    @Autowired
    private ChatMessageRepository chatMessageRepository;
    @Autowired
    private ExchangeRateService exchangeRateService;

    @Value("${huggingface.api.token:}")
    private String huggingFaceApiToken;

    @Value("${openrouter.api.key:}")
    private String openRouterApiKey;

    // DTO for incoming queries
    public static class AssistantQuery {
        public String text;
    }

    @PostMapping("/query")
    public List<Product> smartProductSearch(@RequestBody AssistantQuery query) {
        String text = query.text == null ? "" : query.text.toLowerCase();
        List<Product> allProducts = productRepository.findAll();
        // 1. Extract price (e.g., "under 5000")
        Double maxPrice = null;
        Matcher priceMatcher = Pattern.compile("under (\\d+)").matcher(text);
        if (priceMatcher.find()) {
            maxPrice = Double.parseDouble(priceMatcher.group(1));
        }
        // 2. Extract keywords (remove price part)
        String keywords = text.replaceAll("under (\\d+)", "").replaceAll("[^ -ÿ]+", "").trim();
        // 3. Fuzzy match: simple contains or Levenshtein distance
        final Double finalMaxPrice = maxPrice;
        final String finalKeywords = keywords;
        List<Product> matches = allProducts.stream()
            .filter(p -> {
                boolean priceOk = finalMaxPrice == null || getDiscountedPrice(p) <= finalMaxPrice;
                boolean keywordOk = finalKeywords.isEmpty() || fuzzyMatch(p.getTitle().toLowerCase(), finalKeywords);
                return priceOk && keywordOk;
            })
            .collect(Collectors.toList());
        // 4. Fallback: if no matches, suggest bestsellers (top 3 by rating)
        if (matches.isEmpty()) {
            matches = allProducts.stream()
                .sorted((a, b) -> Double.compare(b.getRating(), a.getRating()))
                .limit(3)
                .collect(Collectors.toList());
        }
        return matches;
    }

    // Simple fuzzy match: contains or Levenshtein distance <= 2
    private boolean fuzzyMatch(String text, String keyword) {
        if (text.contains(keyword)) return true;
        return levenshtein(text, keyword) <= 2;
    }

    // Levenshtein distance
    private int levenshtein(String a, String b) {
        int[] costs = new int[b.length() + 1];
        for (int j = 0; j < costs.length; j++) costs[j] = j;
        for (int i = 1; i <= a.length(); i++) {
            costs[0] = i;
            int nw = i - 1;
            for (int j = 1; j <= b.length(); j++) {
                int cj = Math.min(1 + Math.min(costs[j], costs[j - 1]), a.charAt(i - 1) == b.charAt(j - 1) ? nw : nw + 1);
                nw = costs[j];
                costs[j] = cj;
            }
        }
        return costs[b.length()];
    }

    private static final String TOGETHER_API_KEY = "9f432c9c592f0fde6f8b729d097fdda33454d0753ebe3e90f598b5a407a2e4a7";
    private static final String TOGETHER_API_URL = "https://api.together.xyz/v1/chat/completions";
    private static final String TOGETHER_MODEL = "deepseek-ai/DeepSeek-R1-0528-tput";

    // Simple Q&A map
    private static final Map<String, String> FAQ_MAP = Map.of(
        "what is your name", "My name is Cartlyst!",
        "how old are you", "I'm as old as the code that runs me.",
        "who made you", "I was created by my developer."
    );

    // RiveScript engine (singleton)
    private static final RiveScript riveScript = new RiveScript();
    static {
        try {
            // Load .rive file from classpath
            InputStream is = AssistantController.class.getClassLoader().getResourceAsStream("rivescript/assistant.rive");
            if (is != null) {
                Scanner scanner = new Scanner(is, StandardCharsets.UTF_8.name());
                StringBuilder sb = new StringBuilder();
                while (scanner.hasNextLine()) {
                    sb.append(scanner.nextLine()).append("\n");
                }
                scanner.close();
                riveScript.stream(sb.toString());
                riveScript.sortReplies();
            } else {
                System.out.println("[RiveScript] assistant.rive not found in resources!");
            }
        } catch (Exception e) {
            System.out.println("[RiveScript] Failed to load script: " + e.getMessage());
        }
    }

    // Helper to get discounted price
    private double getDiscountedPrice(Product p) {
      double price = p.getPrice();
      double discount = p.getDiscount();
      if (discount > 0 && discount < 1) {
        return price * (1 - discount);
      } else if (discount >= 1 && discount <= 100) {
        return price * (1 - discount / 100);
      } else {
        return price - discount;
      }
    }

    // Utility to parse <List><item>...</item></List> XML and extract products/categories
    private Map<String, Object> parseXmlProductsAndCategories(String reply) {
        List<Map<String, Object>> productsToReturn = new ArrayList<>();
        List<Map<String, Object>> categoriesToReturn = new ArrayList<>();
        String cleanedReply = reply;
        if (reply != null && reply.contains("<List>")) {
            try {
                DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
                DocumentBuilder builder = factory.newDocumentBuilder();
                InputSource is = new InputSource(new StringReader(reply));
                Document doc = builder.parse(is);
                NodeList items = doc.getElementsByTagName("item");
                for (int i = 0; i < items.getLength(); i++) {
                    Element item = (Element) items.item(i);
                    Map<String, Object> prod = new HashMap<>();
                    NodeList children = item.getChildNodes();
                    for (int j = 0; j < children.getLength(); j++) {
                        Node node = children.item(j);
                        if (node.getNodeType() == Node.ELEMENT_NODE) {
                            String tag = node.getNodeName();
                            String value = node.getTextContent();
                            if (tag.equals("category")) {
                                Map<String, Object> cat = new HashMap<>();
                                NodeList catChildren = node.getChildNodes();
                                for (int k = 0; k < catChildren.getLength(); k++) {
                                    Node catNode = catChildren.item(k);
                                    if (catNode.getNodeType() == Node.ELEMENT_NODE) {
                                        cat.put(catNode.getNodeName(), catNode.getTextContent());
                                    }
                                }
                                prod.put("category", cat.get("name"));
                                categoriesToReturn.add(cat);
                            } else {
                                prod.put(tag, value);
                            }
                        }
                    }
                    productsToReturn.add(prod);
                }
                cleanedReply = reply.replaceAll("(?s)<List>.*?</List>", "").trim();
            } catch (Exception ex) {
                System.out.println("[XML Parse] Exception: " + ex.getMessage());
            }
        }
        Map<String, Object> result = new HashMap<>();
        result.put("reply", cleanedReply);
        result.put("products", productsToReturn);
        result.put("categories", categoriesToReturn);
        return result;
    }

    @PostMapping("/rag-chat")
    public ResponseEntity<?> ragChat(@RequestBody Map<String, Object> req) {
        System.out.println("[NLP] /assistant/rag-chat endpoint called");
        String finalReply = null;
        List<Map<String, Object>> productsToReturn = new ArrayList<>();
        List<Map<String, Object>> categoriesToReturn = new ArrayList<>();
        try {
            String question = (String) req.get("question");
            Map<String, Object> userData = (Map<String, Object>) req.get("userData");
            RestTemplate restTemplate = new RestTemplate();
            StringBuilder context = new StringBuilder();

            System.out.println("[NLP] User question: " + question);
            System.out.println("[NLP] User data: " + userData);

            // In ragChat, after extracting userData, get the currency code
            String userCurrency = "USD";
            String currencySymbol = "$";
            if (userData != null && userData.get("currency") != null) {
              userCurrency = userData.get("currency").toString();
              // Map to symbol (add more as needed)
              switch (userCurrency) {
                case "GHS": currencySymbol = "₵"; break;
                case "NGN": currencySymbol = "₦"; break;
                case "GBP": currencySymbol = "£"; break;
                case "EUR": currencySymbol = "€"; break;
                case "JPY": currencySymbol = "¥"; break;
                case "CNY": currencySymbol = "¥"; break;
                case "INR": currencySymbol = "₹"; break;
                case "CAD": currencySymbol = "C$"; break;
                case "AUD": currencySymbol = "A$"; break;
                case "KES": currencySymbol = "Ksh"; break;
                case "ZAR": currencySymbol = "R"; break;
                default: currencySymbol = "$";
              }
            }

            // In ragChat, before building the LLM prompt, extract language from userData
            String userLanguage = "en";
            if (userData != null && userData.get("language") != null) {
              userLanguage = userData.get("language").toString();
            }

            // 1. Check Q&A map (normalize input)
            String normalized = question == null ? "" : question.trim().toLowerCase();
            if (FAQ_MAP.containsKey(normalized)) {
                finalReply = FAQ_MAP.get(normalized);
            } else {
            // 2. Check RiveScript
            String riveReply = riveScript.reply("user", question);
            if (riveReply != null && !riveReply.trim().isEmpty() && !riveReply.equalsIgnoreCase("undefined") && !riveReply.startsWith("ERR:")) {
                    finalReply = riveReply;
                } else {
            // 3. Use OpenNLP for tokenization
            String lower = normalized;
            String[] tokens = opennlp.tools.tokenize.SimpleTokenizer.INSTANCE.tokenize(lower);
            System.out.println("[NLP] Tokens: " + Arrays.toString(tokens));
            Set<String> tokenSet = new HashSet<>(Arrays.asList(tokens));

            // 4. Product suggestion intent
            if (lower.contains("suggest") || lower.contains("recommend") || lower.contains("show") || lower.contains("find")) {
                // Try to extract keywords for category or product type
                String keyword = null;
                for (String t : tokens) {
                    if (!Set.of("suggest", "recommend", "show", "find", "me", "a", "an", "the", "products", "product", "for", "under", "above", "with", "and", "or", "to", "my", "in").contains(t)) {
                        keyword = t;
                        break;
                    }
                }
                // Price filter
                Double minPrice = null, maxPrice = null;
                for (int i = 0; i < tokens.length; i++) {
                    if (tokens[i].equals("under") && i+1 < tokens.length) {
                        try { maxPrice = Double.parseDouble(tokens[i+1].replaceAll("[^0-9.]", "")); } catch (Exception ignored) {}
                    }
                    if (tokens[i].equals("above") && i+1 < tokens.length) {
                        try { minPrice = Double.parseDouble(tokens[i+1].replaceAll("[^0-9.]", "")); } catch (Exception ignored) {}
                    }
                }
                String url = "http://localhost:8089/products";
                if (keyword != null) {
                    url += "?search=" + keyword;
                }
                if (minPrice != null || maxPrice != null) {
                    url += (url.contains("?") ? "&" : "?");
                    if (minPrice != null) url += "minPrice=" + minPrice + "&";
                    if (maxPrice != null) url += "maxPrice=" + maxPrice + "&";
                    url = url.replaceAll("&$", "");
                }
                List products = restTemplate.getForObject(url, List.class);
                if (products != null && !products.isEmpty()) {
                            finalReply = "Here are some products I found:";
                            productsToReturn = (List<Map<String, Object>>) products;
                } else {
                            finalReply = "Sorry, I couldn't find any products matching your request.";
                }
            }

            // 5. Add to cart intent
            if ((lower.contains("add") && lower.contains("cart")) || lower.contains("buy")) {
                // Try to extract productId from tokens
                Long productId = null;
                for (String t : tokens) {
                    try { productId = Long.parseLong(t); break; } catch (Exception ignored) {}
                }
                String userId = userData != null ? (String) userData.get("userId") : null;
                if (userId != null && productId != null) {
                    String addCartUrl = "http://localhost:8089/cart/add?userId=" + userId + "&productId=" + productId + "&quantity=1";
                    String result = restTemplate.postForObject(addCartUrl, null, String.class);
                            finalReply = result;
                } else {
                            finalReply = "Please specify which product to add to your cart.";
                }
            }

            // 6. Add to wishlist intent
            if ((lower.contains("add") && lower.contains("wishlist"))) {
                Long productId = null;
                for (String t : tokens) {
                    try { productId = Long.parseLong(t); break; } catch (Exception ignored) {}
                }
                String userId = userData != null ? (String) userData.get("userId") : null;
                if (userId != null && productId != null) {
                    String addWishlistUrl = "http://localhost:8089/wishlist/add?userId=" + userId + "&productId=" + productId;
                    String result = restTemplate.postForObject(addWishlistUrl, null, String.class);
                            finalReply = result;
                } else {
                            finalReply = "Please specify which product to add to your wishlist.";
                }
            }

            // 7. Existing logic: greetings, cart, wishlist
            if (tokenSet.contains("hello") || tokenSet.contains("hi") || tokenSet.contains("hey")) {
                        finalReply = "Hi there! I'm Cartlyst, your shopping assistant. How can I help you today?";
            }
            if (tokenSet.contains("laptop") || tokenSet.contains("phone") || tokenSet.contains("shoe") || tokenSet.contains("product")) {
                List<String> found = new ArrayList<>();
                String productsJson = restTemplate.getForObject("http://localhost:8089/products", String.class);
                if (productsJson != null) {
                    for (String keyword : new String[]{"laptop", "phone", "shoe", "product"}) {
                        if (tokenSet.contains(keyword)) {
                            Arrays.stream(productsJson.split("[{}]"))
                                .filter(s -> s.toLowerCase().contains(keyword))
                                .forEach(s -> found.add(s));
                        }
                    }
                }
                if (!found.isEmpty()) {
                            finalReply = "Here are some products I found: " + String.join("\n", found);
                } else {
                            finalReply = "Sorry, I couldn't find any products matching your request.";
                }
            }
            // Remove early return for cart and wishlist
            // if (tokenSet.contains("cart")) {
            //     if (userData != null && userData.get("cart") != null) {
            //         return ResponseEntity.ok(Map.of("reply", "You have these items in your cart: ", "cart", userData.get("cart")));
            //     } else {
            //         return ResponseEntity.ok(Map.of("reply", "Your cart is empty."));
            //     }
            // }
            // if (tokenSet.contains("wishlist")) {
            //     if (userData != null && userData.get("wishlist") != null) {
            //         return ResponseEntity.ok(Map.of("reply", "Your wishlist: ", "wishlist", userData.get("wishlist")));
            //     } else {
            //         return ResponseEntity.ok(Map.of("reply", "Your wishlist is empty."));
            //     }
            // }
            // Add more intents/rules as needed

            // 8. Fallback: Hugging Face LLM
            if (huggingFaceApiToken != null && !huggingFaceApiToken.isEmpty()) {
                try {
                    String hfUrl = "https://api-inference.huggingface.co/models/google/flan-t5-large";
                    RestTemplate hfRest = new RestTemplate();
                    org.springframework.http.HttpHeaders hfHeaders = new org.springframework.http.HttpHeaders();
                    hfHeaders.set("Authorization", "Bearer " + huggingFaceApiToken);
                    hfHeaders.set("Content-Type", "application/json");
                    String hfBody = "{\"inputs\": " + new ObjectMapper().writeValueAsString(("If the user's language is not English (detected from the request or userData.language: '" + userLanguage + "'), always respond in that language. " + question)) + "}";
                    org.springframework.http.HttpEntity<String> hfRequest = new org.springframework.http.HttpEntity<>(hfBody, hfHeaders);
                    org.springframework.http.ResponseEntity<String> hfResponse = hfRest.postForEntity(hfUrl, hfRequest, String.class);
                    if (hfResponse.getStatusCode().is2xxSuccessful() && hfResponse.getBody() != null) {
                        // Parse Hugging Face response
                        com.fasterxml.jackson.databind.JsonNode hfJson = new ObjectMapper().readTree(hfResponse.getBody());
                        if (hfJson.isArray() && hfJson.size() > 0 && hfJson.get(0).has("generated_text")) {
                                    finalReply = hfJson.get(0).get("generated_text").asText();
                        } else if (hfJson.has("generated_text")) {
                                    finalReply = hfJson.get("generated_text").asText();
                        } else if (hfJson.isArray() && hfJson.size() > 0 && hfJson.get(0).has("summary_text")) {
                                    finalReply = hfJson.get(0).get("summary_text").asText();
                        }
                    }
                } catch (Exception ex) {
                    System.out.println("[HuggingFace] Exception: " + ex.getMessage());
                }
            }

            // 9. Fallback: OpenRouter LLM
            if (openRouterApiKey != null && !openRouterApiKey.isEmpty()) {
                try {
                    // Fetch user full name
                    String userName = userData != null && userData.get("userId") != null ? userData.get("userId").toString() : "Unknown";
                    String userFullName = userName;
                    if (userData != null && userData.get("userId") != null) {
                        Optional<User> userOpt = userRepository.findById(userData.get("userId").toString());
                        if (userOpt.isPresent() && userOpt.get().getFullName() != null) {
                            userFullName = userOpt.get().getFullName();
                        }
                    }
                    // Unify cart, wishlist, and all products for LLM context
                    Set<Long> cartIds = new HashSet<>();
                    Set<Long> wishlistIds = new HashSet<>();
                    if (userData != null && userData.get("cart") instanceof java.util.List<?> cartList) {
                        for (Object item : cartList) {
                            if (item instanceof java.util.Map<?,?> map && map.get("id") != null) {
                                cartIds.add(Long.valueOf(map.get("id").toString()));
                            }
                        }
                    }
                    if (userData != null && userData.get("wishlist") instanceof java.util.List<?> wishList) {
                        for (Object item : wishList) {
                            if (item instanceof java.util.Map<?,?> map && map.get("id") != null) {
                                wishlistIds.add(Long.valueOf(map.get("id").toString()));
                            }
                        }
                    }
                    List<Product> allProducts = productRepository.findAll();
                    List<Category> allCategories = categoryRepository.findAll();

                    // In the OpenRouter LLM context, remove 'id: ...' from the products and categories context
                    StringBuilder productsContext = new StringBuilder();
                    for (Product p : allProducts) {
                        String label = "";
                        if (cartIds.contains(p.getId())) label += "[CART] ";
                        if (wishlistIds.contains(p.getId())) label += "[WISHLIST] ";
                        double price = getDiscountedPrice(p);
                        productsContext.append("- ")
                            .append(label)
                            .append(p.getTitle()).append(" (price: ").append(String.format("%.2f", price)).append(" ").append(currencySymbol)
                            .append(", rating: ").append(p.getRating()).append(", category: ")
                            .append(p.getCategory() != null ? p.getCategory().getName() : "None")
                            .append(")\n");
                    }
                    StringBuilder categoriesContext = new StringBuilder();
                    for (Category c : allCategories) {
                        categoriesContext.append("- ")
                            .append(c.getName())
                            .append("\n");
                    }

                    String openRouterContext = "Assistant: Cartlyst\nDefault greeting: Hi there👋, Cartlyst here, ready to speed things up🔥. How can I help you today?\n" +
                        "Cartlyst should use the words \"speed up\" or \"catalyze\" in his responses whenever possible.\n" +
                        "Cartlyst can help users find what they can buy with a given amount of money, assist with budgets, and give advice on the best products to buy based on durability, value, or other relevant factors.\n" +
                        "If the user's language is not English (detected from the request or userData.language: '" + userLanguage + "'), always respond in that language.\n" +
                        "User: " + userFullName + "\n" +
                        "Products:\n" + productsContext +
                        "Categories:\n" + categoriesContext;
                    String prompt = openRouterContext + "\nUser question: " + question;

                    String orUrl = "https://openrouter.ai/api/v1/chat/completions";
                    RestTemplate orRest = new RestTemplate();
                    org.springframework.http.HttpHeaders orHeaders = new org.springframework.http.HttpHeaders();
                    orHeaders.set("Authorization", "Bearer " + openRouterApiKey);
                    orHeaders.set("Content-Type", "application/json");
                    String orBody = "{\"model\": \"qwen/qwen3-235b-a22b-07-25:free\", \"messages\": [{\"role\": \"user\", \"content\": " + new ObjectMapper().writeValueAsString(prompt) + "}]}";
                    org.springframework.http.HttpEntity<String> orRequest = new org.springframework.http.HttpEntity<>(orBody, orHeaders);
                    org.springframework.http.ResponseEntity<String> orResponse = orRest.postForEntity(orUrl, orRequest, String.class);
                    if (orResponse.getStatusCode().is2xxSuccessful() && orResponse.getBody() != null) {
                        com.fasterxml.jackson.databind.JsonNode orJson = new ObjectMapper().readTree(orResponse.getBody());
                        if (orJson.has("choices") && orJson.get("choices").isArray() && orJson.get("choices").size() > 0) {
                                    finalReply = orJson.get("choices").get(0).get("message").get("content").asText();
                                    // --- NEW: Parse XML-like <List><item>...</item></List> ---
                                    if (finalReply != null && finalReply.contains("<List>")) {
                                        try {
                                            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
                                            DocumentBuilder builder = factory.newDocumentBuilder();
                                            InputSource is = new InputSource(new StringReader(finalReply));
                                            Document doc = builder.parse(is);
                                            NodeList items = doc.getElementsByTagName("item");
                                            for (int i = 0; i < items.getLength(); i++) {
                                                Element item = (Element) items.item(i);
                                                Map<String, Object> prod = new HashMap<>();
                                                NodeList children = item.getChildNodes();
                                                for (int j = 0; j < children.getLength(); j++) {
                                                    Node node = children.item(j);
                                                    if (node.getNodeType() == Node.ELEMENT_NODE) {
                                                        String tag = node.getNodeName();
                                                        String value = node.getTextContent();
                                                        if (tag.equals("category")) {
                                                            // Parse category subfields
                                                            Map<String, Object> cat = new HashMap<>();
                                                            NodeList catChildren = node.getChildNodes();
                                                            for (int k = 0; k < catChildren.getLength(); k++) {
                                                                Node catNode = catChildren.item(k);
                                                                if (catNode.getNodeType() == Node.ELEMENT_NODE) {
                                                                    cat.put(catNode.getNodeName(), catNode.getTextContent());
                                                                }
                                                            }
                                                            prod.put("category", cat.get("name"));
                                                            categoriesToReturn.add(cat);
                                                        } else {
                                                            prod.put(tag, value);
                                                        }
                                                    }
                                                }
                                                productsToReturn.add(prod);
                                            }
                                            // Remove XML from reply
                                            finalReply = finalReply.replaceAll("(?s)<List>.*?</List>", "").trim();
                                        } catch (Exception ex) {
                                            System.out.println("[XML Parse] Exception: " + ex.getMessage());
                                        }
                                    }
                                    // --- END XML PARSE ---
                                    // Fallback: if no XML, use old logic
                                    if (productsToReturn.isEmpty()) {
                            for (Product p : allProducts) {
                                            if (finalReply.contains("id: " + p.getId()) || finalReply.toLowerCase().contains(p.getTitle().toLowerCase())) {
                                    Map<String, Object> prod = new HashMap<>();
                                    prod.put("id", p.getId());
                                    prod.put("title", p.getTitle());
                                    prod.put("description", p.getDescription());
                                    double price = getDiscountedPrice(p);
                                    prod.put("price", String.format("%.2f", price));
                                    prod.put("currency", "USD");
                                    prod.put("currencySymbol", "$");
                                    prod.put("quantity", p.getQuantity());
                                    prod.put("discount", p.getDiscount());
                                    prod.put("rating", p.getRating());
                                    prod.put("image", p.getImage());
                                    prod.put("category", p.getCategory() != null ? p.getCategory().getName() : null);
                                    productsToReturn.add(prod);
                                }
                            }
                            for (Category c : allCategories) {
                                            if (finalReply.contains("id: " + c.getId()) || finalReply.toLowerCase().contains(c.getName().toLowerCase())) {
                                    Map<String, Object> cat = new HashMap<>();
                                    cat.put("id", c.getId());
                                    cat.put("name", c.getName());
                                    cat.put("icon", c.getIcon());
                                    cat.put("iconFamily", c.getIconFamily());
                                    cat.put("image", c.getImage());
                                    categoriesToReturn.add(cat);
                                            }
                                }
                            }
                        }
                        Map<String, Object> response = new HashMap<>();
                                response.put("reply", finalReply);
                        if (!productsToReturn.isEmpty()) {
                          for (Map<String, Object> prod : productsToReturn) {
                            if (prod.containsKey("price")) {
                              double price = Double.parseDouble(prod.get("price").toString());
                              if (!userCurrency.equals("USD")) {
                                price = exchangeRateService.convert(price, "USD", userCurrency);
                              }
                              prod.put("price", String.format("%.2f", price));
                              prod.put("currency", userCurrency);
                              prod.put("currencySymbol", currencySymbol);
                            }
                          }
                        }
                        if (!productsToReturn.isEmpty()) response.put("products", productsToReturn);
                        if (!categoriesToReturn.isEmpty()) response.put("categories", categoriesToReturn);
                        return ResponseEntity.ok(response);
                    }
                } catch (Exception ex) {
                    System.out.println("[OpenRouter] Exception: " + ex.getMessage());
                }
            }
                }
            }
            // --- Always parse XML if present ---
            Map<String, Object> parsed = parseXmlProductsAndCategories(finalReply);
            String cleanedReply = (String) parsed.get("reply");
            List<Map<String, Object>> xmlProducts = (List<Map<String, Object>>) parsed.get("products");
            List<Map<String, Object>> xmlCategories = (List<Map<String, Object>>) parsed.get("categories");
            if (!xmlProducts.isEmpty()) productsToReturn = xmlProducts;
            if (!xmlCategories.isEmpty()) categoriesToReturn = xmlCategories;
            Map<String, Object> response = new HashMap<>();
            response.put("reply", cleanedReply);
            if (!productsToReturn.isEmpty()) {
              for (Map<String, Object> prod : productsToReturn) {
                if (prod.containsKey("price")) {
                  double price = Double.parseDouble(prod.get("price").toString());
                  if (!userCurrency.equals("USD")) {
                    price = exchangeRateService.convert(price, "USD", userCurrency);
                  }
                  prod.put("price", String.format("%.2f", price));
                  prod.put("currency", userCurrency);
                  prod.put("currencySymbol", currencySymbol);
                }
              }
            }
            if (!productsToReturn.isEmpty()) response.put("products", productsToReturn);
            if (!categoriesToReturn.isEmpty()) response.put("categories", categoriesToReturn);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("[NLP] Exception: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    // --- Chat Session Endpoints ---
    @PostMapping("/session")
    public ResponseEntity<?> createSession(@RequestBody Map<String, Object> req) {
        String userId = (String) req.get("userId");
        String sessionName = (String) req.get("sessionName");
        if (userId == null) return ResponseEntity.badRequest().body("Missing userId");
        ChatSession session = new ChatSession(userId);
        if (sessionName != null) session.setSessionName(sessionName);
        chatSessionRepository.save(session);
        return ResponseEntity.ok(Map.of("sessionId", session.getId()));
    }

    @GetMapping("/sessions")
    public ResponseEntity<?> getSessions(@RequestParam String userId) {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(28);
        List<ChatSession> sessions = chatSessionRepository.findByUserIdAndLastActiveAtAfter(userId, cutoff);
        // Return sessionName as well
        List<Map<String, Object>> result = new ArrayList<>();
        for (ChatSession s : sessions) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", s.getId());
            map.put("createdAt", s.getCreatedAt());
            map.put("lastActiveAt", s.getLastActiveAt());
            map.put("sessionName", s.getSessionName());
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/session/{sessionId}/history")
    public ResponseEntity<?> getSessionHistory(@PathVariable UUID sessionId) {
        Optional<ChatSession> sessionOpt = chatSessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) return ResponseEntity.notFound().build();
        List<ChatMessage> messages = chatMessageRepository.findBySessionOrderByTimestampAsc(sessionOpt.get());
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/session/{sessionId}/message")
    public ResponseEntity<?> addMessageToSession(@PathVariable UUID sessionId, @RequestBody Map<String, Object> req) {
        Optional<ChatSession> sessionOpt = chatSessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) return ResponseEntity.notFound().build();
        ChatSession session = sessionOpt.get();
        String userId = (String) req.get("userId");
        String role = (String) req.get("role");
        String text = (String) req.get("text");
        String extraData = req.get("extraData") != null ? req.get("extraData").toString() : null;
        if (userId == null || role == null || text == null) return ResponseEntity.badRequest().body("Missing fields");
        // Always set the session on the message
        ChatMessage message = new ChatMessage();
        message.setSession(session);
        message.setUserId(userId);
        message.setRole(role);
        message.setText(text);
        message.setExtraData(extraData);
        chatMessageRepository.save(message);
        // If this is the first user message, set sessionName
        if (session.getSessionName() == null && "user".equals(role)) {
            String[] words = text.trim().split("\\s+");
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < Math.min(words.length, 12); i++) {
                sb.append(words[i]);
                if (i < Math.min(words.length, 12) - 1) sb.append(" ");
            }
            session.setSessionName(sb.toString());
        }
        // Update session lastActiveAt
        session.setLastActiveAt(LocalDateTime.now());
        chatSessionRepository.save(session);
        return ResponseEntity.ok(Map.of("messageId", message.getId()));
    }
} 