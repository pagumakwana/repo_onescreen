import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { WebDService } from '../_appservice/webdpanel.service';
import { BaseServiceHelper } from '../_appservice/baseHelper.service';
import { MultiselectComponent } from '../layout_template/multiselect/multiselect.component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { categoryMaster, productMaster, user_verification, usercartmappingModel, usercartMaster, userModel } from '../_appmodel/_model';
import { CommonModule } from '@angular/common';
import { SweetAlertOptions } from 'sweetalert2';
import { NgbDateParserFormatter, NgbDatepickerModule, NgbDateStruct, NgbInputDatepicker, NgbModal, NgbModalOptions, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '../_appservice/dateformat';
import { enAppSession } from '../_appmodel/sessionstorage';
import { RouterModule } from '@angular/router';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AuthService } from '../authmodule/_authservice/auth.service';
import { first } from 'rxjs';
// import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [MultiselectComponent, ReactiveFormsModule, SweetAlert2Module, FormsModule, CommonModule, NgbModule, RouterModule, NgbDatepickerModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }, AuthService
  ],
})
export class ProductComponent implements OnInit {

  @ViewChild("from_date", { static: true }) from_date!: NgbInputDatepicker;
  @ViewChild("to_date", { static: true }) to_date!: NgbInputDatepicker;
  @ViewChild("from_date_month", { static: true }) from_date_month!: NgbInputDatepicker;

  // ngAfterViewInit(): void {
  //   const popoverTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="popover"]'));
  //   popoverTriggerList.forEach(el => {
  //     new bootstrap.Popover(el);
  //   });
  // }


  @ViewChild('formModal', { static: true }) formModal!: TemplateRef<any>;
  // public formModal!: NgbModalRef;
  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  public get modalService(): NgbModal {
    return this._modalService;
  }
  public set modalService(value: NgbModal) {
    this._modalService = value;
  }
  swalOptions: SweetAlertOptions = { buttonsStyling: false };


  _categoryRouteMaster: categoryMaster = {};
  _categoryScreenMaster: productMaster = {};
  _categoryTimeMaster: categoryMaster = {};
  _categoryTypeMaster: categoryMaster = {};
  _categoryPropertyMaster: categoryMaster = {};
  _categoryrepetition: any = {};
  _categoryinterval: any = {};
  fgcategorymaster!: FormGroup;
  ScreenMaster: any = [];
  ScreenRepeMaster: any = [];
  ScreenIntervalMaster: any = [];
  RouteMaster: any = [];
  TypeMaster: any = [];
  PropertyMaster: any = [];
  TimeMaster: any = [];
  minfromDate: NgbDateStruct | null = null;
  maxfromDate: NgbDateStruct | null = null;
  mintoDate: NgbDateStruct | null = null;
  maxtoDate: NgbDateStruct | null = null;
  minmonth: NgbDateStruct | null = null;
  maxmonth: NgbDateStruct | null = null;
  ConfigMaster: any = [];

  fgverify!: FormGroup;

