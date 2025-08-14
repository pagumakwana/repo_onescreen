import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { WebdtableComponent } from '../../layout_template/webdtable/webdtable.component';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { WebDService } from '../../_appservice/webdpanel.service';
import { Subscription } from 'rxjs';
import { banner } from '../../_appmodel/_model';
import { dataTableConfig, tableEvent } from '../../_appmodel/_componentModel';

@Component({
  selector: 'app-bannermodule',
  standalone: true,
  imports: [WebdtableComponent, SweetAlert2Module],
  templateUrl: './bannermodule.component.html',
  styleUrl: './bannermodule.component.scss'
})
export class BannermoduleComponent {
  @ViewChild('dataTableCom', { static: false }) tableObj!: WebdtableComponent;
  @ViewChild('fileInput', { static: true }) fileInput: any;

  @ViewChild('deleteSwal')
  public readonly deleteSwal!: SwalComponent;

  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  swalOptions: SweetAlertOptions = { buttonsStyling: false };

  
  navigateaddform() {
    this._base._router.navigate(['/app/managebanner/0']);
  }

  private modalRef!: NgbModalRef;
  dataTable: any;
  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    private _cdr: ChangeDetectorRef) { }

  public bannerSubscribe!: Subscription;
  importFile!: FormData;
  bannerList: any = [];
  _banner: banner = {};

  tableConfig: dataTableConfig = {
    tableData: [],
    tableConfig: [
      { identifer: "createddatetime", title: "Date", type: "date" },
      { identifer: "thumbnail", title: "Thumbnail", type: "image", dataType: { type: "string", path: ['thumbnail'] }, size: { height: "100px", width: "250px" } },
      { identifer: "title", title: "Title", type: "text" },
      { identifer: "displayorder", title: "Display Order", type: "text" },
      { identifer: "", title: "Action", type: "buttonIcons", buttonIconList: [{ title: 'Edit', class: 'avtar avtar-s btn btn-primary', iconClass: 'ti ti-pencil' }, { title: 'Delete', class: 'avtar avtar-s btn btn-danger', iconClass: 'ti ti-trash' }] }],
    isCustom: {
      current: 0,
      steps: 10,
      total: 0,
      callbackfn: this.getBanner.bind(this)
    }
  }
  ngOnInit(): void {
    this.getBanner();
  }

  tableClick(dataItem: tableEvent) {
    if (dataItem?.action?.type == 'link' || (dataItem?.action?.type == 'buttonIcons' && dataItem.actionInfo.title == "Edit")) {
      this.modifyBanner(dataItem.tableItem, 'MODIFYBANNER');
    } else if (dataItem?.action?.type == 'buttonIcons' && dataItem.actionInfo.title == "Delete") {
      this.modifyBanner(dataItem.tableItem, 'DELETEBANNER');
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

    const selectedColumns = this.bannerList.map((item: any) => {
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

  getBanner() {
    let obj = this._base._commonService.getcatalogrange(this.tableConfig?.isCustom?.steps, (this.tableConfig?.isCustom?.current ?? 0) + 1)
    let start = obj[obj.length - 1].replace(/ /g, '').split('-')[0];
    let end = obj[obj.length - 1].replace(/ /g, '').split('-')[1];
    this._webDService.getbanner('all', 0, 0, 'null', 0, 'null', 'null', parseInt(start), parseInt(end)).subscribe((resBanner: any) => {
      this.bannerList = resBanner.data;
      this.bannerList = Array.isArray(resBanner.data) ? resBanner.data : [];
      if (this.tableConfig?.isCustom) {
        this.tableConfig.isCustom.total = resBanner.count;
      }
      this.tableObj.initializeTable();
      this.tableConfig.tableData = this.bannerList;
      this._cdr.detectChanges();
    });
  }

  modifyBanner(data:any, flag:any) {
    this._banner = data;
    this._banner.flag = flag;
    this._banner.banner_id = data.banner_id;
    if (flag == 'MODIFYBANNER') {
      this._base._router.navigate([`/app/managebanner/${data.banner_id}`]);
    } else if (flag == 'DELETEBANNER') {
      this.deleteSwal.fire().then((clicked) => {
        if (clicked.isConfirmed) {
          this._banner.isactive = false;
          this._webDService.banner(this._banner).subscribe((response: any) => {
            if (response == 'deletesuccess') {
              this.bannerList.filter((res: any, index: number) => {
                if (res.banner_id === this._banner.banner_id) {
                  this.bannerList.splice(index, 1);
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

  clearFormData() {
    this._banner = {};
  }
}
