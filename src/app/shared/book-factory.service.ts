import { BookRaw } from './book-raw';
import { Injectable } from '@angular/core';
import { Book } from './book';

@Injectable({
  providedIn: 'root'
})
export class BookFactoryService {
  constructor() {}

  static getFromRaw(bookRaw: BookRaw): Book {
    return {
      ...bookRaw,
      published: new Date(bookRaw.published)
    };
  }
  getRawFromBook(book: Book): BookRaw {
    console.log('ISODate2: ' + new Date(book.published).toISOString());
    return <BookRaw>{
      ...book,
      published: new Date(book.published).toISOString()
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
