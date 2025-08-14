import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  navigate() {
    this._base._router.navigate(['/app/profile']);
  }
  constructor(
    public _base: BaseServiceHelper,
  ){

  }
}
