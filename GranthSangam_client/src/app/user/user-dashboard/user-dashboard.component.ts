
import { CommonModule } from '@angular/common';
import { BookUploadComponent } from '../../book/book-upload/book-upload.component';
import { ExchangeListComponent } from '../../exchange/exchange-list/exchange-list.component';
import { HeaderComponent } from '../../core/layout/header/header.component';
import { UserBookListComponent } from '../user-book-list/user-book-list.component';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { BookService } from '../../book/book.service';
import { ExchangeService } from '../../exchange/exchange.service';
import { AuthService } from '../../auth/auth.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, BookUploadComponent, ExchangeListComponent, FormsModule, HeaderComponent,UserBookListComponent],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {
  activeSection = 'dashboard';
  userStats: any = {
    booksListed: 0,
    activeListings: 0,
    successfulExchanges: 0,
    pendingRequests: 0,
    rating: '4.8'
  };
  recentActivity: any[] = [];
  userBooks: any[] = [];
  filteredBooks: any[] = [];
  isLoading = false;
  bookSearchQuery = '';
  currentBookPage = 0;
  booksPerPage = 9;
  hasMoreBooks = false;

  constructor(
    private bookService: BookService,
    private exchangeService: ExchangeService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

loadDashboardData(): void {
  this.isLoading = true;
  const userId = this.authService.getCurrentUserId();
  
  if (!userId) {
    console.error('No user ID found');
    this.isLoading = false;
    return;
  }

  forkJoin([
    this.bookService.getUserBooks(userId, this.currentBookPage, this.booksPerPage),
    this.exchangeService.getIncomingRequests(userId),
    this.exchangeService.getOutgoingRequests(userId),
    this.exchangeService.getIncomingRequests(userId), // Get incoming again for completed status
    this.exchangeService.getOutgoingRequests(userId)  // Get outgoing again for completed status
  ]).subscribe({
    next: ([books, incomingRequests, outgoingRequests, allIncoming, allOutgoing]) => {
      // Handle paginated books response
      const booksData = books.content || books;
      this.userBooks = Array.isArray(booksData) ? booksData : [];
      this.filteredBooks = [...this.userBooks];
      this.hasMoreBooks = books.totalElements > (this.currentBookPage + 1) * this.booksPerPage;
      
      // Combine all requests to find completed exchanges
      const allRequests = [...allIncoming, ...allOutgoing];
      
      // Calculate stats
      this.userStats.booksListed = books.totalElements || this.userBooks.length;
      this.userStats.activeListings = this.userBooks.filter(b => b.status === 'AVAILABLE').length;
      
      // Count completed exchanges (status = 'COMPLETED')
      this.userStats.successfulExchanges = allRequests.filter(
        (r: any) => r.status === 'COMPLETED'
      ).length;
      
      // Count pending requests (both incoming and outgoing)
      this.userStats.pendingRequests = 
        (incomingRequests.filter((r: any) => r.status === 'PENDING').length || 0) + 
        (outgoingRequests.filter((r: any) => r.status === 'PENDING').length || 0);
      
      this.loadRecentActivity(allIncoming, allOutgoing);
      this.isLoading = false;
    },
    error: (err) => {
      console.error('Error loading dashboard data:', err);
      this.isLoading = false;
    }
  });
}

  loadRecentActivity(incomingRequests: any[], outgoingRequests: any[]): void {
    // Combine and process both incoming and outgoing requests
    const allRequests = [...incomingRequests, ...outgoingRequests]
      .filter((r: any) => r.status === 'APPROVED' || r.status === 'REJECTED' || r.status === 'COMPLETED')
      .sort((a: any, b: any) => {
        const dateA = new Date(a.updatedAt || a.createdAt || 0);
        const dateB = new Date(b.updatedAt || b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      });

    this.recentActivity = allRequests.slice(0, 5).map((r: any) => {
      let message = '';
      if (r.status === 'APPROVED') {
        message = r.direction === 'incoming' 
          ? `Approved request for "${r.book?.title}"` 
          : `Your request for "${r.book?.title}" was approved`;
      } else if (r.status === 'REJECTED') {
        message = r.direction === 'incoming'
          ? `Rejected request for "${r.book?.title}"`
          : `Your request for "${r.book?.title}" was rejected`;
      } else if (r.status === 'COMPLETED') {
        message = `Completed exchange for "${r.book?.title}"`;
      }

      return {
        type: 'exchange',
        message: message,
        timestamp: r.updatedAt || r.createdAt || new Date()
      };
    });
  }

  loadUserBooks(): void {
    this.isLoading = true;
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;

    this.bookService.getUserBooks(userId, this.currentBookPage, this.booksPerPage).subscribe({
      next: (books) => {
        this.userBooks = books.content || books;
        this.filteredBooks = [...this.userBooks];
        this.hasMoreBooks = books.totalElements > (this.currentBookPage + 1) * this.booksPerPage;
        this.isLoading = false;
        
        // Update active listings count
        this.userStats.activeListings = this.userBooks.filter(b => b.status === 'AVAILABLE').length;
      },
      error: (err) => {
        console.error('Error loading user books:', err);
        this.isLoading = false;
      }
    });
  }

  filterMyBooks(): void {
    if (!this.bookSearchQuery) {
      this.filteredBooks = [...this.userBooks];
      return;
    }
    
    const query = this.bookSearchQuery.toLowerCase();
    this.filteredBooks = this.userBooks.filter(book => 
      book.title.toLowerCase().includes(query) || 
      (book.author && book.author.toLowerCase().includes(query)) ||
      (book.subject && book.subject.toLowerCase().includes(query))
    );
  }

  nextBookPage(): void {
    this.currentBookPage++;
    this.loadUserBooks();
  }

  prevBookPage(): void {
    if (this.currentBookPage > 0) {
      this.currentBookPage--;
      this.loadUserBooks();
    }
  }

  editBook(book: any): void {
    
  }

  deleteBook(bookId: number): void {
    if (confirm('Are you sure you want to remove this book?')) {
      this.bookService.deleteBook(bookId).subscribe({
        next: () => {
          this.userBooks = this.userBooks.filter(b => b.id !== bookId);
          this.filteredBooks = this.filteredBooks.filter(b => b.id !== bookId);
          this.userStats.booksListed--;
          this.userStats.activeListings = this.userBooks.filter(b => b.status === 'AVAILABLE').length;
        },
        error: (err) => {
          console.error('Error deleting book:', err);
        }
      });
    }
  }

  onUploadSuccess(newBook: any): void {
    this.userBooks.unshift(newBook);
    this.filteredBooks.unshift(newBook);
    this.activeSection = 'myBooks';
    this.userStats.booksListed++;
    this.userStats.activeListings++;
  }

  getActivityIcon(type: string): string {
    switch(type) {
      case 'exchange': return 'fas fa-exchange-alt';
      case 'upload': return 'fas fa-upload';
      case 'message': return 'fas fa-envelope';
      default: return 'fas fa-bell';
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'PENDING': return 'text-yellow-400';
      case 'APPROVED': return 'text-green-400';
      case 'REJECTED': return 'text-red-400';
      case 'COMPLETED': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  }
}