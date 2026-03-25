package com.ShopNova.ShopNova;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", unique = true, nullable = false)
    private String orderNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "customer_name")
    private String customerName;

    @Column(name = "customer_email")
    private String customerEmail;

    @Column(name = "customer_phone")
    private String customerPhone;

    @Column(name = "shipping_address", columnDefinition = "TEXT")
    private String shippingAddress;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<OrderItem> items;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(nullable = false)
    private String status = "PENDING";

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "momo_reference_id")
    private String momoReferenceId;

    @Column(name = "momo_user_id")
    private String momoUserId;

    @Column(name = "momo_api_key")
    private String momoApiKey;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public static OrderBuilder builder() {
        return new OrderBuilder();
    }

    public static class OrderBuilder {
        private String status = "PENDING";
        private BigDecimal totalAmount = BigDecimal.ZERO;
        private Long id;
        private String orderNumber;
        private User user;
        private String customerName;
        private String customerEmail;
        private String customerPhone;
        private String shippingAddress;
        private List<OrderItem> items;
        private String paymentMethod;
        private String momoReferenceId;
        private String momoUserId;
        private String momoApiKey;

        public OrderBuilder id(Long id) { this.id = id; return this; }
        public OrderBuilder orderNumber(String orderNumber) { this.orderNumber = orderNumber; return this; }
        public OrderBuilder user(User user) { this.user = user; return this; }
        public OrderBuilder customerName(String customerName) { this.customerName = customerName; return this; }
        public OrderBuilder customerEmail(String customerEmail) { this.customerEmail = customerEmail; return this; }
        public OrderBuilder customerPhone(String customerPhone) { this.customerPhone = customerPhone; return this; }
        public OrderBuilder shippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; return this; }
        public OrderBuilder items(List<OrderItem> items) { this.items = items; return this; }
        public OrderBuilder totalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; return this; }
        public OrderBuilder status(String status) { this.status = status; return this; }
        public OrderBuilder paymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; return this; }
        public OrderBuilder momoReferenceId(String momoReferenceId) { this.momoReferenceId = momoReferenceId; return this; }
        public OrderBuilder momoUserId(String momoUserId) { this.momoUserId = momoUserId; return this; }
        public OrderBuilder momoApiKey(String momoApiKey) { this.momoApiKey = momoApiKey; return this; }

        public Order build() {
            Order o = new Order();
            o.id = this.id;
            o.orderNumber = this.orderNumber;
            o.user = this.user;
            o.customerName = this.customerName;
            o.customerEmail = this.customerEmail;
            o.customerPhone = this.customerPhone;
            o.shippingAddress = this.shippingAddress;
            o.items = this.items;
            o.totalAmount = this.totalAmount;
            o.status = this.status;
            o.paymentMethod = this.paymentMethod;
            o.momoReferenceId = this.momoReferenceId;
            o.momoUserId = this.momoUserId;
            o.momoApiKey = this.momoApiKey;
            return o;
        }
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
