import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from './environment';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private baseUrl = `${environment.apiUrl}/books`;

  constructor(private http: HttpClient) {}

  getBooks(page: number = 0, size: number = 10, query: string = ''): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (query) {
      params = params.set('query', query);
    }

    return this.http.get<any>(this.baseUrl, { params });
  }

  getBookById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  addBook(userId: number, bookData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/${userId}`, bookData);
  }

  searchBooks(params: any): Observable<any> {
  let httpParams = new HttpParams();
  
  if (params.query) httpParams = httpParams.set('query', params.query);
  if (params.subject) httpParams = httpParams.set('subject', params.subject);
  if (params.listingType) httpParams = httpParams.set('listingType', params.listingType);
  if (params.condition) httpParams = httpParams.set('condition', params.condition);
  if (params.page != null) httpParams = httpParams.set('page', params.page.toString());
  if (params.size != null) httpParams = httpParams.set('size', params.size.toString());

  return this.http.get<any>(`${this.baseUrl}/search`, { params: httpParams });
}

  // updateBook(id: number, bookData: any): Observable<any> {
  //   return this.http.put<any>(`${this.baseUrl}/${id}`, bookData);
  // }

  // deleteBook(id: number): Observable<any> {
  //   return this.http.delete<any>(`${this.baseUrl}/${id}`);
  // }


  //   getUserBooks(userId: number, page: number = 0, size: number = 10): Observable<any> {
  //   const params = new HttpParams()
  //     .set('page', page.toString())
  //     .set('size', size.toString());

  //   return this.http.get<any>(`${this.baseUrl}/user/${userId}`, { params });
  // }

updateBook(id: number, bookData: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, bookData).pipe(
      catchError(error => {
        console.error('Error updating book:', error);
        return throwError(() => new Error('Failed to update book'));
      })
    );
  }

  deleteBook(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting book:', error);
        return throwError(() => new Error('Failed to delete book'));
      })
    );
  }

  getUserBooks(userId: number, page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.baseUrl}/user/${userId}`, { params }).pipe(
      catchError(error => {
        console.error('Error fetching user books:', error);
        return throwError(() => new Error('Failed to fetch user books'));
      })
    );
  }
}

