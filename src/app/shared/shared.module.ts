import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationAlertComponent } from './notification-alert/notification-alert.component';
import { SuccessAlertComponent } from './success-alert/success-alert.component';

@NgModule({
  declarations: [NotificationAlertComponent, SuccessAlertComponent],
  imports: [CommonModule],
  exports: [NotificationAlertComponent, SuccessAlertComponent]
})
export class SharedModule {}
