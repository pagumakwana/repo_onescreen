import { Component } from '@angular/core';
import { AddmodifyproductComponent } from './addmodifyproduct/addmodifyproduct.component';

@Component({
  selector: 'app-productmodule',
  standalone: true,
  imports: [AddmodifyproductComponent],
  templateUrl: './productmodule.component.html',
  styleUrl: './productmodule.component.scss'
})
export class ProductmoduleComponent {

}
