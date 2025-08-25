import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { BaseServiceHelper } from '../../../_appservice/baseHelper.service';
import { WebDService } from '../../../_appservice/webdpanel.service';
import { typeMaster } from '../../../_appmodel/_model';
import { enAppSession } from '../../../_appmodel/sessionstorage';
import { WebdtexteditorComponent } from '../../../layout_template/webdtexteditor/webdtexteditor.component';

@Component({
  selector: 'app-addmodifytypemaster',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,WebdtexteditorComponent, SweetAlert2Module],
  templateUrl: './addmodifytypemaster.component.html',
  styleUrl: './addmodifytypemaster.component.scss'
})
export class AddmodifytypemasterComponent {

   @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

   navigateBack() {
    this._base._router.navigate(['/app/managetypemaster']);
  }	

  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading!: boolean;
  private unsubscribe: Subscription[] = [];

  
  private istypeModify: boolean = false;
  fgtypemaster!: FormGroup
  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    public _fbTypeMaster: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _activatedRouter: ActivatedRoute) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
  }

  _typeMaster: typeMaster = {};
  aliasname: any;
  type_id: any;
  typeMaster: any = [];

  ngOnInit(): void {
    this.initForm();
    this.aliasname = this._activatedRouter.snapshot.paramMap.get('aliasname');
    this.type_id = this._activatedRouter.snapshot.paramMap.get('type_id');
    if (this.aliasname != 'new')
      this.getTypeMaster(atob(this.type_id), this.aliasname);

    this.fgtypemaster.controls['typemaster'].valueChanges.subscribe((value: string) => {
      value = value.replace(/ /g, '-').toLowerCase().trim();
      value = value.replace(/&/g, 'and').toLowerCase().trim();
      value = value.replace(/\//g, 'or').toLowerCase().trim();
      value = value.replace(/\./g, '_').toLowerCase().trim();
      this.fgtypemaster.controls['aliasname'].setValue(value);
      this.fgtypemaster.controls['aliasname'].updateValueAndValidity()
    });
    setTimeout(() => {
      this._cdr.detectChanges();
    }, 500);
  }
  initForm() {
    this.fgtypemaster = this._fbTypeMaster.group({
      typemaster_id: [0],
      aliasname: [''],
      displayorder: [0],
      isactive: [true],
      typemaster: ['', [Validators.required]],
      textarea: this._fbTypeMaster.group({
        description: [''],
      })
    })
  }

  getTypeMaster(type_id:any, aliasname:any) {
    this._webDService.gettypemaster('Detail', aliasname, type_id).subscribe((resuserModulelist: any) => {
      let userModulelist = Array.isArray(resuserModulelist.data) ? resuserModulelist.data : [];
      this._typeMaster = userModulelist[0];
      this.istypeModify = true;
      this.fgtypemaster.controls['typemaster'].setValue(this._typeMaster.typemaster);
      this.fgtypemaster.controls['displayorder'].setValue(this._typeMaster.displayorder);
      this.fgtypemaster.get('textarea.description')?.setValue(this._typeMaster.description);
      this.fgtypemaster.controls['aliasname'].setValue(this._typeMaster.aliasname);
      this.fgtypemaster.controls['isactive'].setValue(this._typeMaster.isactive);
      this.fgtypemaster.controls['typemaster_id'].setValue(this._typeMaster.typemaster_id);

    });
  }

  settypeMaster(flag:any) {
    this._base._commonService.markFormGroupTouched(this.fgtypemaster)
    if (this.fgtypemaster.valid) {
      this._base._encryptedStorage.get(enAppSession.client_id).then(client_id => {
        this._base._encryptedStorage.get(enAppSession.project_id).then(project_id => {
          this._typeMaster.typemaster = this.fgtypemaster.value.typemaster;
          this._typeMaster.description = this.fgtypemaster.value.textarea.description;
          this._typeMaster.aliasname = this.fgtypemaster.value.aliasname;
          this._typeMaster.displayorder = this.fgtypemaster.value.displayorder;
          this._typeMaster.typemaster_id = parseInt(this.fgtypemaster.value.typemaster_id);
          this._typeMaster.isactive = this.fgtypemaster.value.isactive;
          this._typeMaster.client_id = parseInt(client_id);
          this._typeMaster.project_id = parseInt(project_id);
          this.addmodifytypeMaster(flag);
        });
      });
    }
  }
  addmodifytypeMaster(flag:any) {
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this._base._encryptedStorage.get(enAppSession.fullname).then(fullname => {
        this._typeMaster.flag = this.istypeModify ? 'MODIFYTYPEMASTER' : 'NEWTYPEMASTER';
        this._typeMaster.createdname = fullname;
        this._typeMaster.user_id = parseInt(user_id);
        this._webDService.typemaster(this._typeMaster).subscribe((response: any) => {
          let isRedirect: boolean = true
          if (response === 'typeexists') {
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
                this._base._router.navigate(['/app/managetypemaster']);
              }, 1500);
            }, 1000);
          }
        });
      });
    });
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
