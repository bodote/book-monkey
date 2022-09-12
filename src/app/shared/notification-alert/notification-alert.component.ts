import { Component, Input } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'bm-notification-alert',
  templateUrl: './notification-alert.component.html',
  styleUrls: ['./notification-alert.component.css']
})
export class NotificationAlertComponent {
  @Input() error:
    | {
        http?: HttpErrorResponse | null;
        text?: string | null;
      }
    | undefined;

  constructor() {}
}
