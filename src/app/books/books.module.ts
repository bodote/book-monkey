import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BooksRoutingModule } from './books-routing.module';
import { BookListItemComponent } from './book-list-item/book-list-item.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { IsbnPipe } from './shared/isbn.pipe';
import { ZoomDirective } from './shared/zoom.directive';
import { DelayDirective } from './shared/delay.directive';
import { BookListComponent } from './book-list/book-list.component';
import { OutlineIconsModule, SolidIconsModule } from '@dimaslz/ng-heroicons';
import { StoreModule } from '@ngrx/store';
import * as fromBook from './store/book.reducer';
import { EffectsModule } from '@ngrx/effects';
import { BookEffects } from './store/book.effects';
import { SharedModule } from '../shared/shared.module';
import { BookFormComponent } from '../admin/book-edit/book-form.component';
import { CreateBookComponent } from '../admin/create-book/create-book.component';
import { FormMessagesComponent } from '../admin/form-messages/form-messages.component';
import { BookEditComponent } from '../admin/book-edit/book-edit.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    BookListComponent,
    BookListItemComponent,
    BookDetailsComponent,
    IsbnPipe,
    ZoomDirective,
    DelayDirective,
    BookFormComponent,
    CreateBookComponent,
    FormMessagesComponent,
    BookEditComponent
  ],
  imports: [
    CommonModule,
    BooksRoutingModule,
    OutlineIconsModule,
    SolidIconsModule,
    SharedModule,
    StoreModule.forFeature(fromBook.bookFeatureKey, fromBook.reducer),
    EffectsModule.forFeature([BookEffects]),
    ReactiveFormsModule
  ]
})
export class BooksModule {}
