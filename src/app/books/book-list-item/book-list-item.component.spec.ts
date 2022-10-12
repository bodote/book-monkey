import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookListItemComponent } from './book-list-item.component';
import { IsbnPipe } from '../shared/isbn.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { BookFactory } from '../store/book-entity/book.factory.spec';

describe('BookListItemComponent', () => {
  let component: BookListItemComponent;
  let fixture: ComponentFixture<BookListItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookListItemComponent, IsbnPipe],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(BookListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and show the title', () => {
    expect(component).toBeTruthy();
    const factory = new BookFactory();
    component.book = factory.bookEntity({ title: 'myTitle', isbn: '1' });
    fixture.detectChanges();
    const bookElement = fixture.debugElement.query(
      By.css('[data-cy="title/1"]')
    );
    expect(bookElement).toBeTruthy();
    expect(bookElement.nativeElement.textContent).toContain('myTitle');
  });
});
