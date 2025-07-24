import { Component } from '@angular/core';
import { AddmodifybannerComponent } from './addmodifybanner/addmodifybanner.component';

@Component({
  selector: 'app-bannermodule',
  standalone: true,
  imports: [AddmodifybannerComponent],
  templateUrl: './bannermodule.component.html',
  styleUrl: './bannermodule.component.scss'
})
export class BannermoduleComponent {

}
