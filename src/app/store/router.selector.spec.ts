import { RouterFactory } from './router.factory.spec';
import { mockState } from './index.spec';
import { selectLoaderState, selectPageLoading } from './router.selectors';
import { LoaderState } from './router.reducer';

describe('router selectors', () => {
  const routerFactory = new RouterFactory();
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
