import { Component } from '@angular/core';
import { AuthService } from '../../../auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../notification/notification.service';
import { HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  notifications: any[] = [];
  unreadCount: number = 0;
  isMenuOpen: boolean = false;
  showNotifications = false;
  showProfile = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.initializeNotifications();
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.showProfile = false;
      this.loadNotifications();
    }
  }

  toggleProfile() {
    this.showProfile = !this.showProfile;
    if (this.showProfile) {
      this.showNotifications = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const isNotificationButton = target.closest('[data-notification-button]');
    const isProfileButton = target.closest('[data-profile-button]');
    const isInsideNotification = target.closest('.notification-dropdown');
    const isInsideProfile = target.closest('.profile-dropdown');

    if (!isNotificationButton && !isInsideNotification) {
      this.showNotifications = false;
    }
    if (!isProfileButton && !isInsideProfile) {
      this.showProfile = false;
    }
  }

  initializeNotifications() {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.loadNotifications();
      this.loadUnreadCount();
      // Refresh notifications every 30 seconds
      setInterval(() => {
        this.loadUnreadCount();
      }, 30000);
    }
  }

  loadNotifications(): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;
    
    this.notificationService.getUserNotifications(userId).subscribe({
      next: (data) => {
        this.notifications = data || [];
      },
      error: (err) => console.error('Failed to load notifications:', err)
    });
  }

  loadUnreadCount(): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) return;
    
    this.notificationService.getUnreadCount(userId).subscribe({
      next: (count) => this.unreadCount = count ?? 0,
      error: (err) => console.error('Failed to load unread count:', err)
    });
  }

  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification && !notification.seen) {
          notification.seen = true;
          this.unreadCount = Math.max(0, this.unreadCount - 1);
        }
      },
      error: (err) => console.error('Failed to mark as read:', err)
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}