package com.demo.model;

import jakarta.persistence.*;
//import lombok.*;

@Entity
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
public class Wishlist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Book book;

	public Wishlist() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Wishlist(Long id, User user, Book book) {
		super();
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
