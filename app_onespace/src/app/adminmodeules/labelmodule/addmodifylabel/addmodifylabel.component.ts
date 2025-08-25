import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SweetAlertOptions } from 'sweetalert2';
import { BaseServiceHelper } from '../../../_appservice/baseHelper.service';
import { WebDService } from '../../../_appservice/webdpanel.service';
import { labelMaster } from '../../../_appmodel/_model';
import { enAppSession } from '../../../_appmodel/sessionstorage';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { WebdtexteditorComponent } from '../../../layout_template/webdtexteditor/webdtexteditor.component';
import { MultiselectComponent } from '../../../layout_template/multiselect/multiselect.component';

@Component({
  selector: 'app-addmodifylabel',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,WebdtexteditorComponent, MultiselectComponent,SweetAlert2Module],
  templateUrl: './addmodifylabel.component.html',
  styleUrl: './addmodifylabel.component.scss'
})
export class AddmodifylabelComponent {

  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  navigateBack() {
    this._base._router.navigate(['/app/managelabel']);
  }	
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading!: boolean;
  private unsubscribe: Subscription[] = [];

  fglabelmaster!: FormGroup
  constructor(
    public _base: BaseServiceHelper,
    private _webDService: WebDService,
    private _cdr: ChangeDetectorRef,
    public _fblabelMaster: FormBuilder,
    private _activatedRouter: ActivatedRoute) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
  }
  public labelSubscribe!: Subscription;
  _labelMaster: labelMaster = {};
  aliasname: any;
  label_id: any;
  TypeMaster: any = [];
  private isLabelModify: boolean = false;

  public _configType: IDropdownSettings = {
    singleSelection: true,
    idField: 'typemaster_id',
    textField: 'typemaster',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  ngOnInit(): void {
    this.initForm();
    this.aliasname = this._activatedRouter.snapshot.paramMap.get('aliasname');
    this.label_id = this._activatedRouter.snapshot.paramMap.get('label_id');
    this.gettypemasterdetails();
    if (this.aliasname != 'new')
      this.getlabelmaster(atob(this.label_id), this.aliasname);

    this.fglabelmaster.controls['label'].valueChanges.subscribe((value: string) => {
      value = value.replace(/ /g, '-').toLowerCase().trim();
      value = value.replace(/&/g, 'and').toLowerCase().trim();
      value = value.replace(/\//g, 'or').toLowerCase().trim();
      value = value.replace(/\./g, '_').toLowerCase().trim();
      this.fglabelmaster.controls['aliasname'].setValue(value);
      this.fglabelmaster.controls['aliasname'].updateValueAndValidity()
    })
    setTimeout(() => {
      this._cdr.detectChanges();
    }, 500);
  }

  initForm() {
    this.fglabelmaster = this._fblabelMaster.group({
      label_id: [''],
      typemaster_id: [0, [Validators.required]],
      typemaster: [''],
      aliasname: [''],
      isactive: [true],
      lsttypemaster: ['', [Validators.required]],
      label: ['', [Validators.required]],
      textarea: this._fblabelMaster.group({
        description: [''],
      })
    })
  }

  getlabelmaster(label_id:any, aliasname:any) {
    return new Promise((resolve, reject) => {
      this._webDService.getlabelmaster('Details', label_id, aliasname).subscribe((resLabelMaster: any) => {
        let labelMaster = Array.isArray(resLabelMaster.data) ? resLabelMaster.data : [];
        debugger
        this._labelMaster = labelMaster[0];
        this.isLabelModify = true;
        this.fglabelmaster.controls['lsttypemaster'].setValue([{ typemaster: this._labelMaster.typemaster, typemaster_id: parseInt(this._labelMaster.typemaster_id) }]);
        this.fglabelmaster.controls['label'].setValue(this._labelMaster.label);
        this.fglabelmaster.get('textarea.description')?.setValue(this._labelMaster.description);
        this.fglabelmaster.controls['aliasname'].setValue(this._labelMaster.aliasname);
        this.fglabelmaster.controls['isactive'].setValue(this._labelMaster.isactive);
        this._labelMaster.typemaster_id = this.fglabelmaster.value.typemaster_id;
        let typemaster = this._base._commonService.getDropDownText(this._labelMaster.typemaster_id, this.TypeMaster, 'typemaster_id');
        this._labelMaster.typemaster = typemaster ? typemaster.typemaster : '';
        this.fglabelmaster.controls['typemaster_id'].setValue(this._labelMaster.typemaster_id);
        this.fglabelmaster.controls['typemaster'].setValue(this._labelMaster.typemaster);
        resolve(true)
      }, error => {
        resolve(false);
      });
    });
  }

  setlabelMaster(flag:any) {
    this.isLoading$.next(true);
    this._base._commonService.markFormGroupTouched(this.fglabelmaster)
    if (this.fglabelmaster.valid) {
      this._base._encryptedStorage.get(enAppSession.client_id).then(client_id => {
        this._base._encryptedStorage.get(enAppSession.project_id).then(project_id => {
          this._labelMaster.label = this.fglabelmaster.value.label;
          this._labelMaster.description = this.fglabelmaster.value.textarea.description;
          this._labelMaster.aliasname = this.fglabelmaster.value.aliasname;
          this._labelMaster.typemaster_id = this.fglabelmaster.value.typemaster_id;
          this._labelMaster.isactive = this.fglabelmaster.value.isactive;
          let typemaster = this._base._commonService.getDropDownText(this._labelMaster.typemaster_id, this.TypeMaster, 'typemaster_id');
          this._labelMaster.typemaster = typemaster ? typemaster.typemaster : '';
          this._labelMaster.client_id = parseInt(client_id);
          this._labelMaster.project_id = parseInt(project_id);
          this.addmodifylabelmaster(flag);
        });
      });
    }
  }

  addmodifylabelmaster(flag:any) {
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this._base._encryptedStorage.get(enAppSession.fullname).then(fullname => {
        this._labelMaster.flag = this.isLabelModify ? 'MODIFYLABEL' : 'NEWLABEL';
        this._labelMaster.createdname = fullname;
        this._labelMaster.user_id = parseInt(user_id);
        this._webDService.labelmaster(this._labelMaster).subscribe((response: any) => {
          let isRedirect: boolean = true
          if (response === 'labelexists') {
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
              this.successSwal.fire()
              setTimeout(() => {
                this._base._router.navigate(['/app/managelabel']);
              }, 1500);
            }, 1000);
          }
        });
      });
    });
  }

  gettypemasterdetails() {
    return new Promise((resolve, reject) => {
      this._webDService.gettypemaster().subscribe((restypeMaster: any) => {
        this.TypeMaster = [];
        this.TypeMaster = Array.isArray(restypeMaster.data) ? restypeMaster.data : [];
        resolve(this.TypeMaster)
      }, error => {
        resolve(false);
      });
    });
  }
  onItemSelect($event:any) {
    if ($event && $event != null && $event.length > 0) {
      this.fglabelmaster.controls['typemaster_id'].setValue($event[0].typemaster_id);
      this.fglabelmaster.controls['typemaster'].setValue($event[0].typemaster);
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
