import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Book } from '../shared/book';

@Component({
  selector: 'bm-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.css'],
})
export class BookDetailsComponent implements OnInit {
  @Input() book: Book | undefined;
  @Output() backButton = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  backToList(e: Event) {
    this.backButton.emit(e);
  }
}
