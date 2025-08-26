import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  providers: [BaseServiceHelper, Router],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isLoggedIn = false;
  public isSuccessModal_Open: boolean = false;
  public is_category_open: boolean = false;
  is_mobile_menu: boolean = false;
  public isModal_Open: boolean = false;

  constructor(
    public _base: BaseServiceHelper,
    private router: Router
  ) { }

  ngOnInit() {
    // check login status from localStorage
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  }

  navigate() {
    this._base._router.navigate(['/app/dashboard'])
  }

  login() {
    localStorage.setItem('isLoggedIn', 'true');
    this.isLoggedIn = true;
    this.router.navigate(['/auth']);
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    this.isLoggedIn = false;
    this.router.navigate(['/']);
  }

  goToProduct() {
    if (this.isLoggedIn) {
      this.router.navigate(['/product']); 
    } else {
      this.router.navigate(['/userregistration']); 
    }
  }
}
