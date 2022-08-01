import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HomeComponent } from './home/home.component';

import { SearchComponent } from './search/search.component';
import { TokenInterceptor } from './shared/token.interceptor';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
];
@NgModule({
  declarations: [AppComponent, HomeComponent, SearchComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [httpInterceptorProviders, { provide: LOCALE_ID, useValue: 'de' }],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    registerLocaleData(localeDe);
  }
}
