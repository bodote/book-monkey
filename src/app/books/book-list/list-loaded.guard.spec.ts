import { TestBed } from '@angular/core/testing';

import { ListLoadedGuard } from './list-loaded.guard';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from '../../store';
import { mockStateWithBooksEntities } from '../store/book-entity/book.factory.spec';
import { RouterTestingModule } from '@angular/router/testing';
import { BookListComponent } from './book-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';

describe('ListLoadedGuard', () => {
  let guard: ListLoadedGuard;
  let store: MockStore;
  let router: Router;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookListComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          {
            path: 'list',
            component: BookListComponent,
            canActivate: [ListLoadedGuard]
          }
        ])
      ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        provideMockStore<AppState>({
          initialState: mockStateWithBooksEntities()
        })
      ]
    }).compileComponents();
    guard = TestBed.inject(ListLoadedGuard);
    store = TestBed.inject(MockStore);
    router = TestBed.inject(Router);
  });
  xit('should be created', (done) => {
    expect(store).toBeTruthy();
    expect(guard).toBeTruthy();
    expect(router).toBeTruthy();
    const canActivate$ = guard.canActivate(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot
    );
    canActivate$.subscribe((canActivate) => {
      expect(canActivate).toBeTrue();
      done();
    });
  });
});
