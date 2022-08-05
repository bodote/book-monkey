import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Inject, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { TokenInterceptor } from './shared/token.interceptor';
import { NgHeroiconsModule } from '@dimaslz/ng-heroicons';

const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
];
@NgModule({
  declarations: [AppComponent, HomeComponent, SearchComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgHeroiconsModule
  ],
  providers: [
    httpInterceptorProviders
    //{provide: LOCALE_ID, useValue: 'de' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(@Inject(LOCALE_ID) locale: string) {
    //registerLocaleData(localeDe);
    console.log('locale: ' + locale);
  }
}
