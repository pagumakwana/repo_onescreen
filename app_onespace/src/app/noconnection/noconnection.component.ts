import { Component } from '@angular/core';
import { RouterLink, RouterModule } from "@angular/router";
import { BaseServiceHelper } from '../_appservice/baseHelper.service';

@Component({
  selector: 'app-noconnection',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './noconnection.component.html',
  styleUrl: './noconnection.component.scss'
})
export class NoconnectionComponent {
  constructor(private _base: BaseServiceHelper,) {
    //   this.internetConnectionService.getOnlineStatus().subscribe(online => {
    //     debugger
    //     this._base._commonService.isOnline = online;
    if (this._base._commonService.isOnline) {
      this._base._router.navigate(['/home']);
    } else {
      this._base._router.navigate(['/noconnection']);
    }
    //   });
  }

  reloadpage() {
    location.reload();
  }
}
