
package com.demo.repository;

import com.demo.model.Book;
import com.demo.model.ListingType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
	Page<Book> findByUserId(Long userId, Pageable pageable);

	Page<Book> findByListingType(ListingType listingType, Pageable pageable);

	Page<Book> findByTitleContainingIgnoreCase(String title, Pageable pageable);

	Page<Book> findByTitleContainingIgnoreCaseAndSubject(String title, String subject, Pageable pageable);

	Page<Book> findByTitleContainingIgnoreCaseAndListingType(String title, ListingType listingType, Pageable pageable);

	Page<Book> findByTitleContainingIgnoreCaseAndSubjectAndListingType(String title, String subject,
			ListingType listingType, Pageable pageable);

	Page<Book> findByTitleContainingIgnoreCaseAndSubjectAndListingTypeAndBookCondition(String title, String subject,
			ListingType listingType, String condition, Pageable pageable);

	Page<Book> findByTitleContainingIgnoreCaseAndSubjectAndBookCondition(String title, String subject, String condition,
			Pageable pageable);

	Page<Book> findByTitleContainingIgnoreCaseAndListingTypeAndBookCondition(String title, ListingType listingType,
			String condition, Pageable pageable);

	Page<Book> findByTitleContainingIgnoreCaseAndBookCondition(String title, String condition, Pageable pageable);
}