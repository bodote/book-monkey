import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  ValidationErrors
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { BookStoreService } from './book-store.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IsbnValidatorService {
  constructor(private bookService: BookStoreService) {}
  static checkIsbn(control: FormControl): ValidationErrors | null {
    console.log(control.value);
    if (control.value.length != 10 && control.value.length != 13)
      return { isbnLength: { valid: false } };
    return null;
  }
  asyncIsbnExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      console.log('calling book Service for validation of isbn');
      return this.bookService.getBookFast(control.value).pipe(
        map((book) => {
          return book ? { isbnExists: { valid: false } } : null;
        }),
        catchError(() => {
          console.log('all good, since isbn does not yet exist');
          return of(null);
        })
      );
    };
  }
}
