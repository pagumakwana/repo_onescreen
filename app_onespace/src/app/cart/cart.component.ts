import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BaseServiceHelper } from '../_appservice/baseHelper.service';
import { WebDService } from '../_appservice/webdpanel.service';
import { FormBuilder, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from "@angular/router";
import { CheckoutComponent } from '../checkout/checkout.component';
import { razorpay_OrderAttribute, user_coupon_model, usercartMaster } from '../_appmodel/_model';
import { enAppSession } from '../_appmodel/sessionstorage';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, CheckoutComponent, SweetAlert2Module, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  @ViewChild('deleteSwal')
  public readonly deleteSwal!: SwalComponent;

  @ViewChild('delsuccessSwal')
  public readonly delsuccessSwal!: SwalComponent;

  @ViewChild('invalidcodeSwal')
  public readonly invalidcodeSwal!: SwalComponent;

  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  UserCart: any;
  couponMaster: any;
  Coupon_code_text: string = ''
  Coupon_code_btn: string = 'Apply'
  _usercartMaster: usercartMaster = {};

  usercartdata: any = [];
  cart_master_id: number = 0;
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
        this.UserCart = Array.isArray(resUserCart.data) ? resUserCart.data : [];
        this.cart_master_id = this.UserCart[0]?.cart_master_id;
        this.cart_total = this.UserCart[0]?.cart_total;
        this.cart_subtotal = this.UserCart[0]?.cart_subtotal;
        this.cart_tax = this.UserCart[0]?.cart_tax;
        this.cart_discount = this.UserCart[0]?.cart_discount;
        this.UserCart[0]?.lst_cart_product?.forEach((res: any) => {
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
      amount: this.cart_total,
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

  removeFromCart(item: any) {
    this.modifyuser(item, 'DELETECART');
  }

  modifyuser(data: any, flag: any) {
    this._usercartMaster = { ...data };
    this._usercartMaster.flag = flag;

    if (flag === 'DELETECART') {
      this.deleteSwal.fire().then((clicked) => {
        if (clicked.isConfirmed) {
          this._webDService.add_to_cart(this._usercartMaster).subscribe(
            (response: any) => {
              if (response === 'deletesuccess') {
                this.UserCart = this.UserCart.filter(
                  (item: any) => item.cart_master_id !== data.cart_master_id
                );
                this._cdr.detectChanges();
                this.delsuccessSwal.fire();
                setTimeout(() => {
                  this.delsuccessSwal.close();
                }, 1500);
              }
            },
            (error) => {
              console.error("Error deleting cart item:", error);
            }
          );
        }
      });
    }
  }
  _user_coupon_model: user_coupon_model = {};
  applycoupon() {
    if (!this.Coupon_code_text || this.Coupon_code_text.trim() === '') {
      console.warn("Please enter a coupon code");
      return;
    }
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this._base._encryptedStorage.get(enAppSession.fullname).then(full_name => {
        this._webDService.getcoupon(0, this.Coupon_code_text).subscribe(
          (resCouponData: any) => {
            this.couponMaster = [];
            let rescoupon = Array.isArray(resCouponData.data) ? resCouponData.data : [];
            this.couponMaster = rescoupon;

            console.log("Coupon Applied Successfully:", this.couponMaster);

            if (this.couponMaster.length > 0) {
              let coupon_id: any = this.couponMaster[0]?.coupon_id;
               this.cart_discount = this.couponMaster[0]?.discount_value;
              this.coupon_code = this.Coupon_code_text;
              // this.Coupon_code_text = '';
              this.Coupon_code_btn = 'Remove';
              this._user_coupon_model = {
                flag: 'NEWCOUPONCART',
                coupon_id: coupon_id,
                coupon_cart_mapid: 0,
                product_ids: '',
                user_id: user_id,
                cart_id: this.cart_master_id,
                createdname: full_name,
                createdby: user_id
              }
              this._webDService.apply_coupon(this._user_coupon_model).subscribe((rescoupon: any) => {
                if (rescoupon != null && rescoupon.includes('newsuccess')) {
                  this.successSwal.fire();
                  setTimeout(() => {
                    this.successSwal.close();
                  }, 1000);
                }
              });
            } else {
              this.invalidcodeSwal.fire()
              setTimeout(() => {
                this.invalidcodeSwal.close();
              }, 1000);
              console.warn("Invalid or expired coupon code");
            }
          },
          error => {
            console.error("Error applying coupon:", error);
          }
        );
      });
    });
  }
}
