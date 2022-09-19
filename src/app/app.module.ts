import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Inject, LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { TokenInterceptor } from './shared/token.interceptor';
import { NgHeroiconsModule } from '@dimaslz/ng-heroicons';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { CustomRouterStateSerializer } from './custom-router-state-serializer';
import { ROOT_REDUCERS } from './store';
import { ErrorPageComponent } from './error-page/error-page.component';
import { RouterEffects } from './store/router.effects';
import { SharedModule } from './shared/shared.module';
import { SearchEffects } from './search/search.effects';
//{serializer: CustomRouterStateSerializer}
const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
];
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchComponent,
    ErrorPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgHeroiconsModule,
    StoreModule.forRoot(ROOT_REDUCERS, {}),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    }),
    EffectsModule.forRoot([RouterEffects, SearchEffects]),
    StoreRouterConnectingModule.forRoot({
      serializer: CustomRouterStateSerializer
    }),
    SharedModule
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
