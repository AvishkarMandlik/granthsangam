import { Routes } from '@angular/router';
import { BookListComponent } from './book/book-list/book-list.component';
import { BookDetailsComponent } from './book/book-details/book-details.component';
import { BookUploadComponent } from './book/book-upload/book-upload.component';
// import { BookSearchComponent } from './book/book-search/book-search.component';
import { ExchangeListComponent } from './exchange/exchange-list/exchange-list.component';
// import { ExchangeRequestComponent } from './exchange/exchange-request/exchange-request.component';
import { NotificationListComponent } from './notification/notification-list/notification-list.component';
import { WishlistViewComponent } from './wishlist/wishlist-view/wishlist-view.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { BookLikeComponent } from './book/book-like/book-like.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { UserDashboardComponent } from './user/user-dashboard/user-dashboard.component';

export const routes: Routes = [
  // Authentication Routes
  { path: '', redirectTo: 'register', pathMatch: 'full' },
  { path: 'register', component: RegisterComponent, title: 'Register' },
  { path: 'login', component: LoginComponent, title: 'Login' },
  {
    path: 'home',
    component: HomeComponent,
        canActivate: [AuthGuard] 
  },

  // Book Routes
  { path: 'books', component: BookListComponent, title: 'Books', canActivate: [AuthGuard] },
  {
    path: 'books/:id/like',
    component: BookLikeComponent,
    title: 'Book Details',canActivate: [AuthGuard]
  },
  { path: 'books/:id', component: BookDetailsComponent, title: 'Book Details' },
  // { path: 'search', component: BookSearchComponent, title: 'Search Books' },

  // User Routes (Protected - Add AuthGuard later)
  { path: 'upload', component: BookUploadComponent, title: 'Upload Book',        canActivate: [AuthGuard]  },
  { path: 'exchange', component: ExchangeListComponent, title: 'Exchanges', canActivate: [AuthGuard]},
  // {
  //   path: 'exchange/request/:id',
  //   component: ExchangeRequestComponent,
  //   title: 'Request Exchange',
  // },
  {
    path: 'notifications',
    component: NotificationListComponent,
    title: 'Notifications',
  },
  { path: 'wishlist', component: WishlistViewComponent, title: 'Wishlist' },

  // Admin Route
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    title: 'Admin Dashboard',canActivate: [AuthGuard]
  },
  // User Dashboard Route
  { path: 'user-dashboard', component: UserDashboardComponent, title: 'User Dashboard', canActivate: [AuthGuard] },

  // Default route - redirect to books
  { path: '', redirectTo: 'books', pathMatch: 'full' },

  // Catch-all route
  { path: '**', redirectTo: 'books' },
];
