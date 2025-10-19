import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { CommonModule } from '@angular/common';
import { enAppSession } from '../../_appmodel/sessionstorage';
import { AuthService } from '../../authmodule/_authservice/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  providers: [BaseServiceHelper, AuthService],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  public isSuccessModal_Open: boolean = false;
  public is_category_open: boolean = false;
  is_mobile_menu: boolean = false;
  public isModal_Open: boolean = false;
  private sub!: Subscription;

  constructor(
    public _base: BaseServiceHelper,
    private _cdr: ChangeDetectorRef,
    private _auth: AuthService
  ) { }

  _profilepicture: string = '/FileStorage/avatar-1.jpg';

  ngOnInit() {
    this.sub = this._base._commonService.isLoginUser$.subscribe((event: boolean) => {
      this._base._commonService.isLoggedIn = event;
      console.log("isLoggedIn1",this._base._commonService.isLoggedIn)
    });
    this._base._encryptedStorage.get(enAppSession.profilepicture).then((resPicture) => {
      if (resPicture != null && resPicture != '' && resPicture != undefined) {
        this._profilepicture = resPicture;
      }
      this._cdr.detectChanges();
    });
  }

  navigate() {
    this._base._router.navigate(['/app/dashboard'])
  }

  login() {
    this._base._router.navigate(['auth']);
  }

  logout() {
    this._auth.logout();
    this._cdr.detectChanges();
  }

  goToCart() {
    if (this._base._commonService.isLoggedIn) {
      this._base._router.navigate(['/cart']);
    } else {
      this._base._router.navigate(['auth'], { queryParams: { q: ['cart'] } });
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe(); // prevent memory leaks
  }
}
