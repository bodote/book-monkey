import { CustomRouterStateSerializer } from './custom-router-state-serializer';
import { Params, RouterStateSnapshot } from '@angular/router';

interface MockActiveStateSnapshot {
  queryParams?: Params;
  params?: Params;
  firstChild: MockActiveStateSnapshot | null;
}

interface MockRouterStateSnapshot {
  url: string;
  root: MockActiveStateSnapshot;
}

describe('CustomRouterStateSerializer', () => {
  const rStateSn: MockRouterStateSnapshot = {
    url: 'this-is-url',
    root: {
      queryParams: {},
      firstChild: {
        firstChild: null,
        params: {}
      }
    }
  };

  it('should initialize', () => {
    const customRouterStateSerializer = new CustomRouterStateSerializer();
    const state = customRouterStateSerializer.serialize(
      rStateSn as RouterStateSnapshot
    );
    expect(state).toBeDefined();
    expect(state).toEqual(
      jasmine.objectContaining({
        url: 'this-is-url',
        params: jasmine.anything(),
        queryParams: jasmine.anything()
      })
    );
  });
});
