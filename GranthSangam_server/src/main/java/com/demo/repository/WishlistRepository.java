package com.demo.repository;

import com.demo.model.Wishlist;
import com.demo.model.Book;
import com.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUser(User user);
    long countByBook(Book book); 
    
   

}
