import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BaseServiceHelper } from '../_appservice/baseHelper.service';
import { WebDService } from '../_appservice/webdpanel.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from "@angular/router";
import { orderDetails, razorpay_OrderAttribute, user_coupon_model, usercartMaster, ordermaster, removeusercartModel, update_user, user_verification, userModel } from '../_appmodel/_model';
import { enAppSession } from '../_appmodel/sessionstorage';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { concatMap, delay, finalize, first, forkJoin, from, take } from 'rxjs';
import { NgbDateParserFormatter, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '../_appservice/dateformat';
import { AuthService } from '../authmodule/_authservice/auth.service';
declare var Razorpay: any;
declare var bootstrap: any;


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, SweetAlert2Module, NgbModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }, AuthService
  ],
})
export class CartComponent implements OnInit {


  @ViewChild('formModal', { static: true }) formModal!: TemplateRef<any>;

  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  @ViewChild('removecouponSwal')
  public readonly removecouponSwal!: SwalComponent;

  @ViewChild('deleteSwal')
  public readonly deleteSwal!: SwalComponent;


  @ViewChild('deletepackageSwal')
  public readonly deletepackageSwal!: SwalComponent;

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
  fgverify!: FormGroup;

  sales_person_name: string = '';
  sales_person_mobile: string = '';
  referal_person_name: string = '';
  referal_person_mobile: string = '';

