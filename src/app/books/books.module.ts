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

@NgModule({
  declarations: [
    BookListComponent,
    BookListItemComponent,
    BookDetailsComponent,
    IsbnPipe,
    ZoomDirective,
    DelayDirective
  ],
  imports: [
    CommonModule,
    BooksRoutingModule,
    OutlineIconsModule,
    SolidIconsModule
  ]
})
export class BooksModule {}
