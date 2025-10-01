import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { enAppSession } from '../../_appmodel/sessionstorage';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard {
  constructor(private authService: AuthService,private _base:BaseServiceHelper) {
    
   }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this._base._commonService.isLoggedInUser()) {
      // logged in so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.authService.logout();
    return false;
  }
}
