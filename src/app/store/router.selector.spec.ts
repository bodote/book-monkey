import { RouterFactory } from './router.factory.spec';
import { mockState } from './index.spec';
import { selectLoaderState, selectPageLoading } from './router.selectors';
import { LoaderState } from './router.reducer';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppState, ROOT_REDUCERS } from './index';
import { Store, StoreModule } from '@ngrx/store';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { AppComponent } from '../app.component';

describe('router selectors', () => {
  const routerFactory = new RouterFactory();

  describe('router state', () => {
    let store: MockStore;
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [AppComponent],
        imports: [],
        schemas: [NO_ERRORS_SCHEMA], // NEU
        providers: [provideMockStore<AppState>({ initialState: mockState() })]
      }).compileComponents();
      store = TestBed.inject(MockStore);
    });
    it('should contain router key in the  store', () => {
      const mystate = (store as any).initialState;
      const stateKeys = Object.keys(mystate);
      expect(stateKeys).toContain('router');
    });
  });
  xdescribe('router state real router', () => {
    let store: Store;
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        declarations: [AppComponent],
        imports: [
          RouterModule.forRoot(
            [
              {
                path: '',
                redirectTo: '/home',
                pathMatch: 'full'
              }
            ],
            {
              preloadingStrategy: PreloadAllModules,
              enableTracing: false,
              scrollPositionRestoration: 'disabled'
            }
          ),
          StoreModule.forRoot(ROOT_REDUCERS, {})
        ],
        schemas: [NO_ERRORS_SCHEMA], // NEU
        providers: []
      }).compileComponents();
      store = TestBed.inject(Store);
      fixture = TestBed.createComponent(AppComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });
    xit('should contain router key in the  store', (done) => {
      // store.select(selectRouterState).subscribe((value) => {
      //   //expect(value).toBeDefined()  // Doesn't work yet
      //   done();
      // });
    });
  });

  it('should router state', () => {
    //TODO: check that "router" is indead the key for the router - state
  });
  it('should select feature  loader state and initial loading-state=false', () => {
    const loaderState: LoaderState = routerFactory.loaderState({
      loading: false
    });
    const rootState = mockState({ loader: loaderState });
    expect(selectLoaderState(rootState)).toEqual(loaderState);
    expect(selectPageLoading(rootState)).toEqual(loaderState.loading);
  });
  it('should select   loader state with true', () => {
    const loaderState: LoaderState = routerFactory.loaderState({
      loading: true
    });
    const rootState = mockState({ loader: loaderState });
    expect(selectLoaderState(rootState)).toEqual(loaderState);
    expect(selectPageLoading(rootState)).toEqual(loaderState.loading);
  });
});
