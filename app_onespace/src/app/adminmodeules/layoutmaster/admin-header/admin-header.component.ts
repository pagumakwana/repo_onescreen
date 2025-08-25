import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BaseServiceHelper } from '../../../_appservice/baseHelper.service';
import { AuthService } from '../../../authmodule/_authservice/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  providers: [AuthService, BaseServiceHelper],
  templateUrl: './admin-header.component.html',
  styleUrl: './admin-header.component.scss'
})
export class AdminHeaderComponent {

  navigate() {
    this._base._router.navigate(['/home']);
  }
  constructor(
    public _base: BaseServiceHelper,
    private auth: AuthService,
  ) {

  }
  logout() {
    localStorage.removeItem('isLoggedIn');
    this._base._router.navigate(['/home'])
  }
}
