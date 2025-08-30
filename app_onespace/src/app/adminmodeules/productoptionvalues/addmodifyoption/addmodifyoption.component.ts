import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MultiselectComponent } from '../../../layout_template/multiselect/multiselect.component';
import { BaseServiceHelper } from '../../../_appservice/baseHelper.service';
import { WebDService } from '../../../_appservice/webdpanel.service';
import { SweetAlertOptions } from 'sweetalert2';
import { WebdtableComponent } from '../../../layout_template/webdtable/webdtable.component';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { dataTableConfig, tableEvent } from '../../../_appmodel/_componentModel';
import { productoption, productoptiontype } from '../../../_appmodel/_model';
import { enAppSession } from '../../../_appmodel/sessionstorage';

@Component({
  selector: 'app-addmodifyoption',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, MultiselectComponent, SweetAlert2Module, WebdtableComponent],
  templateUrl: './addmodifyoption.component.html',
  styleUrl: './addmodifyoption.component.scss'
})
export class AddmodifyoptionComponent implements OnInit {

  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  @ViewChild('dataTableCom', { static: false }) tableObj!: WebdtableComponent;

  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading!: boolean;
  private unsubscribe: Subscription[] = [];

  @ViewChild('saveSwal')
  public readonly saveSwal!: SwalComponent;

