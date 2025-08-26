import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { WebDService } from '../_appservice/webdpanel.service';
import { BaseServiceHelper } from '../_appservice/baseHelper.service';
import { MultiselectComponent } from '../layout_template/multiselect/multiselect.component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { categoryMaster, productMaster } from '../_appmodel/_model';
import { CommonModule } from '@angular/common';
import { NgbDateParserFormatter, NgbDateStruct, NgbInputDatepicker, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '../_appservice/dateformat';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [MultiselectComponent, ReactiveFormsModule, FormsModule, CommonModule, NgbModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ]
})
export class ProductComponent implements OnInit {

  @ViewChild("from_date", { static: true }) from_date!: NgbInputDatepicker;
  @ViewChild("to_date", { static: true }) to_date!: NgbInputDatepicker;

  _categoryRouteMaster: categoryMaster = {};
  _categoryScreenMaster: productMaster = {};
  _categoryTimeMaster: categoryMaster = {};
  _categoryTypeMaster: categoryMaster = {};
  _categoryPropertyMaster: categoryMaster = {};
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
      lstcategoryslab: this._fbCategoryMaster.array([]),
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
      this.getoptionvalues('Time Slot', this._categoryScreenMaster.product_id).then((res: any) => {
        this.TimeMaster = [];
        this.TimeMaster = res;
        this._cdr.detectChanges();
        console.log(" this.TimeMaster", this.TimeMaster)
      });
      this.getoptionvalues('Screen Interval', this._categoryScreenMaster.product_id).then((res: any) => {
        this.ScreenRepeMaster = [];
        this.ScreenRepeMaster = res;
        this._cdr.detectChanges();
        console.log(" this.Screen Interval", this.ScreenRepeMaster)
      });
    }
  }

  get timeArray(): FormArray {
    return this.fgcategorymaster.get("lstcategoryslab") as FormArray
  }

  onSelecttimeslot($event: any) {
    if ($event && $event != null && $event != '' && $event.length > 0) {


    }
  }

  onSelectEvent($event: any) {
    if ($event && $event != null && $event != '') {
      const _itemTime = this.TimeMaster.filter((x: any) => x.option_value_id === $event?.option_value_id);
      const _itemRepe = this.ScreenRepeMaster.filter((x: any) => x.option_value_id === $event?.option_value_id);

      console.log("select : ", _itemTime, this._categoryRouteMaster);
      let control: FormGroup = this._fbCategoryMaster.group({
        route_category_id: [this._categoryRouteMaster.category_id],
        route_category: [this._categoryRouteMaster.category],
        scree_category_id: [this._categoryScreenMaster.product_id],
        screen_category: [this._categoryScreenMaster.product_name],
        timeslot_category_id: [$event ? $event?.option_value_id : 0],
        timeslot_category: [$event ? $event?.option_value : ''],
        from_date: [''],
        to_date: [''],
        total_price: [(this._categoryScreenMaster.base_price + (_itemTime ? _itemTime[0]?.price_delta : 0.00))],
        repetition_price: [_itemRepe ? _itemRepe[0]?.price_delta : 0.00],
        base_price: [this._categoryScreenMaster.base_price],
        timeslot_price: [_itemTime ? _itemTime[0]?.price_delta : 0.00],
        screen_interval: [[{ "option_value_id": 2, "option_value": "Afternoon" }]],
      });
      console.log("control : ", control);
      this.timeArray.push(control);
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
    debugger
    if (selectedValue != '' && selectedValue != undefined && selectedValue != null) {
      const selectedItem = this.ScreenRepeMaster.find((x: any) => x.option_value_id == selectedValue);
      let obj = this.timeArray.at(_index) as FormGroup;

      obj.controls["repetition_price"].setValue(selectedItem ? selectedItem?.price_delta : 0.00);
      obj.controls['repetition_price'].updateValueAndValidity()
      obj.controls["total_price"].setValue( + (obj.controls["total_price"].value)+(selectedItem[0] ? selectedItem[0]?.price_delta : 0.00) + (obj.controls["repetition_price"].value));
      obj.controls['total_price'].updateValueAndValidity()
      console.log("obj", obj)
      this._cdr.detectChanges();
    }

  }

}

