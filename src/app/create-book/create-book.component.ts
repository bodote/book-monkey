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

  saveBook(book: Book) {
    console.log('post Book: ' + JSON.stringify(book));
    this.bookStoreService.postBook(book).subscribe(
      (res) => {
        console.log('OK: http post: ' + JSON.stringify(res));
        this.errorMessage = res.error;
      },
      (err) => {
        console.log('ERROR in http post: ' + JSON.stringify(err));
        this.errorMessage = err;
      }
    );
  }
}
