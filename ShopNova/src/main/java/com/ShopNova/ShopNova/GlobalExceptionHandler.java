package com.ShopNova.ShopNova;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleAll(Exception e) {
        log.error("Unhandled exception: {}", e.getMessage(), e);
        Throwable root = e;
        while (root.getCause() != null) root = root.getCause();
        return ResponseEntity.status(500).body(Map.of(
            "error", e.getMessage() != null ? e.getMessage() : "Internal Server Error",
            "cause", root.getMessage() != null ? root.getMessage() : "Unknown"
        ));
    }
}
