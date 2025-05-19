// book-management.component.ts
import { Component } from '@angular/core';
import { AdminService } from '../admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './book-management.component.html',
  styleUrls: ['./book-management.component.css']
})
export class BookManagementComponent {
  books: any[] = [];
  isLoading = false;
  editingBook: any = null;

  constructor(private adminService: AdminService) {
    this.loadBooks();
  }

  loadBooks(): void {
    this.isLoading = true;
    this.adminService.getAllBooks().subscribe({
      next: (books) => {
        this.books = books;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading books:', err);
        this.isLoading = false;
      }
    });
  }

  editBook(book: any): void {
    this.editingBook = { ...book };
  }

  updateBook(): void {
    if (this.editingBook) {
      this.adminService.updateBook(this.editingBook.id, this.editingBook).subscribe({
        next: (updatedBook) => {
          const index = this.books.findIndex(b => b.id === updatedBook.id);
          if (index !== -1) {
            this.books[index] = updatedBook;
          }
          this.editingBook = null;
        },
        error: (err) => {
          console.error('Error updating book:', err);
        }
      });
    }
  }

  deleteBook(bookId: number): void {
    if (confirm('Are you sure you want to delete this book?')) {
      this.adminService.deleteBook(bookId).subscribe({
        next: () => {
          this.books = this.books.filter(b => b.id !== bookId);
        },
        error: (err) => {
          console.error('Error deleting book:', err);
        }
      });
    }
  }
}