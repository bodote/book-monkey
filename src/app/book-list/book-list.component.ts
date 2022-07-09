import { Component, OnInit } from '@angular/core';
import { Book } from '../shared/book';
import { BookStoreService } from '../shared/book-store.service';

@Component({
  selector: 'bm-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  books!: Book[];
  listView!: boolean;
  detailBook!: Book;
  error: string | undefined;

  constructor(private bs: BookStoreService) {
    this.bs = bs;
  }

  ngOnInit(): void {
    this.bs.getAll().subscribe({
      next: (books) => {
        this.books = books;
        this.error = undefined;
        return;
      },
      error: (err: string) => {
        this.error = err;
      }
    });
    this.listView = true;
  }
}
