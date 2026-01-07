import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cancellation-and-refund',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './cancellation-and-refund.component.html',
  styleUrl: './cancellation-and-refund.component.scss'
})
export class CancellationAndRefundComponent {

}
