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
import { CalculatorComponent } from './calc/calculator.component';
import { ReactiveFormsModule } from '@angular/forms';

const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
];
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchComponent,
    ErrorPageComponent,
    CalculatorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgHeroiconsModule,
    StoreModule.forRoot(ROOT_REDUCERS, {}),
    StoreDevtoolsModule.instrument(<any>{
      maxAge: 25,
      logOnly: environment.production,
      trace: true
    }),
    EffectsModule.forRoot([RouterEffects, SearchEffects]),
    StoreRouterConnectingModule.forRoot({
      serializer: CustomRouterStateSerializer
    }),
    SharedModule,
    ReactiveFormsModule
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
