import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { WebDService } from '../_appservice/webdpanel.service';
import { BaseServiceHelper } from '../_appservice/baseHelper.service';
import { MultiselectComponent } from '../layout_template/multiselect/multiselect.component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { categoryMaster, productMaster, usercartmappingModel, usercartMaster } from '../_appmodel/_model';
import { CommonModule } from '@angular/common';
import { SweetAlertOptions } from 'sweetalert2';
import { NgbDateParserFormatter, NgbDateStruct, NgbInputDatepicker, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '../_appservice/dateformat';
import { enAppSession } from '../_appmodel/sessionstorage';
import { RouterModule } from '@angular/router';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [MultiselectComponent, ReactiveFormsModule,SweetAlert2Module, FormsModule, CommonModule, NgbModule, RouterModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ]
})
export class ProductComponent implements OnInit {

  @ViewChild("from_date", { static: true }) from_date!: NgbInputDatepicker;
  @ViewChild("to_date", { static: true }) to_date!: NgbInputDatepicker;

  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  swalOptions: SweetAlertOptions = { buttonsStyling: false };


  _categoryRouteMaster: categoryMaster = {};
  _categoryScreenMaster: productMaster = {};
  _categoryTimeMaster: categoryMaster = {};
  _categoryTypeMaster: categoryMaster = {};
  _categoryPropertyMaster: categoryMaster = {};
  _categoryrepetition: any = {};
  fgcategorymaster!: FormGroup;
  ScreenMaster: any = [];
  ScreenRepeMaster: any = [];
  RouteMaster: any = [];
  TypeMaster: any = [];
  PropertyMaster: any = [];
  TimeMaster: any = [];
  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    public _fbCategoryMaster: FormBuilder,
    private _cdr: ChangeDetectorRef) {
    const current = new Date();
    this.minDate = { year: current.getFullYear(), month: current.getMonth(), day: current.getDate() };
    this.maxDate = { year: current.getFullYear() + 1, month: current.getMonth(), day: current.getDate() };
  }

  public _screentype: IDropdownSettings = {
    singleSelection: true,
    idField: 'category_id',
    textField: 'category',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  public _propertytype: IDropdownSettings = {
    singleSelection: true,
    idField: 'category_id',
    textField: 'category',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  public _route: IDropdownSettings = {
    singleSelection: true,
    idField: 'category_id',
    textField: 'category',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };
  public _screen: IDropdownSettings = {
    singleSelection: true,
    idField: 'product_id',
    textField: 'product_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  public _screenRepe: IDropdownSettings = {
    singleSelection: true,
    idField: 'option_value_id',
    textField: 'option_value',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };
  public _timeslot: IDropdownSettings = {
    singleSelection: false,
    idField: 'option_value_id',
    textField: 'option_value',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  ngOnInit(): void {
    this.initform();
    this.gettypecategory();
    // this.gettimeslot();
  }

  initform() {
    this.fgcategorymaster = this._fbCategoryMaster.group({
      category_id: [0],
      lstroute: [''],
      lsttype: [''],
      lstproperty: [''],
      lstscreen: [''],
      lsttimeslot: [''],
      lst_cart_product: this._fbCategoryMaster.array([]),
      final_price: ['']
    })
  }

  getroute(parent_category_id: number = 0) {
    this._webDService.getcategory('all', 0, 'selected_area', 0, 'null', false, parent_category_id, 'null', 0, 0).subscribe((resCategory: any) => {
      this.RouteMaster = resCategory.data;
      this.RouteMaster = Array.isArray(resCategory.data) ? resCategory.data : [];
      this._cdr.detectChanges();
    });
  }
  getscreen(category_id: number = 0) {
    this._webDService.getproduct('all', 0, category_id).subscribe((resProduct: any) => {
      this.ScreenMaster = resProduct.data;
      this.ScreenMaster = Array.isArray(resProduct.data) ? resProduct.data : [];
      this._cdr.detectChanges();
    });
  }
  gettimeslot() {
    this._webDService.getcategory('all', 0, 'time_slots', 0, 'null', false, 0, 'null', 0, 0).subscribe((resCategory: any) => {
      this.TimeMaster = resCategory.data;
      this.TimeMaster = Array.isArray(resCategory.data) ? resCategory.data : [];
      this._cdr.detectChanges();
    });
  }
  gettypecategory() {
    this._webDService.getcategory('all', 0, 'vehicle_type', 0, 'null', false, 0, 'null', 0, 0).subscribe((resCategory: any) => {
      this.TypeMaster = resCategory.data;
      this.TypeMaster = Array.isArray(resCategory.data) ? resCategory.data : [];
      this._cdr.detectChanges();
    });
  }
  getpropertycategory(parent_category_id: number) {
    this._webDService.getcategory('all', 0, 'product_type', 0, 'null', false, parent_category_id, 'null', 0, 0).subscribe((resCategory: any) => {
      this.PropertyMaster = resCategory.data;
      this.PropertyMaster = Array.isArray(resCategory.data) ? resCategory.data : [];
      this._cdr.detectChanges();
    });
  }


  onSelecttype($event: any) {
    if ($event && $event != null && $event != '' && $event.length > 0) {
      this._categoryTypeMaster.category_id = ($event[0]?.category_id);
      this._categoryTypeMaster.category = ($event[0]?.category);
      this.getpropertycategory(this._categoryTypeMaster.category_id);
    }
  }
  onSelectproperty($event: any) {
    if ($event && $event != null && $event != '' && $event.length > 0) {
      this._categoryPropertyMaster.category_id = ($event[0]?.category_id);
      this._categoryPropertyMaster.category = ($event[0]?.category);
      this.getroute(this._categoryPropertyMaster.category_id);
    }
  }
  onSelectroute($event: any) {
    if ($event && $event != null && $event != '' && $event.length > 0) {
      this._categoryRouteMaster.category_id = ($event[0]?.category_id);
      this._categoryRouteMaster.category = ($event[0]?.category);
      this.getscreen(this._categoryRouteMaster.category_id);
    }
  }

  onSelectscreen($event: any) {
    if ($event && $event != null && $event != '' && $event.length > 0) {
      const _item = this.ScreenMaster.filter((x: any) => x.product_id === $event[0]?.product_id);
      console.log("$event", _item)
      this._categoryScreenMaster.product_id = ($event[0]?.product_id);
      this._categoryScreenMaster.product_name = ($event[0]?.product_name);
      this._categoryScreenMaster.base_price = (_item ? _item[0]?.base_price : 0.00);
      this._totalAmount = (this._totalAmount + this._categoryScreenMaster.base_price)
      this.getoptionvalues('Time Slot', this._categoryScreenMaster.product_id).then((res: any) => {
        this.TimeMaster = [];
        this.TimeMaster = res;
        this._cdr.detectChanges();
        console.log(" this.TimeMaster", this.TimeMaster)
      });
      this.getoptionvalues('Repetition', this._categoryScreenMaster.product_id).then((res: any) => {
        this.ScreenRepeMaster = [];
        this.ScreenRepeMaster = res;
        this._cdr.detectChanges();
        console.log(" this.Screen Interval", this.ScreenRepeMaster)
      });
    }
  }

  get timeArray(): FormArray {
    return this.fgcategorymaster.get("lst_cart_product") as FormArray
  }

  onSelecttimeslot($event: any) {
    if ($event && $event != null && $event != '' && $event.length > 0) {


    }
  }
  _indexTimearray: any = [];
  _index_time: number = 0;
  _totalAmount = 0;
  onSelectEvent($event: any) {
    if ($event && $event != null && $event != '') {

      const _itemTime = this.TimeMaster.filter((x: any) => x.option_value_id === $event?.option_value_id);
      const _itemRepe = this.ScreenRepeMaster.filter((x: any) => x.option_value_id === $event?.option_value_id);

      console.log("select : ", _itemTime, this._categoryRouteMaster);
      let control: FormGroup = this._fbCategoryMaster.group({
        route_category_id: [this._categoryRouteMaster.category_id],
        route_category: [this._categoryRouteMaster.category],
        product_id: [this._categoryScreenMaster.product_id],
        product_name: [this._categoryScreenMaster.product_name],
        timeslot_category_id: [$event ? $event?.option_value_id : '', [Validators.required]],
        timeslot_category: [$event ? $event?.option_value : '', [Validators.required]],
        from_date: ['', [Validators.required]],
        to_date: ['', [Validators.required]],
        total_amount: [(this._categoryScreenMaster.base_price + (_itemTime ? _itemTime[0]?.price_delta : 0.00))],
        repetition_price: [_itemRepe ? _itemRepe[0]?.price_delta : '', [Validators.required]],
        base_price: [this._categoryScreenMaster.base_price],
        timeslot_price: [_itemTime ? _itemTime[0]?.price_delta : 0.00],
        repetition_category_id: [],
        repetition_category: [],
        attribute_amount: 0.00,
      });

      console.log("control : ", control);
      // let obj = this.timeArray.at(this._index_time - 1) as FormGroup;
      // if (obj != undefined) {
      //   this._base._commonService.markFormGroupTouched(obj);
      //   if (obj.valid) {
      //     this._indexTimearray.push(this._index_time + 1);
      //     this.timeArray.push(control);
      //   } else {
      //     const selected = this.fgcategorymaster.get('lsttimeslot')?.value || [];
      //     const updated = selected.filter((x: any) => x.option_value_id !== $event.option_value_id);
      //     this.fgcategorymaster.get('lsttimeslot')?.setValue(updated);
      //   }
      // } else {
      //   this._indexTimearray.push(this._index_time + 1);
      this.timeArray.push(control);
      //   this._index_time++
      // }
    }
  }
  onDeSelectEvent($event: any) {
    if ($event && $event != null && $event != '') {
      console.log("Deselect : ", $event);
      const _indexTime = this.timeArray.controls.findIndex((ctrl: any) => {
        return ctrl.value.timeslot_category_id === $event?.category_id;
      });
      this.timeArray.removeAt(_indexTime);
    }
  }
  get_product_price(product_id: number) {
    return this.ScreenMaster.filter((res: any) => {
      res.product_id == product_id
    })
  }

  getoptionvalues(flag: string = 'Time Slot', product_id: number = 0) {
    return new Promise((resolve, rejects) => {
      this._webDService.getoptionvalue(flag, product_id).subscribe((rescategoryMaster: any) => {
        let _optionvalues = [];
        _optionvalues = Array.isArray(rescategoryMaster.data) ? rescategoryMaster.data : [];

        resolve(_optionvalues)
      }, error => {
        resolve(false)
      })
    });
  }

  onRepetitionChange($event: any, _index: number) {
    const selectedValue = $event.target.value;
    if (selectedValue != '' && selectedValue != undefined && selectedValue != null) {
      const selectedItem = this.ScreenRepeMaster.find((x: any) => x.option_value_id == selectedValue);
      let obj = this.timeArray.at(_index) as FormGroup;
      obj.controls["repetition_category"].setValue(selectedItem ? selectedItem?.option_value : '');
      obj.controls["repetition_category_id"].setValue(selectedItem ? selectedItem?.option_value_id : 0);
      obj.controls["repetition_price"].setValue(selectedItem ? selectedItem?.price_delta : 0.00);
      obj.controls['repetition_price'].updateValueAndValidity()
      obj.controls["total_amount"].setValue((obj.controls["total_amount"].value) + (selectedItem[0] ? selectedItem[0]?.price_delta : 0.00) + (obj.controls["repetition_price"].value));
      obj.controls['total_amount'].updateValueAndValidity();
      obj.controls["attribute_amount"].setValue((obj.controls["repetition_price"].value) + (obj.controls["timeslot_price"].value))
      obj.controls["attribute_amount"].updateValueAndValidity()
      console.log("obj", obj)
      this._cdr.detectChanges();
    }

  }

  _usercartMaster: usercartMaster = {};
  _usercartmappingModel: usercartmappingModel = {};
  add_to_cart() {
    debugger
    this._base._commonService.markFormGroupTouched(this.fgcategorymaster)
    if (this.fgcategorymaster.valid) {
      this.fgcategorymaster.value.lst_cart_product.filter((res: any) => res.from_date && typeof res.from_date == 'object' ? res.from_date = `${res.from_date.year}-${res.from_date.month}-${res.from_date.day}` : res.from_date)
      this.fgcategorymaster.value.lst_cart_product.filter((res: any) => res.to_date && typeof res.to_date == 'object' ? res.to_date = `${res.to_date.year}-${res.to_date.month}-${res.to_date.day}` : res.to_date)
      let _objFormData: any = this.fgcategorymaster.value.lst_cart_product;
      this.proceed_to_cart(_objFormData);
    }
  }

  proceed_to_cart(_form_data: any = null) {
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this._base._encryptedStorage.get(enAppSession.fullname).then(fullname => {
        debugger
        let _value_object: any = [];
        let _attriAmount = 0.00;
        _form_data?.filter((_item: any) => {
          _value_object?.push({
            timeslot_category_id: _item.timeslot_category_id,
            timeslot_category: _item.timeslot_category,
            timeslot_price: _item.timeslot_price,
            from_date: _item.from_date,
            to_date: _item.to_date,
            route_category_id: _item.route_category_id,
            route_category: _item.route_category,
            product_id: _item.product_id,
            product_name: _item.product_name,
            repetition_category_id: _item.repetition_category_id,
            repetition_category: _item.repetition_category,
            repetition_price: _item.repetition_price,
            attribute_amount: _item.attribute_amount,
            total_amount: _item.total_amount,
          });
          _attriAmount = (_attriAmount ? _attriAmount : 0.00) + _item.attribute_amount;
        })
        this._usercartmappingModel = {
          base_amount: this._categoryScreenMaster.base_price,
          product_id: this._categoryScreenMaster.product_id,
          total_amount: this._totalAmount,
          attribute_amount: _attriAmount,
          user_id: user_id,
          optionvalues: JSON.stringify(_value_object)
        }
        let _cart_subtotal = (this._totalAmount + _attriAmount);
        let _cart_discount = 0.00;
        let _cart_after_discount = (_cart_subtotal - _cart_discount);
        let _cart_tax = (_cart_after_discount * (18 / 100));
        let _cart_after_tax = (_cart_after_discount + _cart_tax);
        let _cart_total = (_cart_after_tax);

        this._usercartMaster = {
          flag: 'NEWCART',
          createdname: fullname,
          user_id: parseInt(user_id),
          lst_cart_product: [this._usercartmappingModel],
          coupon_id: 0,
          coupon_code: '',
          cart_total: _cart_total,
          cart_subtotal: _cart_subtotal,
          cart_discount: 0.00,
          cart_tax: _cart_tax
        }
        this._webDService.add_to_cart(this._usercartMaster).subscribe((response: any) => {
          this.successSwal.fire();
          setTimeout(() => {
            this._base._router.navigate(['/app/cart']);
          }, 500);

        },error=>{

        });
      });
    });


    console.log("cartModel", this.fgcategorymaster.value.lst_cart_product);
  }

}

