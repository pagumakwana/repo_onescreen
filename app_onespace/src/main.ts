import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environments.prod';
import { enableProdMode } from '@angular/core';
import { ApplicationRef } from '@angular/core';

declare global {
  interface Window {
    ngRef?: ApplicationRef;
  }
}

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, appConfig).then((ref: any) => {
  if (window['ngRef']) {
    window['ngRef'].destroy();
  }
  window['ngRef'] = ref;
}).catch(err => console.error(err));