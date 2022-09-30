import { BookRaw } from './book-raw';
import { Injectable } from '@angular/core';
import { Book } from './book';
import { formatDate } from '@angular/common';
import { BookEntity } from '../books/store/book-entity/book-entity.model';

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
  static getFromRaw2Entity(bookRaw: BookRaw): BookEntity {
    return {
      ...bookRaw,
      published: new Date(bookRaw.published)
    };
  }
  static getRawFromBook(book: Book): BookRaw {
    return <BookRaw>{
      ...book,
      published: formatDate(book.published, 'YYYY-MM-dd', 'en', 'Z')
    };
  }
  static getEmptyBook(): Book {
    return {
      title: '',
      subtitle: '',
      authors: [],
      published: new Date('2022-02-02'),
      isbn: '',
      thumbnails: [],
      rating: 0,
      description: ''
    };
  }
}
