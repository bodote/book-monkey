import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookListItemComponent } from './book-list-item.component';
import { IsbnPipe } from '../shared/isbn.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';

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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
