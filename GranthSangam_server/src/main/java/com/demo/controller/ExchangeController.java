
package com.demo.controller;

import com.demo.model.*;
import com.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exchange")
@CrossOrigin(origins = "*")
public class ExchangeController {

    @Autowired
    private ExchangeRequestRepository exchangeRepo;

    @Autowired
    private BookRepository bookRepo;

    @Autowired
    private UserRepository userRepo;

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

    @PostMapping("/request")
    public ResponseEntity<?> requestExchange(
            @RequestParam Long fromUserId,
            @RequestParam Long toUserId,
            @RequestParam Long bookId) {
        try {
            User fromUser = userRepo.findById(fromUserId)
                .orElseThrow(() -> new RuntimeException("Requester user not found"));
            User toUser = userRepo.findById(toUserId)
                .orElseThrow(() -> new RuntimeException("Book owner not found"));
            Book requestedBook = bookRepo.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

            if (!requestedBook.isAvailable()) {
                return ResponseEntity.badRequest().body("Book is not available for exchange");
            }

            if (exchangeRepo.existsByFromUserAndRequestedBookAndStatus(
                    fromUser, requestedBook, ExchangeStatus.PENDING)) {
                return ResponseEntity.badRequest().body("You already have a pending request for this book");
            }

            ExchangeRequest req = new ExchangeRequest();
            req.setFromUser(fromUser);
            req.setToUser(toUser);
            req.setRequestedBook(requestedBook);
            req.setStatus(ExchangeStatus.PENDING);

            ExchangeRequest savedRequest = exchangeRepo.save(req);
            
            createNotification(toUser, 
                String.format("%s wants to exchange for your book: %s", 
                fromUser.getName(), requestedBook.getTitle()));
            
            return ResponseEntity.status(HttpStatus.CREATED).body(savedRequest);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error creating exchange request: " + e.getMessage());
        }
    }

    @GetMapping("/incoming/{userId}")
    public ResponseEntity<?> getIncomingRequests(@PathVariable Long userId) {
        try {
            User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            List<ExchangeRequest> requests = exchangeRepo.findByToUserOrderByCreatedAtDesc(user);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Error fetching incoming requests: " + e.getMessage());
        }
    }

    @GetMapping("/outgoing/{userId}")
    public ResponseEntity<?> getOutgoingRequests(@PathVariable Long userId) {
        try {
            User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            List<ExchangeRequest> requests = exchangeRepo.findByFromUserOrderByCreatedAtDesc(user);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("Error fetching outgoing requests: " + e.getMessage());
        }
    }

    @PostMapping("/approve/{reqId}")
    public ResponseEntity<?> approveRequest(@PathVariable Long reqId) {
        try {
            ExchangeRequest req = exchangeRepo.findById(reqId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

            if (req.getStatus() != ExchangeStatus.PENDING) {
                return ResponseEntity.badRequest().body("Only pending requests can be approved");
            }

            req.setStatus(ExchangeStatus.APPROVED);
            req.getRequestedBook().setAvailable(false);
            bookRepo.save(req.getRequestedBook());
            
            ExchangeRequest updated = exchangeRepo.save(req);
            
            createNotification(req.getFromUser(),
                String.format("%s approved your request for: %s",
                req.getToUser().getName(), req.getRequestedBook().getTitle()));
            
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error approving request: " + e.getMessage());
        }
    }

    @PostMapping("/reject/{reqId}")
    public ResponseEntity<?> rejectRequest(@PathVariable Long reqId) {
        try {
            ExchangeRequest req = exchangeRepo.findById(reqId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

            if (req.getStatus() != ExchangeStatus.PENDING) {
                return ResponseEntity.badRequest().body("Only pending requests can be rejected");
            }

            req.setStatus(ExchangeStatus.REJECTED);
            ExchangeRequest updated = exchangeRepo.save(req);
            
            createNotification(req.getFromUser(),
                String.format("%s rejected your request for: %s",
                req.getToUser().getName(), req.getRequestedBook().getTitle()));
            
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error rejecting request: " + e.getMessage());
        }
    }

    @DeleteMapping("/{reqId}")
    public ResponseEntity<?> cancelRequest(@PathVariable Long reqId) {
        try {
            ExchangeRequest req = exchangeRepo.findById(reqId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

            if (req.getStatus() != ExchangeStatus.PENDING) {
                return ResponseEntity.badRequest().body("Only pending requests can be cancelled");
            }

            createNotification(req.getToUser(),
                String.format("%s cancelled their request for: %s",
                req.getFromUser().getName(), req.getRequestedBook().getTitle()));
            
            exchangeRepo.delete(req);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error cancelling request: " + e.getMessage());
        }
    }

    @PostMapping("/complete/{reqId}")
    public ResponseEntity<?> completeExchange(@PathVariable Long reqId) {
        try {
            ExchangeRequest req = exchangeRepo.findById(reqId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

            if (req.getStatus() != ExchangeStatus.APPROVED) {
                return ResponseEntity.badRequest().body("Only approved exchanges can be completed");
            }

            req.setStatus(ExchangeStatus.COMPLETED);
            ExchangeRequest updated = exchangeRepo.save(req);
            
            createNotification(req.getFromUser(),
                String.format("Exchange completed for book: %s",
                req.getRequestedBook().getTitle()));
            
            createNotification(req.getToUser(),
                String.format("Exchange completed for book: %s",
                req.getRequestedBook().getTitle()));
            
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error completing exchange: " + e.getMessage());
        }
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkRequestStatus(
            @RequestParam Long userId,
            @RequestParam Long bookId) {
        try {
            User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
            Book book = bookRepo.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

            boolean pending = exchangeRepo.existsByFromUserAndRequestedBookAndStatus(
                user, book, ExchangeStatus.PENDING);
            boolean rejected = exchangeRepo.existsByFromUserAndRequestedBookAndStatus(
                user, book, ExchangeStatus.REJECTED);

            return ResponseEntity.ok(Map.of(
                "hasPendingRequest", pending,
                "wasRejectedBefore", rejected
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error checking request status: " + e.getMessage());
        }
    }

    @GetMapping("/book/{bookId}/pending")
    public ResponseEntity<?> getPendingRequestsForBook(@PathVariable Long bookId) {
        try {
            Book book = bookRepo.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));
            return ResponseEntity.ok(exchangeRepo.findByRequestedBookAndStatus(
                book, ExchangeStatus.PENDING));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error fetching requests: " + e.getMessage());
        }
    }
}
