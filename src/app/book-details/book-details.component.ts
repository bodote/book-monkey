import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book } from '../shared/book';
import { BookStoreService } from '../shared/book-store.service';

@Component({
  selector: 'bm-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css']
})
export class BookDetailsComponent implements OnInit {
  book: Book = {
    title: 'no title',
    authors: [],
    published: new Date('2000-01-01'),
    isbn: ''
  };
  id: number = 0;

  private books: Book[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private bookService: BookStoreService
  ) {}

  ngOnInit(): void {
    let bookId = 0;
    this.books = this.bookService.getAll();

    //bookId = Number(this.route.snapshot.paramMap.get("id"));
    //this.book = this.books[bookId];
    this.route.paramMap.subscribe((params) => {
      console.log(`params.get('isbn') ${params.get('isbn')}`);
      if (params?.get('isbn')) {
        let isbn = params.get('isbn');
        let bookIdx = this.books.findIndex((book) => isbn === book.isbn);
        if (bookIdx != -1) {
          this.id = bookIdx;
          this.book = this.books[this.id];
        }
      }
    });
  }
  next(): void {
    console.log(`next() ${this.id}`);

    if (this.id < this.books.length - 1) {
      this.id += 1;
      this.book = this.books[this.id];
    }
  }
  prev(): void {
    console.log(`prev() ${this.id}`);

    if (this.id > 0) {
      this.id -= 1;
      this.book = this.books[this.id];
    }
  }
}