  public modalRef!: NgbModalRef;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    public _fbCategoryMaster: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _modalService: NgbModal,
    private authService: AuthService,) {
    const current = new Date();
    this.minfromDate = { year: current.getFullYear(), month: current.getMonth() + 1, day: current.getDate() };
    this.maxfromDate = { year: current.getFullYear() + 1, month: current.getMonth(), day: current.getDate() };
    this.mintoDate = { year: current.getFullYear(), month: current.getMonth() + 1, day: current.getDate() };
    this.maxtoDate = { year: current.getFullYear() + 1, month: current.getMonth(), day: current.getDate() };
    console.log('from_date', this.minfromDate, this.maxfromDate)
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
  public _screenInterval: IDropdownSettings = {
    singleSelection: true,
    idField: 'option_value_id',
    textField: 'option_value',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  ConfigDetailsMaster: any = [
    { config_name: 'Sunday' },
    { config_name: 'Monday' },
    { config_name: 'Tuesday' },
    { config_name: 'Wednesday' },
    { config_name: 'Thursday' },
    { config_name: 'Friday' },
    { config_name: 'Saturday' }
  ];

  ngOnInit(): void {
    this._base._scriptLoaderService.load('widget', '../../assets/js/plugins/wizard.min.js');
    this._base._encryptedStorage.get(enAppSession.batch_id).then((batch_id: any) => {
      debugger
      this.batch_id = (batch_id == null || batch_id == '' || batch_id == undefined) ? null : batch_id;
      this.initform();
      this.get_config();
      this.gettypecategory();
    })
  }

  private toNgbDate(date: Date): NgbDateStruct {
    return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
  }
  batch_id: any;
  initform() {
    this.fgcategorymaster = this._fbCategoryMaster.group({
      category_id: [0],
      lstroute: [''],
      lsttype: [''],
      lstproperty: [''],
      lstscreen: [''],
      lsttimeslot: [''],
      lst_cart_product: this._fbCategoryMaster.array([]),
      final_price: [''],
      from_date_month: ['']
    });

    this.fgverify = this._fbCategoryMaster.group({
      mobile_number: ['', [Validators.required]],
      otp_code: ['']
    });

    // this.batch_id = localStorage.getItem('batch_id');
  }
  get_config() {
    this._webDService.getportalconfig('all', 0, 'null', 'day').subscribe((resCategory: any) => {
      this.ConfigMaster = resCategory.data;
      this.ConfigMaster = Array.isArray(resCategory.data) ? resCategory.data : [];
      console.log("ConfigMaster", this.ConfigMaster);
      this._cdr.detectChanges();
    });
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
      this.TypeMaster = this.TypeMaster.map((item: any) => ({
        ...item,          // keep existing properties
        isChecked: false  // add new key
      }));
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


  onSelecttype($event: any, _index: number = 0) {
    if ($event && $event != null && $event != '') {
      this.TypeMaster.forEach((item: any, i: number) => item.isChecked = i === _index);
      this._categoryTypeMaster.category_id = ($event?.category_id);
      this._categoryTypeMaster.category = ($event?.category);
      this.getpropertycategory(this._categoryTypeMaster.category_id);
      this._wizard_index = 1;
    }
  }

  onSelectproperty($event: any, _index: number = 0) {
    if ($event && $event != null && $event != '') {
      this.PropertyMaster.forEach((item: any, i: number) => item.isChecked = i === _index);
      this._categoryPropertyMaster.category_id = ($event?.category_id);
      this._categoryPropertyMaster.category = ($event?.category);
      this.getroute(this._categoryPropertyMaster.category_id);
      this._wizard_index = 2;
    }
  }

  onSelectroute($event: any, _index: number = 0) {
    if ($event && $event != null && $event != '') {
      this.RouteMaster.forEach((item: any, i: number) => item.isChecked = i === _index);
      this._categoryRouteMaster.category_id = ($event?.category_id);
      this._categoryRouteMaster.category = ($event?.category);
      this.getscreen(this._categoryRouteMaster.category_id);
      this._wizard_index = 3;
    }
  }

  onSelectscreen($event: any, _index: number = 0) {
    if ($event && $event != null && $event != '') {
      this.ScreenMaster.forEach((item: any, i: number) => item.isChecked = i === _index);
      const _item = this.ScreenMaster.filter((x: any) => x.product_id === $event?.product_id);
      this._categoryScreenMaster.product_id = ($event?.product_id);
      this._categoryScreenMaster.product_name = ($event?.product_name);
      this._categoryScreenMaster.base_amount = (_item ? _item[0]?.base_amount : 0.00);
      // this._totalAmount = (this._totalAmount + this._categoryScreenMaster.base_amount)
      this.getoptionvalues('Time Slot', this._categoryScreenMaster.product_id).then((res: any) => {
        this.TimeMaster = [];
        this.TimeMaster = res;
        this.TimeMaster = this.TimeMaster.map((item: any) => ({
          ...item,          // keep existing properties
          isChecked: false,
          isDisabled: false  // add new key
        }));
        this._cdr.detectChanges();
        console.log(" this.TimeMaster", this.TimeMaster)
      });
      this.getoptionvalues('Repetition', this._categoryScreenMaster.product_id).then((res: any) => {
        this.ScreenRepeMaster = [];
        this.ScreenRepeMaster = res;
        this._cdr.detectChanges();
        console.log(" this.Screen Interval", this.ScreenRepeMaster)
      });
      this.getoptionvalues('Interval', this._categoryScreenMaster.product_id).then((res: any) => {
        this.ScreenIntervalMaster = [];
        this.ScreenIntervalMaster = res;
        this._cdr.detectChanges();
        console.log(" this.Screen Interval", this.ScreenIntervalMaster)
      });
      this._wizard_index = 4;
    }
  }

  get timeArray(): FormArray {
    return this.fgcategorymaster.get("lst_cart_product") as FormArray
  }

  _indexTimearray: any = [];
  _index_time: number = 0;
  _totalAmount = 0;
  isRepetitionExists(repId: number): boolean {
    return this.timeArray.controls.some((group: AbstractControl) => {
      return (group as FormGroup).get('timeslot_category_id')?.value === repId;
    });
  }
  removefromarray(repId: number) {
    const index = this.timeArray.controls.findIndex((group: AbstractControl) =>
      (group as FormGroup).get('timeslot_category_id')?.value === repId
    );

    if (index !== -1) {
      this.timeArray.removeAt(index);   // ✅ remove that FormGroup
      console.log(`Removed repetition_category_id ${repId} from timeArray`);
    }
  }

  ismonthly: boolean = false;
  onSelectPackageEvent() {
    const today = new Date();

    this.TimeMaster?.filter((_timeslot: any, _index: any) => {
      this.TimeMaster[_index].isChecked = false;
      if (this.isRepetitionExists(_timeslot?.option_value_id)) {
        this.removefromarray(_timeslot?.option_value_id);
      }
    });
    // initial restriction (today + 1 month)
    this.minmonth = { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };

    this.ismonthly = !this.ismonthly;
    if (this.ismonthly) {
      this.TimeMaster?.filter((_timeslot: any, _index: any) => {
        this.TimeMaster[_index].isChecked = !this.TimeMaster[_index].isChecked;
        // const _itemTime = this.TimeMaster.filter((x: any) => x.option_value_id === $event?.option_value_id);
        const _itemRepe = this.ScreenRepeMaster.filter((x: any) => x.option_value === "Repetition 4");
        const _itemInterval = this.ScreenIntervalMaster.filter((x: any) => x.option_value === "Upto 30 Seconds");
        if (this.isRepetitionExists(_timeslot?.option_value_id)) {
          this.removefromarray(_timeslot?.option_value_id);
        } else {
          this.timemastervalid = false;
          let control: FormGroup = this._fbCategoryMaster.group({
            route_category_id: [this._categoryRouteMaster.category_id],
            route_category: [this._categoryRouteMaster.category],
            product_id: [this._categoryScreenMaster.product_id],
            product_name: [this._categoryScreenMaster.product_name],
            timeslot_category_id: [_timeslot ? _timeslot?.option_value_id : '', [Validators.required]],
            timeslot_category: [_timeslot ? _timeslot?.option_value : '', [Validators.required]],
            from_date: ['', [Validators.required]],
            to_date: ['', [Validators.required]],
            total_amount: [this._categoryScreenMaster.base_amount],
            base_amount: [this._categoryScreenMaster.base_amount],
            timeslot_price: [_timeslot ? _timeslot?.price_delta : 0.00],
            repetition_category_id: [0],
            repetition_category: [''],
            selectedReptitionddl: [_itemRepe[0]?.option_value_id],
            repetition_price: [_itemRepe ? _itemRepe[0]?.price_delta : '', [Validators.required]],
            interval_category_id: [0],
            interval_category: [''],
            selectedIntervalddl: [_itemInterval[0]?.option_value_id],
            interval_price: [_itemInterval ? _itemInterval[0]?.price_delta : '', [Validators.required]],
            attribute_amount: 0.00,
            quantity: [1],
            date_total: 0.00
          });

          this.timeArray.push(control);
          this.onRepetitionChange(this.ScreenRepeMaster[0]?.option_value_id, 0)
          this.onIntervalChange(this.ScreenIntervalMaster[0]?.option_value_id, 0)
          this.calculate_final_amount((this.timeArray.length - 1))
        }
      })
    }
  }

  onSelectEvent($event: any, _index: number = 0) {
    if ($event && $event != null && $event != '') {
      this.TimeMaster[_index].isChecked = !this.TimeMaster[_index].isChecked;
      const _itemTime = this.TimeMaster.filter((x: any) => x.option_value_id === $event?.option_value_id);
      const _itemRepe = this.ScreenRepeMaster.filter((x: any) => x.option_value === "Repetition 4");
      const _itemInterval = this.ScreenIntervalMaster.filter((x: any) => x.option_value === "Upto 30 Seconds");
      if (this.isRepetitionExists($event?.option_value_id)) {
        this.removefromarray($event?.option_value_id);
      } else {
        this.timemastervalid = false;
        let control: FormGroup = this._fbCategoryMaster.group({
          route_category_id: [this._categoryRouteMaster.category_id],
          route_category: [this._categoryRouteMaster.category],
          product_id: [this._categoryScreenMaster.product_id],
          product_name: [this._categoryScreenMaster.product_name],
          timeslot_category_id: [$event ? $event?.option_value_id : '', [Validators.required]],
          timeslot_category: [$event ? $event?.option_value : '', [Validators.required]],
          from_date: ['', [Validators.required]],
          to_date: ['', [Validators.required]],
          total_amount: [this._categoryScreenMaster.base_amount],
          base_amount: [this._categoryScreenMaster.base_amount],
          timeslot_price: [_itemTime ? _itemTime[0]?.price_delta : 0.00],
          repetition_category_id: [0],
          repetition_category: [''],
          selectedReptitionddl: [_itemRepe[0]?.option_value_id],
          repetition_price: [_itemRepe ? _itemRepe[0]?.price_delta : '', [Validators.required]],
          interval_category_id: [0],
          interval_category: [''],
          selectedIntervalddl: [_itemInterval[0]?.option_value_id],
          interval_price: [_itemInterval ? _itemInterval[0]?.price_delta : '', [Validators.required]],
          attribute_amount: 0.00,
          quantity: [1],
          date_total: 0.00
        });
        this.timeArray.push(control);
        setTimeout(() => {
          this.calculate_final_amount((this.timeArray.length - 1))
        }, 500);
      }
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
    const selectedValue = this.ismonthly ? $event : $event?.target?.value;
    if (selectedValue != undefined && selectedValue != null) {
      const selectedItem = this.ScreenRepeMaster.find((x: any) => x.option_value_id == selectedValue);
      let obj = this.timeArray.at(_index) as FormGroup;
      obj.controls["repetition_category"].setValue(selectedItem ? selectedItem?.option_value : '');
      obj.controls["repetition_category"].updateValueAndValidity();
      obj.controls["repetition_category_id"].setValue(selectedItem ? selectedItem?.option_value_id : 0);
      obj.controls["repetition_category_id"].updateValueAndValidity();
      obj.controls["selectedReptitionddl"].setValue(selectedItem ? selectedItem?.option_value_id.toString() : '0');
      obj.controls["selectedReptitionddl"].updateValueAndValidity();
      this.calculate_final_amount(_index, 'repetition', selectedItem ? selectedItem?.price_delta : 0.00);
      this._cdr.detectChanges();
    }

  }

  onIntervalChange($event: any, _index: number) {
    const selectedValue = this.ismonthly ? $event : $event?.target?.value;
    let obj = this.timeArray.at(_index) as FormGroup;
    if (selectedValue != undefined && selectedValue != null) {
      const selectedItem = this.ScreenIntervalMaster.find((x: any) => x.option_value_id == selectedValue);
      obj.controls["interval_category"].setValue(selectedItem ? selectedItem?.option_value : '');
      obj.controls["interval_category"].updateValueAndValidity();
      obj.controls["interval_category_id"].setValue(selectedItem ? selectedItem?.option_value_id : 0);
      obj.controls["interval_category_id"].updateValueAndValidity();
      obj.controls["selectedIntervalddl"].setValue(selectedItem ? selectedItem?.option_value_id.toString() : '0');
      obj.controls["selectedIntervalddl"].updateValueAndValidity();
      this.calculate_final_amount(_index, 'interval', selectedItem ? selectedItem?.price_delta : 0.00);
      this._cdr.detectChanges();
    }

  }

  quantity: number = 1;
  calculate_final_amount(_index: number, _param: string = '', _price_delta: any = 0.00) {
    let obj = this.timeArray.at(_index) as FormGroup;
    if (_param == 'repetition') {
      obj.controls['repetition_price'].setValue(_price_delta);
    } else if (_param == 'interval') {
      obj.controls['interval_price'].setValue(_price_delta);
    }
    let repetition_price = (obj.controls['repetition_price'].value) * this.quantity;
    let interval_price = (obj.controls['interval_price'].value) * this.quantity;
    let timeslot_price = (obj.controls['timeslot_price'].value) * this.quantity;
    let date_total: any = obj.controls['date_total'].value;

    let attribute_amount = (repetition_price + interval_price + timeslot_price + date_total)
    obj.controls['attribute_amount'].setValue(attribute_amount);
    obj.controls["attribute_amount"].updateValueAndValidity();
    let base_amount = (obj.controls['base_amount'].value) * this.quantity;
    let total_amount = (base_amount + attribute_amount);
    if (!this.ismonthly) {
      total_amount = total_amount + (total_amount * 0.3);
    } else {
      total_amount = total_amount * 30;
    }
    obj.controls['total_amount'].setValue(total_amount);
    obj.controls["total_amount"].updateValueAndValidity();
    this._cdr.detectChanges();
  }
  readonly DELIMITER = '-';
  toDateModel(date: NgbDateStruct | null): string | null {
    return date ? date.month + this.DELIMITER + date.day + this.DELIMITER + date.year : null;
  }

  toJSDate(d: NgbDateStruct): Date {
    return new Date(d.year, d.month - 1, d.day);
  }
  from_date_alert: string = '';
  to_date_alert: string = '';
  date_select(_index: any, flag: string = 'fromdate') {
    debugger
    let obj = this.timeArray.at(_index) as FormGroup;
    let fmdate = (obj.controls['from_date'].value);
    let todate = (obj.controls['to_date'].value);

    if (!fmdate && todate) {
      this.from_date_alert = 'please select from date.';
      obj.controls['to_date'].setValue('');
      obj.controls['to_date'].updateValueAndValidity();
      return;
    } else if (fmdate && todate && flag === 'todate' && this.toJSDate(todate) < this.toJSDate(fmdate)) {
      this.to_date_alert = 'To date cannot be earlier than From date';
      obj.controls['to_date'].setValue('');
      obj.controls['to_date'].updateValueAndValidity();
      return;
    } else if (fmdate && todate && flag === 'fromdate' && this.toJSDate(fmdate) > this.toJSDate(todate)) {
      this.from_date_alert = 'from date not greater then to date';
      obj.controls['from_date'].setValue('');
      obj.controls['from_date'].updateValueAndValidity();
      return;
    } else {
      this.from_date_alert = ''
      this.to_date_alert = ''
      if (flag == 'fromdate') {
        this.mintoDate = fmdate;
      } else {
        this.maxfromDate = todate;
      }

      let _from_date: any = this.toDateModel(fmdate);
      let _to_date: any = this.toDateModel(todate);
      let date_total: any = obj.controls['date_total'].value;
      let _attribute_amount: any = obj.controls['attribute_amount'].value;

      let total_amount: any = 0.00;
      let _total_amount = (obj.controls['total_amount'].value) * this.quantity;

      if (date_total != null && date_total != undefined && date_total != '') {
        _total_amount = (_total_amount - date_total);
        _attribute_amount = (_attribute_amount - date_total);
        obj.controls['attribute_amount'].setValue(_attribute_amount);
        obj.controls['attribute_amount'].updateValueAndValidity();
      }
      let _date_total = 0.00;
      _date_total = this.setPriceFromConfigMaster(_from_date, _to_date);
      obj.controls['date_total'].setValue(_date_total);
      obj.controls['date_total'].updateValueAndValidity();
      total_amount = (_total_amount + _date_total);

      obj.controls['total_amount'].setValue(total_amount);
      obj.controls['total_amount'].updateValueAndValidity();
      // this._totalAmount = total_amount;
    }
    this._cdr.detectChanges();
  }

  _usercartMaster: usercartMaster = {};
  _usercartmappingModel: usercartmappingModel = {};
  add_to_cart(flag: any = 0) {
    this.timemastervalid = false;
    const ischekedarray = this.TimeMaster.filter((item: any) => item.isChecked == true);
    if (ischekedarray?.length > 0) {
      this._base._commonService.markFormGroupTouched(this.fgcategorymaster)
      if (this.fgcategorymaster.valid || flag == 1) {
        this.fgcategorymaster.value.lst_cart_product.filter((res: any) => res.from_date && typeof res.from_date == 'object' ? res.from_date = `${res.from_date.year}-${res.from_date.month}-${res.from_date.day}` : res.from_date)
        this.fgcategorymaster.value.lst_cart_product.filter((res: any) => res.to_date && typeof res.to_date == 'object' ? res.to_date = `${res.to_date.year}-${res.to_date.month}-${res.to_date.day}` : res.to_date)
        let _objFormData: any = this.fgcategorymaster.value.lst_cart_product;
        this.proceed_to_cart(_objFormData, flag);
      }
    } else {
      this.timemastervalid = true;
    }
  }

  proceed_to_cart(_form_data: any = null, flag: any) {
    this._base._encryptedStorage.get(enAppSession.batch_id).then((batch_id: any) => {

      this.batch_id = (batch_id == null || batch_id == '' || batch_id == undefined) ? null : batch_id;
      debugger
      this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
        if (user_id == '' || user_id == null || user_id == undefined) {
          user_id = 0;
        }
        this._base._encryptedStorage.get(enAppSession.fullname).then(fullname => {
          if ((!user_id || parseInt(user_id, 10) <= 0) && flag == 0) {
            this.modalService.open(this.formModal, {
              size: 'm',
              backdrop: true,
              centered: true
            });
            return;
          }

          let _value_object: any = [];
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
              interval_category_id: _item.interval_category_id,
              interval_category: _item.interval_category,
              interval_price: _item.interval_price,
              attribute_amount: _item.attribute_amount,
              total_amount: _item.total_amount,
              base_amount: _item.base_amount,
              date_total: _item.date_total,
              quantity: _item.quantity,
            });
          });
          let _value_option: any = [];
          _value_object.filter((_res: any) => {
            this._usercartmappingModel = {
              base_amount: _res?.base_amount,
              product_id: _res?.product_id,
              total_amount: _res?.total_amount,
              attribute_amount: _res?.attribute_amount,
              user_id: flag == 1 ? 0 : user_id,
              ismonthly: this.ismonthly,
              optionvalues: JSON.stringify(_res)
            }
            this._totalAmount = this._totalAmount + _res?.total_amount;
            _value_option.push(this._usercartmappingModel);
          })

          let _cart_subtotal = (this._totalAmount);
          let _cart_discount = 0.00;
          let _cart_after_discount = (_cart_subtotal - _cart_discount);
          let _cart_tax = (_cart_after_discount * (18 / 100));
          let _cart_after_tax = (_cart_after_discount + _cart_tax);
          let _cart_total = (_cart_after_tax);

          this._usercartMaster = {
            flag: (this.batch_id == null || this.batch_id == '' || this.batch_id == undefined || this.batch_id == '00000000-0000-0000-0000-000000000000') ? 'NEWCART' : 'MODIFYCART',
            createdname: fullname,
            user_id: parseInt(user_id),
            lst_cart_product: _value_option,
            coupon_id: 0,
            coupon_code: '',
            cart_total: _cart_total,
            cart_subtotal: _cart_subtotal,
            cart_discount: 0.00,
            cart_tax: _cart_tax,
            batch_id: this.batch_id,
          }
          console.log("this._usercartMaster", this._usercartMaster)
          this._webDService.add_to_cart(this._usercartMaster).subscribe((response: any) => {
            this.modalService.dismissAll();
            let responsemessage = response.split('~')[2];
            this.successSwal.fire();
            setTimeout(() => {
              this.successSwal.close();
              if (this.batch_id == null || this.batch_id == '' || this.batch_id == undefined) {
                this.batch_id = responsemessage;
                this._base._encryptedStorage.set(enAppSession.batch_id, this.batch_id);
              }
              this._base._router.navigate([flag == 1 ? `cart/${responsemessage}` : 'cart']);
              this._cdr.detectChanges();
            }, 500);

          }, error => {

          });
        });
      });
    });
  }

  update_qty(flag: string = 'add', _index: number) {
    let obj = this.timeArray.at(_index) as FormGroup;
    let value = parseInt(obj.controls['quantity'].value, 10);

    if (flag == 'minus') {
      value = isNaN(value) ? 1 : value; // default to 1 if invalid
      if (value > 1) {
        value--; // decrease only if > 1
      }
    } else {
      value = isNaN(value) ? 0 : value;
      value++;
    }
    obj.controls['quantity'].setValue(value);
    obj.controls['quantity'].updateValueAndValidity();

    this.quantity = value;
    this.calculate_final_amount(_index)
    this._cdr.detectChanges();
  }

  reset_form() {
    setTimeout(() => {
      location.reload();
    }, 1000);
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
                this._cdr.detectChanges();
                this.add_to_cart();
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

  _wizard_index: number = 0;
  typemastervalid: boolean = false;
  propertymastervalid: boolean = false;
  routemastervalid: boolean = false;
  screenmastervalid: boolean = false;
  timemastervalid: boolean = false;
  change_wizard_index(flag: string = 'plus') {
    if (flag == 'minus') {
      this._wizard_index = isNaN(this._wizard_index) ? 0 : this._wizard_index; // default to 1 if invalid
      if (this._wizard_index > 0) {
        this._wizard_index--; // decrease only if > 1
        if (this._wizard_index == 3) {
          this.ScreenMaster.forEach((item: any, i: number) => item.isChecked = false);
          this.timeArray?.clear();
          this.TimeMaster = [];
        } else if (this._wizard_index == 2) {
          this.RouteMaster.forEach((item: any, i: number) => item.isChecked = false);
          this.ScreenMaster = [];
        }
        else if (this._wizard_index == 1) {
          this.PropertyMaster.forEach((item: any, i: number) => item.isChecked = false);
          this.RouteMaster = [];
        }
        else if (this._wizard_index == 0) {
          this.TypeMaster.forEach((item: any, i: number) => item.isChecked = false);
          this.PropertyMaster = [];
        }
        this._cdr.detectChanges();
      }
    } else {
      this._wizard_index = isNaN(this._wizard_index) ? 0 : this._wizard_index;
      if (this._wizard_index < 4) {
        if (this._wizard_index == 3) {
          const hasChecked = this.ScreenMaster.some((item: any) => item.isChecked === true);
          if (hasChecked) {
            this.screenmastervalid = false;
            this._wizard_index++;
          } else {
            this.screenmastervalid = true;
          }
        } else if (this._wizard_index == 2) {
          const hasChecked = this.RouteMaster.some((item: any) => item.isChecked === true);
          if (hasChecked) {
            this.routemastervalid = false;
            this._wizard_index++;
          } else {
            this.routemastervalid = true;
          }
        }
        else if (this._wizard_index == 1) {
          const hasChecked = this.PropertyMaster.some((item: any) => item.isChecked === true);
          if (hasChecked) {
            this.propertymastervalid = false;
            this._wizard_index++;
          } else {
            this.propertymastervalid = true;
          }
        }
        else if (this._wizard_index == 0) {
          const hasChecked = this.TypeMaster.some((item: any) => item.isChecked === true);
          if (hasChecked) {
            this.typemastervalid = false;
            this._wizard_index++;
          } else {
            this.typemastervalid = true;
          }
        }

      } this._cdr.detectChanges();
    }
  }

  setPriceFromConfigMaster(fromDate: string, toDate: string): number {
    if (!fromDate || !toDate) return 0;
    debugger
    const start = new Date(fromDate);
    const end = new Date(toDate);

    // Build map { dayName: price }
    const configMap: { [key: string]: number } = {};
    this.ConfigMaster.forEach((item: any) => {
      configMap[item.config_name.toLowerCase()] = Number(item.config_value);
    });

    let totalPrice = 0;

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayName = d.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const price = configMap[dayName] ?? 0;
      console.log(`Date: ${d.toISOString().split('T')[0]} → Day: ${dayName} → Price: ${price}`);
      totalPrice += price;
    }

    return totalPrice;
  }

  skiplogin() {
    this.add_to_cart(1);
  }

  dateRangeValidator = (control: any) => {
    const date = control.value;
    if (!date || !this.minmonth || !this.maxmonth) return null; // ✅ prevent null access

    const selected = new Date(date.year, date.month - 1, date.day);
    const min = new Date(this.minmonth.year, this.minmonth.month - 1, this.minmonth.day);
    const max = new Date(this.maxmonth.year, this.maxmonth.month - 1, this.maxmonth.day);

    return selected < min || selected > max ? { outOfRange: true } : null;
  };

  onDateSelect(date: NgbDateStruct) {
    // When a new date is selected, recalculate the 1-month window
    const selectedDate = new Date(date.year, date.month - 1, date.day);
    const nextMonth = new Date(selectedDate);
    nextMonth.setDate(selectedDate.getDate() + 29);

    this.fgcategorymaster.get('from_date_month')?.updateValueAndValidity();

    this.TimeMaster?.filter((_timeslot: any, _index: any) => {
      debugger
      const index = this.timeArray.controls.findIndex((group: AbstractControl) =>
        (group as FormGroup).get('timeslot_category_id')?.value === _timeslot?.option_value_id
      );
      let obj = this.timeArray.at(index) as FormGroup;
      obj.controls["from_date"].setValue(date);
      obj.controls["from_date"]?.updateValueAndValidity();
      obj.controls["to_date"].setValue(this.toNgbDate(nextMonth));
      obj.controls["to_date"]?.updateValueAndValidity()
      console.log("index", index)
    });
  }
}

