import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookEditComponent } from './book-edit.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BookDetailsComponent } from '../../books/book-details/book-details.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BookEditComponent', () => {
  let component: BookEditComponent;
  let fixture: ComponentFixture<BookEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookEditComponent],
      schemas: [NO_ERRORS_SCHEMA], // NEU
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'detail/:isbn', component: BookDetailsComponent }
        ])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
