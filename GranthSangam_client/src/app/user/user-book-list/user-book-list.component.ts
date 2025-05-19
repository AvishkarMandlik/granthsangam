// user-book-list.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-book-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-book-list.component.html',
  styleUrls: ['./user-book-list.component.css']
})
export class UserBookListComponent {
  @Input() books: any[] = [];
  @Input() filteredBooks: any[] = [];
  @Input() isLoading: boolean = false;
  @Input() currentBookPage: number = 0;
  @Input() hasMoreBooks: boolean = false;
  
  @Output() searchQueryChange = new EventEmitter<string>();
  @Output() editBook = new EventEmitter<any>();
  @Output() deleteBook = new EventEmitter<number>();
  @Output() prevPage = new EventEmitter<void>();
  @Output() nextPage = new EventEmitter<void>();
  @Output() uploadNew = new EventEmitter<void>();

  bookSearchQuery: string = '';

  onSearchChange(): void {
    this.searchQueryChange.emit(this.bookSearchQuery);
  }

  onEditBook(book: any): void {
    this.editBook.emit(book);
  }

  onDeleteBook(bookId: number): void {
    this.deleteBook.emit(bookId);
  }

  onPrevPage(): void {
    this.prevPage.emit();
  }

  onNextPage(): void {
    this.nextPage.emit();
  }

  onUploadNew(): void {
    this.uploadNew.emit();
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'AVAILABLE': return 'bg-green-900 text-green-200';
      case 'PENDING': return 'bg-yellow-900 text-yellow-200';
      case 'EXCHANGED': return 'bg-blue-900 text-blue-200';
      default: return 'bg-gray-900 text-gray-200';
    }
  }
}