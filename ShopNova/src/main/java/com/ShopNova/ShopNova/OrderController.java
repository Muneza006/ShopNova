package com.ShopNova.ShopNova;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class OrderController {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final MomoService momoService;

    // ── Customer: place order ─────────────────────────────────────────────
    @PostMapping("/api/orders")
    public ResponseEntity<?> placeOrder(@RequestBody OrderRequest req) {
        User user = req.getUserId() != null
                ? userRepository.findById(req.getUserId()).orElse(null) : null;

        Order order = Order.builder()
                .orderNumber("SN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .user(user)
                .customerName(req.getCustomerName())
                .customerEmail(req.getCustomerEmail())
                .customerPhone(req.getCustomerPhone())
                .shippingAddress(req.getShippingAddress())
                .paymentMethod(req.getPaymentMethod())
                .status("MOBILE_MONEY".equals(req.getPaymentMethod()) ? "PENDING_PAYMENT" : "PENDING")
                .totalAmount(BigDecimal.ZERO)
                .build();

        Order saved = orderRepository.save(order);

        List<OrderItem> items = req.getItems().stream().map(i -> {
            Product product = productRepository.findById(i.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + i.getProductId()));
            if (product.getStockQuantity() < i.getQuantity()) {
                throw new RuntimeException("Not enough stock for: " + product.getName());
            }
            product.setStockQuantity(product.getStockQuantity() - i.getQuantity());
            productRepository.save(product);
            BigDecimal price = product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice();
            return OrderItem.builder()
                    .order(saved)
                    .product(product)
                    .quantity(i.getQuantity())
                    .price(price)
                    .build();
        }).collect(Collectors.toList());

        saved.setItems(items);
        BigDecimal total = items.stream()
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        saved.setTotalAmount(total);
        orderRepository.save(saved);

        emailService.sendOrderNotificationToAdmin(saved);
        emailService.sendOrderConfirmationToCustomer(saved);

        // ── MoMo push payment ─────────────────────────────────────────────
        String momoReferenceId = null;
        if ("MOBILE_MONEY".equals(req.getPaymentMethod()) && req.getMomoPhone() != null) {
            try {
                String userId = UUID.randomUUID().toString();
                momoService.createApiUser(userId);
                String apiKey = momoService.createApiKey(userId);
                String token = momoService.getAccessToken(userId, apiKey);
                momoReferenceId = momoService.requestToPay(token, req.getMomoPhone(), total, saved.getOrderNumber());
                saved.setMomoReferenceId(momoReferenceId);
                saved.setMomoUserId(userId);
                saved.setMomoApiKey(apiKey);
                orderRepository.save(saved);
                log.info("MoMo push sent for order {} ref {}", saved.getOrderNumber(), momoReferenceId);
            } catch (Exception e) {
                log.error("MoMo push failed for order {}: {}", saved.getOrderNumber(), e.getMessage());
            }
        }

        Map<String, Object> response = new java.util.HashMap<>();
        response.put("message", "Order placed successfully");
        response.put("orderNumber", saved.getOrderNumber());
        response.put("orderId", saved.getId());
        response.put("total", total);
        if (momoReferenceId != null) response.put("momoReferenceId", momoReferenceId);
        return ResponseEntity.ok(response);
    }

    // ── Customer: check MoMo payment status ──────────────────────────────
    @GetMapping("/api/orders/{id}/momo-status")
    public ResponseEntity<?> checkMomoStatus(@PathVariable Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (order.getMomoReferenceId() == null) {
            return ResponseEntity.ok(Map.of("status", "N/A"));
        }
        try {
            String token = momoService.getAccessToken(order.getMomoUserId(), order.getMomoApiKey());
            String momoStatus = momoService.getPaymentStatus(token, order.getMomoReferenceId());
            if ("SUCCESSFUL".equals(momoStatus) && !"PAID".equals(order.getStatus())) {
                order.setStatus("PAID");
                orderRepository.save(order);
                emailService.sendPaymentSuccessToCustomer(order);
            } else if ("FAILED".equals(momoStatus) || "REJECTED".equals(momoStatus)) {
                order.setStatus("PAYMENT_FAILED");
                orderRepository.save(order);
            }
            return ResponseEntity.ok(Map.of("status", momoStatus, "orderStatus", order.getStatus()));
        } catch (Exception e) {
            log.error("MoMo status check failed: {}", e.getMessage());
            return ResponseEntity.ok(Map.of("status", "PENDING", "orderStatus", order.getStatus()));
        }
    }

    // ── Customer: get own orders ──────────────────────────────────────────
    @GetMapping("/api/orders/user/{userId}")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {
        return ResponseEntity.ok(orderRepository.findByUserIdOrderByCreatedAtDesc(userId));
    }

    // ── Admin: get all orders ─────────────────────────────────────────────
    @GetMapping("/api/admin/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAllByOrderByCreatedAtDesc());
    }

    // ── Admin: update order status ────────────────────────────────────────
    @PutMapping("/api/admin/orders/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(body.get("status"));
        orderRepository.save(order);
        return ResponseEntity.ok(Map.of("message", "Status updated"));
    }
}

@Data
class OrderRequest {
    private Long userId;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private String shippingAddress;
    private String paymentMethod;
    private String momoPhone;
    private List<OrderItemRequest> items;

    @Data
    static class OrderItemRequest {
        private Long productId;
        private Integer quantity;
    }
}
