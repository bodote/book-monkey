import { Component, Input } from '@angular/core';

@Component({
  selector: 'bm-notification-alert',
  templateUrl: './notification-alert.component.html',
  styleUrls: ['./notification-alert.component.css']
})
export class NotificationAlertComponent {
  @Input() error: any;

  constructor() {}
}
