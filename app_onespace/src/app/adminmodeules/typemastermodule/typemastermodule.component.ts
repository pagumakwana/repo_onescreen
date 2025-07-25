import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { WebdtableComponent } from '../../layout_template/webdtable/webdtable.component';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { WebDService } from '../../_appservice/webdpanel.service';
import { SweetAlertOptions } from 'sweetalert2';
import { Subscription } from 'rxjs';
import { typeMaster } from '../../_appmodel/_model';
import { dataTableConfig, tableEvent } from '../../_appmodel/_componentModel';

@Component({
  selector: 'app-typemastermodule',
  standalone: true,
  imports: [WebdtableComponent],
  templateUrl: './typemastermodule.component.html',
  styleUrl: './typemastermodule.component.scss'
})
export class TypemastermoduleComponent {
  @ViewChild('dataTableCom', { static: false }) tableObj!: WebdtableComponent;
  @ViewChild('fileInput', { static: true }) fileInput: any;

  @ViewChild('deleteSwal')
  public readonly deleteSwal!: SwalComponent;

  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  swalOptions: SweetAlertOptions = { buttonsStyling: false };

  private modalRef!: NgbModalRef;
  dataTable: any;
  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    private _cdr: ChangeDetectorRef) { }

  public typemasterSubscribe!: Subscription;
  importFile!: FormData;
  TypeMaster: any = [];
  _typeMaster: typeMaster = {};

  tableConfig: dataTableConfig = {
    tableTitle: "",
    tableData: [],
    tableConfig: [
      { identifer: "createddatetime", title: "Date", type: "date" },
      { identifer: "typemaster", title: "Type Master", type: "text" },
      { identifer: "description", title: "Description", type: "text" },
      { identifer: "displayorder", title: "Display Order", type: "text" },
      { identifer: "", title: "Action", type: "buttonIcons", buttonIconList: [{ title: 'Edit', class: 'btn btn-sm btn-primary', iconClass: 'edit-2' }, { title: 'Delete', class: 'btn btn-sm btn-danger', iconClass: 'x-circle' }] },
    ],
    isCustom: {
      current: 0,
      steps: 10,
      total: 0,
      callbackfn: this.gettypemaster.bind(this)
    }
  }

  ngOnInit(): void {
    this.gettypemaster();
  }

  tableClick(dataItem: tableEvent) {
    if (dataItem?.action?.type == 'link' || (dataItem?.action?.type == 'buttonIcons' && dataItem.actionInfo.title == "Edit")) {
      this.modifytypemaster(dataItem.tableItem, 'MODIFYTYPEMASTER');
    } else if (dataItem?.action?.type == 'buttonIcons' && dataItem.actionInfo.title == "Delete") {
      this.modifytypemaster(dataItem.tableItem, 'DELETETYPEMASTER');
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

    const selectedColumns = this.TypeMaster.map((item: any) => {
      return {
        Date: formatDate(item.createddatetime),
        TypeMaster: item.typemaster,
        Description: htmlToText(item.description),
        DisplayOrder: item.displayorder,
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
    // saveAs(data, 'TypeData.xlsx');
  }

  gettypemaster() {
    let obj = this._base._commonService.getcatalogrange(this.tableConfig?.isCustom?.steps, (this.tableConfig?.isCustom?.current ?? 0) + 1)
    let start = obj[obj.length - 1].replace(/ /g, '').split('-')[0];
    let end = obj[obj.length - 1].replace(/ /g, '').split('-')[1];
    this._webDService.gettypemaster('all', 'null', 0, 'null', parseInt(start), parseInt(end)).subscribe((resTypeMaster: any) => {
      this.TypeMaster = resTypeMaster.data;
      this.TypeMaster = Array.isArray(resTypeMaster.data) ? resTypeMaster.data : [];
      if (this.tableConfig?.isCustom) {
        this.tableConfig.isCustom.total = resTypeMaster.count;
      }
      this.tableConfig.tableData = this.TypeMaster;
      this.tableObj.initializeTable();
      this._cdr.detectChanges();
    });
  }

  modifytypemaster(data: any, flag: any) {
    this._typeMaster = data;
    this._typeMaster.flag = flag;
    this._typeMaster.aliasname = data.aliasname;
    this._typeMaster.typemaster_id = data.typemaster_id;
    if (flag == 'MODIFYTYPEMASTER') {
      this._base._router.navigate([`/app/catalogue/typemaster/${btoa(data.typemaster_id)}/${data.aliasname}`]);
    } else if (flag == 'DELETETYPEMASTER') {
      this.deleteSwal.fire().then((clicked) => {
        if (clicked.isConfirmed) {
          this._typeMaster.isactive = false;
          this._webDService.typemaster(this._typeMaster).subscribe((response: any) => {
            if (response == 'deletesuccess') {
              this.TypeMaster.filter((res: any, index: number) => {
                if (res.typemaster_id === this._typeMaster.typemaster_id) {
                  this.TypeMaster.splice(index, 1);
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
    this._typeMaster = {};
  }
}
