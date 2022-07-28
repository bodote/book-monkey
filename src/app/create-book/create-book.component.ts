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
  constructor(private bookStoreService: BookStoreService) {}

  createBookSave(book: Book) {
    console.log('post Book: ' + JSON.stringify(book));
    this.bookStoreService.postBook(book).subscribe(
      (res) => {
        console.log('OK: http createBookSave: ' + JSON.stringify(res));
      },
      (err) => {
        console.error('ERROR in createBookSave: ' + JSON.stringify(err));
        this.errorMessage = JSON.stringify(err);
      }
    );
  }
}
