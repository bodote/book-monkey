import { Component, Input } from '@angular/core';
import { BookEntity } from '../store/book-entity/book-entity.model';

@Component({
  selector: 'bm-book-list-item',
  templateUrl: './book-list-item.component.html',
  styleUrls: ['./book-list-item.component.css']
})
export class BookListItemComponent {
  @Input() book: BookEntity | undefined;
  constructor() {}
}
