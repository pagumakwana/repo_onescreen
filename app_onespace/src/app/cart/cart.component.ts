import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BaseServiceHelper } from '../_appservice/baseHelper.service';
import { WebDService } from '../_appservice/webdpanel.service';
import { FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from "@angular/router";
import { CheckoutComponent } from '../checkout/checkout.component';
import { razorpay_OrderAttribute } from '../_appmodel/_model';
import { enAppSession } from '../_appmodel/sessionstorage';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, CheckoutComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  UserCart: any;
  razorpay_OrderAttribute!: razorpay_OrderAttribute;
  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    public _fbcoupon: FormBuilder,
    private _cdr: ChangeDetectorRef) {

  }
  ngOnInit(): void {
    this.get_cart();
  }

  get_cart() {
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this._webDService.getusercartdetail(0, user_id, 0, 0, 0).subscribe((resUserCart: any) => {
        debugger
        this.UserCart = Array.isArray(resUserCart.data) ? resUserCart.data : [];
        this.cart_total = this.UserCart[0]?.cart_total;
        this.cart_subtotal = this.UserCart[0]?.cart_subtotal;
        this.cart_tax = this.UserCart[0]?.cart_tax;
        this.cart_discount = this.UserCart[0]?.cart_discount;
        this.UserCart[0]?.lst_cart_product?.forEach((res: any) => {
          debugger
          if (res.optionvalues && typeof res.optionvalues === 'string') {
            try {
              const parsed = JSON.parse(res.optionvalues);
              res.optionvaluesParsed = JSON.parse(parsed);
            } catch (e) {
              console.warn('Invalid JSON for optionvalues:', res.optionvalues);
              res.optionvaluesParsed = [];
            }
          } else {
            res.optionvaluesParsed = [];
          }
        });
        console.log("UserCart", this.UserCart)
        this._cdr.detectChanges();
      });
    });
  }

  is_payment: boolean = false;
  proceeds_payment($event: any) {
    console.log("pay", $event)

  }

  cart_total: any = 0.00;
  cart_subtotal: any = 0.00;
  cart_tax: any = 0.00;
  cart_discount: any = 0.00;
  coupon_code: string = '-';

  place_order() {
    this.razorpay_OrderAttribute = {
      amount:this.cart_total,
      currency: "INR",
      payment_capture: true
    }
    this._webDService.createOrder(this.razorpay_OrderAttribute).subscribe((res: any) => {
      if (res) {
        this.razorpay_OrderAttribute = res;
        this.is_payment = true;
      }
    })

  }
}
