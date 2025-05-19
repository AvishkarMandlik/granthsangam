import { Component } from '@angular/core';
import { HeaderComponent } from '../core/layout/header/header.component';
import { FooterComponent } from '../core/layout/footer/footer.component';
import { BookListComponent } from '../book/book-list/book-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, FooterComponent,BookListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
