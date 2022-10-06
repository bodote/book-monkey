import { reducer } from './router.reducer';
import { RouterFactory } from './router.factory.spec';
import {
  routerCancelAction,
  routerErrorAction,
  routerNavigatedAction,
  routerNavigationAction
} from '@ngrx/router-store';

describe('Router Reducer', () => {
  let routerFactory = new RouterFactory();
  describe('an unknown action', () => {
    it('should have loading=false initially', () => {
      const testState = routerFactory.loaderState({});
      expect(testState.loading).toBeFalse();
    });
    it('should return the previous false state', () => {
      const action = {} as any;
      const testState = routerFactory.loaderState({ loading: false });
      const result = reducer(testState, action);
      expect(result).toBe(testState);
    });
    it('should return the previous true state', () => {
      const action = {} as any;
      const testState = routerFactory.loaderState({ loading: true });
      const result = reducer(testState, action);
      expect(result).toBe(testState);
    });
  });
  describe('an routerCancelAction action', () => {
    it('should return the previous false state', () => {
      const action = routerCancelAction;
      const testState = routerFactory.loaderState({ loading: false });
      const result = reducer(testState, action);
      expect(result).toEqual(testState);
    });
    it('should return the previous true state', () => {
      const action = routerCancelAction;
      const testState = routerFactory.loaderState({ loading: true });
      const result = reducer(testState, action);
      expect(result).toEqual(routerFactory.loaderState({ loading: false }));
    });
  });
  describe('an routerErrorAction action', () => {
    it('should  false state', () => {
      const action = routerErrorAction;
      const testState = routerFactory.loaderState({ loading: false });
      const result = reducer(testState, action);
      expect(result).toEqual(testState);
    });
    it('should change the previous true state to false', () => {
      const action = routerErrorAction;
      const testState = routerFactory.loaderState({ loading: true });
      const result = reducer(testState, action);
      expect(result).toEqual(routerFactory.loaderState({ loading: false }));
    });
  });
  describe('an routerNavigatedAction action', () => {
    it('should  false state', () => {
      const action = routerNavigatedAction;
      const testState = routerFactory.loaderState({ loading: false });
      const result = reducer(testState, action);
      expect(result).toEqual(testState);
    });
    it('should change the previous true state to false', () => {
      const action = routerNavigatedAction;
      const testState = routerFactory.loaderState({ loading: true });
      const result = reducer(testState, action);
      expect(result).toEqual(routerFactory.loaderState({ loading: false }));
    });
  });
  describe('an routerNavigationAction action', () => {
    const loaderTrue = routerFactory.loaderState({ loading: true });
    const loaderFalse = routerFactory.loaderState({ loading: false });
    const parameters = [
      {
        description: 'should change the previous  state to true',
        input: { action: routerNavigationAction, state: loaderFalse },
        output: loaderTrue
      },
      {
        description: 'should keep loader state true',
        input: { action: routerNavigationAction, state: loaderTrue },
        output: loaderTrue
      }
    ];
    parameters.forEach((param) => {
      it(param.description, () => {
        const result = reducer(param.input.state, param.input.action);
        expect(result).toEqual(param.output);
      });
    });
  });
});
