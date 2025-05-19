package com.demo.controller;

import com.demo.model.Book;
import com.demo.model.User;
import com.demo.model.Wishlist;
import com.demo.repository.BookRepository;
import com.demo.repository.UserRepository;
import com.demo.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin
public class WishlistController {

    @Autowired
    private WishlistRepository wishlistRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private BookRepository bookRepo;

    @PostMapping("/{userId}/{bookId}")
    public Wishlist addToWishlist(@PathVariable Long userId, @PathVariable Long bookId) {
        User user = userRepo.findById(userId).orElseThrow();
        Book book = bookRepo.findById(bookId).orElseThrow();

        Wishlist item = new Wishlist();
        item.setUser(user);
        item.setBook(book);
        return wishlistRepo.save(item);
    }

    @GetMapping("/{userId}")
    public List<Wishlist> viewWishlist(@PathVariable Long userId) {
        User user = userRepo.findById(userId).orElseThrow();
        return wishlistRepo.findByUser(user);
    }
}
