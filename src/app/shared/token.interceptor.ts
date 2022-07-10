import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    console.log(
      'interceptor before: url=' + request.url + ' method=' + request.method
    );
    let myRequest = request.clone({
      headers: request.headers.set('Authorization', 'Bearer 1234567890')
    });

    return next.handle(myRequest).pipe(
      tap({
        next: (httpEvent: HttpEvent<unknown>) => {
          console.log(
            'after handle request , constructor: ' + httpEvent.constructor.name
          );
          if (httpEvent instanceof HttpResponse) {
            console.log(
              'after handle request , headers: ' +
                JSON.stringify(httpEvent.headers)
            );
            console.log(
              'after handle request , status: ' +
                JSON.stringify(httpEvent.status)
            );
            console.log(
              'after handle request , url: ' + JSON.stringify(httpEvent.url)
            );
          }
          console.log(
            'after handle request type: ' + httpEvent.constructor.name
          );
        }
      }),
      catchError((response: HttpErrorResponse) => {
        console.error(JSON.stringify(response));
        return throwError(() => new Error(JSON.stringify(response.error)));
      })
    );
  }
}
