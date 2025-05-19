package com.demo.controller;

import com.demo.model.Book;
import com.demo.model.User;
import com.demo.model.ExchangeRequest;
import com.demo.model.ExchangeStatus;
import com.demo.repository.BookRepository;
import com.demo.repository.UserRepository;
import com.demo.repository.ExchangeRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
@SuppressWarnings("unused")
public class AdminController {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private BookRepository bookRepo;
    
    @Autowired
    private ExchangeRequestRepository exchangeRepo;

    // Existing user endpoints
    @GetMapping("/users")
    public List<User> allUsers() {
        return userRepo.findAll();
    }

    @DeleteMapping("/user/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepo.deleteById(id);
    }
    
    @PutMapping("/user/{id}/role")
    public User updateUserRole(@PathVariable Long id, @RequestBody User userDetails) {
        return userRepo.findById(id).map(user -> {
            user.setRole(userDetails.getRole());
            return userRepo.save(user);
        }).orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }

    // Existing book endpoints
    @GetMapping("/books")
    public List<Book> allBooks() {
        return bookRepo.findAll();
    }

    @PutMapping("/book/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody Book bookDetails) {
        return bookRepo.findById(id).map(book -> {
            book.setTitle(bookDetails.getTitle());
            book.setAuthor(bookDetails.getAuthor());
            book.setCategory(bookDetails.getCategory());
            book.setSubject(bookDetails.getSubject());
            book.setEdition(bookDetails.getEdition());
            book.setPrice(bookDetails.getPrice());
            book.setListingType(bookDetails.getListingType());
            book.setBookCondition(bookDetails.getBookCondition());
            return ResponseEntity.ok(bookRepo.save(book));
        }).orElse(ResponseEntity.notFound().build());
    }

    // New exchange management endpoints (admin only)
    @GetMapping("/exchanges")
    public List<ExchangeRequest> getAllExchanges() {
        return exchangeRepo.findAll();
    }

    @GetMapping("/exchanges/pending")
    public List<ExchangeRequest> getPendingExchanges() {
        return exchangeRepo.findByStatus(ExchangeStatus.PENDING);
    }

    @GetMapping("/exchanges/completed")
    public List<ExchangeRequest> getCompletedExchanges() {
        return exchangeRepo.findByStatus(ExchangeStatus.COMPLETED);
    }

    @GetMapping("/exchanges/stats")
    public ResponseEntity<?> getExchangeStats() {
        long pending = exchangeRepo.countByStatus(ExchangeStatus.PENDING);
        long completed = exchangeRepo.countByStatus(ExchangeStatus.COMPLETED);
        long rejected = exchangeRepo.countByStatus(ExchangeStatus.REJECTED);
        
        return ResponseEntity.ok().body(new ExchangeStats(pending, completed, rejected));
    }
    @PutMapping("/exchanges/{id}/approve")
    public ResponseEntity<?> approveExchange(@PathVariable Long id) {
        return exchangeRepo.findById(id).map(exchange -> {
            exchange.setStatus(ExchangeStatus.APPROVED);
            exchangeRepo.save(exchange);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/exchanges/{id}/reject")
    public ResponseEntity<?> rejectExchange(@PathVariable Long id) {
        return exchangeRepo.findById(id).map(exchange -> {
            exchange.setStatus(ExchangeStatus.REJECTED);
            exchangeRepo.save(exchange);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/exchanges/{id}")
    public ResponseEntity<?> cancelExchange(@PathVariable Long id) {
        if (exchangeRepo.existsById(id)) {
            exchangeRepo.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Inner class for exchange stats
    private static class ExchangeStats {
        private final long pending;
        private final long completed;
        private final long rejected;

        public ExchangeStats(long pending, long completed, long rejected) {
            this.pending = pending;
            this.completed = completed;
            this.rejected = rejected;
        }

        // Getters
        public long getPending() { return pending; }
        public long getCompleted() { return completed; }
        public long getRejected() { return rejected; }
    }
}
