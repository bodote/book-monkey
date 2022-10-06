import { BookRaw } from './book-raw';
import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { BookEntity } from '../books/store/book-entity/book-entity.model';

@Injectable({
  providedIn: 'root'
})
export class BookFactoryService {
  constructor() {}

  static getFromRaw(bookRaw: BookRaw): BookEntity {
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
  static getRawFromBook(book: BookEntity): BookRaw {
    const date: string = formatDate(
      book.published,
      'YYYY-MM-ddThh:mm:ssZZ',
      'en'
    );
    return <BookRaw>{
      ...book,
      published: date
    };
  }
  static getEmptyBook(): BookEntity {
    return {
      title: '',
      subtitle: '',
      authors: [],
      published: new Date('1970-01-01'),
      isbn: '',
      thumbnails: [],
      rating: 0,
      description: ''
    };
  }
}
