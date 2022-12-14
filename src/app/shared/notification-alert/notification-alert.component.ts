import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bm-notification-alert',
  templateUrl: './notification-alert.component.html'
})
export class NotificationAlertComponent {
  @Output() closeErrorEventEmitter = new EventEmitter();
  @Input() error:
    | {
        httpError?: HttpErrorResponse | null;
        errorMessage?: string | null;
      }
    | undefined;

  constructor() {}

  close() {
    this.closeErrorEventEmitter.emit();
  }

  stringify(error: any, param2: any, param3: any) {
    //error?.http?.error
    const parser = new DOMParser();
    const doc = parser.parseFromString(error.httpError.error, 'text/html');
    const errorTxt = doc.getElementsByTagName('pre')[0]?.textContent;
    error = { ...error, http: { ...error.httpError, error: errorTxt } };
    return JSON.stringify(error.http, param2, param3);
  }
}
