import { RouterFactory } from './router.factory.spec';
import { mockState } from './index.spec';
import { selectLoaderState, selectPageLoading } from './router.selectors';
import { LoaderState } from './router.reducer';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppState } from './index';
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
