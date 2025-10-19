import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { WebdtableComponent } from '../../layout_template/webdtable/webdtable.component';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { WebDService } from '../../_appservice/webdpanel.service';
import { Subscription } from 'rxjs';
import { labelMaster } from '../../_appmodel/_model';
import { dataTableConfig, tableEvent } from '../../_appmodel/_componentModel';

@Component({
  selector: 'app-labelmodule',
  standalone: true,
  imports: [WebdtableComponent, SweetAlert2Module],
  templateUrl: './labelmodule.component.html',
  styleUrl: './labelmodule.component.scss'
})
export class LabelmoduleComponent {
  @ViewChild('dataTableCom', { static: false }) tableObj!: WebdtableComponent;
  @ViewChild('fileInput', { static: true }) fileInput: any;

  @ViewChild('deleteSwal')
  public readonly deleteSwal!: SwalComponent;

  navigateaddform() {
    this._base._router.navigate(['/app/managelabel/0']);
  }
  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };

  private modalRef!: NgbModalRef;
  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    private _cdr: ChangeDetectorRef) { }

  public labelSubscribe!: Subscription;
  importFile!: FormData;
  LabelMaster: any = [];
  _labelMaster: labelMaster = {};
  tableConfig: dataTableConfig = {
    tableData: [],
    tableConfig: [
      { identifer: "createddatetime", title: "Date", type: "date" },
      { identifer: "label", title: "Label Name", type: "text" },
      { identifer: "typemaster", title: "Type Master", type: "text" },
      { identifer: "description", title: "Description", type: "text" },
      { identifer: "", title: "Action", type: "buttonIcons", buttonIconList: [{ title: 'Edit', class: 'btn btn-primary btn-sm', iconClass: 'feather icon-edit' }, { title: 'Delete', class: 'btn btn-danger btn-sm', iconClass: 'feather icon-trash-2' }] },],
    isCustom: {
      current: 0,
      steps: 10,
      total: 0,
      callbackfn: this.getLabelMaster.bind(this)
    }
  }

  ngOnInit(): void {
    this.getLabelMaster();
  }

  tableClick(dataItem: tableEvent) {
    if (dataItem?.action?.type == 'link' || (dataItem?.action?.type == 'buttonIcons' && dataItem.actionInfo.title == "Edit")) {
      this.modifylabel(dataItem.tableItem, 'MODIFYLABEL');
    } else if (dataItem?.action?.type == 'buttonIcons' && dataItem.actionInfo.title == "Delete") {
      this.modifylabel(dataItem.tableItem, 'DELETELABEL');
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

    const selectedColumns = this.LabelMaster.map((item: any) => {
      return {
        Date: formatDate(item.createddatetime),
        LabelName: item.label,
        TypeMaster: item.typemaster,
        Description: htmlToText(item.description),
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
    // saveAs(data, 'LabelData.xlsx');
  }

  getLabelMaster() {
    let obj = this._base._commonService.getcatalogrange(this.tableConfig?.isCustom?.steps, (this.tableConfig?.isCustom?.current ?? 0) + 1)
    let start = obj[obj.length - 1].replace(/ /g, '').split('-')[0];
    let end = obj[obj.length - 1].replace(/ /g, '').split('-')[1];
    this._webDService.getlabelmaster('all', 0, 'null', 0, 'null', 'null', parseInt(start), parseInt(end)).subscribe((resLabel: any) => {
      this.LabelMaster = resLabel.data;
      this.LabelMaster = Array.isArray(resLabel.data) ? resLabel.data : [];
      if (this.tableConfig?.isCustom) {
        this.tableConfig.isCustom.total = resLabel.count;
      }
      this.tableConfig.tableData = this.LabelMaster;
      this.tableObj.initializeTable();
      this._cdr.detectChanges();
    });
  }

  modifylabel(data: any, flag: any) {
    this._labelMaster = data;
    this._labelMaster.flag = flag;
    this._labelMaster.aliasname = data.aliasname;
    if (flag == 'MODIFYLABEL') {
      this._base._router.navigate([`/app/managelabel/${data.label_id}`]);
    } else if (flag == 'DELETELABEL') {
      this.deleteSwal.fire().then((clicked) => {
        if (clicked.isConfirmed) {
          this._labelMaster.isactive = false;
          this._webDService.labelmaster(this._labelMaster).subscribe((response: any) => {
            if (response == 'deletesuccess') {
              this.LabelMaster.filter((res: any, index: number) => {
                if (res.label_id === this._labelMaster.label_id) {
                  this.LabelMaster.splice(index, 1);
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
    this._labelMaster = {};
  }
}
