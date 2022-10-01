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
import { By } from '@angular/platform-browser';

xdescribe('BookEditComponent', () => {
  let component: BookEditComponent;
  let fixture: ComponentFixture<BookEditComponent>;
  let bookStoreMock: Partial<BookStoreService>;
  let book: Book;
  const aTitle = 'The Book Title';
  let route: ActivatedRoute;
  const httpError404 = new HttpErrorResponse({ status: 404 });
  const expectedSaveBookError = 'ERROR in http.put saveBook: ';
  xdescribe('but  isbn number does not exist and service thorws an error ', () => {
    beforeEach(async () => {
      book = {
        title: aTitle,
        authors: [],
        published: new Date(),
        isbn: ''
      };
      bookStoreMock = {
        getBook: jasmine.createSpy().and.returnValue(
          throwError(() => {
            return httpError404;
          })
        )
      };
      expect(bookStoreMock.getBook).not.toHaveBeenCalled();
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
    it('should  show an error if isbn number does not exist ', fakeAsync(() => {
      let paramMapGetSpy = jasmine.createSpyObj<ParamMap>('paramMap.get()', [
        'get'
      ]);
      paramMapGetSpy.get.and.returnValue('123');
      const routeParamMap = spyOnProperty(route, 'paramMap').and.returnValue(
        of(paramMapGetSpy)
      );
      fixture.detectChanges();
      expect(routeParamMap).toHaveBeenCalledOnceWith();
      expect(paramMapGetSpy.get).toHaveBeenCalledOnceWith('isbn');
      expect(bookStoreMock.getBook).toHaveBeenCalledOnceWith('123');
      tick(0); // since the error gets displayed in the next change detection cycle
      fixture.detectChanges();
      const errorMessage = fixture.debugElement.query(
        By.css('span#errorMessage')
      );
      expect(errorMessage.nativeElement.textContent).toEqual(
        httpError404.message
      );
    }));
  });
  describe('but  isbn number does not exist and service thorws NO error but an empty response ', () => {
    beforeEach(async () => {
      book = {
        title: aTitle,
        authors: [],
        published: new Date(),
        isbn: ''
      };
      bookStoreMock = {
        getBook: jasmine.createSpy().and.returnValue(of({} as Book))
      };
      expect(bookStoreMock.getBook).not.toHaveBeenCalled();
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
    it('should  show an error if isbn number does not exist ', fakeAsync(() => {
      let paramMapGetSpy = jasmine.createSpyObj<ParamMap>('paramMap.get()', [
        'get'
      ]);
      paramMapGetSpy.get.and.returnValue('123');
      const routeParamMap = spyOnProperty(route, 'paramMap').and.returnValue(
        of(paramMapGetSpy)
      );
      fixture.detectChanges();
      expect(routeParamMap).toHaveBeenCalledOnceWith();
      expect(paramMapGetSpy.get).toHaveBeenCalledOnceWith('isbn');
      expect(bookStoreMock.getBook).toHaveBeenCalledOnceWith('123');
      tick(0); // since the error gets displayed in the next change detection cycle
      fixture.detectChanges();
      const errorMessage = fixture.debugElement.query(
        By.css('span#errorMessage')
      );
      expect(errorMessage.nativeElement.textContent).toContain(
        'HTTP-Error-Response:'
      );
    }));
  });
  describe('with existing isbn number', () => {
    beforeEach(async () => {
      book = {
        title: aTitle,
        authors: [],
        published: new Date(),
        isbn: ''
      };
      bookStoreMock = {
        putBook: jasmine.createSpy().and.returnValue(of('OK')),
        getBook: jasmine.createSpy().and.returnValue(of(book))
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
    it('should create component and should call bookStoreService.get() with ISBN number on ngOnInit()', fakeAsync(() => {
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
      tick(1);
      fixture.detectChanges();

      const errorMessage = fixture.debugElement.query(
        By.css('span#errorMessage')
      );
      expect(errorMessage).toBeNull();
    }));
    it('to save a book, it should call bookstoreservice and subscribe on saveBook(), success case', fakeAsync(() => {
      fixture.detectChanges();
      //arrange
      bookStoreMock.putBook = jasmine.createSpy().and.returnValue(of('OK'));
      //act
      component.saveBook(book);
      tick(3000);
      //assert
      expect(bookStoreMock.putBook).toHaveBeenCalledOnceWith(book);
      // expect(component.saved).toEqual(true);
      expect(component.successMsg).toEqual('OK');
      tick(3000);
      // expect(component.saved).toEqual(false);
    }));
    it('should call bookstoreservice and subscribe on saveBook() , error case', fakeAsync(() => {
      //arrange
      fixture.detectChanges();
      spyOn(console, 'error');
      const errorObservable$ = throwError(() => {
        return new HttpErrorResponse({ status: 404 });
      });
      bookStoreMock.putBook = jasmine
        .createSpy()
        .and.returnValue(errorObservable$);
      //act
      component.saveBook(book);

      tick(1); // since the error gets displayed in the next change detection cycle

      fixture.detectChanges();
      //assert
      expect(console.error).toHaveBeenCalledTimes(1);
      const args = (console.error as jasmine.Spy).calls.allArgs()[0][0]; //calls.mostRecent().args[0];
      expect(args).toContain(expectedSaveBookError);
      expect(args).toContain('404');
      expect(bookStoreMock.putBook).toHaveBeenCalledOnceWith(book);
      // expect(component.saved).toEqual(false);
      expect(component.successMsg.length).toEqual(0);

      const errorMessage = fixture.debugElement.query(
        By.css('span#errorMessage')
      );
      expect(errorMessage.nativeElement.textContent).toEqual(
        httpError404.message
      );
    }));
  });
});
