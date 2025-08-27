import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BaseServiceHelper } from '../_appservice/baseHelper.service';
import { WebDService } from '../_appservice/webdpanel.service';
import { FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from "@angular/router";

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {

  UserCart: any;
  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    public _fbcoupon: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private modalService: NgbModal,) {

  }
  ngOnInit(): void {
    this.get_cart();
  }

  // get_cart() {
  //   this._webDService.getusercartdetail(0, 0, 0,0,0).subscribe((resUserCart: any) => {
  //     this.UserCart = resUserCart.data;
  //     this.UserCart = Array.isArray(resUserCart.data) ? resUserCart.data : [];
  //     this.UserCart.filter((res: any) => {
  //       res.optionvalues = res.optionvalues ? JSON.parse(res.optionvalues) : '';
  //     })
  //     this._cdr.detectChanges();
  //   });
  // }

  // get_cart() {
  //   this._webDService.getusercartdetail(0, 0, 0, 0, 0).subscribe((resUserCart: any) => {
  //     this.UserCart = Array.isArray(resUserCart.data) ? resUserCart.data : [];

  //     this.UserCart.forEach((res: any) => {
  //       if (res.optionvalues && typeof res.optionvalues === 'string') {
  //         try {
  //           const parsed = JSON.parse(res.optionvalues);

  //           // ✅ Ensure it's always an array
  //           res.optionvaluesParsed = Array.isArray(parsed) ? parsed : [parsed];

  //         } catch (e) {
  //           console.warn('Invalid JSON for optionvalues:', res.optionvalues);
  //           res.optionvaluesParsed = [];
  //         }
  //       } else {
  //         res.optionvaluesParsed = [];
  //       }
  //     });

  //     this._cdr.detectChanges();
  //   });
  // }

  get_cart() {
  this._webDService.getusercartdetail(0, 0, 0, 0, 0).subscribe((resUserCart: any) => {
    console.log('API raw response:', resUserCart.data);  // 👀 check here

    this.UserCart = Array.isArray(resUserCart.data) ? resUserCart.data : [];

    this.UserCart.forEach((res: any) => {
      if (res.optionvalues && typeof res.optionvalues === 'string') {
        try {
           console.log('res:',res);
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
console.log("UserCart",this.UserCart)
    this._cdr.detectChanges();
  });
}

}
