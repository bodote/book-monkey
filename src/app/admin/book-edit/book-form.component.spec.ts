import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookFormComponent } from './book-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  AsyncValidatorFn,
  ReactiveFormsModule,
  ValidationErrors
} from '@angular/forms';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  SimpleChange,
  SimpleChanges
} from '@angular/core';
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

const testBookDataNoThumbs: Book = {
  authors: ['author'],
  isbn: '1234567890',
  published: new Date('2022-02-02'),
  title: 'a title',
  subtitle: 'a subtitle',
  description: 'a description',
  rating: 3
};
const testBookData: Book = {
  ...testBookDataNoThumbs,
  thumbnails: [{ title: '', url: '' }]
};
const testBookDataWrongISBN: Book = {
  ...testBookData,
  isbn: '123'
};
const testBookDataNoISBNWrongRating: Book = {
  ...testBookData,
  isbn: '',
  rating: -1
};
const testBookDataWrongISBNRatingTooBig: Book = {
  ...testBookData,
  isbn: '',
  rating: 6
};

describe('BookFormsComponent', () => {
  let component: BookFormComponent;
  let fixture: ComponentFixture<BookFormComponent>;
  let validatorService = jasmine.createSpyObj<BodosValidatorService>(
    'validatorSpy',
    ['asyncIsbnExistsValidator', 'checkIsbn', 'checkAuthors']
  );
  async function prepareTests(
    asyncReturn: { isbnExists: { valid: false } } | null = {
      isbnExists: { valid: false }
    },
    checkIsbn: ValidationErrors | null = null,
    checkAuthors: ValidationErrors | null = null
  ) {
    validatorService.asyncIsbnExistsValidator = jasmine
      .createSpy<() => AsyncValidatorFn>()
      .and.returnValue(() => of(asyncReturn));
    validatorService.checkIsbn = jasmine.createSpy().and.returnValue(checkIsbn);
    validatorService.checkAuthors = jasmine
      .createSpy()
      .and.returnValue(checkAuthors);
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
  }
  describe('with existing book where AsyncValidatorFn is not used, ', () => {
    beforeEach(async () => {});
    it(
      'form should be valid and emit the new book data to the saveBookEventEmitter Output emitter' +
        'if a book is given to ngOnChanges',
      async () => {
        await prepareTests();
        component.isNew = false;
        expect(component).toBeTruthy();
        spyOn(component.saveBookEventEmitter, 'emit');
        fixture.detectChanges(); // only if component.isNew || component.book , there is a button!
        //directly call ngOnChanges
        component.aBook = testBookDataNoThumbs;
        // because of fixture.detectChanges() does not call it in a unittest directly,
        // and only the first fixture.detectChanges() call calls ngOnInit()
        component.ngOnChanges({
          aBook: new SimpleChange(null, testBookDataNoThumbs, false)
        });
        // to force reevaluate the html - template after component.book = testBookData:
        fixture.detectChanges();
        const buttonEl = fixture.debugElement.query(
          By.css('button[type="submit"]')
        );
        buttonEl.nativeElement.click();
        expect(component.editForm.valid).toBeTrue();
        expect(component.saveBookEventEmitter.emit).toHaveBeenCalledWith(
          testBookDataNoThumbs
        );
      }
    );
    it(
      'form should be valid and emit the new book data to the saveBookEventEmitter Output emitter' +
        'if a book is given to ngOnChanges',
      async () => {
        await prepareTests();
        component.isNew = false;
        expect(component).toBeTruthy();
        spyOn(component.saveBookEventEmitter, 'emit');
        fixture.detectChanges(); // only if component.isNew || component.book , there is a button!
        //directly call ngOnChanges
        component.aBook = testBookData;
        // because of fixture.detectChanges() does not call it in a unittest directly,
        // and only the first fixture.detectChanges() call calls ngOnInit()
        component.ngOnChanges({
          aBook: new SimpleChange(null, testBookData, false)
        });
        // to force reevaluate the html - template after component.book = testBookData:
        fixture.detectChanges();
        const buttonEl = fixture.debugElement.query(
          By.css('button[type="submit"]')
        );
        buttonEl.nativeElement.click();
        expect(component.editForm.valid).toBeTrue();
        expect(component.saveBookEventEmitter.emit).toHaveBeenCalledWith(
          testBookData
        );
      }
    );
    it('should not call fillForm if  ngOnChanges has no book ', async () => {
      await prepareTests();
      component.isNew = false;

      spyOn(component, 'fillForm');
      fixture.detectChanges();
      //directly call ngOnChanges
      component.aBook = testBookDataNoThumbs;
      // because of fixture.detectChanges() does not call it in a unittest directly,
      // and only the first fixture.detectChanges() call calls ngOnInit()
      component.ngOnChanges({
        aBook: new SimpleChange(testBookDataNoThumbs, undefined, false)
      });
      expect(component.fillForm).toHaveBeenCalledTimes(0);
    });
    it('should not call fillForm if  ngOnChanges has no book or if changes are null alltogether ', async () => {
      await prepareTests();
      component.isNew = true;

      spyOn(component, 'fillForm');
      fixture.detectChanges();
      //directly call ngOnChanges
      component.aBook = testBookDataNoThumbs;
      // because of fixture.detectChanges() does not call it in a unittest directly,
      // and only the first fixture.detectChanges() call calls ngOnInit()
      const change = new SimpleChange(null, testBookDataNoThumbs, false);
      component.ngOnChanges({ aBook: change } as SimpleChanges);
      expect(component.fillForm).toHaveBeenCalledTimes(0);
      // @ts-ignore
      // because it happens in browser for whatever reason! (Angular - Bug? )
      component.ngOnChanges({ aBook: null });
      expect(component.fillForm).toHaveBeenCalledTimes(0);
    });
    it(
      'form should be valid and emit the new book data to the saveBookEventEmitter Output emitter' +
        'if a book is given in advance to the component before ngOnInit is run',
      async () => {
        await prepareTests();
        component.isNew = false;
        expect(component).toBeTruthy();
        component.aBook = testBookData;
        spyOn(component.saveBookEventEmitter, 'emit');
        fixture.detectChanges(); // only if component.isNew || component.book , there is a button!

        const buttonEl = fixture.debugElement.query(
          By.css('button[type="submit"]')
        );
        buttonEl.nativeElement.click();
        expect(component.editForm.valid).toBeTrue();
        expect(component.saveBookEventEmitter.emit).toHaveBeenCalledWith(
          testBookData
        );
      }
    );
    it('should add an author, if add button is clicked', async () => {
      await prepareTests();
      component.isNew = false;
      fixture.detectChanges();
      expect(component).toBeTruthy();
      spyOn(component.saveBookEventEmitter, 'emit');
      spyOn(component, 'addAuthor').and.callThrough();
      component.aBook = testBookData;
      //directly call ngOnChanges
      component.ngOnChanges({
        aBook: new SimpleChange(null, testBookData, false)
      });
      fixture.detectChanges();
      expect(component.authors.length).toEqual(1);
      const addAuthButton = fixture.debugElement.query(By.css('#addAuthor'));
      addAuthButton.nativeElement.click();
      expect(component.addAuthor).toHaveBeenCalledTimes(1);
      expect(component.authors.length).toEqual(2);
    });
    it('should disable the SAVE button, and show the error if ISBN is invalid or if there are no authors', async () => {
      await prepareTests(
        null,
        { isbnLength: { valid: false } },
        { oneAuthor: { valid: false } }
      );
      component.isNew = false;
      fixture.detectChanges();

      spyOn(component, 'removeAuthor').and.callThrough();
      component.aBook = testBookDataWrongISBN;
      //directly call ngOnChanges
      component.ngOnChanges({
        aBook: new SimpleChange(null, testBookDataWrongISBN, false)
      });
      fixture.detectChanges();
      expect(validatorService.checkIsbn).toHaveBeenCalled();
      const removeAuthButton = fixture.debugElement.query(
        By.css('#removeAuthor')
      );
      removeAuthButton.nativeElement.click();
      expect(component.removeAuthor).toHaveBeenCalledTimes(1);

      expect(component.authors.length).toEqual(0);
      const saveButton = fixture.debugElement.query(
        By.css('button[type="submit"]')
      );

      //check if button is disabled:
      expect(saveButton.nativeElement.disabled).toBeTrue();
      expect(component.editForm.valid).toBeFalse();

      expect(component.editForm.get('isbn')?.valid).toBeFalse();

      expect(validatorService.checkAuthors).toHaveBeenCalled();
      expect(component.editForm.get('authors')?.valid).toBeFalse();
    });
  });
  xdescribe('with new book and AsyncValidatorFn or the checkAuthors validator  returns an error ', () => {
    beforeEach(async () => {
      await prepareTests(
        {
          isbnExists: { valid: false }
        },
        null,
        { oneAuthor: { valid: false } }
      );
      component.isNew = true;
      fixture.detectChanges();
    });
    it('should create', () => {
      expect(component).toBeTruthy();
    });
    it('should create the edit form, which should not be valid', () => {
      expect(component.editForm.value).toEqual(emptyBookData);
      expect(component.editForm.valid).toBeFalse();
      expect(component.editForm.get('isbn')?.valid).toBeFalse();
    });
    it('should not be valid, if BodosValidatorService.asyncIsbnExistsValidator or checkAuthors finds an error', () => {
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
      const removeAuthButton = fixture.debugElement.query(
        By.css('#removeAuthor')
      );
      removeAuthButton.nativeElement.click();
      fixture.detectChanges();
      expect(isbnContr?.value).toEqual('123');
      expect(isbnContr?.pristine).toBeFalse();
      expect(component.isbn?.dirty).toBeTrue();
      expect(isbnContr?.dirty).toBeTruthy();
      expect(isbnContr?.valid).toBeFalse();
      expect(component.editForm.get('authors')?.valid).toBeFalse();
    });
    it('should call bookFormSaveBook method, when button is clicked, but not emit Event if Form is not valid', () => {
      spyOn(component, 'bookFormSaveBook').and.callThrough();
      spyOn(component.saveBookEventEmitter, 'emit');
      spyOn(console, 'error');
      const buttonEl = fixture.debugElement.query(By.css('button')); //throws an Error but is catched internally;
      spyOn(buttonEl.nativeElement, 'click').and.callThrough();
      expect(buttonEl.nativeElement.disabled).toBeTrue();
      buttonEl.nativeElement.click();

      expect(component.bookFormSaveBook).toHaveBeenCalledTimes(0);
      expect(console.error).toHaveBeenCalledTimes(0);
      //even if we call it directly, the saveBookEventEmitter
      //should not emit an action
      // and it should raise an exeption instead
      expect(() => component.bookFormSaveBook()).toThrowError(
        'bookFormSave called although form is not valid!'
      );
      expect(component.saveBookEventEmitter.emit).toHaveBeenCalledTimes(0);
    });
  });
  xdescribe('with new book and isbnLength validator  returns an error ', () => {
    beforeEach(async () => {
      await prepareTests(null, { isbnLength: { valid: false } }, null);
      component.isNew = true;
      fixture.detectChanges();
    });

    it('should create the edit form, which should not be valid', () => {
      expect(component.editForm.value).toEqual(emptyBookData);
      expect(component.editForm.valid).toBeFalse();
      expect(component.editForm.get('isbn')?.valid).toBeFalse();
    });
  });

  describe('with new book and AsyncValidatorFn that returns no errors', () => {
    beforeEach(async () => {
      await prepareTests(null, null);
      component.isNew = true;
      fixture.detectChanges();
    });
    it('should call bookFormSaveBook method, when button is clicked, and emit Event if Form is  valid', () => {
      //arrange
      spyOn(component, 'bookFormSaveBook').and.callThrough();
      spyOn(component.saveBookEventEmitter, 'emit');
      expect(component.editForm.valid).toBeFalse();
      // act
      component.editForm.setValue(testBookData);
      fixture.detectChanges();
      // assert
      expect(component.editForm.valid).toBeTrue();
      // act
      const buttonEl = fixture.debugElement.query(By.css('button'));
      expect(buttonEl.nativeElement.disabled).toBeFalse();
      buttonEl.nativeElement.click();
      // assert
      expect(component.bookFormSaveBook).toHaveBeenCalledTimes(1);
      expect(component.saveBookEventEmitter.emit).toHaveBeenCalledTimes(1);
    });
    it('should call addAuthor method, when add Author is clicked, same with removeAuthor', () => {
      //arrange
      spyOn(component, 'addAuthor').and.callThrough();
      spyOn(component, 'removeAuthor').and.callThrough();
      expect(component.editForm.valid).toBeFalse();
      // act
      component.editForm.setValue(testBookData);
      // assert
      expect(component.authors.length).toEqual(1);
      expect(component.editForm.valid).toBeTrue();
      // act

      const authorPlusButton = fixture.debugElement.query(By.css('#addAuthor'));
      authorPlusButton.nativeElement.click();
      // assert
      expect(component.authors.length).toEqual(2);
      expect(component.addAuthor).toHaveBeenCalledTimes(1);
      //arrange
      const authorMinusButton = fixture.debugElement.query(
        By.css('#removeAuthor')
      );
      authorMinusButton.nativeElement.click();
      expect(component.removeAuthor).toHaveBeenCalledTimes(1);
      expect(component.authors.length).toEqual(1);
    });
    it('should call addThumb method, when add Thumb is clicked, same with ThumbAuthor', () => {
      //arrange
      spyOn(component, 'addThumb').and.callThrough();
      spyOn(component, 'removeThumb').and.callThrough();
      expect(component.editForm.valid).toBeFalse();
      // act
      component.editForm.setValue(testBookData);
      // assert
      expect(component.thumbnails.length).toEqual(1);
      expect(component.editForm.valid).toBeTrue();
      // act
      const thumbPlusButton = fixture.debugElement.query(By.css('#addThumb'));
      thumbPlusButton.nativeElement.click();
      // assert
      expect(component.thumbnails.length).toEqual(2);
      expect(component.addThumb).toHaveBeenCalledTimes(1);
      //arrange
      const thumbMinusButton = fixture.debugElement.query(
        By.css('#removeThumb')
      );
      thumbMinusButton.nativeElement.click();
      expect(component.removeThumb).toHaveBeenCalledTimes(1);
      expect(component.thumbnails.length).toEqual(1);
    });
  });
  describe('with new book and required or isbn validator that returns an error', () => {
    beforeEach(async () => {});
    it('should disable the save button, when isbn number is not valid, or rating is not valid', async () => {
      //arrange
      await prepareTests(null, { isbnLength: { valid: false } });
      component.isNew = true;
      fixture.detectChanges();
      spyOn(component, 'bookFormSaveBook').and.callThrough();
      spyOn(component.saveBookEventEmitter, 'emit');
      expect(component.editForm.valid).toBeFalse();
      // act
      component.editForm.setValue(testBookDataWrongISBNRatingTooBig);
      fixture.detectChanges();
      // assert
      expect(component.editForm.valid).toBeFalse();
      expect(component.editForm.get('isbn')?.valid).toBeFalse();
      expect(component.editForm.get('rating')?.valid).toBeFalse();
      // act
      const saveButton = fixture.debugElement.query(
        By.css('button[type="submit"]')
      );
      //check if button is still disabled:
      expect(saveButton.nativeElement.disabled).toBeTrue();

      // assert
      expect(component.bookFormSaveBook).toHaveBeenCalledTimes(0);
      expect(component.saveBookEventEmitter.emit).toHaveBeenCalledTimes(0);
    });
    it('form should not be valid, when there is no isbn number, or rating is not valid', async () => {
      //arrange
      await prepareTests(null, { isbnLength: { valid: false } });
      component.isNew = true;
      fixture.detectChanges();

      expect(component.editForm.valid).toBeFalse();
      component.editForm.setValue(testBookDataNoISBNWrongRating);

      const isbnContr = component.editForm.get('isbn');
      const isbnEl = fixture.debugElement.query(
        By.css('input[formControlName="isbn"]')
      ).nativeElement;
      expect(isbnContr?.pristine).toBeTrue();
      expect(isbnContr?.dirty).toBeFalse();
      isbnEl.value = '123';
      // BodosValidatorService.checkIsbn is just a mock that returns always null Errors
      // but BodosValidatorService.asyncIsbnExistsValidator returns of({ isbnExists: { valid: false } })

      // act
      isbnEl.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(isbnContr?.dirty).toBeTrue();
      // assert
      expect(validatorService.checkIsbn).toHaveBeenCalled();
      expect(component.editForm.valid).toBeFalse();
      expect(component.editForm.get('isbn')?.valid).toBeFalse();
      expect(component.editForm.get('rating')?.valid).toBeFalse();
    });
  });
});
