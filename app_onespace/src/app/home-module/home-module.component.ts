import { Component,CUSTOM_ELEMENTS_SCHEMA, ViewEncapsulation } from '@angular/core';
// import function to register Swiper custom elements
import { register } from 'swiper/element/bundle';
// register Swiper custom elements
register();
@Component({
  selector: 'app-home-module',
  standalone: true,
  imports: [],
  templateUrl: './home-module.component.html',
  styleUrl: './home-module.component.scss',
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
encapsulation: ViewEncapsulation.None
})
export class HomeModuleComponent {

}