  fguser!: FormGroup
  usercartdata: any = [];
  cart_master_id: number = 0;
  razorpay_OrderAttribute!: razorpay_OrderAttribute;
  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    public _fbuser: FormBuilder,
    private authService: AuthService,
    private _modalService: NgbModal,
    private _activatedRouter: ActivatedRoute,
    private _cdr: ChangeDetectorRef) {
    this._base._scriptLoaderService.load('script', 'https://checkout.razorpay.com/v1/checkout.js');
  }

  batch_id: any = null;
  reloadfreshdata() {
    this.resetCartValues().then(() => this.get_cart(this.batch_id))
      .then(() => this.loadShippingData());
  }

  ngOnInit(): void {
    this.batch_id = this._activatedRouter.snapshot.paramMap.get('batch_id');
    this.initform();
    if (this.batch_id == undefined || this.batch_id == null || this.batch_id == '') {
      this.batch_id = '00000000-0000-0000-0000-000000000000';
    }
    this._base._encryptedStorage.set(enAppSession.batch_id, this.batch_id);
    this.getcoupon().then((_rescoupon: any) => {
      if (_rescoupon) {
        this.get_cart(this.batch_id).then((_rescart: any) => {
          if (_rescart) {
            // this.calculatecart();
            this.loadShippingData();
          }
        })
      }
    })
  }

  initform() {
    this.fguser = this._fbuser.group({
      user_id: [0],
      fullname: ['', [Validators.required]],
      email_id: ['', [Validators.required]],
      address: ['', [Validators.required]]
    });

    this.fgverify = this._fbuser.group({
      mobile_number: ['', [Validators.required]],
      otp_code: ['']
    })
  }

  ismonthly: boolean = false;
  get_cart(batch_id: any = '00000000-0000-0000-0000-000000000000') {
    return new Promise((resolve, reject) => {

      // this.resetCartValues();  // IMPORTANT FIX

      this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {

        const useridOrBatch =
          (batch_id && batch_id !== '00000000-0000-0000-0000-000000000000')
            ? 0
            : user_id;

        this._webDService
          .getusercartdetail(batch_id, useridOrBatch, 0, 0, 0)
          .subscribe((resUserCart: any) => {

            this.UserCart = Array.isArray(resUserCart?.data)
              ? resUserCart.data
              : [];

            const products = this.UserCart[0]?.lst_cart_product ?? [];

            this.ismonthly = products.some((p: any) => p.ismonthly === true);

            products?.forEach((res: any) => { if (res.optionvalues && typeof res.optionvalues === 'string') { try { const parsed = JSON.parse(res.optionvalues); res.optionvaluesParsed = [JSON.parse(parsed)]; } catch (e) { console.warn('Invalid JSON for optionvalues:', res.optionvalues); res.optionvaluesParsed = []; } } else { res.optionvaluesParsed = []; } });

            setTimeout(() => {

              this.UserCart.forEach((item: any) => {
                this.cart_master_id = item.cart_master_id;
                this.cart_total += item.cart_total;
                this.cart_subtotal += item.cart_subtotal;
                this.cart_tax += item.cart_tax;
                this.cart_discount += item.cart_discount;

                this.Coupon_code_text = item.coupon_code || "";
                this.coupon_code = this.Coupon_code_text;
                this.coupon_code_id = item.coupon_id;

                this.Coupon_code_btn = this.coupon_code ? "Remove" : "Apply";
              });
              this._cdr.detectChanges();
            }, 1000);


            resolve(true);
          }, err => {
            resolve(true);
          });
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
    debugger
    if (rzr_response && rzr_response.status === 'success') {
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
              order_total: this._base._commonService.formatAmount(this.cart_total),
              order_subtotal: this._base._commonService.formatAmount(this.cart_subtotal),
              order_discount: this._base._commonService.formatAmount(this.cart_discount),
              order_tax: this._base._commonService.formatAmount(this.cart_tax),
              order_status: 'success',
              payment_status: 'success',
              sales_person_mobile: this.sales_person_mobile,
              sales_person_name: this.sales_person_name,
              referal_person_mobile: this.referal_person_mobile,
              referal_person_name: this.referal_person_name,
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
                }, 500);
              } else {
                this.failureSwal.fire();
                setTimeout(() => {
                  this.failureSwal.close();
                }, 500);
              }
            });
          });
        });
      }, 500);
    } else if (rzr_response && rzr_response.status === 'failure') {
      this.failureSwal.fire();
      setTimeout(() => {
        this.failureSwal.close();
      }, 500);
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

  calculateOrderSummary() {
    let subtotal = 0;
    debugger
    // 1. sum all product totals
    this.UserCart[0]?.lst_cart_product?.forEach((item: any) => {
      subtotal += Number(item.total_amount) || 0;
    });

    this.cart_subtotal = this._base._commonService.formatAmount(subtotal);

    // 2. Apply coupon discount (if any)
    // this.cart_discount = this.appliedCoupon?.discount_amount || 0;

    // 3. Tax calculation (ex. 18%)
    const amountAfterDiscount = this._base._commonService.formatAmount(subtotal - this.cart_discount);
    this.cart_tax = this._base._commonService.formatAmount(amountAfterDiscount * 0.18);

    // 4. Total payable
    this.cart_total = this._base._commonService.formatAmount(amountAfterDiscount + this.cart_tax);

    this._cdr.detectChanges();
  }


  removeFromCarts() {
    this.deletepackageSwal.fire().then(clicked => {

      if (!clicked.isConfirmed) return;

      this.deletepackageSwal.close();

      const monthlyItems = this.UserCart[0]?.lst_cart_product?.filter(
        (x: any) => x?.ismonthly
      );

      if (!monthlyItems?.length) return;

      // Convert array → stream (to run sequentially)
      from(monthlyItems)
        .pipe(
          concatMap((item: any) => {

            const sub_total = item.total_amount;
            const tax_total = sub_total * 0.18;
            const total_amount = sub_total + tax_total;

            const model = {
              user_cart_mapping_id: item.user_cart_mapping_id,
              cart_master_id: item.cart_master_id,
              product_id: item.product_id,
              product_name: item.product_name,
              user_id: item.user_id,
              attribute_amount: item.attribute_amount,
              total_amount: this._base._commonService.formatAmount(total_amount),
              cart_total: this._base._commonService.formatAmount(total_amount),
              sub_amount: this._base._commonService.formatAmount(sub_total),
              base_amount: item.base_amount,
              tax_amount: this._base._commonService.formatAmount(tax_total)
            };

            return this._webDService.remove_cart(model).pipe(
              delay(500) // 👉 delay between each API call
            );
          }),

          finalize(() => {
            // 👉 Called AFTER all API requests finish (success or fail)
            setTimeout(() => {
              this.reloadfreshdata();
            }, 800);
          })
        )
        .subscribe(
          (response: any) => {
            console.log("Each delete response:", response);
          }, (error: any) => {
            console.error("Error deleting cart items:", error);
          }
        );

    });
  }

  removeusercartModel: removeusercartModel = {};

  removeFromCart(item: any, _index: number) {

    this.deleteSwal.fire().then((clicked) => {

      if (!clicked.isConfirmed) return; // clean exit if cancelled

      const sub_total = Number(item?.total_amount) || 0;
      const tax_total = sub_total * 0.18;
      const total_amount = sub_total + tax_total;

      const removeModel = {
        user_cart_mapping_id: item?.user_cart_mapping_id,
        cart_master_id: item?.cart_master_id,
        product_id: item?.product_id,
        product_name: item?.product_name,
        user_id: item?.user_id,
        attribute_amount: item?.attribute_amount,
        total_amount: this._base._commonService.formatAmount(total_amount),
        cart_total: this._base._commonService.formatAmount(total_amount),
        sub_amount: this._base._commonService.formatAmount(sub_total),
        base_amount: item?.base_amount,
        tax_amount: this._base._commonService.formatAmount(tax_total),
      };

      console.log("removeusercartModel", removeModel);

      this._webDService.remove_cart(removeModel).subscribe(
        (response: any) => {
          if (response === 'deletesuccess') {
            this.delsuccessSwal.fire();

            // Recommended: update UI without reload
            this.removeItemFromLocalList(item);

            setTimeout(() => {
              this.delsuccessSwal.close();
              this._cdr.detectChanges();
            }, 700);
          }
        },
        (error) => {
          console.error("Error deleting cart item:", error);
        }
      );

    });

  }
  removeItemFromLocalList(item: any) {
    this.UserCart[0].lst_cart_product = this.UserCart[0].lst_cart_product
      .filter((x: any) => x.user_cart_mapping_id !== item.user_cart_mapping_id);

      this.reloadfreshdata();
    //this.calculateOrderSummary(); // If you have subtotal/tax/discount recalc
  }


  modifyuser(data: any, flag: any) {
    this._usercartMaster = { ...data };
    this._usercartMaster.flag = flag;
    debugger
    if (flag === 'DELETECART') {
      this.deleteSwal.fire().then((clicked) => {
        if (clicked.isConfirmed) {
          this._webDService.add_to_cart(this._usercartMaster).subscribe(
            (response: any) => {
              if (response === 'deletesuccess') {
                this.UserCart = this.UserCart.filter(
                  (item: any) => String(item.cart_master_id) !== String(data.cart_master_id)
                );
                this._cdr.detectChanges();
                this.delsuccessSwal.fire();
                setTimeout(() => {
                  this.delsuccessSwal.close();
                }, 1000);
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

  // private reloadCart() {
  //   this.get_cart(this.batch_id);
  //   // this.calculatecart();
  //   this._cdr.detectChanges();
  // }

  applycoupon() {
    this.is_valid = false;

    if (!this.Coupon_code_text?.trim()) {
      console.warn("Please enter a coupon code");
      this.is_valid = true;
      return;
    }

    Promise.all([
      this._base._encryptedStorage.get(enAppSession.user_id),
      this._base._encryptedStorage.get(enAppSession.fullname)
    ]).then(([user_id, full_name]) => {

      const coupon = this.couponList.find(
        x => x?.coupon_code?.trim() === this.Coupon_code_text.trim()
      );

      if (!coupon) {
        this.invalidcodeSwal.fire();
        setTimeout(() => this.invalidcodeSwal.close(), 800);
        return;
      }

      this._user_coupon_model = {
        flag: "NEWCOUPONCART",
        coupon_id: coupon.coupon_id,
        coupon_cart_mapid: 0,
        product_ids: "",
        user_id: user_id,
        cart_id: this.cart_master_id,
        createdname: full_name,
        createdby: user_id
      };

      this._webDService.apply_coupon(this._user_coupon_model)
        .subscribe((res: any) => {

          if (res?.includes("newsuccess")) {
            this.successSwal.fire();

            setTimeout(() => { this.reloadfreshdata(); this.successSwal.close(), this._cdr.detectChanges() }, 1000);
            // setTimeout(() => location.reload(), 2000);
          }
        });
    });
  }



  removecouponcode() {

    Promise.all([
      this._base._encryptedStorage.get(enAppSession.user_id),
      this._base._encryptedStorage.get(enAppSession.fullname)
    ]).then(([user_id, full_name]) => {

      this._user_coupon_model = {
        flag: "REMOVECOUPON",
        coupon_id: this.coupon_code_id,
        coupon_cart_mapid: 0,
        product_ids: "",
        user_id: 1,
        cart_id: this.cart_master_id,
        createdname: full_name,
        createdby: user_id
      };

      this._webDService.apply_coupon(this._user_coupon_model)
        .subscribe((resp: any) => {
          this.removecouponSwal.fire();

          if (resp?.includes("removesuccess")) {
            this.coupon_code = "";
            this.Coupon_code_btn = "Apply";
            this.Coupon_code_text = "";
            this.coupon_code_id = 0;
            this.resetCartValues();
            setTimeout(() => { this.reloadfreshdata(); this.removecouponSwal.close(), this._cdr.detectChanges() }, 1000);

          }

        });
    });
  }


  is_valid: boolean = false;
  _user_coupon_model: user_coupon_model = {};

  resetCartValues() {
    return new Promise((resolve, reject) => {

      this.cart_master_id = 0;
      this.cart_total = 0;
      this.cart_subtotal = 0;
      this.cart_tax = 0;
      this.cart_discount = 0;
      // this.coupon_code = "";
      // this.Coupon_code_btn = "Apply";
      // this.Coupon_code_text = "";
      // this.coupon_code_id = 0;
      resolve(true);
    });
  }

  calculatecart() {
    this.UserCart?.forEach((res: any) => {
      debugger
      this.cart_master_id = res?.cart_master_id;
      this.cart_total = +this._base._commonService.formatAmount((this.cart_total + res?.cart_total));
      this.cart_subtotal = +this._base._commonService.formatAmount((this.cart_subtotal + res?.cart_subtotal));
      this.cart_tax = +this._base._commonService.formatAmount((this.cart_tax + res?.cart_tax));
      this.cart_discount = +this._base._commonService.formatAmount((this.cart_discount + res?.cart_discount));
      this.Coupon_code_text = res?.coupon_code;
      this.coupon_code = res?.coupon_code;
      this.coupon_code_id = res?.coupon_id;
      this.Coupon_code_btn = (res?.coupon_code != '' && res?.coupon_code != undefined && res?.coupon_code != null) ? 'Remove' : 'Apply';
    });
    this._cdr.detectChanges();
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
      if (response ?? (response?.status == 'success')) {
        this.proceeds_payment(response);
      } else {
        console.log(response);
      }
    });
  }

  detailupdated: boolean = false;
  emptycartmessage: boolean = false;
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
    this.emptycartmessage = false;
    if (this.cart_total > 0) {
      this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
        this._base._encryptedStorage.get(enAppSession.fullname).then(fullname => {
          this._updateuserdetail.createdname = fullname;
          this._updateuserdetail.user_id = parseInt(user_id);
          this._webDService.update_userdetails(this._updateuserdetail).subscribe((response: any) => {
            let isRedirect: boolean = true
            if (response === 'details added') {
              this._base._encryptedStorage.set(enAppSession.address, this._updateuserdetail.address);
              this._base._encryptedStorage.set(enAppSession.fullname, this._updateuserdetail.fullname);
              this._base._encryptedStorage.set(enAppSession.email_id, this._updateuserdetail.email_id);
              this.detailupdated = true;
              setTimeout(() => {
                this.detailupdated = false;
                this.place_order();
              }, 500);
            }
            this._cdr.detectChanges();
          });
        });
      });
    } else {
      this.emptycartmessage = true;
    }
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
    this.emptycartmessage = false;
    const cartTab = document.querySelector('#ecomtab-tab-1');
    if (cartTab) {
      const tab = new bootstrap.Tab(cartTab);
      tab.show();
    }
  }

  public get modalService(): NgbModal {
    return this._modalService;
  }
  public set modalService(value: NgbModal) {
    this._modalService = value;
  }

  goToShipping() {
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      debugger
      if (user_id == '' || user_id == null || user_id == undefined) {
        user_id = 0;
      }
      this._base._encryptedStorage.get(enAppSession.fullname).then(fullname => {
        if ((!user_id || parseInt(user_id, 10) <= 0)) {
          this.modalService.open(this.formModal, {
            size: 'm',
            backdrop: true,
            centered: true
          });
          return;
        }
        const cartTab = document.querySelector('#ecomtab-tab-2');
        if (cartTab) {
          const tab = new bootstrap.Tab(cartTab);
          tab.show();
          this.loadShippingData();
        }
      });
    });
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
    return new Promise((resolve) => {
      this._webDService.getcoupon('all', 0, 'null', 0, 0, 0).subscribe(
        (res: any) => {
          this.couponList = [];
          if (res && Array.isArray(res.data)) {
            this.couponList = res.data.map((c: any, index: number) => {
              const colorSet = this.couponColors[index % this.couponColors.length];
              return { ...c, colorSet };
            });
          } else {
            this.couponList = [];
          }
          resolve(true);
        },
        (err) => {
          this.couponList = [];
          resolve(true);
        }
      );
    });
  }

  // Coupon_code_text: string = '';
  // Coupon_code_btn: string = 'Apply';

  applySuggestedCoupon(coupon_id: any, code: string) {
    this.Coupon_code_text = code;
    this.coupon_code_id = coupon_id;
    // this.coupon_code = code;
    // this.applycoupon();
  }


  _mobileverification: user_verification = {}
  verify_number(flag: string = 'MOBILE_VERIFY') {
    this._base._commonService.markFormGroupTouched(this.fgverify);
    if (this.fgverify.valid) {
      this._mobileverification.mobile_number = this.fgverify.value.mobile_number;
      this._mobileverification.otp_code = this.fgverify.value.otp_code;
      this.addverify();
    }
  }

  isOTPsent: boolean = false;
  isverifybutton: boolean = false;
  OTPValue: string = '';
  invalidOTP: boolean = false;
  addverify() {
    this.invalidOTP = false;
    // this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
    //   this._base._encryptedStorage.get(enAppSession.fullname).then(fullname => {
    this._mobileverification.flag = this.isverifybutton ? 'VERIFY_OTP' : 'MOBILE_VERIFY';
    this._mobileverification.createdname = 'system';
    this._mobileverification.createdby = 0;
    this._webDService.mobile_verification(this._mobileverification).subscribe({
      next: (response: any) => {
        if (response.includes('otp_sent_success~')) {
          const parts = response.split("~");
          this.isOTPsent = true;
          this.isverifybutton = true;
          this.OTPValue = parts[1];
          this._webDService.sendOtp(this._mobileverification.mobile_number, this.OTPValue).subscribe((res: any) => {
            console.log("OTP", res)
          })
          this._cdr.detectChanges();
        } else if (response.includes('otp_verify')) {
          this.OTPValue = '';
          this.modalService.dismissAll();
          this.SignInCustomer(this._mobileverification.mobile_number, this._mobileverification.otp_code);
          console.warn('otp_verify response:', response);
        } else {
          this.invalidOTP = true;
        }
      },
      complete: () => { },
      error: (err) => {
        console.error('Mobile verification failed:', err);
        // optional: Swal error toast here
      }
    });
    //   });
    // });
  }

  hasError: boolean = false;
  SignInCustomer(_username: string = '', _passsword: string = '') {
    this.hasError = false;
    const loginSubscr = this.authService
      .login(_username, _passsword)
      .pipe(first())
      .subscribe((user: userModel | undefined) => {
        if (user) {
          this.getUserConfig(user.user_id).then((resUserConfig: any) => {
            this._base._appSessionService.setUserSession(user, (resUserConfig as any[])[0]).subscribe((res: any) => {
              if (res) {
                this.move_to_cart();
              }
            });
          });
        } else {
          this.hasError = true;
        }
      });
  }
  getUserConfig(user_id: any) {
    return new Promise((resolve, reject) => {
      this._webDService.getuserconfig(user_id).subscribe((resUserModule: any) => {
        let UserModule = [];
        UserModule = Array.isArray(resUserModule) ? resUserModule : [];
        resolve(UserModule)
      }, error => {
        resolve(false);
      });
    });
  }

  @ViewChild('loginsuccessSwal')
  public readonly loginsuccessSwal!: SwalComponent;

  move_to_cart() {
    this.modalService.dismissAll();
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this._webDService.update_to_cart(this.batch_id, user_id).subscribe((res: any) => {
        this.loginsuccessSwal.fire();
        setTimeout(() => {
          this.loginsuccessSwal.close();
          const cartTab = document.querySelector('#ecomtab-tab-2');
          if (cartTab) {
            const tab = new bootstrap.Tab(cartTab);
            tab.show();
            this.loadShippingData();
          }
          this._cdr.detectChanges();
        }, 1000);
      })
    })
  }

}
