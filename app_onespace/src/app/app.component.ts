import { Component, inject, Renderer2 } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
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
