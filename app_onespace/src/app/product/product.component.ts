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
  fgcategorymaster!: FormGroup
  CategoryMaster: any = [];
  ScreenMaster: any = [];
  RouteMaster: any = [];
  TimeMaster: any = [];

  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    public _fbCategoryMaster: FormBuilder,
    private _cdr: ChangeDetectorRef) { }

  public _route: IDropdownSettings = {
    singleSelection: true,
    idField: 'category_id',
    textField: 'category',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  public _screen: IDropdownSettings = {
    singleSelection: true,
    idField: 'category_id',
    textField: 'category',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
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
    this.getroute();

    this.gettimeslot();
  }

  initform() {
    this.fgcategorymaster = this._fbCategoryMaster.group({
      category_id: [0],
      lstroute: [''],
      lstscreen: [''],
      lsttimeslot: [''],
      lstcategoryslab: this._fbCategoryMaster.array([]),
    })
  }

  getroute() {
    this._webDService.getcategory('all', 0, 'selected_area', 0, 'null', false, 0, 'null', 0, 0).subscribe((resCategory: any) => {
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
  getcategory() {
    this._webDService.getcategory('all', 0, 'null', 0, 'null', false, 0, 'null', 0, 0).subscribe((resCategory: any) => {
      this.CategoryMaster = resCategory.data;
      this.CategoryMaster = Array.isArray(resCategory.data) ? resCategory.data : [];
      this._cdr.detectChanges();
    });
  }


  onSelectroute($event: any) {
    if ($event && $event != null && $event != '' && $event.length > 0) {
      debugger
      this._categoryRouteMaster.category_id = ($event[0]?.category_id);
      this.getscreen(this._categoryRouteMaster.category_id);
    }
  }

  onSelectscreen($event: any) {
    if ($event && $event != null && $event != '' && $event.length > 0) {
      this._categoryScreenMaster.category_id = ($event[0]?.category_id);
    }
  }

  

  get penaltyArray(): FormArray {
    return this.fgcategorymaster.get("lstcategoryslab") as FormArray
  }

  onSelecttimeslot($event: any) {
    const formArray = this.penaltyArray;

    const selectedIds = $event.map((slot: any) => slot.category_id);

    selectedIds.forEach((id: number) => {
      
        const found = $event.find((x:any) => x.category_id === id);

      const _index = formArray.controls.findIndex(
        (ctrl) => ctrl.get('timeslot_id')?.value === id
      );
      console.log("exists",_index);
      console.log("$event",$event);

      if (_index < 0) {
        formArray.push(this.createSlabGroup({ category_id: id,category : found.category}));
      }else{
        formArray.removeAt(_index);
      }
    });

    console.log("Updated FormArray:", this.fgcategorymaster.value.lstcategoryslab);
  }

  createSlabGroup(slot: any) {
    return this._fbCategoryMaster.group({
      timeslot_id: [slot ? slot.category_id : null],
      category: [slot ? slot.category : null],
      screenInterval: [''],
      fromDate: [''],
      toDate: ['']
    });
  }

}

