package com.demo.model;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

@Entity
@Table(name = "book_like")
public class BookLike {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @ManyToOne
    @JoinColumn(name = "book_id")
    @JsonBackReference("book-likes") // Don't serialize the Book when serializing a BookLike
    private Book book;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference("user-likes")  // Serialize User details in BookLike (or @JsonBackReference if needed elsewhere)
    private User user;

    public BookLike() {}

    public BookLike(Long id, User user, Book book) {
        this.id = id;
        this.user = user;
        this.book = book;
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public Book getBook() {
		return book;
	}

	public void setBook(Book book) {
		this.book = book;
	}
    
    

}
