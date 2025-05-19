
import { Component, Input, OnInit } from '@angular/core';
import { LikeService } from '../like.service';
import { AuthService } from '../../auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-like',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-like.component.html',
  styleUrls: ['./book-like.component.css']
})
export class BookLikeComponent implements OnInit {
  @Input({ required: true }) bookId!: number;
  @Input() initialCount: number = 0;
  @Input() initialLiked: boolean = false;
  
  likeCount: number = 0;
  isLiked: boolean = false;
  isLoading: boolean = false;
  currentUserId: number | null = null;

  constructor(
    private likeService: LikeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId();
    
    if (this.currentUserId) {
      // Check the actual like status from server
      this.likeService.checkIfLiked(this.currentUserId, this.bookId).subscribe({
        next: (liked) => {
          this.isLiked = liked;
          this.updateLikeCount();
        },
        error: () => {
          // Fallback to input values if API fails
          this.isLiked = this.initialLiked;
          this.likeCount = this.initialCount;
        }
      });
    } else {
      // Use input values if not logged in
      this.isLiked = this.initialLiked;
      this.likeCount = this.initialCount;
    }
  }

  private updateLikeCount(): void {
    this.likeService.getLikeCount(this.bookId).subscribe({
      next: (count) => this.likeCount = count,
      error: () => this.likeCount = this.initialCount
    });
  }

  toggleLike(): void {
    if (!this.currentUserId || this.isLoading) return;

    this.isLoading = true;
    const wasLiked = this.isLiked;
    
    // Optimistic UI update
    this.isLiked = !wasLiked;
    this.likeCount += this.isLiked ? 1 : -1;

    const action = wasLiked 
      ? this.likeService.unlikeBook(this.currentUserId, this.bookId)
      : this.likeService.likeBook(this.currentUserId, this.bookId);

    action.subscribe({
      next: (response: any) => {
        if (response.success) {
          // Update with actual count from server
          this.likeCount = response.likeCount || this.likeCount;
        } else {
          this.revertLikeState(wasLiked);
        }
      },
      error: () => this.revertLikeState(wasLiked),
      complete: () => this.isLoading = false
    });
  }

  private revertLikeState(wasLiked: boolean): void {
    this.isLiked = wasLiked;
    this.likeCount = wasLiked ? this.likeCount - 1 : this.likeCount + 1;
  }
}