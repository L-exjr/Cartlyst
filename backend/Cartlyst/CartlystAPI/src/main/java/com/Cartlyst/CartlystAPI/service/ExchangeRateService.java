package com.Cartlyst.CartlystAPI.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import jakarta.annotation.PostConstruct;
import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ExchangeRateService {
    private static final String API_URL = "https://v6.exchangerate-api.com/v6/9bfff904cddd83d25f954f51/latest/USD";
    private final RestTemplate restTemplate = new RestTemplate();
    private Map<String, Double> rates = new ConcurrentHashMap<>();
    private Date lastUpdated = null;

    @PostConstruct
    @Scheduled(fixedRate = 12 * 60 * 60 * 1000) // every 12 hours
    public void updateRates() {
        try {
            Map response = restTemplate.getForObject(API_URL, Map.class);
            if (response != null && response.containsKey("conversion_rates")) {
                Map<String, Object> newRates = (Map<String, Object>) response.get("conversion_rates");
                rates.clear();
                for (Map.Entry<String, Object> entry : newRates.entrySet()) {
                    rates.put(entry.getKey(), ((Number) entry.getValue()).doubleValue());
                }
                lastUpdated = new Date();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public Map<String, Double> getRates() {
        return rates;
    }

    public Date getLastUpdated() {
        return lastUpdated;
    }

    public double convert(double amount, String from, String to) {
        if (!rates.containsKey(from) || !rates.containsKey(to)) return amount;
        return (amount / rates.get(from)) * rates.get(to);
    }
} 
 
 