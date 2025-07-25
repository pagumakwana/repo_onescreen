import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { SweetAlertOptions } from 'sweetalert2';
import { WebdtableComponent } from '../../layout_template/webdtable/webdtable.component';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { WebDService } from '../../_appservice/webdpanel.service';
import { userModel } from '../../_appmodel/_model';
import { Subscription } from 'rxjs';
import { dataTableConfig, tableEvent } from '../../_appmodel/_componentModel';

@Component({
  selector: 'app-usermodule',
  standalone: true,
  imports: [WebdtableComponent],
  templateUrl: './usermodule.component.html',
  styleUrl: './usermodule.component.scss'
})
export class UsermoduleComponent {
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

  _userModel: userModel = {};
  userListData: any = [];
  public userSubscribe!: Subscription;
  importFile!: FormData;

  tableConfig: dataTableConfig = {
    tableData: [],
    tableConfig: [
      { identifer: "createddatetime", title: "Date", type: "date" },
      // { identifer: "projectname", title: "Project", type: "text" },
      { identifer: "fullname", title: "Full Name", type: "text" },
      { identifer: "email_id", title: "Email ID", type: "text" },
      { identifer: "mobilenumber", title: "Mobile Number", type: "text" },
      { identifer: "is_approved", title: "Is_Approved", type: "text" },
      { identifer: "", title: "Action", type: "buttonIcons", buttonIconList: [{ title: 'Edit', class: 'btn btn-sm btn-primary', iconClass: 'edit-2' }, { title: 'Delete', class: 'btn btn-sm btn-danger', iconClass: 'x-circle' }] },
    ],
    isCustom: {
      current: 0,
      steps: 10,
      total: 0,
      callbackfn: this.getUserList.bind(this)
    }
  }

  ngOnInit(): void {
    this.getUserList();
  }

  tableClick(dataItem: tableEvent) {
    if (dataItem?.action?.type == 'link' || (dataItem?.action?.type == 'buttonIcons' && dataItem.actionInfo.title == "Edit")) {
      this.modifyuser(dataItem.tableItem, 'MODIFYUSER');
    } else if (dataItem?.action?.type == 'buttonIcons' && dataItem.actionInfo.title == "Delete") {
      this.modifyuser(dataItem.tableItem, 'DELETEUSER');
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

    const selectedColumns = this.userListData.map((item: any) => {
      return {
        Date: formatDate(item.createddatetime),
        FullName: item.fullname,
        EmailAddress: item.email_id,
        Password: item.password,
        MobileNumber: item.mobilenumber,
        DOB: item.dob,
        Website: item.Website,
        Bio: item.bio,
        ProjectName: item.project_id,
        Project: item.project_id,
        Authority: item.Authority,
        Description: htmlToText(item.description),
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
    // saveAs(data, 'UserData.xlsx');
  }

  getUserList() {
    let obj = this._base._commonService.getcatalogrange(this.tableConfig?.isCustom?.steps, (this.tableConfig?.isCustom?.current ?? 0) + 1)
    let start = obj[obj.length - 1].replace(/ /g, '').split('-')[0];
    let end = obj[obj.length - 1].replace(/ /g, '').split('-')[1];
    this._webDService.userlist('USERLIST', 0, 'null', parseInt(start), parseInt(end)).subscribe((resUserListdata: any) => {
      this.userListData = resUserListdata.data;
      this.userListData = Array.isArray(resUserListdata.data) ? resUserListdata.data : [];
      if (this.tableConfig?.isCustom) {
        this.tableConfig.isCustom.total = resUserListdata.count;
      }
      this.tableConfig.tableData = this.userListData;
      this.tableObj.initializeTable();
      this._cdr.detectChanges();
    });
  }

  modifyuser(data:any, flag:any) {
    this._userModel = data;
    this._userModel.flag = flag;
    this._userModel.user_id = data.user_id;
    if (flag == 'MODIFYUSER') {
      this._base._router.navigate([`/app/user/userlist/${data.user_id}`]);
    } else if (flag == 'DELETEUSER') {
      this.deleteSwal.fire().then((clicked) => {
        if (clicked.isConfirmed) {
          // this._userModel.isactive = false;
          this._webDService.useraddmodify(this._userModel).subscribe((response: any) => {
            if (response == 'deletesuccess') {
              this.userListData.filter((res: any, index: number) => {
                if (res.user_id === this._userModel.user_id) {
                  this.userListData.splice(index, 1);
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
}