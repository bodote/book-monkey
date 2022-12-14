import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  ValidationErrors
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { BookStoreService } from '../../shared/book-store.service';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BodosValidatorService {
  //Todo: replace use of BookStoreService with a Store-Action
  constructor(private bookService: BookStoreService) {}
  checkIsbn(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return { isbnLength: { valid: false } };
    if (control.value.length != 10 && control.value.length != 13)
      return { isbnLength: { valid: false } };
    return null;
  }
  checkAuthors(authorsFormArray: AbstractControl): ValidationErrors | null {
    if (
      (authorsFormArray as FormArray).controls.some(
        (ele) => ele.value?.length > 0
      )
    ) {
      return null;
    } else {
      return { oneAuthor: { valid: false } };
    }
  }
  asyncIsbnExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      //console.log('calling book Service for validation of isbn');
      return this.bookService.getBookFast(control.value).pipe(
        map((book) => {
          return book ? { isbnExists: { valid: false } } : null;
        }),
        catchError(() => {
          //console.log('all good, since isbn does not yet exist');
          return of(null);
        })
      );
    };
  }
}
