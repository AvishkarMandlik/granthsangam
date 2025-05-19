package com.demo.repository;

import com.demo.model.BookLike;
import com.demo.model.User;
import com.demo.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;
import java.util.Optional;

public interface LikeRepository extends JpaRepository<BookLike, Long> {
    List<BookLike> findByUser(User user);
    List<BookLike> findByBook(Book book);
    Optional<BookLike> findByUserAndBook(User user, Book book);
    long countByBook(Book book);
    
    

}
