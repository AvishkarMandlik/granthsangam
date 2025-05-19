

package com.demo.controller;

import com.demo.model.*;
import com.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/likes")
@CrossOrigin
public class LikeController {

    @Autowired
    private LikeRepository likeRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private BookRepository bookRepo;

    @Autowired
    private NotificationRepository notificationRepo;

    private void createNotification(User user, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setSeen(false);
        notification.setCreatedAt(LocalDateTime.now());
        notificationRepo.save(notification);
    }

    @PostMapping("/{userId}/{bookId}")
    public ResponseEntity<Map<String, Object>> likeBook(
            @PathVariable Long userId, 
            @PathVariable Long bookId) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            Book book = bookRepo.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

            if (likeRepo.findByUserAndBook(user, book).isPresent()) {
                response.put("success", false);
                response.put("message", "Already liked");
                return ResponseEntity.ok(response);
            }

            BookLike like = new BookLike();
            like.setUser(user);
            like.setBook(book);
            likeRepo.save(like);

            long likeCount = likeRepo.countByBook(book);

            if (!user.equals(book.getUser())) {
                createNotification(book.getUser(),
                    String.format("%s liked your book: %s",
                    user.getName(), book.getTitle()));
            }

            response.put("success", true);
            response.put("likeCount", likeCount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/{userId}/{bookId}")
    public ResponseEntity<Map<String, Object>> unlikeBook(
            @PathVariable Long userId, 
            @PathVariable Long bookId) {
        
        Map<String, Object> response = new HashMap<>();
        
        try {
            User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            Book book = bookRepo.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

            Optional<BookLike> existing = likeRepo.findByUserAndBook(user, book);
            if (existing.isPresent()) {
                likeRepo.delete(existing.get());
                long likeCount = likeRepo.countByBook(book);

                response.put("success", true);
                response.put("likeCount", likeCount);
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Like not found");
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/check/{userId}/{bookId}")
    public ResponseEntity<Boolean> checkIfLiked(
            @PathVariable Long userId, 
            @PathVariable Long bookId) {
        try {
            User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            Book book = bookRepo.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));
            return ResponseEntity.ok(likeRepo.findByUserAndBook(user, book).isPresent());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(false);
        }
    }

    @GetMapping("/count/{bookId}")
    public ResponseEntity<Long> getLikeCount(@PathVariable Long bookId) {
        try {
            Book book = bookRepo.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));
            return ResponseEntity.ok(likeRepo.countByBook(book));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(0L);
        }
    }
}