import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AdminHeaderComponent } from "./layoutmaster/admin-header/admin-header.component";
import { AdminFooterComponent } from "./layoutmaster/admin-footer/admin-footer.component";
import { AdminSidebarComponent } from './layoutmaster/admin-sidebar/admin-sidebar.component';
import { BaseServiceHelper } from '../_appservice/baseHelper.service';
@Component({
  selector: 'app-adminmodeules',
  standalone: true,
  imports: [RouterOutlet, AdminHeaderComponent, AdminFooterComponent, AdminSidebarComponent, RouterModule],
  templateUrl: './adminmodeules.component.html',
  styleUrl: './adminmodeules.component.scss'
})
export class AdminmodeulesComponent implements OnInit {

  constructor() {
  
  }
  ngOnInit(): void {
    // if (!this._base._commonService.isLoggedIn) {
    //   this._base._router.navigate(['/home'])
    // }
  }
}
