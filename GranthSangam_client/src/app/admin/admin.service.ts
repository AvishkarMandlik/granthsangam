// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../book/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class AdminService {
//   private baseUrl = `${environment.apiUrl}/admin`;
  

//   constructor(private http: HttpClient) {}

//   // User Management
//   getAllUsers(page: number = 0, size: number = 10): Observable<any> {
//     const params = new HttpParams()
//       .set('page', page.toString())
//       .set('size', size.toString());
//     return this.http.get<any>(`${this.baseUrl}/users`, { params });
//   }

//   deleteUser(id: number): Observable<void> {
//     return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
//   }

//   updateUserRole(id: number, role: string): Observable<any> {
//     return this.http.put(`${this.baseUrl}/users/${id}/role`, { role });
//   }

//   // Book Management
//   getAllBooks(page: number = 0, size: number = 10): Observable<any> {
//     const params = new HttpParams()
//       .set('page', page.toString())
//       .set('size', size.toString());
//     return this.http.get<any>(`${this.baseUrl}/books`, { params });
//   }

//   deleteBook(id: number): Observable<void> {
//     return this.http.delete<void>(`${this.baseUrl}/books/${id}`);
//   }

//   updateBook(id: number, bookData: any): Observable<any> {
//     return this.http.put(`${this.baseUrl}/books/${id}`, bookData);
//   }

//   // Exchange Management
//   getPendingExchanges(): Observable<any[]> {
//     return this.http.get<any[]>(`${this.baseUrl}/exchanges/pending`);
//   }

//   getCompletedExchanges(): Observable<any[]> {
//     return this.http.get<any[]>(`${this.baseUrl}/exchanges/completed`);
//   }

//   approveExchange(id: number): Observable<any> {
//     return this.http.put(`${this.baseUrl}/exchanges/${id}/approve`, {});
//   }

//   rejectExchange(id: number): Observable<any> {
//     return this.http.put(`${this.baseUrl}/exchanges/${id}/reject`, {});
//   }

//   // System Stats
//   getSystemStats(): Observable<any> {
//     return this.http.get<any>(`${this.baseUrl}/stats`);
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../book/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  // User Management
  getAllUsers(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.baseUrl}/users`, { params });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }

  updateUserRole(id: number, role: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${id}/role`, { role });
  }

  // Book Management
  getAllBooks(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.baseUrl}/books`, { params });
  }

  deleteBook(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/books/${id}`);
  }

  updateBook(id: number, bookData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/books/${id}`, bookData);
  }

  // System Stats
  getSystemStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/stats`);
  }
}