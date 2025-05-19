
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../book/environment';

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {
  // private baseUrl = 'http://localhost:8080/api/exchange';
   private baseUrl = `${environment.apiUrl}/exchange`;
  private adminBaseUrl = `${environment.apiUrl}/admin/exchanges`;

  constructor(private http: HttpClient) {}

  // Request exchange for a book
  requestExchange(bookId: number, fromUserId: number, toUserId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/request?fromUserId=${fromUserId}&toUserId=${toUserId}&bookId=${bookId}`, {});
  }

  // Get incoming requests for a user
  getIncomingRequests(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/incoming/${userId}`);
  }

  // Get outgoing requests for a user
  getOutgoingRequests(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/outgoing/${userId}`);
  }

  // Get pending requests for a specific book
  getPendingRequestsForBook(bookId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/book/${bookId}/pending`);
  }

  // Approve a request
  approveRequest(requestId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/approve/${requestId}`, {});
  }

  // Reject a request
  rejectRequest(requestId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/reject/${requestId}`, {});
  }

  // Cancel a request
  cancelRequest(requestId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${requestId}`);
  }

  // Complete an exchange
  completeExchange(requestId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/complete/${requestId}`, {});
  }

  // Check request status for a book
  checkRequestStatus(userId: number, bookId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/check?userId=${userId}&bookId=${bookId}`);
  }

  // Get exchange status for a book
  getExchangeStatus(bookId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/status/${bookId}`);
  }

   // Admin-specific methods
  getAllExchanges(): Observable<any[]> {
    return this.http.get<any[]>(`${this.adminBaseUrl}`);
  }

  getAllPendingExchanges(): Observable<any[]> {
    return this.http.get<any[]>(`${this.adminBaseUrl}/pending`);
  }

  getAllCompletedExchanges(): Observable<any[]> {
    return this.http.get<any[]>(`${this.adminBaseUrl}/completed`);
  }

  getExchangeStats(): Observable<any> {
    return this.http.get<any>(`${this.adminBaseUrl}/stats`);
  }

  adminApproveExchange(id: number): Observable<any> {
    return this.http.put(`${this.adminBaseUrl}/${id}/approve`, {});
  }

  adminRejectExchange(id: number): Observable<any> {
    return this.http.put(`${this.adminBaseUrl}/${id}/reject`, {});
  }

  adminCancelExchange(id: number): Observable<any> {
    return this.http.delete(`${this.adminBaseUrl}/${id}`);
  }
}