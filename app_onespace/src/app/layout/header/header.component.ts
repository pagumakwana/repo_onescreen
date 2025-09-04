import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { CommonModule } from '@angular/common';
import { enAppSession } from '../../_appmodel/sessionstorage';
import { AuthService } from '../../authmodule/_authservice/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  providers: [BaseServiceHelper, AuthService],
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
    private _cdr: ChangeDetectorRef,
    private _auth: AuthService
  ) { }

  _profilepicture: string = './assets/media/avatars/blank.png'

  ngOnInit() {
    this._base._encryptedStorage.get(enAppSession.haslogin).then((haslogin: boolean) => {
      this._base._encryptedStorage.get(enAppSession.profilepicture).then((resPicture) => {
        this.isLoggedIn = haslogin ? haslogin : false;
        console.log("islogin", this.isLoggedIn);
        if (resPicture != null && resPicture != '' && resPicture != undefined) {
          this._profilepicture = resPicture;
        }
        this._cdr.detectChanges();
      });
    });
  }

  navigate() {
    this._base._router.navigate(['/app/dashboard'])
  }

  login() {
    this._base._router.navigate(['auth']);
  }

  logout() {
    this.isLoggedIn = false;
    this._auth.logout();
    document.location.reload();
    this._cdr.detectChanges();
  }

  goToProduct() {
    if (this.isLoggedIn) {
      this._base._router.navigate(['/product']);
    } else {
      this._base._router.navigate(['auth'], { queryParams: { q: ['product'] } });
    }
  }
  goToCart() {
    if (this.isLoggedIn) {
      this._base._router.navigate(['/cart']);
    } else {
      this._base._router.navigate(['auth'], { queryParams: { q: ['cart'] } });
    }
  }
}
