import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { WebdtableComponent } from '../../layout_template/webdtable/webdtable.component';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { WebDService } from '../../_appservice/webdpanel.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { couponModel, productMaster } from '../../_appmodel/_model';
import { dataTableConfig, tableEvent } from '../../_appmodel/_componentModel';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { enAppSession } from '../../_appmodel/sessionstorage';

@Component({
  selector: 'app-productmodule',
  standalone: true,
  imports: [CommonModule, WebdtableComponent, SweetAlert2Module, FormsModule, ReactiveFormsModule],
  templateUrl: './productmodule.component.html',
  styleUrl: './productmodule.component.scss'
})
export class ProductmoduleComponent {
  @ViewChild('dataTableCom', { static: false }) tableObj!: WebdtableComponent;
  @ViewChild('coupondataTableCom', { static: false }) coupontableObj!: WebdtableComponent;
  @ViewChild('fileInput', { static: true }) fileInput: any;

  @ViewChild('deleteSwal')
  public readonly deleteSwal!: SwalComponent;

  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  @ViewChild('saveSwal')
  public readonly saveSwal!: SwalComponent;

  @ViewChild('formModal', { static: true }) formModal!: TemplateRef<any>;

  navigateaddform() {
    this._base._router.navigate(["app/manageproduct/0"])
  }

