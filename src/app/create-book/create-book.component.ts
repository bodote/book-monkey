import { Component } from '@angular/core';
import { Book } from '../shared/book';
import { BookStoreService } from '../shared/book-store.service';

@Component({
  selector: 'bm-create-book',
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.css']
})
export class CreateBookComponent {
  errorMessage = '';
  saved = false;
  successMsg = '';
  constructor(private bookStoreService: BookStoreService) {}

  createBookSave(book: Book) {
    this.bookStoreService.postBook(book).subscribe(
      (res) => {
        this.saved = true;
        this.successMsg = JSON.stringify(res);
        setTimeout(() => (this.saved = false), 5000);
      },
      (err) => {
        console.error('ERROR in createBookSave: ' + JSON.stringify(err));
        this.errorMessage = JSON.stringify(err);
      }
    );
  }
}
