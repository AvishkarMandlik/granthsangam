

// services/notification.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../book/environment';
import { Notification } from './notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly baseUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  getUserNotifications(userId: number, unreadOnly = false): Observable<Notification[]> {
    return this.http.get<Notification[]>(
      `${this.baseUrl}/user/${userId}?unreadOnly=${unreadOnly}`
    );
  }

  markAsRead(notificationId: number): Observable<Notification> {
    return this.http.put<Notification>(
      `${this.baseUrl}/${notificationId}/mark-read`, 
      null
    );
  }

  getUnreadCount(userId: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/user/${userId}/unread-count`);
  }

  deleteNotification(notificationId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${notificationId}`);
  }
}