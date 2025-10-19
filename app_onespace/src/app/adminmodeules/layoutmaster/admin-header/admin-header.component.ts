import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BaseServiceHelper } from '../../../_appservice/baseHelper.service';
import { AuthService } from '../../../authmodule/_authservice/auth.service';
import { CommonModule } from '@angular/common';
import { WebDService } from '../../../_appservice/webdpanel.service';
import { enAppSession } from '../../../_appmodel/sessionstorage';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  providers: [AuthService, BaseServiceHelper],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss'
})
export class AdminHeaderComponent implements OnInit,OnDestroy {
  

  userDetails: any;
  _profilepicture: string = '/FileStorage/avatar-1.jpg'; 
  constructor(
    public _base: BaseServiceHelper,
    private _auth: AuthService,
    private _cdr: ChangeDetectorRef
  ) {

  }

  ngOnInit(): void {
    this._base._encryptedStorage.get(enAppSession.profilepicture).then((resPicture) => {
      if (resPicture != null && resPicture != '' && resPicture != undefined) {
        this._profilepicture = resPicture;
      }
      this._cdr.detectChanges();
    });
	}

  navigate() {
    this._base._router.navigate(['/home']);
  }
  cart() {
    this._base._router.navigate(['/cart']);
  }
  
  logout() {
    localStorage.removeItem('isLoggedIn');
    this._auth.logout();
    this._cdr.detectChanges();
  }

  ngOnDestroy() {
  
  }
  // getUserDetails() {
  //   this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
  //     this._webDService.userlist('Detail', user_id).subscribe((resUserDetails: any) => {
  //       this.userDetails = Array.isArray(resUserDetails.data) ? resUserDetails.data : [];
        
  //       if (this.userDetails.length > 0) {
  //         const profilePic = this.userDetails[0].profilepicture;
  //         this._profilepicture = profilePic && profilePic.trim() !== ''
  //           ? profilePic
  //           : '../assets/images/user/avatar-2.jpg';
  //       }
  //     });
  //   });
  // }
}
