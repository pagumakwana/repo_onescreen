import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { CommonModule } from '@angular/common';
import { enAppSession } from '../../_appmodel/sessionstorage';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  providers: [BaseServiceHelper],
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
    private _cdr:ChangeDetectorRef
  ) { }

  ngOnInit() {
    this._base._encryptedStorage.get(enAppSession.haslogin).then((haslogin:boolean) => {
      this.isLoggedIn = haslogin ? haslogin:false;
      console.log("islogin",this.isLoggedIn);
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
    this._base._appSessionService.clearUserSession();
    setTimeout(() => {
      this.isLoggedIn=false;
      this._cdr.detectChanges();
      this._base._router.navigate(['/home']);
    }, 1000);
  }

  goToProduct() {
    if (this.isLoggedIn) {
      this._base._router.navigate(['/product']);
    } else {
       this._base._router.navigate(['auth'], { queryParams: { q: ['/product'] } });
    }
  }
}
