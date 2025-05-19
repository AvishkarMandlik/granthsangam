import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError  } from 'rxjs';
import { map, tap,catchError  } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject: BehaviorSubject<any>;

  // Public observables for components
  public currentUser$: Observable<any>;
  public isAuthenticated$: Observable<boolean>;


  constructor(private http: HttpClient) {
    // Initialize with user from localStorage
    this.currentUserSubject = new BehaviorSubject<any>(this.getStoredUser());
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isAuthenticated$ = this.currentUser$.pipe(map((user) => !!user));
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/signup`, userData);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials).pipe(
      tap((response: any) => {
        const userData = response.user || response;
        console.log('User data:', userData);
        if (userData) {
          this.setCurrentUser(userData);
        }
      })
    );
  }

  resetPassword(email: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, { email, newPassword }).pipe(
      catchError(error => {
        return throwError(error.error || 'Password reset failed');
      })
    );
  }

  // Verify user before allowing password reset
verifyUser(email: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/verify-user`, { email }).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('AuthService error:', {
        status: error.status,
        statusText: error.statusText,
        error: error.error,
        url: error.url
      });
      
      let errorMsg = 'User verification failed';
      
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMsg = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        errorMsg = error.error?.message || 
                  (typeof error.error === 'string' ? error.error : error.message) || 
                  `Server returned ${error.status}: ${error.statusText}`;
      }
      
      return throwError(errorMsg);
    })
  );
}
 


logout(): void {
  localStorage.removeItem('user');
  this.clearCurrentUser();
  window.location.href = '/login';
  
   // Or use router.navigate if you prefer
}

  getCurrentUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  get currentUser(): any {
    return this.currentUserSubject.value;
  }

  private getStoredUser(): any {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  // Update this when user logs in
  setCurrentUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  // Get the current user ID
  getCurrentUserId(): number | null {
    const user = this.getStoredUser();
    return user ? user.id : null;
  }

  // Clear this when user logs out
  clearCurrentUser(): void {
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  get isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  getUserRole(): string | null {
    const user = this.getStoredUser();
    return user?.role || null;
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  getUsername(): string | null {
    const user = this.getStoredUser();
    return user?.name || null;
  }
  getUserEmail(): string | null {
    const user = this.getStoredUser();
    return user?.email || null;
  }

  getUserContact(): string | null {
    const user = this.getStoredUser();
    return user?.contact || null;
  }
}
