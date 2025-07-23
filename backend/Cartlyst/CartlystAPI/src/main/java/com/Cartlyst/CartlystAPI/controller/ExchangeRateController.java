package com.Cartlyst.CartlystAPI.controller;

import com.Cartlyst.CartlystAPI.service.ExchangeRateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/exchange")
public class ExchangeRateController {
    @Autowired
    private ExchangeRateService exchangeRateService;

    @GetMapping("/rates")
    public Map<String, Double> getRates() {
        return exchangeRateService.getRates();
    }

    @GetMapping("/last-updated")
    public String getLastUpdated() {
        return exchangeRateService.getLastUpdated() != null ? exchangeRateService.getLastUpdated().toString() : null;
    }

    @GetMapping("/convert")
    public double convert(@RequestParam double amount, @RequestParam String from, @RequestParam String to) {
        return exchangeRateService.convert(amount, from, to);
    }
} 
 
 