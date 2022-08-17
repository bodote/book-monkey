import { Component, OnDestroy } from '@angular/core';
import { Book } from '../../shared/book';
import { BookStoreService } from '../../shared/book-store.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'bm-create-book',
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.css']
})
export class CreateBookComponent implements OnDestroy {
  errorMessage = '';
  saved = false;
  successMsg = '';
  subscription: Subscription | undefined;
  constructor(private bookStoreService: BookStoreService) {}

  createBookSave(book: Book) {
    this.subscription = this.bookStoreService.postBook(book).subscribe({
      next: (res) => {
        this.saved = true;
        this.successMsg = res;
        setTimeout(() => (this.saved = false), 5000);
      },
      error: (err) => {
        console.error('ERROR in createBookSave: ' + JSON.stringify(err));
        this.errorMessage = JSON.stringify(err);
      }
    });
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
