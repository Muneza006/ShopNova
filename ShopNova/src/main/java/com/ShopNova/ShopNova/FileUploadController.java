package com.ShopNova.ShopNova;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class FileUploadController {

    @Value("${upload.dir:uploads}")
    private String uploadDir;

    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "No file provided"));

        String ext = "";
        String original = file.getOriginalFilename();
        if (original != null && original.contains(".")) ext = original.substring(original.lastIndexOf("."));

        String filename = UUID.randomUUID() + ext;
        Path dir = Paths.get(uploadDir);
        Files.createDirectories(dir);
        Files.copy(file.getInputStream(), dir.resolve(filename), StandardCopyOption.REPLACE_EXISTING);

        String url = "http://localhost:8080/uploads/" + filename;
        return ResponseEntity.ok(Map.of("url", url));
    }
}
