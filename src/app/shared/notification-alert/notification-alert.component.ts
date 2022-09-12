import { Component, Input, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bm-notification-alert',
  templateUrl: './notification-alert.component.html',
  styleUrls: ['./notification-alert.component.css']
})
export class NotificationAlertComponent implements OnInit {
  show: boolean = true;
  @Input() error:
    | {
        http?: HttpErrorResponse | null;
        text?: string | null;
      }
    | undefined;

  constructor() {}

  close() {
    this.show = false;
  }

  ngOnInit(): void {
    this.show = true;
  }

  stringify(error: any, param2: any, param3: any) {
    //error?.http?.error
    const parser = new DOMParser();
    const doc = parser.parseFromString(error?.http?.error, 'text/html');
    const errorTxt = doc?.getElementsByTagName('pre')[0].textContent;
    if (!!error?.http?.error)
      error = { ...error, http: { ...error.http, error: errorTxt } };
    return JSON.stringify(error?.http, param2, param3);
  }
}
