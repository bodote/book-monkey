import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookFormComponent } from './book-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AsyncValidatorFn, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
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
describe('BookFormsComponent', () => {
  let component: BookFormComponent;
  let fixture: ComponentFixture<BookFormComponent>;
  let validatorService = jasmine.createSpyObj<BodosValidatorService>(
    'validatorSpy',
    ['asyncIsbnExistsValidator', 'checkIsbn', 'checkAuthors']
  );

  async function prepareTests() {
    validatorService.asyncIsbnExistsValidator = jasmine
      .createSpy<() => AsyncValidatorFn>()
      .and.returnValue(() => of({ isbnExists: { valid: false } }));
    validatorService.checkIsbn = jasmine.createSpy().and.returnValue(null);
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

  describe('with existing book and AsyncValidatorFn that returns a isbnExists-Error', () => {
    beforeEach(async () => {
      await prepareTests();
      component.isNew = false;
    });
    it(
      ' form should be valid and emit the new book data to the saveBookEventEmitter Output emitter' +
        'if a book is given to ngOnChanges',
      () => {
        expect(component).toBeTruthy();
        spyOn(component.saveBookEventEmitter, 'emit');
        fixture.detectChanges(); // only if component.isNew || component.book , there is a button!
        //directly call ngOnChanges
        component.book = testBookData;
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
    it(
      'form should be valid and emit the new book data to the saveBookEventEmitter Output emitter' +
        'if a book is given in advance to the component before ngOnInit is run',
      () => {
        expect(component).toBeTruthy();
        component.book = testBookData;
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
    it('should add an author ', () => {
      fixture.detectChanges();
      expect(component).toBeTruthy();
      spyOn(component.saveBookEventEmitter, 'emit');
      spyOn(component, 'addAuthor').and.callThrough();
      component.book = testBookData;
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
  });

  describe('with new book and AsyncValidatorFn that returns a isbnExists-Error', () => {
    beforeEach(async () => {
      await prepareTests();
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
      expect(component.isbn?.dirty).toBeTrue();
      expect(isbnContr?.dirty).toBeTruthy();
      expect(isbnContr?.valid).toBeFalse();
    });
    it('should call bookFormSaveBook method, when button is clicked, but not emit Event if Form is not valid', () => {
      spyOn(component, 'bookFormSaveBook').and.callThrough();
      spyOn(component.saveBookEventEmitter, 'emit');
      spyOn(console, 'error');
      const buttonEl = fixture.debugElement.query(By.css('button')); //throws an Error but is catched internally;
      spyOn(buttonEl.nativeElement, 'click').and.callThrough();

      buttonEl.nativeElement.click();

      expect(component.bookFormSaveBook).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(component.saveBookEventEmitter.emit).toHaveBeenCalledTimes(0);
    });
  });
  describe('with new book and AsyncValidatorFn that returns no errors', () => {
    beforeEach(async () => {
      await prepareTests();
      validatorService.asyncIsbnExistsValidator = jasmine
        .createSpy<() => AsyncValidatorFn>()
        .and.returnValue(() => of({}));
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
      // assert
      expect(component.editForm.valid).toBeTrue();
      // act
      const buttonEl = fixture.debugElement.query(By.css('button'));
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
});
