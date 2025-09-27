import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SweetAlertOptions } from 'sweetalert2';
import { BaseServiceHelper } from '../../../_appservice/baseHelper.service';
import { WebDService } from '../../../_appservice/webdpanel.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { controlDetails } from '../../../_appmodel/_model';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { enAppSession } from '../../../_appmodel/sessionstorage';
import { WebdtexteditorComponent } from '../../../layout_template/webdtexteditor/webdtexteditor.component';
import { MultiselectComponent } from '../../../layout_template/multiselect/multiselect.component';

@Component({
  selector: 'app-managecontrol',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, WebdtexteditorComponent, MultiselectComponent, SweetAlert2Module, RouterLink],
  templateUrl: './managecontrol.component.html',
  styleUrl: './managecontrol.component.scss'
})
export class ManagecontrolComponent {
  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading!: boolean;
  private unsubscribe: Subscription[] = [];

  // navigateBack() {
  //   this._base._router.navigate(['/app/control']);
  // }	

  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    public _fbControls: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _activatedRouter: ActivatedRoute) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
  }

  fgcontrols!: FormGroup
  moduleMaster: any = []
  _controlDetails: controlDetails = {};
  control_id: any;
  ControlList: any = [];
  private isControlModify: boolean = false;


  initform() {
    this.fgcontrols = this._fbControls.group({
      control_id: [''],
      title: ['', [Validators.required]],
      syscontrolname: [''],
      aliasname: [''],
      module_id: ['0'],
      modulename: ['', [Validators.required]],
      lstmodule: ['', [Validators.required]],
      isactive: [true],
      textarea: this._fbControls.group({
        description: [''],
      }),
    })

  }

  public _configmodule: IDropdownSettings = {
    singleSelection: true,
    idField: 'module_id',
    textField: 'modulename',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true, closeDropDownOnSelection: true
  }
  ngAfterViewInit(): void {
    // this._base._pageTitleService.setTitle('Manage Authority', 'Manage Authority');
  }

  flag: string = "";
  ngOnInit(): void {
    this.initform();
    this.control_id = this._activatedRouter.snapshot.paramMap.get('control_id');
    this.getUserModule();
    if (this.control_id != '0') {
      this.getControls(this.control_id);
      this.flag = "Update Controls";
    } else {
      this.flag = "New Controls";
    }

    this.fgcontrols.controls['title'].valueChanges.subscribe((value: string) => {
      value = value.replace(/ /g, '-').toLowerCase().trim();
      value = value.replace(/&/g, 'and').toLowerCase().trim();
      value = value.replace(/\//g, 'or').toLowerCase().trim();
      value = value.replace(/\./g, '_').toLowerCase().trim();
      this.fgcontrols.controls['aliasname'].setValue(value);
      this.fgcontrols.controls['aliasname'].updateValueAndValidity()
      this.fgcontrols.controls['syscontrolname'].setValue(value);
      this.fgcontrols.controls['syscontrolname'].updateValueAndValidity()
    })
  }

  getControls(control_id: any) {
    return new Promise((resolve, reject) => {
      this._webDService.getcontrols(control_id).subscribe((resControlList: any) => {
        let controlList = Array.isArray(resControlList.data) ? resControlList.data : [];
        this._controlDetails = controlList[0];
        this.isControlModify = true;
        this.fgcontrols.controls['title'].setValue(this._controlDetails.title);
        this.fgcontrols.controls['aliasname'].setValue(this._controlDetails.aliasname);
        this.fgcontrols.controls['syscontrolname'].setValue(this._controlDetails.syscontrolname);
        this.fgcontrols.controls['module_id'].setValue(this._controlDetails.module_id);
        this.fgcontrols.controls['modulename'].setValue(this._controlDetails.modulename);
        this.fgcontrols.controls['isactive'].setValue(this._controlDetails.isactive);
        this.fgcontrols.get('textarea.description')?.setValue(this._controlDetails.description);
        this.fgcontrols.controls['lstmodule'].setValue([{ module_id: this._controlDetails.module_id, modulename: this._controlDetails.modulename }]);
        resolve(true)
      }, error => {
        resolve(false);
      });
    });
  }

  flagType: string = ''
  setcontrol(flag:any) {

    this.flagType = flag;
    this.isLoading$.next(true);
    this._base._commonService.markFormGroupTouched(this.fgcontrols)
    if (this.fgcontrols.valid) {
      this._controlDetails.title = this.fgcontrols.value.title;
      this._controlDetails.aliasname = this.fgcontrols.value.aliasname;
      this._controlDetails.syscontrolname = this.fgcontrols.value.syscontrolname;
      this._controlDetails.module_id = this.fgcontrols.value.module_id;
      this._controlDetails.modulename = this.fgcontrols.value.modulename;
      this._controlDetails.isactive = this.fgcontrols.value.isactive;
      this._controlDetails.description = this.fgcontrols.value.textarea.description;
      this.addmodifycontrol(flag);
    } else {
      setTimeout(() => {
        this.isLoading$.next(false);
        this._cdr.detectChanges();
      }, 1500);
    }
  }
  addmodifycontrol(flag: any) {
    this._base._encryptedStorage.get(enAppSession.client_id).then(client_id => {
      this._base._encryptedStorage.get(enAppSession.project_id).then(project_id => {
        this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
          this._base._encryptedStorage.get(enAppSession.fullname).then(fullname => {
            this._controlDetails.flag = this.isControlModify ? 'MODIFYCONTROL' : 'NEWCONTROL';
            this._controlDetails.client_id = client_id;
            this._controlDetails.project_id = project_id;
            this._controlDetails.createdname = fullname;
            this._controlDetails.user_id = user_id;
            console.log("this._controlDetails", this._controlDetails);
            this._webDService.controls(this._controlDetails).subscribe((response: any) => {
              let isRedirect: boolean = true
              if (response === 'controlexists') {
                // Show warning if society already exists
                // this._base._alertMessageService.warning("Society already exists!");
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
                    this._base._router.navigate(['/app/control']);
                  }, 1500);
                }, 1000);
              }
            });
          });
        });
      });
    });
  }

  getUserModule() {
    this._webDService.getusermodule().subscribe((resmoduleMaster: any) => {
      this.moduleMaster = [];
      this.moduleMaster = Array.isArray(resmoduleMaster.data) ? resmoduleMaster.data : [];
      this.moduleMaster = this.moduleMaster.sort((a: any, b: any) => a.modulename.localeCompare(b.modulename));
      this._cdr.detectChanges();
    });
  }

  changeModule($event: any) {
    if ($event && $event != null && $event != '' && $event.length > 0) {
      this.fgcontrols.controls['module_id'].setValue($event[0]?.module_id);
      let modulename = this._base._commonService.getDropDownText($event[0]?.module_id, this.moduleMaster, 'module_id');
      this.fgcontrols.controls['modulename'].setValue(modulename.modulename);
    }
  }

}
