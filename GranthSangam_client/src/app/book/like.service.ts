
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class LikeService {
  private apiUrl = `${environment.apiUrl}/likes`;

  constructor(private http: HttpClient) { }

  likeBook(userId: number, bookId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${userId}/${bookId}`, {}).pipe(
      catchError(error => {
        console.error('Like failed:', error);
        return throwError(() => new Error('Like failed'));
      })
    );
  }

  unlikeBook(userId: number, bookId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}/${bookId}`).pipe(
      catchError(error => {
        console.error('Unlike failed:', error);
        return throwError(() => new Error('Unlike failed'));
      })
    );
  }

  checkIfLiked(userId: number, bookId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check/${userId}/${bookId}`).pipe(
      catchError(error => {
        console.error('Check like failed:', error);
        return throwError(() => new Error('Check like failed'));
      })
    );
  }

  getLikeCount(bookId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count/${bookId}`).pipe(
      catchError(error => {
        console.error('Get like count failed:', error);
        return throwError(() => new Error('Get like count failed'));
      })
    );
  }
}