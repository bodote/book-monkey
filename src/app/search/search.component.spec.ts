import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BookStoreService } from '../shared/book-store.service';
import { mergeMap, Observable, of, throwError, timer } from 'rxjs';
import { Book } from '../shared/book';
import { delay } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

const testBookData: Book = {
  authors: ['author'],
  isbn: '1234567890',
  published: new Date('2022-02-02'),
  title: 'a title',
  subtitle: '',
  description: '',
  rating: 3,
  thumbnails: [{ title: '', url: '' }]
};
describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let mockService = jasmine.createSpyObj<BookStoreService>('bookStoreService', [
    'getAllSearch'
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: BookStoreService, useValue: mockService }]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it(
    'should call BookStoreService.getAllSearch after 400ms if keyup() is called with a string ' +
      'longer then 2 chars and should subscribe and set foundBooks',
    fakeAsync(() => {
      mockService.getAllSearch = jasmine
        .createSpy<() => Observable<Book[]>>()
        .and.returnValue(of([testBookData]).pipe(delay(10)));
      const searchString = 'test';
      expect(component).toBeTruthy();
      component.keyup(searchString);

      tick(390);
      expect(component.foundBooks).toBeUndefined();
      expect(mockService.getAllSearch).toHaveBeenCalledTimes(0);
      tick(10);
      expect(component.isLoading).toBeTrue();
      expect(mockService.getAllSearch).toHaveBeenCalledOnceWith(searchString);
      tick(10);
      expect(component.foundBooks).toEqual([testBookData]);
      expect(component.isLoading).toBeFalse();
    })
  );
  it(
    'should call BookStoreService.getAllSearch after 400ms if keyup() is called with a string ' +
      'longer then 2 chars and should print error on console',
    fakeAsync(() => {
      spyOn(console, 'error');
      mockService.getAllSearch = jasmine
        .createSpy<() => Observable<Book[]>>()
        .and.returnValue(
          timer(10).pipe(
            mergeMap((e) =>
              throwError(() => new HttpErrorResponse({ status: 404 }))
            )
          )
        );
      const searchString = 'test';
      expect(component).toBeTruthy();
      component.keyup(searchString);
      tick(390);
      expect(component.foundBooks).toBeUndefined();
      expect(mockService.getAllSearch).toHaveBeenCalledTimes(0);
      tick(11);
      expect(component.isLoading).toBeTrue();
      expect(mockService.getAllSearch).toHaveBeenCalledOnceWith(searchString);
      tick(10);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(component.isLoading).toBeFalse();
    })
  );
});
