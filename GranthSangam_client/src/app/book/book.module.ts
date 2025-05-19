import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BookListComponent } from './book-list/book-list.component';
import { BookUploadComponent } from './book-upload/book-upload.component';
import { BookDetailsComponent } from './book-details/book-details.component';
// import { BookSearchComponent } from './book-search/book-search.component';
import { SharedModule } from '../shared/shared.module';
import { BookLikeComponent } from './book-like/book-like.component';
import { ExchangeButtonComponent } from '../exchange/exchange-button/exchange-button.component';

NgModule({
  declarations: [
    BookListComponent,
    BookUploadComponent,
    BookDetailsComponent,
    BookLikeComponent,
    ExchangeButtonComponent
     
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: BookListComponent },
      { path: 'upload', component: BookUploadComponent },
      { path: ':id', component: BookDetailsComponent },
      
    ]),
    SharedModule
  ]
})
export class BooksModule { }