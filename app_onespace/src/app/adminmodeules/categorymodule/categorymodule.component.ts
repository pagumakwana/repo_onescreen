import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { WebdtableComponent } from '../../layout_template/webdtable/webdtable.component';
import { enAppSession } from '../../_appmodel/sessionstorage';
import { dataTableConfig, tableEvent } from '../../_appmodel/_componentModel';
import { categoryMaster } from '../../_appmodel/_model';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { WebDService } from '../../_appservice/webdpanel.service';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';

import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-categorymodule',
  standalone: true,
  imports: [WebdtableComponent],
  templateUrl: './categorymodule.component.html',
  styleUrl: './categorymodule.component.scss'
})
export class CategorymoduleComponent {
  @ViewChild('dataTableCom', { static: false }) tableObj!: WebdtableComponent;
  @ViewChild('fileInput', { static: true }) fileInput: any;

  @ViewChild('deleteSwal')
  public readonly deleteSwal!: SwalComponent;

  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  navigateaddform() {
    this._base._router.navigate(['/app/managecategory/0']);
  }
  private modalRef!: NgbModalRef;
  dataTable: any;
  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    private _cdr: ChangeDetectorRef) { }

  public categorySubscribe!: Subscription;
  importFile!: FormData;
  CategoryMaster: any = [];
  _categoryMaster: categoryMaster = {};
  tableConfig: dataTableConfig = {
    tableData: [],
    tableConfig: [
      { identifer: "createddatetime", title: "Date", type: "date" },
      { identifer: "category", title: "Category", type: "text" },
      { identifer: "typemaster", title: "Type Master", type: "text" },
      { identifer: "description", title: "Description", type: "text" },
      { identifer: "", title: "Action", type: "buttonIcons", buttonIconList: [{ title: 'Edit', class: 'avtar avtar-s btn btn-primary', iconClass: 'ti ti-pencil' }, { title: 'Delete', class: 'avtar avtar-s btn btn-danger', iconClass: 'ti ti-trash' }] },
    ],
    isCustom: {
      current: 0,
      steps: 10,
      total: 0,
      callbackfn: this.getcategory.bind(this)
    }
  }

  ngOnInit(): void {
    this.getcategory();
  }

  tableClick(dataItem: tableEvent) {
    if (dataItem?.action?.type == 'link' || (dataItem?.action?.type == 'buttonIcons' && dataItem.actionInfo.title == "Edit")) {
      this.modifyCategory(dataItem.tableItem, 'MODIFYCATEGORY');
    } else if (dataItem?.action?.type == 'buttonIcons' && dataItem.actionInfo.title == "Delete") {
      this.modifyCategory(dataItem.tableItem, 'DELETECATEGORY');
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

    const selectedColumns = this.CategoryMaster.map((item: any) => {
      return {
        Date: formatDate(item.createddatetime),
        TypeMaster: item.typemaster,
        Category: item.category,
        Description: htmlToText(item.description),
        DisplayOrder: item.displayorder,
        IsFeatured: item.isfeatured,
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
    // saveAs(data, 'CategoryData.xlsx');
  }

  importCategoryData($event: any) {
    this.importFile = $event.target.files;
  }

  confirmUpload() {
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this._base._encryptedStorage.get(enAppSession.fullname).then(fullname => {
        // let f = this.importFile.item(0);
        // this._webDService.importCategoryData(this.importFile, user_id, fullname).subscribe((result: any) => {
        //   if (result == 'IMPORTCUISINESSUCCESS') {
        //     // this._base._alertService.success("Cuisines Data Imported successfully!");
        //   } else {
        //     // this._base._alertService.error("Import Process Failed!")
        //   }
        //   setTimeout(() => {
        //     this._base._router.navigate(['catalog', 'cuisines']);
        //   }, 1000);
        // });
      });
    });
  }
  CancelimportCategoryData() {
    // this.importFile = null;
  }

  getcategory() {
    let obj = this._base._commonService.getcatalogrange(this.tableConfig?.isCustom?.steps, (this.tableConfig?.isCustom?.current ?? 0) + 1)
    let start = obj[obj.length - 1].replace(/ /g, '').split('-')[0];
    let end = obj[obj.length - 1].replace(/ /g, '').split('-')[1];
    this._webDService.getcategory('all', 0, 'null', 0, 'null', false, 0, 'null', parseInt(start), parseInt(end)).subscribe((resCategory: any) => {
      this.CategoryMaster = resCategory.data;
      this.CategoryMaster = Array.isArray(resCategory.data) ? resCategory.data : [];
      if (this.tableConfig?.isCustom) {
        this.tableConfig.isCustom.total = resCategory.count;
      }
      this.tableConfig.tableData = this.CategoryMaster;
      this.tableObj.initializeTable();
      this._cdr.detectChanges();
    });
  }

  modifyCategory(data: any, flag: any) {
    this._categoryMaster = data;
    this._categoryMaster.flag = flag;
    if (flag == 'MODIFYCATEGORY') {
      this._base._router.navigate([`/app/managecategory/${data.category_id}`]);
    } else if (flag == 'DELETECATEGORY') {
      this.deleteSwal.fire().then((clicked) => {
        if (clicked.isConfirmed) {

          this._categoryMaster.isactive = false;
          this._webDService.category(this._categoryMaster).subscribe((response: any) => {
            if (response == 'deletesuccess') {
              this.CategoryMaster.filter((res: any, index: number) => {
                if (res.category_id === this._categoryMaster.category_id) {
                  this.CategoryMaster.splice(index, 1);
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
    this._categoryMaster = {};
  }
}
