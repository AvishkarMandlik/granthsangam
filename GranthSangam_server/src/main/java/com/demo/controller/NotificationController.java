
package com.demo.controller;

import com.demo.model.*;
import com.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepo;

    @Autowired
    private UserRepository userRepo;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "false") boolean unreadOnly) {
        try {
            User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            List<Notification> notifications = unreadOnly ?
                notificationRepo.findByUserAndSeenFalseOrderByCreatedAtDesc(user) :
                notificationRepo.findByUserOrderByCreatedAtDesc(user);
                
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/mark-read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        try {
            Notification notification = notificationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
            notification.setSeen(true);
            return ResponseEntity.ok(notificationRepo.save(notification));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/user/{userId}/unread-count")
    public ResponseEntity<Long> getUnreadCount(@PathVariable Long userId) {
        try {
            User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            return ResponseEntity.ok(notificationRepo.countByUserAndSeenFalse(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        try {
            notificationRepo.deleteById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}