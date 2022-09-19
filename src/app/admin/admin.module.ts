import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { BookFormComponent } from './book-edit/book-form.component';
import { CreateBookComponent } from './create-book/create-book.component';
import { FormMessagesComponent } from './form-messages/form-messages.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LocalDateValueAccessorModule } from 'angular-date-value-accessor';
import { SolidIconsModule } from '@dimaslz/ng-heroicons';
import { BooksModule } from '../books/books.module';
import { BookEditComponent } from './book-edit/book-edit.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    BookFormComponent,
    CreateBookComponent,
    FormMessagesComponent,
    BookEditComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    LocalDateValueAccessorModule,
    SolidIconsModule,
    BooksModule
  ]
})
export class AdminModule {}
