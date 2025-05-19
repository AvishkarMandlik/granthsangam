//package com.demo.repository;
//
//import com.demo.model.Notification;
//import com.demo.model.User;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//import java.util.List;
//
//public interface NotificationRepository extends JpaRepository<Notification, Long> {
//    List<Notification> findByUser(User user);
//    long countByUserAndSeenFalse(User user);
//
//}

package com.demo.repository;

import com.demo.model.Notification;
import com.demo.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    List<Notification> findByUserAndSeenFalseOrderByCreatedAtDesc(User user);
    long countByUserAndSeenFalse(User user);
}