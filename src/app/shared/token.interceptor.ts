import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let myRequest = request.clone({
      headers: request.headers.set('Authorization', 'Bearer 1234567890')
    });

    return next.handle(myRequest).pipe(
      catchError((response: HttpErrorResponse) => {
        console.error('catch Error in interceptor:' + JSON.stringify(response));
        return throwError(() => response);
      })
    );
  }
}
