import { Component, inject, Renderer2 } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { ApiService } from './_appservice/api.service';
import { AppSessionService } from './_appservice/appsession.service';
import { BaseServiceHelper } from './_appservice/baseHelper.service';
import { CommonService } from './_appservice/common.service';
import { EncryptedStorage } from './_appservice/encryptedstorage.service';
import { ScriptLoaderService } from './_appservice/script-loader.service';
import { PageTitleService } from './_appservice/title.service';
import { WebDService } from './_appservice/webdpanel.service';
import { AuthService } from './authmodule/_authservice/auth.service';
import { AuthGuard } from './authmodule/_authservice/auth.guard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers:[BaseServiceHelper, PageTitleService,
    ApiService,
    AuthService,
    AuthGuard,
    WebDService,
    CommonService,
    ScriptLoaderService,
    EncryptedStorage,
    AppSessionService]
})
export class AppComponent {
  title = 'app_onespace';
  private router = inject(Router);
  private renderer = inject(Renderer2);

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event:any) => {
        const body = document.body;

        if (event.url.includes('/app')) {
          this.renderer.removeAttribute(body, 'data-pc-layout');
        } else {
          this.renderer.setAttribute(body, 'data-pc-layout', 'horizontal');
        }
      });
  }
}
