import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-policy',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './order-policy.component.html',
  styleUrl: './order-policy.component.scss'
})
export class OrderPolicyComponent {

}
