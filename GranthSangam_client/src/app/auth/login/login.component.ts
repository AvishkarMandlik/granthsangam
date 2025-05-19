
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  // Login form
  loginData = {
    email: '',
    password: ''
  };
  
  // Password reset form
  resetData = {
    email: '',
    newPassword: '',
    confirmPassword: ''
  };

  showPassword = false;
  isLoading = false;
  errorMessage = '';
  
  // Reset password states
  showResetModal = false;
  resetStep: 'verify' | 'reset' = 'verify';
  verificationSuccess = false;

  constructor(private authService: AuthService, private router: Router) {}

  // Login methods
  onSubmit() {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error || 'Login failed. Please try again.';
      }
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Password reset methods
  openResetModal() {
    this.showResetModal = true;
    this.resetStep = 'verify';
    this.resetData.email = this.loginData.email;
    this.verificationSuccess = false;
  }

  closeResetModal() {
    this.showResetModal = false;
    this.resetData = { email: '', newPassword: '', confirmPassword: '' };
  }
verifyUser() {
  if (!this.resetData.email) {
    this.errorMessage = 'Please enter your email';
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';

  console.log('Attempting to verify:', this.resetData.email); // Log the email being sent

  this.authService.verifyUser(this.resetData.email).subscribe({
    next: (response) => {
      console.log('Verification success:', response); // Log successful response
      this.isLoading = false;
      this.resetStep = 'reset';
      this.verificationSuccess = true;
    },
    error: (error) => {
      console.error('Full verification error:', {
        error: error,
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        message: error.message,
        errorResponse: error.error
      });
      
      this.isLoading = false;
      
      if (error.status === 404) {
        this.errorMessage = 'No account found with this email';
      } else if (error.status === 400) {
        this.errorMessage = 'Invalid email format';
      } else if (error.status === 0) {
        this.errorMessage = 'Cannot connect to server. Please check your connection.';
      } else {
        // Try to get more specific error message
        this.errorMessage = error.error?.message || 
                          error.error?.error || 
                          error.message || 
                          'Verification failed. Please try again.';
      }
    }
  });
}

resetPassword() {
  // Validate passwords match
  if (this.resetData.newPassword !== this.resetData.confirmPassword) {
    this.errorMessage = 'Passwords do not match';
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';

  this.authService.resetPassword(this.resetData.email, this.resetData.newPassword).subscribe({
    next: (response) => {
      console.log('Password reset success:', response);
      this.isLoading = false;
      
      // Show success alert
      alert('Password reset successfully! Please login with your new password');
      
      // Reset form and close modal
      this.showResetModal = false;
      this.resetData = { email: '', newPassword: '', confirmPassword: '' };
      
      // Clear any previous login errors
      this.errorMessage = '';
      
      // Optionally auto-fill login form
      this.loginData.email = this.resetData.email;
      this.loginData.password = '';
      
      // Focus on email field (add template reference #emailInput to your email input)
      setTimeout(() => {
        const emailInput = document.getElementById('email');
        if (emailInput) emailInput.focus();
      }, 100);
    },
    error: (error) => {
      console.error('Password reset error:', error);
      this.isLoading = false;
      
      // Show error alert
      alert(` ${error.text}`);
      
      
      // Keep modal open to allow retry
      this.errorMessage = error;
      
      // Focus back on new password field
      setTimeout(() => {
        const newPasswordInput = document.getElementById('new-password');
        if (newPasswordInput) newPasswordInput.focus();
      }, 100);
    }
  });
}
}