import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { WebDService } from '../_appservice/webdpanel.service';
import { BaseServiceHelper } from '../_appservice/baseHelper.service';
import { MultiselectComponent } from '../layout_template/multiselect/multiselect.component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { categoryMaster } from '../_appmodel/_model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [MultiselectComponent, ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent {

  _categoryRouteMaster: categoryMaster = {};
  _categoryScreenMaster: categoryMaster = {};
  _categoryTimeMaster: categoryMaster = {};
  _categoryTypeMaster: categoryMaster = {};
  _categoryPropertyMaster: categoryMaster = {};
  fgcategorymaster!: FormGroup;
  ScreenMaster: any = [];
  RouteMaster: any = [];
  TypeMaster: any = [];
  PropertyMaster: any = [];
  TimeMaster: any = [];

  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    public _fbCategoryMaster: FormBuilder,
    private _cdr: ChangeDetectorRef) { }

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
    idField: 'category_id',
    textField: 'category',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };
  public _timeslot: IDropdownSettings = {
    singleSelection: false,
    idField: 'category_id',
    textField: 'category',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  ngOnInit(): void {
    this.initform();
    this.gettypecategory();
    this.gettimeslot();
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
    console.log("$event", $event)
    if ($event && $event != null && $event != '' && $event.length > 0) {
      this._categoryScreenMaster.category_id = ($event[0]?.category_id);
      this._categoryScreenMaster.category = ($event[0]?.category);
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
      console.log("select : ", $event);
      let control: FormGroup = this._fbCategoryMaster.group({
        route_category_id: [this._categoryRouteMaster.category_id],
        route_category: [this._categoryRouteMaster.category],
        scree_category_id: [this._categoryScreenMaster.category_id],
        screen_category: [this._categoryScreenMaster.category],
        timeslot_category_id: [$event ? $event.category_id : 0],
        timeslot_category: [$event ? $event.category : ''],
        from_date: [''],
        to_date: [''],
        product_price: [''],
        screen_interval: [''],
      });
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

}

