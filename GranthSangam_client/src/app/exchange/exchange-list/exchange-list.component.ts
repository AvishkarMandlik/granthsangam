

import { Component, OnInit } from '@angular/core';
import { ExchangeService } from '../exchange.service';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exchange-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exchange-list.component.html',
  styleUrls: ['./exchange-list.component.css']
})
export class ExchangeListComponent implements OnInit {
  incomingRequests: any[] = [];
  outgoingRequests: any[] = [];
  activeTab: 'incoming' | 'outgoing' = 'incoming';
  isLoading = false;
  userId: number | null = null;

  constructor(
    private exchangeService: ExchangeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getCurrentUser()?.id || null;
    if (this.userId) {
      this.loadIncomingRequests();
      this.loadOutgoingRequests();
    }
  }

  getStatusClass(status: string): string {
    switch (status.toUpperCase()) {
      case 'PENDING': return 'text-yellow-500 font-medium';
      case 'APPROVED': return 'text-green-600 font-semibold';
      case 'REJECTED': return 'text-red-600 font-semibold';
      case 'CANCELLED': return 'text-gray-500 italic';
      case 'COMPLETED': return 'text-green-600 font-semibold';
      default: return 'text-gray-600';
    }
  }

  loadIncomingRequests(): void {
    this.isLoading = true;
    this.exchangeService.getIncomingRequests(this.userId!)
      .subscribe({
        next: (requests) => {
          this.incomingRequests = requests;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading incoming requests', err);
          this.isLoading = false;
        }
      });
  }

  loadOutgoingRequests(): void {
    this.isLoading = true;
    this.exchangeService.getOutgoingRequests(this.userId!)
      .subscribe({
        next: (requests) => {
          this.outgoingRequests = requests;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading outgoing requests', err);
          this.isLoading = false;
        }
      });
  }

  approveRequest(requestId: number): void {
    this.isLoading = true;
    this.exchangeService.approveRequest(requestId)
      .subscribe({
        next: () => {
          this.loadIncomingRequests();
          alert('Request approved successfully');
        },
        error: (err) => {
          console.error('Error approving request', err);
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
          this.loadIncomingRequests();
          alert('Request rejected');
        },
        error: (err) => {
          console.error('Error rejecting request', err);
          alert('Failed to reject request');
          this.isLoading = false;
        }
      });
  }

  cancelRequest(requestId: number): void {
    this.isLoading = true;
    this.exchangeService.cancelRequest(requestId)
      .subscribe({
        next: () => {
          this.loadOutgoingRequests();
          alert('Request cancelled successfully');
        },
        error: (err) => {
          console.error('Error cancelling request', err);
          alert('Failed to cancel request');
          this.isLoading = false;
        }
      });
  }

  completeExchange(requestId: number): void {
    this.isLoading = true;
    this.exchangeService.completeExchange(requestId)
      .subscribe({
        next: () => {
          this.loadIncomingRequests();
          alert('Exchange marked as completed!');
        },
        error: (err) => {
          console.error('Error completing exchange', err);
          alert('Failed to complete exchange');
          this.isLoading = false;
        }
      });
  }
  

  getRequesterName(request: any): string {
  return request.fromUser?.name || 'Unknown User';
}

getBookTitle(request: any): string {
  return request.requestedBook?.title || 'Unknown Book';
}
}
