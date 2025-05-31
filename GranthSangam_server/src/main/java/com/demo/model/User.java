package com.demo.model;

import jakarta.persistence.*;
//import lombok.*;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "users")
public class User {
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String email;
    private String password;
    private String contact;
    private String role; 
    

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonIgnore // Ignore this during serialization
    private List<Book> books;

    @OneToMany(mappedBy = "fromUser")
    @JsonIgnore // Ignore this during serialization
    private List<ExchangeRequest> sentRequests;

    @OneToMany(mappedBy = "toUser")
    @JsonIgnore // Ignore this during serialization
    private List<ExchangeRequest> receivedRequests;
    
    @OneToMany(mappedBy = "user")
    @JsonManagedReference("user-likes") // Managed (forward) reference
    private List<BookLike> likedBooks;


	public User() {
		super();
		// TODO Auto-generated constructor stub
	}

	public User(Long id, String name, String email, String password, String contact,
			String role, List<Book> books, List<ExchangeRequest> sentRequests,
	           List<ExchangeRequest> receivedRequests, List<BookLike> likedBooks) {
	    this.id = id;
	    this.name = name;
	    this.email = email;
	    this.password = password;
	    this.contact = contact;
	    this.role = role;
	    this.books = books;
	    this.sentRequests = sentRequests;
	    this.receivedRequests = receivedRequests;
	    this.likedBooks = likedBooks;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getContact() {
		return contact;
	}

	public void setContact(String contact) {
		this.contact = contact;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public List<Book> getBooks() {
		return books;
	}

	public void setBooks(List<Book> books) {
		this.books = books;
	}

	public List<ExchangeRequest> getSentRequests() {
		return sentRequests;
	}

	public void setSentRequests(List<ExchangeRequest> sentRequests) {
		this.sentRequests = sentRequests;
	}

	public List<ExchangeRequest> getReceivedRequests() {
		return receivedRequests;
	}

	public void setReceivedRequests(List<ExchangeRequest> receivedRequests) {
		this.receivedRequests = receivedRequests;
	}
    
	public List<BookLike> getLikedBooks() {
        return likedBooks;
    }

    public void setLikedBooks(List<BookLike> likedBooks) {
        this.likedBooks = likedBooks;
    }
    
}
