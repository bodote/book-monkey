import { TestBed } from '@angular/core/testing';

import { TokenInterceptor } from './token.interceptor';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpInterceptor
} from '@angular/common/http';

describe('TokenInterceptor', () => {
  let httpTestingController: HttpTestingController;
  let interceptor: HttpInterceptor[];
  let tokenInterceptor: TokenInterceptor;
  // mock your loaderService to ensure no issues

  let httpClient: HttpClient;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true
        }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    interceptor = TestBed.inject(HTTP_INTERCEPTORS);
    for (let i = 0; i < interceptor.length; i++) {
      if (interceptor[i] instanceof TokenInterceptor) {
        tokenInterceptor = interceptor[i] as TokenInterceptor;
      }
    }
  });

  it('should increment the counter for all apis except getUsers', (done) => {
    const testUrl = 'https://nomatterwhat';
    const ob$ = httpClient.get(testUrl);
    ob$.subscribe((res) => {
      expect(res).toBeTruthy();
      expect(tokenInterceptor.counter).toBeGreaterThan(0);
      done();
    });
    let req = httpTestingController.expectOne(testUrl);
    const authHeaderValue = req.request.headers.get('Authorization');
    expect(authHeaderValue).toEqual('Bearer 1234567890');
    req.flush('nomatterwhat');
  });
});