  modalConfig: NgbModalOptions = {
    size: 'xl',
    backdrop: true,
    centered: true
  }

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading!: boolean;
  private unsubscribe: Subscription[] = [];
  private iscouponModify: boolean = false;

  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  private modalRef!: NgbModalRef;
  dataTable: any;
  fgcoupon!: FormGroup;

  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    public _fbcoupon: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private modalService: NgbModal,) {
      const loadingSubscr = this.isLoading$
        .asObservable()
        .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
  }

  public productSubscribe!: Subscription;
  importFile!: FormData;
  productMaster: any = [];
  couponMaster: any = [];
  _productMaster: productMaster = {};
  _couponModel: couponModel = {};

  tableConfig: dataTableConfig = {
    tableData: [],
    tableConfig: [
      { identifer: "createddatetime", title: "Date", type: "date" },
      { identifer: "thumbnail", title: "Thumbnail", type: "image", dataType: { type: "string", path: ['thumbnail'] }, size: { height: "100px", width: "100px" } },
      { identifer: "product_name", title: "Product Name", type: "text" },
      { identifer: "category", title: "Category", type: "text" },
      { identifer: "brand_name", title: "Brand", type: "text" },
      { identifer: "product_description", title: "Description", type: "text" },
      { identifer: "", title: "Action", type: "buttonIcons", buttonIconList: [{ title: 'Edit', class: 'avtar avtar-s btn btn-primary', iconClass: 'ti ti-pencil' }, { title: 'Delete', class: 'avtar avtar-s btn btn-danger', iconClass: 'ti ti-trash' }] },],
    isCustom: {
      current: 0,
      steps: 10,
      total: 0,
      callbackfn: this.getproductMaster.bind(this)
    }
  }

  coupontableConfig: dataTableConfig = {
    tableData: [],
    tableConfig: [
      { identifer: "createddatetime", title: "Date", type: "date" },
      { identifer: "coupon_code", title: "Coupon Code", type: "text"},
      { identifer: "discount_value", title: "Discount Value", type: "text" },
      { identifer: "from_date", title: "From Date", type: "text" },
      { identifer: "to_date", title: "To Date", type: "text" },
      { identifer: "isdisable", title: "Is Disable", type: "text" },
      // { identifer: "", title: "Action", type: "buttonIcons", buttonIconList: [{ title: 'Edit', class: 'avtar avtar-s btn btn-primary', iconClass: 'ti ti-pencil' }, { title: 'Delete', class: 'avtar avtar-s btn btn-danger', iconClass: 'ti ti-trash' }] },],
    ],
      isCustom: {
      current: 0,
      steps: 10,
      total: 0,
      callbackfn: this.getcoupon.bind(this)
    }
  }

  ngOnInit(): void {
    this.initForm()
    this.getproductMaster();
  }

  initForm() {
    this.fgcoupon = this._fbcoupon.group({
      coupon_id: [0],
      coupon_code: [''],
      discount_value: [''],
      from_date: [''],
      to_date: [''],
      isdisable: [false],
      isactive: [true],
    });
  }

  tableClick(dataItem: tableEvent) {
    if (dataItem?.action?.type == 'link' || (dataItem?.action?.type == 'buttonIcons' && dataItem.actionInfo.title == "Edit")) {
      this.modifyproduct(dataItem.tableItem, 'MODIFYPRODUCT');
    } else if (dataItem?.action?.type == 'buttonIcons' && dataItem.actionInfo.title == "Delete") {
      this.modifyproduct(dataItem.tableItem, 'DELETEPRODUCT');
    }
  }

  opencouponModal() {
    this.modalRef = this.modalService.open(this.formModal, this.modalConfig);
    this.getcoupon();
  }

  exportToExcel() {
    const htmlToText = (html: string): string => {
      const tempElement = document.createElement('div');
      tempElement.innerHTML = html;
      return tempElement.textContent || tempElement.innerText || '';
    };
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const selectedColumns = this.productMaster.map((item: any) => {
      return {
        Date: formatDate(item.createddatetime),
        ProductName: item.product_name,
        Category: item.lstcategory,
        Brand: item.lstbrand,
        Description: htmlToText(item.product_description),
        IsActive: item.isactive
      };
    });

    // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedColumns);
    // const workbook: XLSX.WorkBook = {
    //   Sheets: { 'data': worksheet },
    //   SheetNames: ['data']
    // };
    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    // saveAs(data, 'Product Data.xlsx');
  }

  getproductMaster() {
    let obj = this._base._commonService.getcatalogrange(this.tableConfig?.isCustom?.steps, (this.tableConfig?.isCustom?.current ?? 0) + 1)
    let start = obj[obj.length - 1].replace(/ /g, '').split('-')[0];
    let end = obj[obj.length - 1].replace(/ /g, '').split('-')[1];
    this._webDService.getproduct('all', 0, 0, 'null', parseInt(start), parseInt(end)).subscribe((resProductMaster: any) => {
      this.productMaster = resProductMaster.data;
      this.productMaster = Array.isArray(resProductMaster.data) ? resProductMaster.data : [];
      if (this.tableConfig?.isCustom) {
        this.tableConfig.isCustom.total = resProductMaster.count;
      }
      this.tableConfig.tableData = this.productMaster;
      this.tableObj.initializeTable();
      this._cdr.detectChanges();
    });
  }

  modifyproduct(data: any, flag: any) {
    this._productMaster = data;
    this._productMaster.flag = flag;
    this._productMaster.product_id = data.product_id;
    if (flag == 'MODIFYPRODUCT') {
      this._base._router.navigate([`/app/manageproduct/${data.product_id}`]);
    } else if (flag == 'DELETEPRODUCT') {
      this.deleteSwal.fire().then((clicked) => {
        if (clicked.isConfirmed) {
          this._productMaster.isactive = false;
          this._webDService.manageproduct(this._productMaster).subscribe((response: any) => {
            if (response == 'deletesuccess') {
              this.productMaster.filter((res: any, index: number) => {
                if (res.product_id === this._productMaster.product_id) {
                  this.productMaster.splice(index, 1);
                  this._cdr.detectChanges();
                  this.successSwal.fire()
                  setTimeout(() => {
                    location.reload();
                  }, 1500);
                }
              });
            }
          }, error => {
            // this._base._alertMessageService.error("Something went wrong !!");
          });
        }
      });
    }
  }

  getcoupon() {
    let obj = this._base._commonService.getcatalogrange(this.coupontableConfig?.isCustom?.steps, (this.coupontableConfig?.isCustom?.current ?? 0) + 1)
    let start = obj[obj.length - 1].replace(/ /g, '').split('-')[0];
    let end = obj[obj.length - 1].replace(/ /g, '').split('-')[1];
    this._webDService.getcoupon(0,'' ,parseInt(start), parseInt(end)).subscribe((rescouponMaster: any) => {
      this.couponMaster = rescouponMaster.data;
      this.couponMaster = Array.isArray(rescouponMaster.data) ? rescouponMaster.data : [];
      if (this.coupontableConfig?.isCustom) {
        this.coupontableConfig.isCustom.total = rescouponMaster.count;
      }
      this.coupontableConfig.tableData = this.couponMaster;
      this.coupontableObj.initializeTable();
      this._cdr.detectChanges();
    });
  }

  setcoupon(flag: any) {
    this.isLoading$.next(true);
    this._base._commonService.markFormGroupTouched(this.fgcoupon)
    if (this.fgcoupon.valid) {
      this._base._encryptedStorage.get(enAppSession.client_id).then(client_id => {
        this._base._encryptedStorage.get(enAppSession.project_id).then(project_id => {
          this._couponModel.coupon_code = this.fgcoupon.value.coupon_code;
          this._couponModel.discount_value = this.fgcoupon.value.discount_value;
          this._couponModel.from_date = this.fgcoupon.value.from_date;
          this._couponModel.to_date = this.fgcoupon.value.to_date;
          this._couponModel.isdisable = this.fgcoupon.value.isdisable;
          this._couponModel.isactive = this.fgcoupon.value.isactive;
          this._couponModel.client_id = parseInt(client_id);
          this._couponModel.project_id = parseInt(project_id);
          this.addmodifycoupon(flag);
        });
      });
    }
  }

  addmodifycoupon(flag: any) {
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this._base._encryptedStorage.get(enAppSession.fullname).then(fullname => {
        this._couponModel.flag = this.iscouponModify ? 'MODIFYCOUPON' : 'NEWCOUPON';
        this._couponModel.createdname = fullname;
        this._couponModel.user_id = parseInt(user_id);
        this._webDService.managecoupon(this._couponModel).subscribe((response: any) => {
          let isRedirect: boolean = true
          if (response === 'couponexists') {
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
                this._base._router.navigate(['/app/manageproduct']);
                location.reload();
              }, 1500);
            }, 1000);
          }
        });
      });
    });
  }


  clearFormData() {
    this._productMaster = {};
  }

}