  constructor(
    public _base: BaseServiceHelper,
    private _webDService: WebDService,
    private _cdr: ChangeDetectorRef,
    public _fb: FormBuilder) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
  }

  @ViewChild('optiondataTableCom', { static: false }) optiontableObj!: WebdtableComponent;
  fgoption!: FormGroup;
  fgtype!: FormGroup
  _productOption: productoption = {};

  OptionType: any = [];
  ProductMaster: any = [];
  ProductOptionMaster: any = [];

  public _configProduct: IDropdownSettings = {
    singleSelection: true,
    idField: 'product_id',
    textField: 'product_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    closeDropDownOnSelection:true
  };

  public _configType: IDropdownSettings = {
    singleSelection: false,
    idField: 'option_type_id',
    textField: 'title',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true,
    closeDropDownOnSelection:true
  };

  // tableConfigoptiontype: dataTableConfig = {
  //   tableData: [],
  //   tableConfig: [
  //     { identifer: "createddatetime", title: "Date", type: "date" },
  //     { identifer: "title", title: "Option Type", type: "text" },
  //     { identifer: "display_order", title: "Display Order", type: "text" },
  //     { identifer: "", title: "Action", type: "buttonIcons", buttonIconList: [{ title: 'Edit', class: 'avtar avtar-s btn btn-primary', iconClass: 'ti ti-pencil' }, { title: 'Delete', class: 'avtar avtar-s btn btn-danger', iconClass: 'ti ti-trash' }] },],
  //   isCustom: {
  //     current: 0,
  //     steps: 10,
  //     total: 0,
  //     callbackfn: this.gettype.bind(this)
  //   }
  // }
  tableConfigproductoption: dataTableConfig = {
    tableData: [],
    tableConfig: [
      { identifer: "createddatetime", title: "Date", type: "date" },
      { identifer: "product_name", title: "Product Name", type: "text" },
      { identifer: "option_type", title: "Option Type", type: "text" },
      { identifer: "", title: "Action", type: "buttonIcons", buttonIconList: [{ title: 'Edit', class: 'avtar avtar-s btn btn-primary', iconClass: 'ti ti-pencil' }, { title: 'Delete', class: 'avtar avtar-s btn btn-danger', iconClass: 'ti ti-trash' }] },],
    isCustom: {
      current: 0,
      steps: 10,
      total: 0,
      callbackfn: this.getproductoption.bind(this)
    }
  }


  ngOnInit(): void {
    this.initForm();
    this.gettype();
    this.getproduct();
    this.getproductoption()
  }
  initForm() {
    // this.fgtype = this._fb.group({
    //   option_type_id: [0],
    //   title: [''],
    //   display_order: [''],
    //   isactive: [true],
    // });

    this.fgoption = this._fb.group({
      option_id: [0],
      product_id: [0],
      optiontype_list: [''],
      lstproduct: [''],
      isactive: [true],
    });
  }

  getproductoption() {
    let obj = this._base._commonService.getcatalogrange(this.tableConfigproductoption?.isCustom?.steps, (this.tableConfigproductoption?.isCustom?.current ?? 0) + 1)
    let start = obj[obj.length - 1].replace(/ /g, '').split('-')[0];
    let end = obj[obj.length - 1].replace(/ /g, '').split('-')[1];
    this._webDService.getproductoption('all', 0, 0, 0, parseInt(start), parseInt(end)).subscribe((resProductMaster: any) => {
      this.ProductOptionMaster = resProductMaster.data;
      this.ProductOptionMaster = Array.isArray(resProductMaster.data) ? resProductMaster.data : [];
      if (this.tableConfigproductoption?.isCustom) {
        this.tableConfigproductoption.isCustom.total = resProductMaster.count;
      }
      this.tableConfigproductoption.tableData = this.ProductOptionMaster;
      this.tableObj.initializeTable();
      this._cdr.detectChanges();
    });
  }

  getproduct() {
    this._webDService.getproduct('all').subscribe((resProductMaster: any) => {
      this.ProductMaster = resProductMaster.data;
      this.ProductMaster = Array.isArray(resProductMaster.data) ? resProductMaster.data : [];
      this._cdr.detectChanges();
    });
  }
  gettype() {
    this._webDService.productoptiontypes('all').subscribe((resOptionType: any) => {
      this.OptionType = [];
      this.OptionType = Array.isArray(resOptionType.data) ? resOptionType.data : [];
      this._cdr.detectChanges();
    });
  }
  onItemSelect($event: any) {
    if ($event && $event != null && $event.length > 0) {
      this._productOption.product_id = $event[0]?.product_id;
    }
  }
  onSelect($event: any) {
    if ($event && $event != null && $event.length > 0) {
     
    }
  }

  private istypeModify: boolean = false;
  setproductoption(flag: any) {
    this.isLoading$.next(true);
    this._base._commonService.markFormGroupTouched(this.fgoption)
    if (this.fgoption.valid) {
      this._base._encryptedStorage.get(enAppSession.client_id).then(client_id => {
        this._base._encryptedStorage.get(enAppSession.project_id).then(project_id => {
          this._productOption.lstproduct = this.fgoption.value.lstproduct;
          this._productOption.optiontype_list = this.fgoption.value.optiontype_list;
          this._productOption.isactive = this.fgoption.value.isactive;
          this._productOption.client_id = parseInt(client_id);
          this._productOption.project_id = parseInt(project_id);
          this.addmodifyproductoption(flag);
        });
      });
    }
  }

  addmodifyproductoption(flag: any) {
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this._base._encryptedStorage.get(enAppSession.fullname).then(fullname => {
        this._productOption.flag = this.istypeModify ? 'MODIFYPRODUCTOPTION' : 'NEWPRODUCTOPTION';
        this._productOption.createdname = fullname;
        this._productOption.user_id = parseInt(user_id);
        this._webDService.manageproductoptions(this._productOption).subscribe((response: any) => {
          let isRedirect: boolean = true
          if (response === 'labelexists') {
            // Show warning if society already exists
            // this._base._alertMessageService.warning("Society already exists!");
            isRedirect = false;
          }

          setTimeout(() => {
            this.isLoading$.next(false);
            this._cdr.detectChanges();
          }, 1500);

          if (isRedirect && flag) {
            setTimeout(() => {
              this.saveSwal.fire()
              setTimeout(() => {
                this._base._router.navigate(['/app/managevalues']);
                location.reload();
              }, 1500);
            }, 1000);
          }
        });
      });
    });
  }
  tableClick(dataItem: tableEvent) {
    if (dataItem?.action?.type == 'link' || (dataItem?.action?.type == 'buttonIcons' && dataItem.actionInfo.title == "Edit")) {
      // this.modifylabel(dataItem.tableItem, 'MODIFYOPTIONVALUE');
    } else if (dataItem?.action?.type == 'buttonIcons' && dataItem.actionInfo.title == "Delete") {
      // this.modifylabel(dataItem.tableItem, 'DELETEOPTIONVALUE');
    }
  }

}
