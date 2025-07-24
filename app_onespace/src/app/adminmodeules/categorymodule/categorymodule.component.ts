import { Component } from '@angular/core';
import { AddmodifycategoryComponent } from './addmodifycategory/addmodifycategory.component';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-categorymodule',
  standalone: true,
  imports: [AddmodifycategoryComponent,RouterModule,RouterOutlet],
  templateUrl: './categorymodule.component.html',
  styleUrl: './categorymodule.component.scss'
})
export class CategorymoduleComponent {

}
