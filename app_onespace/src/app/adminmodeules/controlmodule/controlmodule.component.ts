import { ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { WebdtableComponent } from '../../layout_template/webdtable/webdtable.component';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { WebDService } from '../../_appservice/webdpanel.service';
import { Subscription } from 'rxjs';
import { controlDetails, moduledataModel } from '../../_appmodel/_model';
import { dataTableConfig, tableEvent } from '../../_appmodel/_componentModel';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-controlmodule',
  standalone: true,
  imports: [WebdtableComponent, SweetAlert2Module, RouterLink],
  templateUrl: './controlmodule.component.html',
  styleUrl: './controlmodule.component.scss'
})
export class ControlmoduleComponent {
  @ViewChild('dataTableCom', { static: false }) tableObj!: WebdtableComponent;

  @ViewChild('deleteSwal')
  public readonly deleteSwal!: SwalComponent;

  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  @ViewChild('errorSwal')
  public readonly errorSwal!: SwalComponent;

  @ViewChild('importSwal')
  public readonly importSwal!: SwalComponent;

  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  importFile!: FormData;
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('formModal', { static: true }) formModal!: TemplateRef<any>;

  private modalRef!: NgbModalRef;
  dataTable: any;
  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    private _cdr: ChangeDetectorRef,
    private modalService: NgbModal
  ) { }

  public controlSubscribeData!: Subscription;
  ControlList: any = [];
  search: string = "";
  _controlDetails: controlDetails = {};
  _moduledataModel: moduledataModel = {};
  tableConfig: dataTableConfig = {
    tableData: [],
    tableConfig: [
      { identifer: "createddatetime", title: "Date", type: "date" },
      { identifer: "modulename", title: "Module", type: "text" },
      { identifer: "title", title: "System Name", type: "text" },
      { identifer: "description", title: "Description", type: "text" },
      { identifer: "", title: "Action", type: "buttonIcons", buttonIconList: [{ title: 'Edit', class: 'btn btn-primary btn-sm', iconClass: 'feather icon-edit' }, { title: 'Delete', class: 'btn btn-danger btn-sm', iconClass: 'feather icon-trash-2' }] },
    ],
    // showCheckBox: true, 
    isCustom: {
      current: 0,
      steps: 10,
      total: 0,
      callbackfn: this.getControls.bind(this)
    }
  }

  ngAfterViewInit(): void {
    // this._base._pageTitleService.setTitle('Manage Controls', 'Manage Controls');
  }

  ngOnInit(): void {
    this.getControls();
  }

  isDeleteButtonVisible: boolean = false;
  selectedId: string = '';
  tableClick(dataItem: tableEvent) {
    this.isDeleteButtonVisible = dataItem.checkedData.length > 0;
    if (dataItem.action?.type == 'link' || (dataItem.action?.type == 'buttonIcons' && dataItem.actionInfo.title == "Edit")) {
      this.modifycontrols(dataItem.tableItem, 'MODIFYCONTROL');
    } else if (dataItem.action?.type == 'buttonIcons' && dataItem.actionInfo.title == "Delete") {
      this.modifycontrols(dataItem.tableItem, 'DELETECONTROL');
    }
  }



  // exportToExcel() {

  //   const htmlToText = (html: string): string => {
  //     const tempElement = document.createElement('div');
  //     tempElement.innerHTML = html;
  //     return tempElement.textContent || tempElement.innerText || '';
  //   };
  //   const formatDate = (dateString: string): string => {
  //     const date = new Date(dateString);
  //     const day = String(date.getDate()).padStart(2, '0');
  //     const month = String(date.getMonth() + 1).padStart(2, '0');
  //     const year = date.getFullYear();
  //     return `${day}/${month}/${year}`;
  //   };

  //   const selectedRows = this.tableConfig.tableData.filter(item: any => item.isChecked_DataTable);

  //   if (selectedRows.length > 0) {
  //     const selectedColumns = selectedRows.map(item: any => {
  //       return {
  //         control_id: item.control_id,
  //         title: item.title,
  //         modulename: item.modulename,
  //         syscontrolname: item.syscontrolname,
  //         aliasname: item.aliasname,
  //         Description: htmlToText(item.description),
  //         module_id: item.module_id,
  //         IsActive: item.isactive,
  //         isdeleted: item.isdeleted,
  //         createdby: item.createdby,
  //         createdname: item.createdname,
  //       };
  //     });

  //     const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedColumns);
  //     const workbook: XLSX.WorkBook = {
  //       Sheets: { 'data': worksheet },
  //       SheetNames: ['data']
  //     };
  //     const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  //     const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  //     saveAs(data, 'SelectedControlsData.xlsx');
  //   } else {
  //     this._webDService.getcontrols(0, "null", 0, 999999).subscribe((res: any) => {
  //       const allData = Array.isArray(res.data) ? res.data : [];

  //       const selectedColumns = allData.map(item: any => {
  //         return {
  //           control_id: item.control_id,
  //           title: item.title,
  //           modulename: item.modulename,
  //           syscontrolname: item.syscontrolname,
  //           aliasname: item.aliasname,
  //           Description: htmlToText(item.description),
  //           module_id: item.module_id,
  //           IsActive: item.isactive,
  //           isdeleted: item.isdeleted,
  //           createdby: item.createdby,
  //           createdname: item.createdname,
  //         };
  //       });

  //       // const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(selectedColumns);
  //       // const workbook: XLSX.WorkBook = {
  //       //   Sheets: { 'data': worksheet },
  //       //   SheetNames: ['data']
  //       // };
  //       // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  //       // const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  //       // saveAs(data, 'ControlsData.xlsx');
  //     });
  //   }
  // }

  openMediaUploaderModal() {
    this.modalService.open(this.formModal, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      centered: true
    });
  }
  import_control(event: any) {
    this.importFile = event.target.files;
  }

  // confirmUpload() {
  //   this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
  //     this._base._encryptedStorage.get(enAppSession.fullname).then(fullname => {
  //       // let f = this.importFile.item(0);
  //       this._webDService.import_control(this.importFile, user_id, fullname).subscribe((response: any) => {
  //         if (response == 'importsuccess') {
  //           setTimeout(() => {
  //             this.importSwal.fire();
  //             setTimeout(() => {
  //               this._base._router.navigate(['/app/configuration/controls']);
  //               location.reload();
  //             }, 1500);
  //           }, 1000);
  //         } else {
  //           if (response === ' ERROR_MESSAGE()') {
  //             setTimeout(() => {
  //               this.errorSwal.fire();
  //               setTimeout(() => {
  //                 location.reload();
  //               }, 1500);
  //             }, 1000);
  //           }
  //         }
  //       });
  //     });
  //   });
  // }
  // CancelimportcontrolData() {
  //   this.importFile = null;
  // }


  noRecordsFound: boolean = false;
  clearSearch() {
    this.search = '';
    this.noRecordsFound = false;
    this.getControls();
  }

  getControls() {
    let obj = this._base._commonService.getcatalogrange(this.tableConfig.isCustom?.steps, (this.tableConfig?.isCustom?.current ?? 0) + 1)
    let start = obj[obj.length - 1].replace(/ /g, '').split('-')[0];
    let end = obj[obj.length - 1].replace(/ /g, '').split('-')[1];
    this._webDService.getcontrols(0, this.search || "null", parseInt(start), parseInt(end)).subscribe((resControlsData: any) => {
      this.ControlList = resControlsData.data;
      this.ControlList = Array.isArray(resControlsData.data) ? resControlsData.data : [];
      if (this.tableConfig?.isCustom) {
        this.tableConfig.isCustom.total = resControlsData.count;
      }
      this.tableConfig.tableData = this.ControlList;
      this.noRecordsFound = this.ControlList.length === 0;
      this.tableObj.initializeTable();
      this._cdr.detectChanges();
    });
  }

  modifycontrols(data: any, flag: any) {
    this._controlDetails = data;
    this._controlDetails.flag = flag;
    this._controlDetails.control_id = data.control_id
    if (flag == 'MODIFYCONTROL') {
      this._base._router.navigate([`/app/control/${data.control_id}`]);
    } else if (flag == 'DELETECONTROL') {
      this.deleteSwal.fire().then((clicked) => {
        if (clicked.isConfirmed) {
          this._controlDetails.isactive = false;
          this._webDService.controls(this._controlDetails).subscribe((response: any) => {
            if (response == 'deletesuccess') {
              this.ControlList.filter((res: any, index: number) => {
                if (res.control_id === this._controlDetails.control_id) {
                  this.ControlList.splice(index, 1);
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
    this._controlDetails = {};
  }

}
