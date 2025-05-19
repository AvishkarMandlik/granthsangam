package com.demo.controller;

import com.demo.model.*;
import com.demo.repository.BookRepository;
import com.demo.repository.CategoryRepository;
import com.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "${allowed.origins}")
public class BookController {

    @Autowired
    private BookRepository bookRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private CategoryRepository categoryRepo;

    @PostMapping("/{userId}")
    public ResponseEntity<Book> addBook(@PathVariable Long userId, @RequestBody Book book) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        Category category = categoryRepo.findById(book.getCategory().getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

        book.setUser(user);
        book.setCategory(category);
        Book savedBook = bookRepo.save(book);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedBook);
    }

    @GetMapping
    public ResponseEntity<Page<Book>> getAllBooks(Pageable pageable) {
        Page<Book> books = bookRepo.findAll(pageable); // Use Pageable
        if (books.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(books);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        Book book = bookRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found"));
        return ResponseEntity.ok(book);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<Book>> getUserBooks(@PathVariable Long userId, Pageable pageable) {
        if (!userRepo.existsById(userId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        Page<Book> userBooks = bookRepo.findByUserId(userId, pageable);
        return ResponseEntity.ok(userBooks);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Book>> searchBooks(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) ListingType listingType,
            @RequestParam(required = false) String condition,
            Pageable pageable) {

        String searchQuery = (query == null) ? "" : query;
        Page<Book> resultPage;
        
        // Handle all possible filter combinations
        if (subject != null && listingType != null && condition != null) {
            resultPage = bookRepo.findByTitleContainingIgnoreCaseAndSubjectAndListingTypeAndBookCondition(
                searchQuery, subject, listingType, condition, pageable);
        } else if (subject != null && listingType != null) {
            resultPage = bookRepo.findByTitleContainingIgnoreCaseAndSubjectAndListingType(
                searchQuery, subject, listingType, pageable);
        } else if (subject != null && condition != null) {
            resultPage = bookRepo.findByTitleContainingIgnoreCaseAndSubjectAndBookCondition(
                searchQuery, subject, condition, pageable);
        } else if (listingType != null && condition != null) {
            resultPage = bookRepo.findByTitleContainingIgnoreCaseAndListingTypeAndBookCondition(
                searchQuery, listingType, condition, pageable);
        } else if (subject != null) {
            resultPage = bookRepo.findByTitleContainingIgnoreCaseAndSubject(
                searchQuery, subject, pageable);
        } else if (listingType != null) {
            resultPage = bookRepo.findByTitleContainingIgnoreCaseAndListingType(
                searchQuery, listingType, pageable);
        } else if (condition != null) {
            resultPage = bookRepo.findByTitleContainingIgnoreCaseAndBookCondition(
                searchQuery, condition, pageable);
        } else {
            resultPage = bookRepo.findByTitleContainingIgnoreCase(searchQuery, pageable);
        }

        return ResponseEntity.ok(resultPage);
    }
    
    

    @PutMapping("/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody Book bookDetails) {
        Book book = bookRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found"));

        book.setTitle(bookDetails.getTitle());
        book.setSubject(bookDetails.getSubject());
        book.setEdition(bookDetails.getEdition());
        book.setPrice(bookDetails.getPrice());
        book.setListingType(bookDetails.getListingType());
        book.setBookCondition(bookDetails.getBookCondition());

        if (bookDetails.getCategory() != null) {
            Category category = categoryRepo.findById(bookDetails.getCategory().getId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
            book.setCategory(category);
        }

        Book updatedBook = bookRepo.save(book);
        return ResponseEntity.ok(updatedBook);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        if (!bookRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Book not found");
        }
        bookRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

