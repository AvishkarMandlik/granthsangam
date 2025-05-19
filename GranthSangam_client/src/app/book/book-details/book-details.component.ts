
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookLikeComponent } from '../book-like/book-like.component'; 
import { ExchangeButtonComponent } from '../../exchange/exchange-button/exchange-button.component'; 

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    BookLikeComponent,
    ExchangeButtonComponent,
    DatePipe
  ],
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  bookId!: string;
  book: any;
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.bookId = this.route.snapshot.paramMap.get('id')!;
    this.fetchBook();
  }

  fetchBook(): void {
    this.http.get(`http://localhost:8080/api/books/${this.bookId}`).subscribe({
      next: (data: any) => {
        this.book = {
          ...data,
          // Ensure default values
          imageUrl: data.imageUrl || 'assets/default-book.jpg',
          description: data.description || 'No description provided.',
          subject: data.subject || 'Not specified',
          condition: data.bookCondition || 'Not specified',
          listingType: data.listingType || 'N/A',
          price: data.price || 'Not specified',
          expectedExchange: data.expectedExchange || 'Any book',
          user: data.user || { name: 'Unknown' },
          likeCount: data.likeCount || 0,
          isLiked: data.isLiked || false,
          available: data.available !== undefined ? data.available : true
        };
        this.isLoading = false;
        console.log('Book details:', this.book);
      },
      error: (err) => {
        console.error('Error fetching book:', err);
        this.errorMessage = 'Failed to load book details. Please try again later.';
        this.isLoading = false;
      }
    });
  }
}