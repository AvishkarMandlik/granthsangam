// components/notification-list/notification-list.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { Notification } from '..//notification.model';
import { NotificationService } from '../notification.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit {
  @Input() userId!: number;
  notifications: Notification[] = [];
  unreadCount = 0;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
    this.loadUnreadCount();
  }

  loadNotifications(): void {
    this.notificationService.getUserNotifications(this.userId)
      .subscribe(notifications => {
        this.notifications = notifications;
        console.log('Notifications loaded:', this.notifications);
      });
  }

  loadUnreadCount(): void {
    this.notificationService.getUnreadCount(this.userId)
      .subscribe(count => {
        this.unreadCount = count;
      });
  }

  markAsRead(notification: Notification): void {
    if (!notification.seen) {
      this.notificationService.markAsRead(notification.id)
        .subscribe(updatedNotification => {
          notification.seen = true;
          this.unreadCount--;
        });
    }
  }

  deleteNotification(notificationId: number): void {
    this.notificationService.deleteNotification(notificationId)
      .subscribe(() => {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        if (!this.notifications.find(n => n.id === notificationId)?.seen) {
          this.unreadCount--;
        }
      });
  }
}