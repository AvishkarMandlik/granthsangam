import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from './environment';

export interface Category {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error fetching categories:', error);
        return of([]); // Return empty array on error
      })
    );
  }

  addCategory(category: { name: string }): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category).pipe(
      catchError(error => {
        console.error('Error adding category:', error);
        throw error;
      })
    );
  }

  getCategoryByName(name: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/name/${name}`).pipe(
      catchError(error => {
        console.error('Error fetching category by name:', error);
        throw error;
      })
    );
  }
}