
package com.demo.repository;

import com.demo.model.Book;
import com.demo.model.ExchangeRequest;
import com.demo.model.ExchangeStatus;
import com.demo.model.User;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ExchangeRequestRepository extends JpaRepository<ExchangeRequest, Long> {
	
	List<ExchangeRequest> findByToUserOrderByCreatedAtDesc(User user);
    List<ExchangeRequest> findByFromUserOrderByCreatedAtDesc(User user);
    
    
    List<ExchangeRequest> findByToUser(User user);
    
    List<ExchangeRequest> findByFromUser(User user);
    
    boolean existsByFromUserAndRequestedBookAndStatus(
        User fromUser, Book requestedBook, ExchangeStatus status);
    
    @Query("SELECT er FROM ExchangeRequest er WHERE er.toUser = :user AND er.status = 'PENDING'")
    List<ExchangeRequest> findPendingByToUser(@Param("user") User user);
    
    @Query("SELECT er FROM ExchangeRequest er WHERE er.fromUser = :user AND er.status = 'PENDING'")
    List<ExchangeRequest> findPendingByFromUser(@Param("user") User user);
    
    @Query("SELECT er FROM ExchangeRequest er WHERE er.requestedBook = :book AND er.status = 'PENDING'")
    List<ExchangeRequest> findPendingByRequestedBook(@Param("book") Book book);
    
    List<ExchangeRequest> findByFromUserAndRequestedBook(User fromUser, Book book);

    List<ExchangeRequest> findByRequestedBookAndStatus(Book requestedBook, ExchangeStatus status);

//    For Admin
    
    List<ExchangeRequest> findByStatus(ExchangeStatus status);
    long countByStatus(ExchangeStatus status);
  
}