package com.ShopNova.ShopNova;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@Slf4j
public class MomoService {

    @Value("${momo.base-url}")
    private String baseUrl;

    @Value("${momo.primary-key}")
    private String primaryKey;

    @Value("${momo.environment}")
    private String environment;

    @Value("${momo.currency}")
    private String currency;

    @Value("${momo.callback-host:localhost}")
    private String callbackHost;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper mapper = new ObjectMapper();

    // Step 1: Create API user (sandbox only — call once per UUID)
    public String createApiUser(String referenceId) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-Reference-Id", referenceId);
        headers.set("Ocp-Apim-Subscription-Key", primaryKey);

        Map<String, String> body = new HashMap<>();
        body.put("providerCallbackHost", callbackHost);

        HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.exchange(
                baseUrl + "/v1_0/apiuser",
                HttpMethod.POST, entity, String.class);
        return response.getStatusCode().toString();
    }

    // Step 2: Create API key for the user
    public String createApiKey(String referenceId) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Ocp-Apim-Subscription-Key", primaryKey);

        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(
                baseUrl + "/v1_0/apiuser/" + referenceId + "/apikey",
                HttpMethod.POST, entity, String.class);
        try {
            JsonNode node = mapper.readTree(response.getBody());
            return node.get("apiKey").asText();
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse API key: " + e.getMessage());
        }
    }

    // Step 3: Get access token
    public String getAccessToken(String userId, String apiKey) {
        String credentials = Base64.getEncoder().encodeToString((userId + ":" + apiKey).getBytes());

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Basic " + credentials);
        headers.set("Ocp-Apim-Subscription-Key", primaryKey);

        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(
                baseUrl + "/collection/token/",
                HttpMethod.POST, entity, String.class);
        try {
            JsonNode node = mapper.readTree(response.getBody());
            return node.get("access_token").asText();
        } catch (Exception e) {
            throw new RuntimeException("Failed to get access token: " + e.getMessage());
        }
    }

    // Step 4: Request to Pay (push payment)
    public String requestToPay(String accessToken, String phone, BigDecimal amount, String orderNumber) {
        String referenceId = UUID.randomUUID().toString();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + accessToken);
        headers.set("X-Reference-Id", referenceId);
        headers.set("X-Target-Environment", environment);
        headers.set("Ocp-Apim-Subscription-Key", primaryKey);

        // Normalize phone: remove leading 0, add 250
        String normalizedPhone = phone.replaceAll("\\s+", "");
        if (normalizedPhone.startsWith("0")) {
            normalizedPhone = "250" + normalizedPhone.substring(1);
        }

        Map<String, Object> body = new HashMap<>();
        body.put("amount", amount.setScale(0, java.math.RoundingMode.CEILING).toString());
        body.put("currency", currency);
        body.put("externalId", orderNumber);
        body.put("payer", Map.of("partyIdType", "MSISDN", "partyId", normalizedPhone));
        body.put("payerMessage", "Payment for ShopNova order " + orderNumber);
        body.put("payeeNote", "ShopNova order " + orderNumber);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        restTemplate.exchange(baseUrl + "/collection/v1_0/requesttopay",
                HttpMethod.POST, entity, String.class);

        return referenceId;
    }

    // Step 5: Check payment status
    public String getPaymentStatus(String accessToken, String referenceId) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        headers.set("X-Target-Environment", environment);
        headers.set("Ocp-Apim-Subscription-Key", primaryKey);

        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(
                baseUrl + "/collection/v1_0/requesttopay/" + referenceId,
                HttpMethod.GET, entity, String.class);
        try {
            JsonNode node = mapper.readTree(response.getBody());
            return node.get("status").asText();
        } catch (Exception e) {
            throw new RuntimeException("Failed to get payment status: " + e.getMessage());
        }
    }
}
