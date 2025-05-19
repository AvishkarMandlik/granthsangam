// import { Component, OnInit } from '@angular/core';
// import { AdminService } from '../admin.service';
// import { AuthService } from '../../auth/auth.service';
// import { CommonModule } from '@angular/common';
// import { UserManagementComponent } from '../user-management/user-management.component';
// import { BookManagementComponent } from '../book-management/book-management.component';
// import { forkJoin } from 'rxjs';
// import { HeaderComponent } from '../../core/layout/header/header.component';

// @Component({
//   selector: 'app-admin-dashboard',
//   standalone: true,
//   imports: [ CommonModule,
//     UserManagementComponent,
//     BookManagementComponent,HeaderComponent],
//   templateUrl: './admin-dashboard.component.html',
//   styleUrls: ['./admin-dashboard.component.css']
// })
// export class AdminDashboardComponent implements OnInit {
//   activeSection = 'dashboard';
//   adminStats: any = {
//     totalUsers: 0,
//     totalBooks: 0,
//     activeBooks: 0,
//     pendingExchanges: 0,
//     completedExchanges: 0
//   };
//   recentExchanges: any[] = [];
//   isLoading = false;
//   recentActivity: any[] = [];

//   constructor(
//     private adminService: AdminService,
//     private authService: AuthService
//   ) { }

//   ngOnInit(): void {
//     this.loadDashboardData();
//   }

//   loadDashboardData(): void {
//     this.isLoading = true;
    
//     forkJoin([
//       this.adminService.getAllUsers(),
//       this.adminService.getAllBooks(),
//       this.adminService.getPendingExchanges(),
//       this.adminService.getCompletedExchanges()
//     ]).subscribe({
//       next: ([users, books, pendingExchanges, completedExchanges]) => {
//         this.adminStats.totalUsers = users.length;
//         this.adminStats.totalBooks = books.length;
//         this.adminStats.pendingExchanges = pendingExchanges.length;
//         this.adminStats.completedExchanges = completedExchanges.length;
        
//         this.loadRecentActivity(completedExchanges);
//         this.isLoading = false;
//       },
//       error: (err) => {
//         console.error('Error loading admin dashboard data:', err);
//         this.isLoading = false;
//       }
//     });
//   }

//   loadRecentActivity(completedExchanges: any[]): void {
//     this.recentActivity = completedExchanges
//       .slice(0, 5)
//       .map(exchange => ({
//         type: 'exchange',
//         message: `Exchange completed for "${exchange.book?.title}"`,
//         timestamp: exchange.completedAt || new Date()
//       }));
//   }
//   getActivityIcon(type: string): string {
//     switch (type) {
//       case 'user':
//         return 'fas fa-user';
//       case 'book':
//         return 'fas fa-book';
//       case 'exchange':
//         return 'fas fa-exchange-alt';
//       case 'completed':
//         return 'fas fa-check-circle';
//       case 'pending':
//         return 'fas fa-clock';
//       default:
//         return 'fas fa-info-circle';
//     }
//   }
// }


// admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin.service';
import { ExchangeService } from '../../exchange/exchange.service';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';
import { UserManagementComponent } from '../user-management/user-management.component';
import { BookManagementComponent } from '../book-management/book-management.component';
import { ExchangeManagementComponent } from '../exchange-management/exchange-management.component';
import { forkJoin } from 'rxjs';
import { HeaderComponent } from '../../core/layout/header/header.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    UserManagementComponent,
    BookManagementComponent,
    ExchangeManagementComponent,
    HeaderComponent
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  activeSection = 'dashboard';
  adminStats: any = {
    totalUsers: 0,
    totalBooks: 0,
    activeBooks: 0,
    pendingExchanges: 0,
    completedExchanges: 0
  };
  isLoading = false;
  recentActivity: any[] = [];
  allExchanges: any[] = [];
  exchangeStats: any = {};

  constructor(
    private adminService: AdminService,
    private exchangeService: ExchangeService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    
    forkJoin([
      this.adminService.getAllUsers(),
      this.adminService.getAllBooks(),
      this.exchangeService.getAllPendingExchanges(),
      this.exchangeService.getAllCompletedExchanges(),
      this.exchangeService.getExchangeStats(),
      this.exchangeService.getAllExchanges()
    ]).subscribe({
      next: ([users, books, pendingExchanges, completedExchanges, stats, allExchanges]) => {
        this.adminStats.totalUsers = users.length;
        this.adminStats.totalBooks = books.length;
        this.adminStats.pendingExchanges = pendingExchanges.length;
        this.adminStats.completedExchanges = completedExchanges.length;
        this.exchangeStats = stats;
        this.allExchanges = allExchanges;
        
        this.loadRecentActivity(completedExchanges);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading admin dashboard data:', err);
        this.isLoading = false;
      }
    });
  }

  loadRecentActivity(completedExchanges: any[]): void {
    this.recentActivity = completedExchanges
      .slice(0, 5)
      .map(exchange => ({
        type: 'exchange',
        message: `Exchange completed for "${exchange.requestedBook?.title || 'unknown book'}"`,
        timestamp: exchange.updatedAt || new Date()
      }));
  }

  onApproveExchange(id: number): void {
    this.exchangeService.adminApproveExchange(id).subscribe({
      next: () => this.loadDashboardData(),
      error: (err) => console.error('Error approving exchange:', err)
    });
  }

  onRejectExchange(id: number): void {
    this.exchangeService.adminRejectExchange(id).subscribe({
      next: () => this.loadDashboardData(),
      error: (err) => console.error('Error rejecting exchange:', err)
    });
  }

  onCancelExchange(id: number): void {
    this.exchangeService.adminCancelExchange(id).subscribe({
      next: () => this.loadDashboardData(),
      error: (err) => console.error('Error canceling exchange:', err)
    });
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'user': return 'fas fa-user';
      case 'book': return 'fas fa-book';
      case 'exchange': return 'fas fa-exchange-alt';
      case 'completed': return 'fas fa-check-circle';
      case 'pending': return 'fas fa-clock';
      default: return 'fas fa-info-circle';
    }
  }
}