import { ChangeDetectionStrategy, Component, HostBinding, inject, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthService } from './authmodule/_authservice/auth.service';
import { ApiService } from './_appservice/api.service';
import { AppSessionService } from './_appservice/appsession.service';
import { BaseServiceHelper } from './_appservice/baseHelper.service';
import { CommonService } from './_appservice/common.service';
import { EncryptedStorage } from './_appservice/encryptedstorage.service';
import { InternetConnectionService } from './_appservice/internet-connection.service';
import { ScriptLoaderService } from './_appservice/script-loader.service';
import { PageTitleService } from './_appservice/title.service';
import { WebDService } from './_appservice/webdpanel.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [BaseServiceHelper, PageTitleService,
    ApiService,
    WebDService,
    CommonService,
    ScriptLoaderService,
    EncryptedStorage,
    AppSessionService,
    InternetConnectionService]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'app_onespace';
  private router = inject(Router);
  private renderer = inject(Renderer2);
  private sub!: Subscription;

  @HostBinding('class') hostCssClass = '';

  constructor(private _base: BaseServiceHelper,private internetConnectionService: InternetConnectionService) {
    this.internetConnectionService.getOnlineStatus().subscribe(online => {
      this._base._commonService.isOnline = online;
     
      this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        const body = document.body;
        
        if (event.url.includes('/app')) {
          this.renderer.removeAttribute(body, 'data-pc-layout');
        } else if (event.url.includes('/aboutus')) {
          this.hostCssClass = 'aboutus_module';
          this.renderer.setAttribute(body, 'data-pc-layout', 'horizontal');
        } else if (event.url.includes('/contactus')) {
          this.hostCssClass = 'contactus_module';
          this.renderer.setAttribute(body, 'data-pc-layout', 'horizontal');
        }
        else if (event.url.includes('/faqs')) {
          this.hostCssClass = 'faq_module';
          this.renderer.setAttribute(body, 'data-pc-layout', 'horizontal');
        }
        else {
          this.hostCssClass = '';
          this.renderer.setAttribute(body, 'data-pc-layout', 'horizontal');
        }
      });
    });
  }

  ngOnInit() {
   
  }

  ngOnDestroy() {
    this.sub.unsubscribe(); // prevent memory leaks
  }
}
