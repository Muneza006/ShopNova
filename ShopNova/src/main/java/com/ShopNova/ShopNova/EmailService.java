package com.ShopNova.ShopNova;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendWelcomeEmail(String to, String firstName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Welcome back to ShopNova, " + firstName + "! 👋");
            StringBuilder sb = new StringBuilder();
            sb.append("Dear ").append(firstName).append(",\n\n");
            sb.append("Welcome back to ShopNova! 🎉\n\n");
            sb.append("You have successfully logged in to your account.\n");
            sb.append("We're so happy to have you back!\n\n");
            sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            sb.append("WHAT YOU CAN DO TODAY:\n");
            sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            sb.append("  🛍️  Browse our latest products\n");
            sb.append("  ❤️  Check your wishlist\n");
            sb.append("  📦  Track your orders\n");
            sb.append("  💰  Grab today's best deals\n");
            sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
            sb.append("If this wasn't you, please reset your password immediately.\n\n");
            sb.append("Happy shopping!\n");
            sb.append("With love,\n");
            sb.append("The ShopNova Team ❤️");
            message.setText(sb.toString());
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send welcome email: " + e.getMessage());
        }
    }

    public void sendVerificationEmail(String to, String firstName, String verifyLink) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Verify your ShopNova email address");
            message.setText(
                "Hello " + firstName + ",\n\n" +
                "Thank you for registering on ShopNova!\n\n" +
                "Please click the link below to verify your email address:\n\n" +
                verifyLink + "\n\n" +
                "This link expires in 24 hours.\n\n" +
                "If you did not create an account, please ignore this email.\n\n" +
                "Best regards,\nShopNova Team"
            );
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send verification email: " + e.getMessage());
        }
    }

    public void sendRegistrationEmail(String to, String firstName) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Welcome to ShopNova!");
            message.setText(
                "Hello " + firstName + ",\n\n" +
                "Thank you for registering on ShopNova!\n\n" +
                "Your account has been successfully created. You can now login and start shopping.\n\n" +
                "Best regards,\n" +
                "ShopNova Team"
            );
            
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    public void sendPasswordResetEmail(String to, String resetLink) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject("Reset Your ShopNova Password");
            message.setText(
                "Hello,\n\n" +
                "You requested to reset your password. Click the link below to reset it:\n\n" +
                resetLink + "\n\n" +
                "This link will expire in 1 hour.\n\n" +
                "If you didn't request this, please ignore this email.\n\n" +
                "Best regards,\n" +
                "ShopNova Team"
            );
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }

    public void sendOrderConfirmationToCustomer(Order order) {
        if (order.getCustomerEmail() == null || order.getCustomerEmail().isBlank()) return;
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(order.getCustomerEmail());
            message.setSubject("Your ShopNova Order is Confirmed! " + order.getOrderNumber());
            StringBuilder sb = new StringBuilder();
            sb.append("Dear ").append(order.getCustomerName()).append(",\n\n");
            sb.append("Thank you for shopping with ShopNova! 🎉\n");
            sb.append("We truly appreciate your trust in us.\n\n");
            sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            sb.append("ORDER SUMMARY\n");
            sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            sb.append("Order Number : ").append(order.getOrderNumber()).append("\n");
            sb.append("Status       : ").append(order.getStatus()).append("\n");
            sb.append("Payment      : ").append(order.getPaymentMethod()).append("\n");
            sb.append("Delivery To  : ").append(order.getShippingAddress()).append("\n\n");
            sb.append("ITEMS ORDERED:\n");
            order.getItems().forEach(item ->
                sb.append("  • ").append(item.getProduct().getName())
                  .append(" x").append(item.getQuantity())
                  .append(" — $").append(item.getPrice()).append("\n")
            );
            sb.append("\nTotal Amount : $").append(order.getTotalAmount()).append("\n");
            sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
            if ("MOBILE_MONEY".equals(order.getPaymentMethod())) {
                sb.append("PAYMENT INSTRUCTIONS:\n");
                sb.append("Please send $").append(order.getTotalAmount()).append(" via MTN MoMo or Airtel Money to:\n");
                sb.append("  Phone : 0790 765 114 (ShopNova Payments)\n");
                sb.append("  Reference : ").append(order.getOrderNumber()).append("\n");
                sb.append("Your order will be processed once payment is confirmed.\n\n");
            } else {
                sb.append("Your order will be delivered to your address.\n");
                sb.append("Please have the exact amount ready upon delivery.\n\n");
            }
            sb.append("If you have any questions, reply to this email or contact us.\n\n");
            sb.append("Thank you for choosing ShopNova!\n");
            sb.append("With appreciation,\n");
            sb.append("The ShopNova Team ❤️");
            message.setText(sb.toString());
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send order confirmation email: " + e.getMessage());
        }
    }

    public void sendPaymentSuccessToCustomer(Order order) {
        if (order.getCustomerEmail() == null || order.getCustomerEmail().isBlank()) return;
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(order.getCustomerEmail());
            message.setSubject("Payment Received — ShopNova Order " + order.getOrderNumber());
            StringBuilder sb = new StringBuilder();
            sb.append("Dear ").append(order.getCustomerName()).append(",\n\n");
            sb.append("Great news! We have received your payment. ✅\n\n");
            sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            sb.append("PAYMENT CONFIRMED\n");
            sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
            sb.append("Order Number : ").append(order.getOrderNumber()).append("\n");
            sb.append("Amount Paid  : $").append(order.getTotalAmount()).append("\n");
            sb.append("Payment Via  : MTN Mobile Money\n");
            sb.append("Order Status : PAID\n");
            sb.append("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n");
            sb.append("Your order is now being prepared and will be delivered to:\n");
            sb.append(order.getShippingAddress()).append("\n\n");
            sb.append("We will notify you once your order is shipped.\n\n");
            sb.append("Thank you so much for shopping with ShopNova!\n");
            sb.append("We truly appreciate your business and look forward to serving you again.\n\n");
            sb.append("With gratitude,\n");
            sb.append("The ShopNova Team ❤️");
            message.setText(sb.toString());
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send payment success email: " + e.getMessage());
        }
    }

    public void sendOrderNotificationToAdmin(Order order) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo("pascalmuneza0@gmail.com");
            message.setSubject("New Order Received - " + order.getOrderNumber());
            StringBuilder sb = new StringBuilder();
            sb.append("New order received on ShopNova!\n\n");
            sb.append("Order Number: ").append(order.getOrderNumber()).append("\n");
            sb.append("Customer: ").append(order.getCustomerName()).append("\n");
            sb.append("Email: ").append(order.getCustomerEmail()).append("\n");
            sb.append("Phone: ").append(order.getCustomerPhone()).append("\n");
            sb.append("Shipping Address: ").append(order.getShippingAddress()).append("\n");
            sb.append("Payment Method: ").append(order.getPaymentMethod()).append("\n\n");
            sb.append("Items:\n");
            order.getItems().forEach(item ->
                sb.append("  - ").append(item.getProduct().getName())
                  .append(" x").append(item.getQuantity())
                  .append(" @ $").append(item.getPrice()).append("\n")
            );
            sb.append("\nTotal: $").append(order.getTotalAmount());
            message.setText(sb.toString());
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send order notification: " + e.getMessage());
        }
    }
}
