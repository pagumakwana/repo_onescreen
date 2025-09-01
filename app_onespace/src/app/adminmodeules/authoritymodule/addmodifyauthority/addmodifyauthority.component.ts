import { ChangeDetectorRef, Component, EventEmitter, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Config } from 'datatables.net';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { enAppSession } from '../../../_appmodel/sessionstorage';
import { BaseServiceHelper } from '../../../_appservice/baseHelper.service';
import { WebDService } from '../../../_appservice/webdpanel.service';
import { userAuthority } from '../../../_appmodel/_model';
import { WebdtexteditorComponent } from '../../../layout_template/webdtexteditor/webdtexteditor.component';
import { CommonModule } from '@angular/common';
import { treeConfig } from '../../../layout_template/webdtreeview/treeview.model';
import { WebdtreeviewComponent } from '../../../layout_template/webdtreeview/webdtreeview.component';

@Component({
  selector: 'app-addmodifyauthority',
  standalone: true,
  imports: [SweetAlert2Module, WebdtexteditorComponent,FormsModule,ReactiveFormsModule,CommonModule,RouterModule,WebdtreeviewComponent],
  templateUrl: './addmodifyauthority.component.html',
  styleUrl: './addmodifyauthority.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class AddmodifyauthorityComponent implements OnInit{
  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  @ViewChild('deleteSwal')
  public readonly deleteSwal!: SwalComponent;

  confirmGoBack() {
    this.deleteSwal.fire();
  }

  navigateBack() {
    this._base._router.navigate(['/app/manageauthority']);
  }
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading!: boolean;


  // @ViewChild('dataTableCom', { static: false }) tableObj: WebdtableComponent;
  dataTable: any;
  fguserAuthority!: FormGroup;
  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    public _fbUserAuthority: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _activatedRouter: ActivatedRoute) { }

  _userAuthority: userAuthority = {};
  authorityid: any;
  controlList: any = [];
  isFormSubmit: boolean = false;
  private isAuthorityModify: boolean = false;
  public authoritySubscribeData?: Subscription;

  // tableConfig: dataTableConfig = {
  //   tableData: [],
  //   tableConfig: [
  //     // { identifer: "", title: "Action", type: "buttonIcons", buttonIconList: [{ title: 'Edit', class: 'btn btn-primary btn-sm', iconClass: 'fa fa-pencil' }, { title: 'Delete', class: 'btn btn-danger btn-sm', iconClass: 'fa fa-trash' }] },
  //     // { identifer: "createddatetime", title: "Date", type: "date" },
  //     // { identifer: "isChecked", title: "Select", type: "checkbox" } ,
  //     { identifer: "modulename", title: "Module", type: "text" },
  //     { identifer: "title", title: "Name", type: "text" },
  //     { identifer: "syscontrolname", title: "System Name", type: "text" },
  //     { identifer: "description", title: "Description", type: "text" }
  //   ],
  //   showCheckBox: true,
  //   isCustom: {
  //     current: 0,
  //     steps: 10,
  //     total: null,
  //     callbackfn: this.getControls.bind(this)
  //   }
  // }

  treeConfig: treeConfig = {
    childrenField: 'children',
    displayField: 'modulename',
    idField: 'module_id',
    treeData: [],
    selectedNodes: []
  }
  initform() {
    this.fguserAuthority = this._fbUserAuthority.group({
      authority_id: [0],
      authority: ['', [Validators.required]],
      textarea: this._fbUserAuthority.group({
        description: [''],
      }),
      lstmodule: [[]]
    })
  }
  ngAfterViewInit(): void {
    // this._base._pageTitleService.setTitle('Manage Authority', 'Manage Authority');
  }
  ngOnInit(): void {
    this.initform();
    this.authorityid = this._activatedRouter.snapshot.paramMap.get('authority_id');
    // this.getControls().then((isControl``: boolean) => {
    //   if (isControl) {
        this.getusermodule().then((isMenu: any) => {
          if (isMenu) {
            this.treeConfig.treeData = this._base._commonService.list_to_tree(isMenu, 'module_id', 'module_parent_id');
            if (this.authorityid != '0' && isMenu) {
              this.getAuhtority(this.authorityid);
            }
          }
        });
    //   }
    // });

  }
  getusermodule() {
    return new Promise((resolve, rejects) => {
      this._webDService.getusermodule().subscribe((res: any) => {
        res = Array.isArray(res?.data) && res?.data?.length > 0 ? res?.data : [];
        resolve(res);
      }, error => {
        resolve(false);
      });
    });
  }

  // getControls() {
  //   return new Promise((resolve, rejects) => {
  //     this._webDService.getcontrols().subscribe((resControlsData: any) => {
  //       this.controlList = [];
  //       this.controlList = Array.isArray(resControlsData.data) ? resControlsData.data : [];
  //       this.tableConfig.isCustom.total = resControlsData.count;
  //       this.tableConfig.tableData = this.controlList;
  //       this.tableObj.initializeTable()
  //       this._cdr.detectChanges();
  //       resolve(true);
  //     }, error => {
  //       resolve(false);
  //     });
  //   });
  // }
  // lstcheckdata: any = [];
  // tableClick(dataItem: tableEvent) {
  //   this.lstcheckdata = [];
  //   this.lstcheckdata = dataItem.checkedData;
  //   console.log("this.lstcheckdata", this.lstcheckdata);
  //   this.fguserAuthority.controls.lstcontrol.setValue(this.lstcheckdata);
  // }

  treeEvent(event:any) {
    let obj:any = [];
    event?.checkedObj.filter((res:any) => {
      if (!obj.includes(res.data))
        obj.push(res.data);
    });
    this.fguserAuthority.controls['lstmodule'].setValue(obj);
  }


  getAuhtority(authority_id:any) {
    this._webDService.getauthority(authority_id, 'DETAILS').subscribe((resuserModulelist: any) => {
      let userModulelist = Array.isArray(resuserModulelist.data) ? resuserModulelist.data : [];
      this._userAuthority = userModulelist[0];

      if (this._userAuthority) {
        this.isAuthorityModify = true;
        this.fguserAuthority.controls['authority'].setValue(this._userAuthority.authority);
        this.fguserAuthority.get('textarea.description')?.setValue(this._userAuthority.description);
        this.fguserAuthority.controls['authority_id'].setValue(this._userAuthority.authority_id);

        // Set checked state in treeConfig
        this.treeConfig.selectedNodes = this._userAuthority.lstmodule;
        this.fguserAuthority.controls['lstmodule']?.setValue(this._base._commonService.plunk(this._userAuthority.lstmodule, 'module_id').split(','));
        // this.fguserAuthority.controls['lstcontrol'].setValue(this._base._commonService.plunk(this._userAuthority.lstcontrol, 'control_id').split(','));
        // // ** Update checkboxes based on the assigned controls **
        // const assignedControlIds = this._base._commonService.plunk(this._userAuthority.lstcontrol, 'control_id').split(',');

        // this.tableConfig.tableData = this.tableConfig.tableData.map(control => ({
        //   ...control,
        //   isChecked: assignedControlIds.includes(control.control_id.toString()) // Convert to string for matching
        // }));

        // // Update the form control for lstcontrol
        // this.fguserAuthority.controls.lstcontrol.setValue(assignedControlIds);

        this._cdr.detectChanges();
      }
    });
  }

  flagType: any
  setuserAuthority(flag:any) {
    this.flagType = flag;
    this.isLoading$.next(true);
    this._base._commonService.markFormGroupTouched(this.fguserAuthority)
    if (this.fguserAuthority.valid) {
      this._userAuthority.authority = this.fguserAuthority.value.authority;
      this._userAuthority.description = this.fguserAuthority.value.textarea.description;
      this._userAuthority.lstmodule = this.fguserAuthority.value.lstmodule;
      this._userAuthority.authority_id = this.fguserAuthority.value.authority_id;
      this.addmodifyuserauthority(flag);
    }
  }
  addmodifyuserauthority(flag:any) {
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this._base._encryptedStorage.get(enAppSession.fullname).then(fullname => {
        this._userAuthority.flag = this.isAuthorityModify ? 'MODIFYAUTHORITY' : 'NEWAUTHORITY';
        this._userAuthority.createdname = fullname;
        this._userAuthority.user_id = user_id;
        this._webDService.authority(this._userAuthority).subscribe((response: any) => {
          let isRedirect: boolean = true
          if (response === 'authorityexists') {
            isRedirect = false;
          }

          setTimeout(() => {
            this.isLoading$.next(false);
            this._cdr.detectChanges();
          }, 1500);

          if (isRedirect && flag) {
            setTimeout(() => {
              this.successSwal.fire();
              setTimeout(() => {
                this._base._router.navigate(['/app/manageauthority']);
              }, 1500);
            }, 1000);
          }
        });
      });
    });
  }
}
