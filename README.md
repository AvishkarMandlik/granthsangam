# 📚 GranthSangam – Second-Hand Book Exchange Platform
![Alt text](./GranthSangam_client/src/assets/GranthSangam.jpg)
**GranthSangam** (Granth = Book, Sangam = Union) is a web-based platform where users can exchange, donate, or request second-hand books. It promotes affordable education, sustainability, and builds a community of readers helping each other.

---

## 🌟 Project Overview

In today’s world, buying new books is often expensive, and many good books lie unused on shelves. **GranthSangam** solves this problem by connecting book owners with people who need them — allowing **book exchange, donation, and requests** through a simple online system.

This platform is useful for:
- Students who want to save money on books
- People who want to give away or exchange unused books
- Promoting reusability and eco-friendliness

---

## 🚀 Key Features

### 👤 User Features
- Register and Login
- Add, Edit, Delete your books
- Browse all listed books
- Send and manage exchange requests
- Book Like 
- Add books to wishlist
- Receive real-time notifications
- User Dashboard
- Admin Dashboard

### 🛠️ Admin Features
- View and manage all users
- Manage all books and categories
- Dashboard for monitoring activity

---

## 🧰 Tech Stack Used

### 🔙 Backend – Spring Boot (Java)
- RESTful APIs using **Spring Web**
- **Spring Data JPA** for ORM
- **MySQL** for relational database
- **Spring Security** (optional) for user authentication
- Layered architecture with `model`, `repository`, `controller`

### 🗃️ Database – MySQL
- Relational database to store users, books, categories, and exchange_requests, notifications, book_like
- Proper schema with relationships (One-to-Many, Many-to-One)

### 🌐 Frontend – Angular
- **Angular** for responsive single-page application (SPA)
- **TailwindCss + Font Awesome icon** for UI styling
- Components for:
  - Registration/Login
  - Book list, Book upload, Book Details,Book Like and search
  - User and Admin dashboards
  - Notifications and exchange requests

---

## 🔄 How It Works

1. **User registers or logs in**
2. Adds books to their profile
3. Browses available books and sends exchange requests
4. Receives requests for their own books
5. Admin can manage all users, books, and categories
6. Users receive notifications about request status and likes
7. Books can be searched, filtered, or added to a wishlist

---

## 🖼️ Screenshots



> Add screenshots of:
> - Home Page  
> - User Dashboard  
> - Admin Panel  
> - Book Exchange Request Flow  
> *(Optional)*

---

## ⚙️ Installation & Run Locally

### 🔧 Backend (Spring Boot)
```bash
cd GranthSangam_server
./mvnw spring-boot:run
```

### 🔧 Frontend (Angular)
```bash
cd GranthSangam_client
npm install
ng serve
```