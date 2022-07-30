import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookListItemComponent } from './book-list-item/book-list-item.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { HomeComponent } from './home/home.component';
import { BookListComponent } from './book-list/book-list.component';
import { SearchComponent } from './search/search.component';
import { TokenInterceptor } from './shared/token.interceptor';
import { BookFormComponent } from './book-edit/book-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateBookComponent } from './create-book/create-book.component';
import { DatePipe, registerLocaleData } from '@angular/common';
import { FormMessagesComponent } from './form-messages/form-messages.component';
import { BookEditComponent } from './book-edit/book-edit.component';
import localeDe from '@angular/common/locales/de';
import { LocalDateValueAccessorModule } from 'angular-date-value-accessor';

const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
];
@NgModule({
  declarations: [
    AppComponent,
    BookListComponent,
    BookListItemComponent,
    BookDetailsComponent,
    HomeComponent,
    SearchComponent,
    BookFormComponent,
    CreateBookComponent,
    FormMessagesComponent,
    BookEditComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    LocalDateValueAccessorModule
  ],
  providers: [
    httpInterceptorProviders,
    DatePipe,
    { provide: LOCALE_ID, useValue: 'de' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    registerLocaleData(localeDe);
  }
}
