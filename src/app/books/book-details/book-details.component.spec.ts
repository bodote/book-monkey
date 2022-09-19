import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDetailsComponent } from './book-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BookListComponent } from '../book-list/book-list.component';
import { Observable, of, throwError } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { BookStoreService } from '../../shared/book-store.service';
import { Book } from '../../shared/book';
import { IsbnPipe } from '../shared/isbn.pipe';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
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

describe('BookDetailsComponent and IsbnPipe', () => {
  let component: BookDetailsComponent;
  let fixture: ComponentFixture<BookDetailsComponent>;
  let testScheduler: TestScheduler;
  let route: ActivatedRoute;
  let router: Router;

  const theError = new HttpErrorResponse({ status: 404 });
  let mockService = jasmine.createSpyObj<BookStoreService>('bookStoreService', [
    'getBook',
    'deleteBook'
  ]);
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookDetailsComponent, IsbnPipe],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'detail/:isbn', component: BookDetailsComponent },
          { path: 'detail/wrong', component: BookDetailsComponent },
          { path: 'list', component: BookListComponent }
        ])
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: BookStoreService, useValue: mockService }]
    }).compileComponents();
    testScheduler = new TestScheduler((actual, expected) => {
      // asserting the two objects are equal - required
      expect(actual).toEqual(expected);
    });
    fixture = TestBed.createComponent(BookDetailsComponent);
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('when initializes properly', () => {
    const params = {
      get: () => {
        return '1234567890';
      }
    } as unknown as ParamMap;
    beforeEach(async () => {
      mockService.getBook = jasmine
        .createSpy<() => Observable<Book>>()
        .and.returnValue(of(testBookData));
    });
    it(
      'should subscribe to route.paramMap onInit() and get the isbn param ' +
        'and get the book with that isbn from bookstoreService' +
        'and show all the book details on screen including some buttons and show ISBN with a dash',
      () => {
        let propertySpy = spyOnProperty(
          route,
          'paramMap',
          'get'
        ).and.returnValue(of(params));
        fixture.detectChanges(); // should call ngOnInit()
        expect(propertySpy).toHaveBeenCalledTimes(1);
        expect(mockService.getBook).toHaveBeenCalledTimes(1);
        expect(component.book).toEqual(testBookData);

        let debugElements = fixture.debugElement.queryAll(
          By.directive(RouterLink)
        );
        let index = debugElements.findIndex((de) => {
          return (
            de.attributes['ng-reflect-router-link'] === '/admin/edit,1234567890'
          );
        });
        expect(index).toBeGreaterThan(-1);
        index = debugElements.findIndex((de) => {
          return de.attributes['ng-reflect-router-link'] === '/books/list';
        });
        expect(index).toBeGreaterThan(-1);
        debugElements = fixture.debugElement.queryAll(By.css('div>div>button'));
        index = debugElements.findIndex((de) => {
          return de.nativeElement.textContent.indexOf('Delete') != -1;
        });
        expect(index).toBeGreaterThan(-1);
        index = debugElements.findIndex((de) => {
          return de.nativeElement.textContent.indexOf('Next') != -1;
        });
        expect(index).toBeGreaterThan(-1);
        let debugElement = fixture.debugElement.query(By.css('div#isbn'));
        expect(
          debugElement.nativeElement.textContent.indexOf('123-4567890')
        ).toBeGreaterThan(-1); //check ISBN-Pipe
        debugElement = fixture.debugElement.query(By.css('#published'));
        //debugElement.query(By.css('div[name="my-name"]'));
        expect(
          debugElement.nativeElement.textContent.indexOf('published')
        ).toBeGreaterThan(-1); //check ISBN-Pipe
      }
    );
    it(
      'should contain delete-button, and when clicked  ' +
        'should call component.delete(isbn)',
      () => {
        spyOnProperty(route, 'paramMap', 'get').and.returnValue(of(params));
        spyOn(component, 'delete');
        fixture.detectChanges(); // should call ngOnInit()
        let debugElements = fixture.debugElement.queryAll(
          By.css('div>div>button')
        );
        let index = debugElements.findIndex((de) => {
          return de.nativeElement.textContent.indexOf('Delete') != -1;
        });
        expect(index).toBeGreaterThan(-1);
        debugElements[index].nativeElement.click();
        expect(component.delete).toHaveBeenCalledOnceWith('1234567890');
      }
    );
    it(
      'should subscribe a to a confirmation window, and call this.bookService.deleteBook(isbn)' +
        ' if the confirmation is true, and show an error when the bookService.deleteBook() is called and it does not succeede',
      () => {
        spyOnProperty(route, 'paramMap', 'get').and.returnValue(of(params));
        fixture.detectChanges(); // should call ngOnInit()
        //arrange
        spyOn(window, 'confirm').and.returnValue(true);
        mockService.deleteBook = jasmine
          .createSpy<() => Observable<string>>()
          .and.returnValue(throwError(() => theError));

        expect(component.book).toBeDefined();
        //act
        component.delete('1234567890');
        expect(mockService.deleteBook).toHaveBeenCalledOnceWith('1234567890');
        //expect(component.error).toBeDefined();
        expect(window.confirm).toHaveBeenCalledOnceWith('Really delete book?');
        expect(component.book).toBeDefined();
        fixture.detectChanges();
        const debugElement = fixture.debugElement.query(
          By.css('div.container div.alert')
        );
        expect(debugElement.nativeElement.textContent).toContain(
          '"status": 404'
        );
      }
    );

    it(
      'should subscribe a to a confirmation window, and NOT call this.bookService.deleteBook(isbn)' +
        ' if the confirmation is false, ',
      () => {
        spyOnProperty(route, 'paramMap', 'get').and.returnValue(of(params));
        spyOn(component, 'reallyDelete');
        fixture.detectChanges(); // should call ngOnInit()
        //arrange
        spyOn(window, 'confirm').and.returnValue(false);
        mockService.deleteBook = jasmine
          .createSpy<() => Observable<string>>()
          .and.returnValue(throwError(() => theError));

        expect(component.book).toBeDefined();
        //act
        component.delete('1234567890');
        expect(mockService.deleteBook).toHaveBeenCalledTimes(0);
        expect(component.reallyDelete).toHaveBeenCalledTimes(0);
      }
    );
  });
  it(
    'should subscribe to route.paramMap onInit() and get the isbn param ' +
      'and show the error html if  bookstoreService returns an error',
    () => {
      // const params = {
      //   get: () => {
      //     return '1234567890';
      //   }
      // } as unknown as ParamMap;
      const params = jasmine.createSpyObj<ParamMap>('paramMap', ['get']);
      params.get = jasmine
        .createSpy<(a: string) => string>()
        .and.returnValue('12345567');
      mockService.getBook = jasmine
        .createSpy<() => Observable<Book>>()
        .and.returnValue(throwError(() => theError));
      let propertySpy = spyOnProperty(route, 'paramMap', 'get').and.returnValue(
        of(params)
      );
      fixture.detectChanges(); // should call ngOnInit()
      expect(propertySpy).toHaveBeenCalledTimes(1);
      expect(params.get).toHaveBeenCalledOnceWith('isbn');
      expect(mockService.getBook).toHaveBeenCalledTimes(1);
      // expect(JSON.stringify(component.error)).toContain('"status":404');
      // expect(component.error?.status).toBeGreaterThan(299);
      fixture.detectChanges();

      const debugElement = fixture.debugElement.query(By.css('div.alert'));
      expect(debugElement.nativeElement.textContent).toContain('"status": 404');
    }
  );

  it(
    "should log  an error to console and reroute to /home, if it tries to subscribe to route.paramMap onInit() and don't get the isbn param " +
      '',
    async () => {
      const params = {
        get: () => {
          return null;
        }
      } as unknown as ParamMap;
      spyOn(console, 'error');
      spyOn(router, 'navigate').and.callThrough();
      mockService.getBook = jasmine
        .createSpy<() => Observable<Book>>()
        .and.returnValue(of({} as Book));
      let x = jasmine.createSpyObj({ basename: [], propertyNames: ['isbn'] });
      //spyOn(params, 'get').and.returnValue('1234567');
      let propertySpy = spyOnProperty(route, 'paramMap', 'get').and.returnValue(
        of(params)
      );
      fixture.detectChanges(); // should call ngOnInit()
      await fixture.whenStable();
      expect(propertySpy).toHaveBeenCalledTimes(1);

      expect(mockService.getBook).toHaveBeenCalledTimes(0);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        'no isbn param found in route, rerouting to /home (should actually route to an error page) '
      );
      expect(router.navigate).toHaveBeenCalledOnceWith(['/home']);
    }
  );

  it(
    'should subscribe a to a confirmation window, and call this.bookService.deleteBook(isbn)' +
      ' if the confirmation is true, and navigate to "/books/list" when the bookService.deleteBook() is called and it succeeds',
    () => {
      //arrange
      spyOn(window, 'confirm').and.returnValue(true);
      mockService.deleteBook = jasmine
        .createSpy<() => Observable<string>>()
        .and.returnValue(of('OK'));
      spyOn(router, 'navigate');
      //act
      component.delete('1234567890');
      expect(mockService.deleteBook).toHaveBeenCalledOnceWith('1234567890');
      expect(router.navigate).toHaveBeenCalledOnceWith(['/books/list']);
    }
  );

  it(
    "should call window.confirm(message || 'Is it OK?') if component.confirm is called " +
      ' return an observable of true| false ',
    () => {
      testScheduler.run((helpers) => {
        const { expectObservable } = helpers;
        //arrange
        spyOn(window, 'confirm').and.returnValue(true);
        //act + assert:
        expectObservable(component.confirm(component.confirmMessage)).toEqual(
          of(true)
        );
      });
    }
  );
});
