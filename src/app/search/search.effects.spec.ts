import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';

import { SearchEffects } from './search.effects';
import { BookStoreService } from '../shared/book-store.service';
import { Book } from '../shared/book';
import { delay } from 'rxjs/operators';

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
describe('SearchEffects', () => {
  let actions$: Observable<any>;
  let effects: SearchEffects;
  let mockService = jasmine.createSpyObj<BookStoreService>('bookStoreService', [
    'getAllSearch'
  ]);
  mockService.getAllSearch = jasmine
    .createSpy<() => Observable<Book[]>>()
    .and.returnValue(of([testBookData]).pipe(delay(10)));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SearchEffects,
        provideMockActions(() => actions$),
        { provide: BookStoreService, useValue: mockService }
      ]
    });

    effects = TestBed.inject(SearchEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
