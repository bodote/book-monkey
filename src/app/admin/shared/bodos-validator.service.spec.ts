import { BodosValidatorService } from './bodos-validator.service';
import { BookStoreService } from '../../shared/book-store.service';
import {
  AbstractControl,
  FormArray,
  FormControl,
  ValidationErrors
} from '@angular/forms';
import { Observable, of, throwError } from 'rxjs';
import { Book } from '../../shared/book';
import { TestScheduler } from 'rxjs/testing';
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
describe('BodosValidatorService', () => {
  let mockService = jasmine.createSpyObj<BookStoreService>('bookStoreService', [
    'getBookFast'
  ]);
  let testScheduler: TestScheduler;
  beforeEach(() => {
    testScheduler = new TestScheduler((actual, expected) => {
      // asserting the two objects are equal - required
      expect(actual).toEqual(expected);
    });
  });

  it('should return null if FormControlArray has at least one author', () => {
    //arrange
    const validatorService = new BodosValidatorService(mockService);
    const authorFC = new FormControl('author');
    const authorArray = new FormArray([authorFC]);
    expect(validatorService.checkAuthors(authorArray)).toBeNull();
  });
  it('should return { oneAuthor: { valid: false } } if FormControlArray has no author', () => {
    //arrange
    const validatorService = new BodosValidatorService(mockService);
    const authorFC = new FormControl();
    const authorArray = new FormArray([authorFC]);
    expect(validatorService.checkAuthors(authorArray)).toEqual({
      oneAuthor: { valid: false }
    });
  });
  it('should return null if value.length is 10 or 13', () => {
    //arrange
    const validatorService = new BodosValidatorService(mockService);
    const isbnFC = new FormControl('1234567890');
    const isbnFC2 = new FormControl('1234567890123');
    expect(validatorService.checkIsbn(isbnFC)).toBeNull();
    expect(validatorService.checkIsbn(isbnFC2)).toBeNull();
  });
  it('should return an error if value.length is not 10 or 13', () => {
    //arrange
    const validatorService = new BodosValidatorService(mockService);
    const isbnFC = new FormControl('123456789');
    expect(validatorService.checkIsbn(isbnFC)).toEqual({
      isbnLength: { valid: false }
    });
  });
  it('should return error observable if book with this ISBN already exists', () => {
    testScheduler.run((helpers) => {
      const { expectObservable } = helpers;
      //arrange
      mockService.getBookFast = jasmine
        .createSpy()
        .and.returnValue(of([testBookData]));
      const validatorService = new BodosValidatorService(mockService);
      const isbnFC = new FormControl('1234567890');
      const valFn = validatorService.asyncIsbnExistsValidator() as (
        control: AbstractControl
      ) => Observable<ValidationErrors>;
      expect(valFn).not.toBeNull();
      const error$: Observable<ValidationErrors | null> = valFn(isbnFC);
      const valuesOut = { e: { isbnExists: { valid: false } } };
      const expected = '(e|)';
      expectObservable(error$).toBe(expected, valuesOut);
    });
  });

  it('should return  observable of(null) if book with this ISBN does not exists yet', () => {
    testScheduler.run((helpers) => {
      const { expectObservable } = helpers;
      //arrange
      mockService.getBookFast = jasmine.createSpy().and.returnValue(
        throwError(() => {
          return new HttpErrorResponse({ status: 404 });
        })
      );
      const validatorService = new BodosValidatorService(mockService);
      const isbnFC = new FormControl('1234567890');
      const valFn = validatorService.asyncIsbnExistsValidator() as (
        control: AbstractControl
      ) => Observable<ValidationErrors>;
      expect(valFn).not.toBeNull();
      const error$: Observable<ValidationErrors | null> = valFn(isbnFC);
      const valuesOut = { e: null };
      const expected = '(e|)';
      expectObservable(error$).toBe(expected, valuesOut);
    });
  });
});
