import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { WebdtableComponent } from '../../layout_template/webdtable/webdtable.component';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { WebDService } from '../../_appservice/webdpanel.service';
import { Subscription } from 'rxjs';
import { vendorModel } from '../../_appmodel/_model';
import { dataTableConfig, tableEvent } from '../../_appmodel/_componentModel';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-vendormodule',
  standalone: true,
  imports: [WebdtableComponent, SweetAlert2Module],
  templateUrl: './vendormodule.component.html',
  styleUrl: './vendormodule.component.scss'
})
export class VendormoduleComponent {
  @ViewChild('dataTableCom', { static: false }) tableObj!: WebdtableComponent;
  @ViewChild('fileInput', { static: true }) fileInput: any;

  @ViewChild('deleteSwal')
  public readonly deleteSwal!: SwalComponent;

  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  swalOptions: SweetAlertOptions = { buttonsStyling: false };


  navigateaddform() {
    this._base._router.navigate(['/app/managevendor/0']);
  }

  private modalRef!: NgbModalRef;
  dataTable: any;
  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    private _cdr: ChangeDetectorRef) { }

  public vendorSubscribe!: Subscription;
  importFile!: FormData;
  vendorList: any = [];
  _vendor: vendorModel = {};

  tableConfig: dataTableConfig = {
    tableData: [],
    displayPaging:true,
    tableConfig: [
      { identifer: "createddatetime", title: "Date", type: "date" },
      { identifer: "contact_person_name", title: "Vendor Name", type: "text" },
      { identifer: "company_name", title: "Company Name", type: "text" },
      // { identifer: "vendor_address", title: "Address", type: "text" },
      { identifer: "email_id", title: "Email Id", type: "text" },
      { identifer: "mobile_no", title: "Mobile Number", type: "text" },
       { identifer: "", title: "Action", type: "buttonIcons", buttonIconList: [{ title: 'Edit', class: 'btn btn-primary btn-sm', iconClass: 'feather icon-edit' }, { title: 'Delete', class: 'btn btn-danger btn-sm', iconClass: 'feather icon-trash-2' }] },],
    isCustom: {
      current: 0,
      steps: 10,
      total: 0,
      callbackfn: this.getVendor.bind(this)
    }
  }
  ngOnInit(): void {
    this.getVendor();
  }

  tableClick(dataItem: tableEvent) {
    if (dataItem?.action?.type == 'link' || (dataItem?.action?.type == 'buttonIcons' && dataItem.actionInfo.title == "Edit")) {
      this.modifyVendor(dataItem.tableItem, 'MODIFYVENDOR');
    } else if (dataItem?.action?.type == 'buttonIcons' && dataItem.actionInfo.title == "Delete") {
      this.modifyVendor(dataItem.tableItem, 'DELETEVENDOR');
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

    const selectedColumns = this.vendorList.map((item: any) => {
      return {
        Date: formatDate(item.createddatetime),
        Thumbnail: item.thumbnail,
        Title: item.tittle,
        SubTittle: item.subtitle,
        Url: item.url,
        TypeMaster: item.typemaster,
        Category: item.category,
        label: item.label,
        Description: htmlToText(item.description),
        DisplayOrder: item.displayorder,
        IsFeatured: item.isfeatured,
        IsActive: item.isactive
      };
    });

    // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedColumns);
    // const workbook: XLSX.WorkBook = {
    //     Sheets: { 'data': worksheet },
    //     SheetNames: ['data']
    // };
    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    // saveAs(data, 'BannerData.xlsx');
  }

  getVendor() {
    let obj = this._base._commonService.getcatalogrange(this.tableConfig?.isCustom?.steps, (this.tableConfig?.isCustom?.current ?? 0) + 1)
    let start = obj[obj.length - 1].replace(/ /g, '').split('-')[0];
    let end = obj[obj.length - 1].replace(/ /g, '').split('-')[1];
    this._webDService.getvendor('all', 0, parseInt(start), parseInt(end)).subscribe((resVendor: any) => {
      this.vendorList = resVendor.data;
      this.vendorList = Array.isArray(resVendor.data) ? resVendor.data : [];
      if (this.tableConfig?.isCustom) {
        this.tableConfig.isCustom.total = resVendor.count;
      }
      this.tableObj.initializeTable();
      this.tableConfig.tableData = this.vendorList;
      this._cdr.detectChanges();
    });
  }

  modifyVendor(data: any, flag: any) {
    this._vendor = data;
    this._vendor.flag = flag;
    this._vendor.vendor_id = data.vendor_id;
    if (flag == 'MODIFYVENDOR') {
      this._base._router.navigate([`/app/managevendor/${data.vendor_id}`]);
    } else if (flag == 'DELETEVENDOR') {
      this.deleteSwal.fire().then((clicked) => {
        if (clicked.isConfirmed) {
          this._vendor.isactive = false;
          this._webDService.managevendor(this._vendor).subscribe((response: any) => {
            if (response == 'deletesuccess') {
              this.vendorList.filter((res: any, index: number) => {
                if (res.vendor_id === this._vendor.vendor_id) {
                  this.vendorList.splice(index, 1);
                  this._cdr.detectChanges();
                  this.successSwal.fire()
                  setTimeout(() => {
                    this.successSwal.close();
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

  clearFormData() {
    this._vendor = {};
  }
}
