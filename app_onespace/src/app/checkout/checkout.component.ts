import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { enAppSession } from '../_appmodel/sessionstorage';
import { razorpay_OrderAttribute } from '../_appmodel/_model';
import { BaseServiceHelper } from '../_appservice/baseHelper.service';
import { WebDService } from '../_appservice/webdpanel.service';
declare var Razorpay: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {

  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    public _fbCategoryMaster: FormBuilder,
    private _cdr: ChangeDetectorRef) {
  }

  @Input() payment_details!: razorpay_OrderAttribute;
  @Output() pay_order: EventEmitter<any> = new EventEmitter();
  ngOnInit(): void {
    this._base._scriptLoaderService.load('script', 'https://checkout.razorpay.com/v1/checkout.js');
    debugger
    this.pay(this.payment_details);
  }

  pay(_payment_attributes: razorpay_OrderAttribute) {
    // Step 1: Create order from backend
    this._base._encryptedStorage.get(enAppSession.fullname).then(fullname => {
      this._base._encryptedStorage.get(enAppSession.email_id).then(email_id => {
        this._base._encryptedStorage.get(enAppSession.mobilenumber).then(mobilenumber => {

          this._webDService.createOrder(_payment_attributes).subscribe((order: any) => {
            const options = {
              key: 'rzp_test_RAp1XhaN6GAi6K', // Replace with your Razorpay Key Id
              amount: _payment_attributes.amount,     // Amount in paise (e.g., ₹100 = 10000 paise)
              currency: 'INR',
              name: 'One Screen',
              description: 'Test Transaction',
              order_id: order.id,      // Razorpay order id from backend
              handler: (response: any) => {
                // Step 3: On successful payment
                debugger
                this.verifyPayment(response);
              },
              prefill: {
                name: fullname,
                email: email_id,
                contact: mobilenumber
              },
              theme: {
                color: '#3399cc'
              }
            };

            const rzp1 = new Razorpay(options);
            rzp1.open();
          }, error => {

          });
        });
      });
    });
  }

  verifyPayment(response: any) {
    this._webDService.verifyorder(response).subscribe((status: any) => {
      console.log('Payment success:', status);

    });
  }
}
