import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import { CreateBookComponent } from './create-book.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BookStoreService } from '../../shared/book-store.service';
import { Observable, of, throwError } from 'rxjs';
import { Book } from '../../shared/book';
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

describe('CreateBookComponent', () => {
  let component: CreateBookComponent;
  let fixture: ComponentFixture<CreateBookComponent>;
  let mockService = jasmine.createSpyObj<BookStoreService>('bookStoreService', [
    'postBook'
  ]);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateBookComponent],
      imports: [HttpClientTestingModule],
      providers: [{ provide: BookStoreService, useValue: mockService }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create, set "save" to true for 5 sec and set successmessage to the result', fakeAsync(() => {
    //arrange
    mockService.postBook = jasmine
      .createSpy<() => Observable<string>>()
      .and.returnValue(of('OK'));
    expect(component).toBeTruthy();
    expect(component.saved).toBeFalse();
    //act
    component.createBookSave(testBookData);
    //assert
    expect(mockService.postBook).toHaveBeenCalledOnceWith(testBookData);
    expect(component.saved).toBeTrue();
    expect(component.successMsg).toEqual('OK');
    tick(5001);
    expect(component.saved).toBeFalse();
  }));
  xit('should create, set errorMsg ', () => {
    //arrange
    spyOn(console, 'error');
    const errorObservable$ = throwError(() => {
      return new HttpErrorResponse({ status: 404 });
    });
    mockService.postBook = jasmine
      .createSpy<() => Observable<string>>()
      .and.returnValue(errorObservable$);
    //act
    component.createBookSave(testBookData);
    //assert
    expect(mockService.postBook).toHaveBeenCalledOnceWith(testBookData);
    // expect(component.errorMessage).toContain('404');
    expect((console.error as jasmine.Spy).calls.mostRecent().args[0]).toContain(
      'ERROR in createBookSave:'
    );
    expect(component.successMsg?.length).toEqual(0);
    expect(component.saved).toBeFalse();
    expect(console.error).toHaveBeenCalledTimes(1);
  });
  xit('should unsubscribe when component is disposed ', () => {
    //arrange
    spyOn(component, 'ngOnDestroy').and.callThrough();

    mockService.postBook = jasmine
      .createSpy<() => Observable<string>>()
      .and.returnValue(of('OK'));

    //act
    component.createBookSave(testBookData);
    // if (component.subscription)
    //   spyOn(component.subscription, 'unsubscribe').and.callThrough();
    // //assert
    // expect(mockService.postBook).toHaveBeenCalledOnceWith(testBookData);
    // //act
    // component.ngOnDestroy();
    // //assert
    // expect(component.ngOnDestroy).toHaveBeenCalledTimes(1);
    // expect(component.subscription?.closed).toBeTrue();
    // expect(component.subscription?.unsubscribe).toHaveBeenCalled();
  });
});
