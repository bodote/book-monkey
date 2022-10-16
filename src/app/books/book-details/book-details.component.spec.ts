import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDetailsComponent } from './book-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BookListComponent } from '../book-list/book-list.component';
import { Observable, of } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IsbnPipe } from '../shared/isbn.pipe';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpErrorResponse } from '@angular/common/http';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from '../../store';
import {
  BookFactory,
  mockStateWithBooksEntities
} from '../store/book-entity/book.factory.spec';
import { provideMockActions } from '@ngrx/effects/testing';
import { TypedAction } from '@ngrx/store/src/models';
import {
  selectCurrentBook,
  selectErrorState
} from '../store/book-entity/book-entity.selectors';
import { BookEditComponent } from '../../admin/book-edit/book-edit.component';
import { Location } from '@angular/common';
import {
  deleteBookEntity,
  resetErrorsAction
} from '../store/book-entity/book-entity.actions';
import { NotificationAlertComponent } from '../../shared/notification-alert/notification-alert.component';

describe('BookDetailsComponent and IsbnPipe', () => {
  let component: BookDetailsComponent;
  let fixture: ComponentFixture<BookDetailsComponent>;
  let testScheduler: TestScheduler;
  let route: ActivatedRoute;
  let router: Router;
  let actions$: Observable<TypedAction<any>>;
  let store: MockStore;
  let selectSpy: jasmine.Spy<any>;
  let dispatchSpy: jasmine.Spy<any>;
  const factory = new BookFactory();
  const httpError = new HttpErrorResponse({ status: 404 });
  const bookEntityState = factory.stateWith2Books();
  const firstB = factory.getBooksFromState(bookEntityState)[0];
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        BookDetailsComponent,
        NotificationAlertComponent,
        IsbnPipe
      ],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'detail/:isbn', component: BookDetailsComponent },
          { path: 'admin/edit/:isbn', component: BookEditComponent },
          { path: 'detail/wrong', component: BookDetailsComponent },
          { path: 'list', component: BookListComponent }
        ])
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        provideMockActions(() => actions$),
        provideMockStore<AppState>({
          initialState: mockStateWithBooksEntities()
        })
      ]
    }).compileComponents();
    testScheduler = new TestScheduler((actual, expected) => {
      // asserting the two objects are equal - required
      expect(actual).toEqual(expected);
    });
    route = TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    store = TestBed.inject(MockStore);
    selectSpy = spyOn(store, 'select');
    dispatchSpy = spyOn(store, 'dispatch');
    selectSpy.and.callThrough();
    fixture = TestBed.createComponent(BookDetailsComponent);
    location = TestBed.inject(Location);
    router.initialNavigation();
    component = fixture.componentInstance;
  });

  it('should create and subscribe to store', () => {
    store.setState(mockStateWithBooksEntities(bookEntityState));
    expect(component).toBeTruthy();
    fixture.detectChanges();
    expect(selectSpy).toHaveBeenCalledTimes(2);
    expect(selectSpy).toHaveBeenCalledWith(selectCurrentBook);
    expect(selectSpy).toHaveBeenCalledWith(selectErrorState);
  });
  it(
    'should show  http errors if any  and if clicked on close,' +
      ' the error message should disapear',
    (done) => {
      store.setState(
        mockStateWithBooksEntities({
          httpError,
          lastUpdateTS: 1
        })
      );
      fixture.detectChanges();
      let errorElement = fixture.debugElement.query(
        By.css('[data-id="error-element"]')
      );
      expect(errorElement).toBeTruthy();
      let closeBtn = fixture.debugElement.query(By.css('[data-id="closeBtn"]'));
      expect(closeBtn).toBeTruthy();
      closeBtn.triggerEventHandler('click');
      expect(dispatchSpy).toHaveBeenCalledOnceWith(resetErrorsAction());
      store.setState(mockStateWithBooksEntities({}));
      fixture.detectChanges();
      fixture.whenStable().then(() => {
        closeBtn = fixture.debugElement.query(By.css('[data-id="closeBtn"]'));
        expect(closeBtn).toBeFalsy();
        done();
      });
    }
  );

  it('should show a book title an isbn number', () => {
    store.setState(mockStateWithBooksEntities(bookEntityState));
    fixture.detectChanges();
    const titleElement = fixture.debugElement.query(
      By.css('[data-id="title"]')
    );
    expect(titleElement.nativeElement.textContent).toContain(firstB.title);
    const isbnElement = fixture.debugElement.query(By.css('[data-id="isbn"]'));
    expect(isbnElement.nativeElement.textContent).toContain(
      firstB.isbn.slice(0, 3) + '-' + firstB.isbn.slice(3)
    );
    let debugElements = fixture.debugElement.queryAll(By.directive(RouterLink));
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
  });

  it(
    'should  have edit-button ' + 'when clicked, naviate to targetURL',
    (done) => {
      store.setState(mockStateWithBooksEntities(bookEntityState));
      fixture.detectChanges();
      const editButton = fixture.debugElement.query(
        By.css('[data-cy="editBtn"]')
      );
      expect(editButton).toBeTruthy();
      editButton.triggerEventHandler('click');
      fixture.whenStable().then(() => {
        expect(location.path()).toEqual('/admin/edit/' + firstB.isbn);
        done();
      });
    }
  );

  it(
    ' when click on delete, it should subscribe a to a confirmation window,' +
      ' and call this.book .deleteBook(isbn)' +
      ' if the confirmation is true, and navigate to "/books/list" when the book .deleteBook() is called and it succeeds',
    (done) => {
      //arrange
      const windowsSpy = spyOn(window, 'confirm').and.returnValue(true);
      spyOn(router, 'navigate');
      store.setState(mockStateWithBooksEntities(bookEntityState));
      fixture.detectChanges();
      const deleteButton = fixture.debugElement.query(
        By.css('[data-cy="deleteBtn"]')
      );
      //act
      deleteButton.nativeElement.click();
      fixture.whenStable().then(() => {
        expect(windowsSpy).toHaveBeenCalledOnceWith('Really delete book?');
        expect(dispatchSpy).toHaveBeenCalledOnceWith(
          deleteBookEntity({ id: firstB.isbn })
        );
        expect(router.navigate).toHaveBeenCalledOnceWith(['/books/list']);
        done();
      });
    }
  );

  it(
    ' when click on delete, it should subscribe a to a confirmation window,' +
      ' and NOT call this.book .deleteBook(isbn)' +
      ' if the confirmation is false, and NOT navigate to "/books/list" ',
    (done) => {
      //arrange
      const windowsSpy = spyOn(window, 'confirm').and.returnValue(false);
      spyOn(router, 'navigate');
      store.setState(mockStateWithBooksEntities(bookEntityState));
      fixture.detectChanges();
      const deleteButton = fixture.debugElement.query(
        By.css('[data-cy="deleteBtn"]')
      );
      //act
      deleteButton.nativeElement.click();
      fixture.whenStable().then(() => {
        expect(windowsSpy).toHaveBeenCalledOnceWith('Really delete book?');
        expect(dispatchSpy).not.toHaveBeenCalled();
        expect(router.navigate).not.toHaveBeenCalled();
        done();
      });
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
