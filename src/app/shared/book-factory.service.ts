import { BookRaw } from './book-raw';
import { Injectable } from '@angular/core';
import { Book } from './book';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class BookFactoryService {
  constructor(private datePipe: DatePipe) {}

  static getFromRaw(bookRaw: BookRaw): Book {
    return {
      ...bookRaw,
      published: new Date(bookRaw.published)
    };
  }
  getRawFromBook(book: Book): BookRaw {
    console.log(book.published);
    const shortDate = this.datePipe.transform(book.published, 'shortDate');
    if (!shortDate) new Error(' could not transform date: ' + book.published);
    return <BookRaw>{
      ...book,
      published: shortDate
    };
  }
  static getEmptyBook(): Book {
    return {
      title: '',
      subtitle: '',
      authors: [],
      published: new Date(),
      isbn: '',
      thumbnails: [],
      rating: 0,
      description: ''
    };
  }
}
