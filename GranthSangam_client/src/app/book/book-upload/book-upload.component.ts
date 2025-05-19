// import { Component, OnInit } from '@angular/core';
// import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
// import { BookService } from '../book.service';
// import { CategoryService } from '../categories.service';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-book-upload',
//   standalone: true,
//   imports: [ReactiveFormsModule, CommonModule],
//   templateUrl: './book-upload.component.html',
//   styleUrls: ['./book-upload.component.css']
// })
// export class BookUploadComponent implements OnInit {
//   uploadForm: FormGroup;
//   categories: any[] = [];
//   listingTypes = ['SELL', 'EXCHANGE', 'GIVEAWAY'];
//   userId = 1;
//   loading = false;
//   errorMessage = '';

//   constructor(
//     private fb: FormBuilder,
//     private bookService: BookService,
//     private categoryService: CategoryService,
//     private router: Router
//   ) {
//     this.uploadForm = this.fb.group({
//       title: ['', Validators.required],
//       subject: ['', Validators.required],
//       author: [''],
//       edition: [''],
//       bookCondition: [''],
//       imageUrl: [''],
//       listingType: ['', Validators.required],
//       expectedExchange: [''],
//       price: [null, Validators.min(0)],
//       category: this.fb.group({
//         id: [null, Validators.required]
//       })
//     });
//   }

//   ngOnInit(): void {
//     this.loadCategories();
//     this.setupFormListeners();
//   }

//  loadCategories(): void {
//   this.categoryService.getAllCategories().subscribe({
//     next: (categories) => {
//       this.categories = categories;
//       if (categories.length === 0) {
//         this.errorMessage = 'No categories available';
//       }
//     },
//     error: (error) => {
//       console.error('Error loading categories:', error);
//       this.errorMessage = 'Failed to load categories.';
//       this.categories = [];
//     }
//   });
// }

//   setupFormListeners(): void {
//     this.uploadForm.get('listingType')?.valueChanges.subscribe(value => {
//       const expectedExchangeControl = this.uploadForm.get('expectedExchange');
//       const priceControl = this.uploadForm.get('price');
      
//       if (value === 'EXCHANGE') {
//         expectedExchangeControl?.setValidators(Validators.required);
//         priceControl?.clearValidators();
//         priceControl?.setValue(null);
//       } else if (value === 'SELL') {
//         priceControl?.setValidators([Validators.required, Validators.min(0)]);
//         expectedExchangeControl?.clearValidators();
//         expectedExchangeControl?.setValue('');
//       } else {
//         expectedExchangeControl?.clearValidators();
//         priceControl?.clearValidators();
//         expectedExchangeControl?.setValue('');
//         priceControl?.setValue(null);
//       }
      
//       expectedExchangeControl?.updateValueAndValidity();
//       priceControl?.updateValueAndValidity();
//     });
//   }

//   onSubmit(): void {
//     if (this.uploadForm.valid) {
//       this.loading = true;
//       const bookData = this.uploadForm.value;
      
//       this.bookService.addBook(this.userId, bookData).subscribe({
//         next: (response) => {
//           this.uploadForm.reset();
//           this.loading = false;
//           this.router.navigate(['/books']);
//         },
//         error: (error) => {
//           this.errorMessage = 'Failed to upload book.';
//           this.loading = false;
//           console.error('Error uploading book:', error);
//         }
//       });
//     } else {
//       this.markFormAsTouched();
//     }
//   }

//   private markFormAsTouched(): void {
//     Object.values(this.uploadForm.controls).forEach(control => {
//       control.markAsTouched();
//     });
//     (this.uploadForm.get('category') as FormGroup).controls['id'].markAsTouched();
//   }
// }


import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { BookService } from '../book.service';
import { CategoryService } from '../categories.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-book-upload',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './book-upload.component.html',
  styleUrls: ['./book-upload.component.css']
})
export class BookUploadComponent implements OnInit {
  uploadForm: FormGroup;
  categories: any[] = [];
  listingTypes = ['SELL', 'EXCHANGE', 'DONATE'];
  userId: number | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private categoryService: CategoryService,
    private router: Router,
    private authService: AuthService
  ) {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      subject: ['', Validators.required],
      author: [''],
      edition: [''],
      bookCondition: [''],
      imageUrl: [''],
      listingType: ['', Validators.required],
      expectedExchange: [''],
      price: [null, Validators.min(0)],
      category: this.fb.group({
        id: [[''], Validators.required]
      })
    });
  }

  ngOnInit(): void {
    this.userId = this.authService.getCurrentUserId();
    this.loadCategories();
    this.setupFormListeners();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        if (categories.length === 0) {
          this.errorMessage = 'No categories available';
        }
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.errorMessage = 'Failed to load categories.';
        this.categories = [];
      }
    });
  }

  setupFormListeners(): void {
    this.uploadForm.get('listingType')?.valueChanges.subscribe(value => {
      const expectedExchangeControl = this.uploadForm.get('expectedExchange');
      const priceControl = this.uploadForm.get('price');
      
      if (value === 'EXCHANGE') {
        expectedExchangeControl?.setValidators(Validators.required);
        priceControl?.clearValidators();
        priceControl?.setValue(null);
      } else if (value === 'SELL') {
        priceControl?.setValidators([Validators.required, Validators.min(0)]);
        expectedExchangeControl?.clearValidators();
        expectedExchangeControl?.setValue('');
      } else {
        expectedExchangeControl?.clearValidators();
        priceControl?.clearValidators();
        expectedExchangeControl?.setValue('');
        priceControl?.setValue(null);
      }
      
      expectedExchangeControl?.updateValueAndValidity();
      priceControl?.updateValueAndValidity();
    });
  }

  onSubmit(): void {
    if (this.uploadForm.valid) {
      if (this.userId === null) {
        this.errorMessage = 'User not authenticated.';
        return;
      }
      this.loading = true;
      const bookData = this.uploadForm.value;
      
      this.bookService.addBook(this.userId, bookData).subscribe({
        next: (response) => {
          this.uploadForm.reset();
          this.loading = false;
          this.router.navigate(['/books']);
        },
        error: (error) => {
          this.errorMessage = 'Failed to upload book.';
          this.loading = false;
          console.error('Error uploading book:', error);
        }
      });
    } else {
      this.markFormAsTouched();
    }
  }

  private markFormAsTouched(): void {
    Object.values(this.uploadForm.controls).forEach(control => {
      control.markAsTouched();
    });
    (this.uploadForm.get('category') as FormGroup).controls['id'].markAsTouched();
  }
}