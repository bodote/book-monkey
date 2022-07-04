import { Component, OnInit } from '@angular/core';
import { Book } from '../shared/book';

@Component({
  selector: 'bm-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css'],
})
export class BookListComponent implements OnInit {
  books!: Book[];
  listView!: boolean;
  detailBook!: Book;

  constructor() {}

  enableList(): void {
    this.listView = true;
  }

  showDetail(book: Book): void {
    console.log('show detail  book-list', book);
    this.listView = false;
    this.detailBook = book;
  }

  ngOnInit(): void {
    this.listView = true;

    this.books = [
      {
        title: 'Angular',
        authors: ['Ferdinand Malcher', 'Johannes Hoppe', 'Danny Koppenhagen'],
        published: new Date('2020-10-08'),
        isbn: '978-3-86490-779-1',
        rating: 5,
        subtitle:
          'Grundlagen, fortgeschrittene Themen und Best Practices – inkl. RxJS, NgRx und PWA',
        thumbnails: [
          {
            title: 'Angular',
            url: 'https://dpunkt.de/wp-content/uploads/2020/09/13654-200x291.jpg',
          },
        ],
        description: 'Lernen Sie Angular mit diesem Praxisbuch!',
      },
      {
        title: 'Angular',
        authors: ['Manfred Steyer'],
        published: new Date('2021-09-21'),
        isbn: '978-3-96009-166-0',
        subtitle: 'Das Praxisbuch zu Grundlagen und Best Practices',
        thumbnails: [
          {
            title: 'Angular',
            url: 'https://dpunkt.de/wp-content/uploads/2021/05/13610-200x291.jpg',
          },
        ],
      },
    ];
  }
}
