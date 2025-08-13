import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { WebdtableComponent } from '../../layout_template/webdtable/webdtable.component';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { WebDService } from '../../_appservice/webdpanel.service';
import { Subscription } from 'rxjs';
import { productMaster } from '../../_appmodel/_model';
import { dataTableConfig, tableEvent } from '../../_appmodel/_componentModel';

@Component({
  selector: 'app-productmodule',
  standalone: true,
  imports: [CommonModule, WebdtableComponent],
  templateUrl: './productmodule.component.html',
  styleUrl: './productmodule.component.scss'
})
export class ProductmoduleComponent {
  @ViewChild('dataTableCom', { static: false }) tableObj!: WebdtableComponent;
  @ViewChild('fileInput', { static: true }) fileInput: any;

  @ViewChild('deleteSwal')
  public readonly deleteSwal!: SwalComponent;

  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  navigateaddform()
  {
    this._base._router.navigate(["app/manageproduct/0"])
  }
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  private modalRef!: NgbModalRef;
  dataTable: any;
  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    private _cdr: ChangeDetectorRef) { }

  public productSubscribe!: Subscription;
  importFile!: FormData;
  productMaster: any = [];
  _productMaster: productMaster = {};
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

  ngOnInit(): void {
    this.getproductMaster();
  }

  tableClick(dataItem: tableEvent) {
    if (dataItem?.action?.type == 'link' || (dataItem?.action?.type == 'buttonIcons' && dataItem.actionInfo.title == "Edit")) {
      this.modifyproduct(dataItem.tableItem, 'MODIFYPRODUCT');
    } else if (dataItem?.action?.type == 'buttonIcons' && dataItem.actionInfo.title == "Delete") {
      this.modifyproduct(dataItem.tableItem, 'DELETEPRODUCT');
    }
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
    this._webDService.getproduct('all', 0, 0,'null',parseInt(start), parseInt(end)).subscribe((resProductMaster: any) => {
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

  modifyproduct(data:any, flag:any) {
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

  clearFormData() {
    this._productMaster = {};
  }

}
