import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import { BookEditComponent } from './book-edit.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BookDetailsComponent } from '../../books/book-details/book-details.component';
import { BookStoreService } from '../../shared/book-store.service';
import { Book } from '../../shared/book';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, ParamMap } from '@angular/router';

describe('BookEditComponent', () => {
  let component: BookEditComponent;
  let fixture: ComponentFixture<BookEditComponent>;
  let bookStoreMock: Partial<BookStoreService>;
  let book: Book;

  let route: ActivatedRoute;

  beforeEach(async () => {
    book = {
      title: 'string',
      authors: [],
      published: new Date(),
      isbn: ''
    };
    bookStoreMock = {
      putBook: jasmine.createSpy().and.returnValue(of('OK')),
      getBook: jasmine.createSpy().and.returnValue(of([book]))
    };
    expect(bookStoreMock.putBook).not.toHaveBeenCalled();

    await TestBed.configureTestingModule({
      declarations: [BookEditComponent],
      schemas: [NO_ERRORS_SCHEMA], // NEU
      imports: [
        //HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          { path: 'detail/:isbn', component: BookDetailsComponent }
        ])
      ],
      providers: [
        {
          provide: BookStoreService,
          useValue: bookStoreMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookEditComponent);
    component = fixture.componentInstance;

    route = TestBed.inject(ActivatedRoute);
  });

  it('should create component and should ball bookStoreService.get() with ISBN number on ngOnInit()', () => {
    let paramMapGetSpy = jasmine.createSpyObj<ParamMap>('paramMap.get()', [
      'get'
    ]);
    paramMapGetSpy.get.and.returnValue('123');
    const routeParamMap = spyOnProperty(route, 'paramMap').and.returnValue(
      of(paramMapGetSpy)
    );
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(routeParamMap).toHaveBeenCalledOnceWith();
    expect(paramMapGetSpy.get).toHaveBeenCalledOnceWith('isbn');
    expect(bookStoreMock.getBook).toHaveBeenCalledOnceWith('123');
  });
  it('to save a book, it should call bookstoreservice and subscribe on saveBook(), success case', fakeAsync(() => {
    fixture.detectChanges();
    //arrange
    bookStoreMock.putBook = jasmine.createSpy().and.returnValue(of('OK'));
    //act
    component.saveBook(book);
    tick(3000);
    //assert
    expect(bookStoreMock.putBook).toHaveBeenCalledOnceWith(book);
    expect(component.saved).toEqual(true);
    expect(component.successMsg).toEqual('OK');
    tick(3000);
    expect(component.saved).toEqual(false);
  }));

  it('should call bookstoreservice and subscribe on saveBook() , error case', fakeAsync(() => {
    //arrange
    spyOn(console, 'error');
    const errorObservable$ = throwError(() => {
      return new HttpErrorResponse({ status: 404 });
    });
    bookStoreMock.putBook = jasmine
      .createSpy()
      .and.returnValue(errorObservable$);
    //act
    component.saveBook(book);
    tick(1);
    //assert
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(bookStoreMock.putBook).toHaveBeenCalledOnceWith(book);
    expect(component.saved).toEqual(false);
    expect(component.successMsg.length).toEqual(0);
    expect(component.errorMessage.length).toBeGreaterThan(3);
    expect(component.errorMessage).toContain('404');
  }));
});
