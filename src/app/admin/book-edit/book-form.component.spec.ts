import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookFormComponent } from './book-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AsyncValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BodosValidatorService } from '../shared/bodos-validator.service';
import { Book } from '../../shared/book';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

const emptyBookData: Book = {
  authors: [''],
  isbn: '',
  published: new Date('2022-08-10'),
  title: '',
  subtitle: '',
  description: '',
  rating: null,
  thumbnails: [{ title: '', url: '' }]
};
describe('BookFormsComponent', () => {
  let component: BookFormComponent;
  let fixture: ComponentFixture<BookFormComponent>;
  let validatorService = jasmine.createSpyObj<BodosValidatorService>(
    'validatorSpy',
    ['asyncIsbnExistsValidator', 'checkIsbn', 'checkAuthors']
  );

  validatorService.asyncIsbnExistsValidator = jasmine
    .createSpy<() => AsyncValidatorFn>()
    .and.returnValue(() => of({ isbnExists: { valid: false } }));
  validatorService.checkIsbn = jasmine.createSpy().and.returnValue(null);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookFormComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: BodosValidatorService, useValue: validatorService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookFormComponent);
    component = fixture.componentInstance;
    component.isNew = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('with new book', () => {
    it('should create the edit form, which should not be valid', () => {
      expect(component.editForm.value).toEqual(emptyBookData);
      expect(component.editForm.valid).toBeFalse();
      expect(component.editForm.get('isbn')?.valid).toBeFalse();
    });
    it('should not be valid, if BodosValidatorService.asyncIsbnExistsValidator finds an error', () => {
      const isbnContr = component.editForm.get('isbn'); //.setValue('sasd');
      const isbnEl = fixture.debugElement.query(
        By.css('input[formControlName="isbn"]')
      ).nativeElement;
      expect(isbnContr?.pristine).toBeTruthy();
      expect(isbnContr?.dirty).toBeFalse();
      isbnEl.value = '123';
      // BodosValidatorService.checkIsbn is just a mock that returns always null Errors
      // but BodosValidatorService.asyncIsbnExistsValidator returns of({ isbnExists: { valid: false } })
      isbnEl.dispatchEvent(new Event('input'));
      expect(isbnContr?.value).toEqual('123');
      expect(isbnContr?.pristine).toBeFalse();
      expect(isbnContr?.dirty).toBeTruthy();
      expect(isbnContr?.valid).toBeFalse();
    });
    it('should call bookFormSaveBook method, when button is clicked, but not emit Event if Form is not valid', () => {
      spyOn(component, 'bookFormSaveBook').and.callThrough();
      spyOn(component.saveBookEventEmitter, 'emit');
      const buttonEl = fixture.debugElement.query(By.css('button'));
      buttonEl.nativeElement.click();
      expect(component.bookFormSaveBook).toHaveBeenCalledTimes(1);
      expect(component.saveBookEventEmitter.emit).toHaveBeenCalledTimes(0);
    });
  });
});
