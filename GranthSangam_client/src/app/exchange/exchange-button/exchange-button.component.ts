import { Component, Input, OnInit } from '@angular/core';
import { ExchangeService } from '../exchange.service';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-exchange-button',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './exchange-button.component.html',
  styleUrls: ['./exchange-button.component.css']
})
export class ExchangeButtonComponent implements OnInit {
  @Input() bookId!: number;
  @Input() ownerId!: number;
  @Input() bookAvailable: boolean = true;

  hasRequest: boolean = false;
  currentRequest: any;
  pendingRequests: any[] = [];
  isLoading: boolean = false;
  currentUserId: number | null = null;
  requestStatus: any = {};

  constructor(
    private exchangeService: ExchangeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUser()?.id || null;
    this.loadExchangeStatus();
  }

  get isOwner(): boolean {
    return this.currentUserId === this.ownerId;
  }

  get isRequester(): boolean {
    return this.currentRequest?.fromUser?.id === this.currentUserId;
  }

  getStatusIcon(): string {
    switch (this.currentRequest?.status) {
      case 'PENDING': return 'fas fa-hourglass-half text-yellow-500';
      case 'APPROVED': return 'fas fa-check-circle text-blue-600';
      case 'REJECTED': return 'fas fa-times-circle text-red-600';
      case 'COMPLETED': return 'fas fa-check-double text-green-600';
      default: return 'fas fa-question-circle text-gray-500';
    }
  }

  getStatusText(): string {
    switch (this.currentRequest?.status) {
      case 'PENDING': return 'Pending Approval';
      case 'APPROVED': return 'Approved - Contact owner to exchange';
      case 'REJECTED': return 'Rejected';
      case 'COMPLETED': return 'Completed - Exchange successful';
      default: return 'Unknown Status';
    }
  }

  getStatusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'PENDING': return 'text-yellow-500 font-medium';
      case 'APPROVED': return 'text-blue-500 font-semibold';
      case 'REJECTED': return 'text-red-500 font-semibold';
      case 'CANCELLED': return 'text-gray-400 italic';
      case 'COMPLETED': return 'text-green-500 font-semibold';
      default: return 'text-white';
    }
  }

  loadExchangeStatus(): void {
    if (!this.currentUserId || !this.bookId) return;

    // Check if current user has any request for this book
    this.exchangeService.checkRequestStatus(this.currentUserId, this.bookId)
      .subscribe({
        next: (status) => {
          this.requestStatus = status;
          this.hasRequest = status.hasPendingRequest || status.wasRejectedBefore;
          
          if (this.hasRequest) {
            this.loadCurrentRequest();
          }
        },
        error: (err) => console.error('Error checking request status', err)
      });

    // If current user is owner, load pending requests for this book
    if (this.isOwner) {
      this.exchangeService.getPendingRequestsForBook(this.bookId)
        .subscribe({
          next: (requests) => this.pendingRequests = requests,
          error: (err) => console.error('Error loading pending requests', err)
        });
    }
  }

  loadCurrentRequest(): void {
    this.exchangeService.getOutgoingRequests(this.currentUserId!)
      .subscribe({
        next: (requests) => {
          this.currentRequest = requests.find(r => r.requestedBook.id === this.bookId);
        },
        error: (err) => console.error('Error loading current request', err)
      });
  }

  requestExchange(): void {
    if (!this.currentUserId) return;
    this.isLoading = true;
    this.exchangeService.requestExchange(this.bookId, this.currentUserId, this.ownerId)
      .subscribe({
        next: () => {
          this.loadExchangeStatus();
          alert('Exchange requested successfully!');
        },
        error: (err) => {
          console.error(err);
          alert('Failed to request exchange');
          this.isLoading = false;
        }
      });
  }

  cancelRequest(): void {
    if (!this.currentRequest?.id) return;
    this.isLoading = true;
    this.exchangeService.cancelRequest(this.currentRequest.id)
      .subscribe({
        next: () => {
          this.loadExchangeStatus();
          alert('Request cancelled successfully');
        },
        error: (err) => {
          console.error(err);
          alert('Failed to cancel request');
          this.isLoading = false;
        }
      });
  }

  approveRequest(requestId: number): void {
    this.isLoading = true;
    this.exchangeService.approveRequest(requestId)
      .subscribe({
        next: () => {
          this.loadExchangeStatus();
          alert('Request approved successfully');
        },
        error: (err) => {
          console.error(err);
          alert('Failed to approve request');
          this.isLoading = false;
        }
      });
  }

  rejectRequest(requestId: number): void {
    this.isLoading = true;
    this.exchangeService.rejectRequest(requestId)
      .subscribe({
        next: () => {
          this.loadExchangeStatus();
          alert('Request rejected');
        },
        error: (err) => {
          console.error(err);
          alert('Failed to reject request');
          this.isLoading = false;
        }
      });
  }

  completeExchange(requestId: number): void {
    this.isLoading = true;
    this.exchangeService.completeExchange(requestId)
      .subscribe({
        next: () => {
          this.loadExchangeStatus();
          alert('Exchange marked as completed!');
        },
        error: (err) => {
          console.error(err);
          alert('Failed to complete exchange');
          this.isLoading = false;
        }
      });
  }
}