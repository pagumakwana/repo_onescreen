import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, withHashLocation, withRouterConfig } from '@angular/router';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes,withRouterConfig({ onSameUrlNavigation: 'reload' })),importProvidersFrom (
    BrowserAnimationsModule, // required by Toastr
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule,
    SweetAlert2Module.forRoot()),provideHttpClient(withInterceptorsFromDi()),]
};
