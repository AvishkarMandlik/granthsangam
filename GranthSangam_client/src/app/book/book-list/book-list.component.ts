// import { Component, OnInit } from '@angular/core';
// import { BookService } from '../book.service'; // Adjust path if needed
// import { logout } from '../../utils/logout';
// import { Router } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { BookLikeComponent } from '../book-like/book-like.component'; 
// import { Subject } from 'rxjs';
// import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// @Component({
//   selector: 'app-book-list',
//   standalone: true,
//   imports: [CommonModule,RouterModule,BookLikeComponent,FormsModule],
//   templateUrl: './book-list.component.html',
//   styleUrls: ['./book-list.component.css'],
//   template: `
//   <app-book-like 
//     [bookId]="book.id"
//     [initialCount]="book.likesCount || 0"
//     [initialLiked]="book.isLiked || false">
//   </app-book-like>
// `
// })
// export class BookListComponent implements OnInit {
//   books: any[] = [];
//   currentPage = 0;
//   pageSize = 8;
//   totalElements = 0;
//   loading = false;
//   errorMessage = '';

// searchQuery = '';
//   private searchSubject = new Subject<string>();
//   filters = {
//   subject: '',
//   listingType: '',
//   condition: ''
// };

// subjectOptions = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'Biology'];
// listingTypeOptions = ['SELL', 'EXCHANGE', 'GIVEAWAY'];
// conditionOptions = ['NEW', 'GOOD', 'FAIR', 'POOR'];

//   constructor(private bookService: BookService, private router: Router) {}

//   ngOnInit(): void {
//     const user = localStorage.getItem('user');
//     if (!user) {
//       logout();
//       return;
//     }
//     this.loadBooks();
//   }

//  private setupSearchDebounce(): void {
//     // Debounce search input to prevent excessive API calls
//     this.searchSubject.pipe(
//       debounceTime(500),
//       distinctUntilChanged()
//     ).subscribe(() => {
//       this.searchBooks();
//     });
//   }

//   onSearchInput(): void {
//     this.searchSubject.next(this.searchQuery);
//   }

//   loadBooks(): void {
//     this.loading = true;
//     this.errorMessage = '';

//     const params = {
//       page: this.currentPage,
//       size: this.pageSize,
//       ...this.getActiveFilters()
//     };

//     this.bookService.getBooks(params).subscribe({
//       next: (res) => {
//         this.books = res.content || [];
//         this.totalElements = res.totalElements || 0;
//         this.loading = false;
//       },
//       error: (err) => {
//         console.error('Error loading books:', err);
//         this.errorMessage = 'Failed to load books. Please try again later.';
//         this.books = [];
//         this.loading = false;
//       }
//     });
//   }

//   searchBooks(): void {
//     this.currentPage = 0; // Reset to first page on new search
//     this.loadBooks();
//   }

//   clearFilters(): void {
//     this.searchQuery = '';
//     this.filters = {
//       subject: '',
//       listingType: '',
//       condition: ''
//     };
//     this.currentPage = 0;
//     this.loadBooks();
//   }

//   getActiveFilters(): any {
//     const activeFilters: any = {};
    
//     if (this.searchQuery) {
//       activeFilters.query = this.searchQuery;
//     }
    
//     if (this.filters.subject) {
//       activeFilters.subject = this.filters.subject;
//     }
    
//     if (this.filters.listingType) {
//       activeFilters.listingType = this.filters.listingType;
//     }
    
//     if (this.filters.condition) {
//       activeFilters.condition = this.filters.condition;
//     }
    
//     return activeFilters;
//   }

//   onPageChange(page: number): void {
//     this.currentPage = page;
//     this.loadBooks();
//   }

//   getPages(): number[] {
//     const pageCount = Math.ceil(this.totalElements / this.pageSize);
//     return Array.from({ length: pageCount }, (_, i) => i);
//   }

//   // Utility function to get listing type display
//   getListingTypeDisplay(listingType: string): string {
//     switch (listingType) {
//       case 'SELL': return 'For Sale';
//       case 'EXCHANGE': return 'For Exchange';
//       case 'GIVEAWAY': return 'Giveaway';
//       default: return listingType;
//     }
//   }

// }
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookService } from '../book.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BookLikeComponent } from '../book-like/book-like.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [CommonModule, RouterModule, BookLikeComponent, FormsModule],
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit, OnDestroy {
  books: any[] = [];
  currentPage = 0;
  pageSize = 8;
  totalElements = 0;
  loading = false;
  errorMessage = '';
  private destroy$ = new Subject<void>();
  searchQuery = '';
  private searchSubject = new Subject<string>();

  filters = {
    subject: '',
    listingType: '',
    condition: ''
  };

  subjectOptions = ['Self-help', 'Personal Finance', 'Spirituality ', 'Autobiography'];
  listingTypeOptions = ['SELL', 'EXCHANGE', 'DONATE'];
  conditionOptions = ['NEW', 'GOOD', 'FAIR', 'POOR'];

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    const user = localStorage.getItem('user');
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.setupSearchDebounce();
    this.loadBooks();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearchDebounce(): void {
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.searchBooks();
    });
  }

  onSearchInput(): void {
    this.searchSubject.next(this.searchQuery);
  }

 loadBooks(): void {
  this.loading = true;
  this.errorMessage = '';
  const filters = {
    ...this.getActiveFilters(),
    page: this.currentPage,
    size: this.pageSize
  };

  this.bookService.searchBooks(filters)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        this.books = res.content || [];
        this.totalElements = res.totalElements || 0;
        this.loading = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: () => {
        this.errorMessage = 'Failed to load books. Please try again later.';
        this.books = [];
        this.loading = false;
      }
    });
}
  searchBooks(): void {
    this.currentPage = 0;
    this.loadBooks();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.filters = { subject: '', listingType: '', condition: '' };
    this.currentPage = 0;
    this.loadBooks();
  }

  getActiveFilters(): any {
    const activeFilters: any = {};
    if (this.searchQuery) activeFilters.query = this.searchQuery;
    if (this.filters.subject) activeFilters.subject = this.filters.subject;
    if (this.filters.listingType) activeFilters.listingType = this.filters.listingType;
    if (this.filters.condition) activeFilters.condition = this.filters.condition;
    return activeFilters;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadBooks();
  }

  getTotalPages(): number {
    return Math.ceil(this.totalElements / this.pageSize);
  }

  getVisiblePages(): number[] {
    const totalPages = this.getTotalPages();
    const visiblePages = 5;
    const pages: number[] = [];

    let startPage = Math.max(0, this.currentPage - Math.floor(visiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + visiblePages - 1);

    if (endPage - startPage + 1 < visiblePages) {
      startPage = Math.max(0, endPage - visiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }
}
