import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BaseServiceHelper } from '../_appservice/baseHelper.service';
import { WebDService } from '../_appservice/webdpanel.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from "@angular/router";
import { orderDetails, razorpay_OrderAttribute, user_coupon_model, usercartMaster, ordermaster, removeusercartModel, update_user } from '../_appmodel/_model';
import { enAppSession } from '../_appmodel/sessionstorage';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { take } from 'rxjs';
declare var Razorpay: any;
declare var bootstrap: any;


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, SweetAlert2Module, FormsModule, ReactiveFormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  @ViewChild('removecouponSwal')
  public readonly removecouponSwal!: SwalComponent;

  @ViewChild('deleteSwal')
  public readonly deleteSwal!: SwalComponent;

  @ViewChild('delsuccessSwal')
  public readonly delsuccessSwal!: SwalComponent;

  @ViewChild('invalidcodeSwal')
  public readonly invalidcodeSwal!: SwalComponent;

  @ViewChild('failureSwal')
  public readonly failureSwal!: SwalComponent;
  @ViewChild('paysuccessSwal')
  public readonly paysuccessSwal!: SwalComponent;

  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  UserCart: any;
  couponMaster: any;
  Coupon_code_text: string = ''
  Coupon_code_btn: string = 'Apply'
  _usercartMaster: usercartMaster = {};
  _updateuserdetail: update_user = {};

  fguser!: FormGroup
  usercartdata: any = [];
  cart_master_id: number = 0;
  razorpay_OrderAttribute!: razorpay_OrderAttribute;
  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    public _fbuser: FormBuilder,
    private _cdr: ChangeDetectorRef) {
    this._base._scriptLoaderService.load('script', 'https://checkout.razorpay.com/v1/checkout.js');
  }
  ngOnInit(): void {
    this.initform();
    this.get_cart();
    this.getcoupon();
  }

  initform() {
    this.fguser = this._fbuser.group({
      user_id: [0],
      fullname: [''],
      email_id: [''],
      address: ['']
    });
  }

  get_cart() {
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this._webDService.getusercartdetail(0, user_id, 0, 0, 0).subscribe((resUserCart: any) => {
        this.UserCart = [];
        this.UserCart = Array.isArray(resUserCart.data) ? resUserCart.data : [];
        console.log("UserCartUserCart", this.UserCart)
        debugger
        this.calculatecart();
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

        this._cdr.detectChanges();
      });
    });
  }


  _order_details: orderDetails = {};
  _ordermaster: ordermaster = {};
  is_payment: boolean = false;
  proceeds_payment(rzr_response: any) {
    const result = this.UserCart[0]?.lst_cart_product
      ?.filter((p: any) => p.product_id > 0)
      .flatMap((p: any) => p.optionvaluesParsed); // ✅ merge all arrays into one
    console.log("rzr_response", rzr_response)
    if (rzr_response && rzr_response.status === 'failure') {
      setTimeout(() => {
        this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
          this._base._encryptedStorage.get(enAppSession.fullname).then(full_name => {
            this._order_details = {
              flag: 'NEWORDER',
              order_id: 0,
              cart_master_id: this.UserCart[0]?.cart_master_id,
              coupon_id: this.couponMaster?.[0]?.coupon_id || 0,
              payment_type: 'razorpay',
              payment_order_id: rzr_response?.razorpay_order_id || '',
              payment_response: JSON.stringify(rzr_response) || '',
              order_total: this.cart_total,
              order_subtotal: this.cart_subtotal,
              order_discount: this.cart_discount,
              order_tax: this.cart_tax,
              order_status: 'success',
              payment_status: 'success',
              user_id: user_id,
              createdname: full_name,
              createdby: user_id,
              lst_orderdetail: this.UserCart[0]?.lst_cart_product,
              lst_orderproduct: Array.isArray(result) ? JSON.parse(JSON.stringify(result)) : []
            };
            this._ordermaster = {
              lst_ordermaster: this._order_details,
              lst_orderdetail: this.UserCart[0]?.lst_cart_product,
              lst_orderproduct: this._order_details?.lst_orderproduct
            }
            console.log('array', this._ordermaster)
            this._webDService.move_to_order(this._ordermaster).subscribe((resorder: any) => {
              if (resorder != null && resorder.includes('newsuccess')) {
                console.log("Order stored successfully:", resorder);
                let order_id = resorder.split('~')[1];
                this.paysuccessSwal.fire();
                setTimeout(() => {
                  this.paysuccessSwal.close();
                  this._base._router.navigate(['thankyou', order_id]);
                  this._cdr.detectChanges();
                }, 1000);
              } else {
                this.failureSwal.fire();
                setTimeout(() => {
                  this.failureSwal.close();
                }, 1000);
              }
            });
          });
        });
      }, 1000);
    }
  }

  cart_total: any = 0.00;
  cart_subtotal: any = 0.00;
  cart_tax: any = 0.00;
  cart_discount: any = 0.00;
  coupon_code: string = '-';
  coupon_code_id: number = 0;

  place_order() {
    this.razorpay_OrderAttribute = {
      amount: this.cart_total,
      currency: "INR",
      payment_capture: true
    }
    this._webDService.createOrder(this.razorpay_OrderAttribute)
      .subscribe((res: any) => {
        if (res) {
          this.razorpay_OrderAttribute = res;
          this.is_payment = true;
          this.pay(this.razorpay_OrderAttribute);
        }
      });

  }


  removeusercartModel: removeusercartModel = {};

  removeFromCart(item: any) {
    // this.modifyuser(item, 'DELETECART');
    let sub_total = (item?.base_amount + item?.attribute_amount);
    let tax_total = sub_total * 18 / 100;
    let total_amount = (sub_total + tax_total);
    this.removeusercartModel = {
      user_cart_mapping_id: item?.user_cart_mapping_id,
      cart_master_id: item?.cart_master_id,
      product_id: item?.product_id,
      product_name: item?.product_name,
      user_id: item?.user_id,
      attribute_amount: item?.attribute_amount,
      total_amount: total_amount,
      sub_amount: sub_total,
      base_amount: item?.base_amount,
      tax_amount: tax_total,
    }
    this.deleteSwal.fire().then((clicked) => {
      if (clicked.isConfirmed) {
        this._webDService.remove_cart(this.removeusercartModel).subscribe(
          (response: any) => {
            if (response === 'deletesuccess') {
              this.delsuccessSwal.fire();

              setTimeout(() => {
                this.delsuccessSwal.close();
                location.reload();
              }, 1500);
              this._cdr.detectChanges();
            }
          },
          (error) => {
            console.error("Error deleting cart item:", error);
          }
        );
      }
    });
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

  removecouponcode() {
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this._base._encryptedStorage.get(enAppSession.fullname).then(full_name => {
        this._user_coupon_model = {
          flag: 'REMOVECOUPON',
          coupon_id: this.coupon_code_id,
          coupon_cart_mapid: 0,
          product_ids: '',
          user_id: user_id,
          cart_id: this.cart_master_id,
          createdname: full_name,
          createdby: user_id
        }
        this._webDService.apply_coupon(this._user_coupon_model).subscribe((rescoupon: any) => {
          if (rescoupon != null && rescoupon.includes('removesuccess')) {
            this.coupon_code = '';
            this.Coupon_code_btn = 'Apply';
            this.Coupon_code_text = '';
            this.coupon_code_id = 0;
            this.cart_discount = '';
            this.removecouponSwal.fire();
            setTimeout(() => {
              this.removecouponSwal.close();
              location.reload();
            }, 1000);
          }
        });
      });
    });
  }

  is_valid: boolean = false;
  _user_coupon_model: user_coupon_model = {};
  applycoupon() {
    this.is_valid = false;
    if (!this.Coupon_code_text || this.Coupon_code_text.trim() === '') {
      console.warn("Please enter a coupon code");
      this.is_valid = true;
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
              // this.cart_discount = this.couponMaster[0]?.discount_value;
              this.cart_discount = (this.cart_subtotal * this.couponMaster[0]?.discount_value / 100)
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
                    location.reload();
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

  calculatecart() {
    debugger
    this.UserCart?.filter((res: any) => {
      this.cart_master_id = (this.cart_master_id + res?.cart_master_id);
      this.cart_total = (this.cart_total + res?.cart_total);
      this.cart_subtotal = (this.cart_subtotal + res?.cart_subtotal);
      this.cart_tax = (this.cart_tax + res?.cart_tax);
      this.cart_discount = (this.cart_discount + res?.cart_discount);
      this.Coupon_code_text = res?.coupon_code;
      this.coupon_code = res?.coupon_code;
      this.coupon_code_id = res?.coupon_id;
      this.Coupon_code_btn = (res?.coupon_code != '' && res?.coupon_code != undefined && res?.coupon_code != null) ? 'Remove' : 'Apply';
    });
  }


  pay(_payment_attributes: razorpay_OrderAttribute) {
    // Step 1: Create order from backend
    this._base._encryptedStorage.get(enAppSession.fullname).then(fullname => {
      this._base._encryptedStorage.get(enAppSession.email_id).then(email_id => {
        this._base._encryptedStorage.get(enAppSession.mobilenumber).then(mobilenumber => {
          const options = {
            key: 'rzp_test_RAp1XhaN6GAi6K', // Replace with your Razorpay Key Id
            amount: _payment_attributes.amount,     // Amount in paise (e.g., ₹100 = 10000 paise)
            currency: 'INR',
            name: 'One Screen',
            description: 'Test Transaction',
            order_id: _payment_attributes.id,      // Razorpay order id from backend
            handler: (response: any) => {
              // Step 3: On successful payment
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
  }

  verifyPayment(response: any) {
    this._webDService.verifyorder(response).subscribe((response: any) => {
      console.log('Payment success:', response);
      if (response ?? (response?.status == 'success' || response?.status == 'failure')) {
        this.proceeds_payment(response);
      } else {
        console.log(response);
      }
    });
  }

  detailupdated: boolean = false;
  updateUser() {
    this._base._commonService.markFormGroupTouched(this.fguser)
    if (this.fguser.valid) {
      this._updateuserdetail.fullname = this.fguser.value.fullname;
      this._updateuserdetail.email_id = this.fguser.value.email_id;
      this._updateuserdetail.address = this.fguser.value.address;
      this.update();
    }
  }

  update() {
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this._base._encryptedStorage.get(enAppSession.fullname).then(fullname => {
        this._updateuserdetail.createdname = fullname;
        this._updateuserdetail.user_id = parseInt(user_id);
        this._webDService.update_userdetails(this._updateuserdetail).subscribe((response: any) => {
          let isRedirect: boolean = true
          if (response === 'details added') {
            this.detailupdated = true;
            this.place_order();
          }

          setTimeout(() => {
            this._cdr.detectChanges();
          }, 1500);
        });
      });
    });
  }

  loadShippingData() {
    this._base._encryptedStorage.get(enAppSession.fullname).then(fullname => {
      this._base._encryptedStorage.get(enAppSession.email_id).then(email_id => {
        this._base._encryptedStorage.get(enAppSession.address).then(address => {
          this.fguser.patchValue({
            fullname: fullname || '',
            email_id: email_id || '',
            address: address || '',
            // mobilenumber: mobilenumber || '',
          });
          this._cdr.detectChanges();
        });
      });
    });
  }


  goToCartTab() {
    const cartTab = document.querySelector('#ecomtab-tab-1');
    if (cartTab) {
      const tab = new bootstrap.Tab(cartTab);
      tab.show();
    }
  }
  goToShipping() {
    const cartTab = document.querySelector('#ecomtab-tab-2');
    if (cartTab) {
      const tab = new bootstrap.Tab(cartTab);
      tab.show();
      this.loadShippingData();
    }
  }

  Coupon_text: string = '';
  Coupon_btn: string = 'Apply';
  isvalid: boolean = false;

  apply() {
    if (this.Coupon_text.trim() === '') {
      this.isvalid = true;
      return;
    }
    this.isvalid = false;
    console.log('Applying coupon:', this.Coupon_text);
    // your logic here
  }

  removecoupon() {
    this.Coupon_text = '';
    this.Coupon_btn = 'Apply';
    this.isvalid = false;
  }

  couponList: any[] = [];  // this will be used directly in template

  // Random color palettes for coupon cards
  couponColors: any[] = [
    { bg: '#f0faff', border: '#36c', btn: 'btn-primary' },
    { bg: '#fffdf5', border: '#f5b400', btn: 'btn-warning' },
    { bg: '#f5faff', border: '#00b894', btn: 'btn-success' },
    { bg: '#fff5f8', border: '#d63031', btn: 'btn-danger' },
    { bg: '#fef9f5', border: '#fd7e14', btn: 'btn-orange' }
  ];

  getcoupon() {
    this._webDService.getcoupon(0, '', 0, 0).subscribe(
      (res: any) => {
        console.log("API Response:", res);
        this.couponList = [];
        if (res && Array.isArray(res.data)) {
          this.couponList = res.data.map((c: any, index: number) => {
            const colorSet = this.couponColors[index % this.couponColors.length];
            return { ...c, colorSet };
          });
        } else {
          this.couponList = [];
        }

        this._cdr.detectChanges();
      },
      (err) => {
        console.error("Coupon API Error:", err);
        this.couponList = [];
      }
    );
  }

  // Coupon_code_text: string = '';
  // Coupon_code_btn: string = 'Apply';

  applySuggestedCoupon(code: string) {
    this.Coupon_code_text = code;
    // this.applycoupon();
  }

}
