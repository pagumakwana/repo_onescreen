import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SweetAlertOptions } from 'sweetalert2';
import { BaseServiceHelper } from '../../../_appservice/baseHelper.service';
import { WebDService } from '../../../_appservice/webdpanel.service';
import { productoptionvalue } from '../../../_appmodel/_model';
import { enAppSession } from '../../../_appmodel/sessionstorage';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { MultiselectComponent } from '../../../layout_template/multiselect/multiselect.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addmodifyvalues',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, MultiselectComponent, SweetAlert2Module, RouterModule],
  templateUrl: './addmodifyvalues.component.html',
  styleUrl: './addmodifyvalues.component.scss'
})
export class AddmodifyvaluesComponent  implements OnInit{

  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  navigateBack() {
    this._base._router.navigate(['/app/managevalues']);
  }
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading!: boolean;
  private unsubscribe: Subscription[] = [];

  fgoptionvalue!: FormGroup
  constructor(
    public _base: BaseServiceHelper,
    private _webDService: WebDService,
    private _cdr: ChangeDetectorRef,
    public _fboptionvalue: FormBuilder,
    private _activatedRouter: ActivatedRoute) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
  }
  public labelSubscribe!: Subscription;
  _optionValue: productoptionvalue = {};
  aliasname: any;
  option_value_id: any;
  option_type_id: any;
  OptionType: any = [];
  private isvalueModify: boolean = false;

  public _configType: IDropdownSettings = {
    singleSelection: true,
    idField: 'option_type_id',
    textField: 'title',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  ngOnInit(): void {
    this.initForm();
    this.option_value_id = this._activatedRouter.snapshot.paramMap.get('option_value_id');
    this.gettype();
    if (this.option_value_id != '0') {
      this.getoptionValue(this.option_value_id);
    }
    setTimeout(() => {
      this._cdr.detectChanges();
    }, 500);
  }

  initForm() {
    this.fgoptionvalue = this._fboptionvalue.group({
      option_value_id: [''],
      option_value: ['', [Validators.required]],
      display_order: [''],
      isactive: [true],
      lstoptiontype: [''],
    })
  }

  getoptionValue(option_value_id: any) {
    return new Promise((resolve, reject) => {
      this._webDService.productoptionvalues('Details', option_value_id).subscribe((resOptionValue: any) => {
        let OptionValue = Array.isArray(resOptionValue.data) ? resOptionValue.data : [];
        this._optionValue = OptionValue[0];
        this.isvalueModify = true;
        this.fgoptionvalue.controls['option_value'].setValue(this._optionValue.option_value);
        this.fgoptionvalue.controls['display_order'].setValue(this._optionValue.display_order);
        this.fgoptionvalue.controls['lstoptiontype'].setValue(this._optionValue.lstoptiontype);
        this.fgoptionvalue.controls['isactive'].setValue(this._optionValue.isactive);
        resolve(true)
      }, error => {
        resolve(false);
      });
    });
  }

  setoptionValue(flag: any) {
    this.isLoading$.next(true);
    this._base._commonService.markFormGroupTouched(this.fgoptionvalue)
    if (this.fgoptionvalue.valid) {
      this._base._encryptedStorage.get(enAppSession.client_id).then(client_id => {
        this._base._encryptedStorage.get(enAppSession.project_id).then(project_id => {
          this._optionValue.option_value = this.fgoptionvalue.value.option_value;
          this._optionValue.display_order = this.fgoptionvalue.value.display_order;
          this._optionValue.lstoptiontype = this.fgoptionvalue.value.lstoptiontype;
          this._optionValue.isactive = this.fgoptionvalue.value.isactive;
          this._optionValue.client_id = parseInt(client_id);
          this._optionValue.project_id = parseInt(project_id);
          this.addmodifyoptionValue(flag);
        });
      });
    }
  }

  addmodifyoptionValue(flag: any) {
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this._base._encryptedStorage.get(enAppSession.fullname).then(fullname => {
        this._optionValue.flag = this.isvalueModify ? 'MODIFYOPTIONVALUE' : 'NEWOPTIONVALUE';
        this._optionValue.createdname = fullname;
        this._optionValue.user_id = parseInt(user_id);
        this._webDService.manageproductoptionvalues(this._optionValue).subscribe((response: any) => {
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
                this._base._router.navigate(['/app/managevalues']);
              }, 1500);
            }, 1000);
          }
        });
      });
    });
  }

  gettype() {
    return new Promise((resolve, reject) => {
      this._webDService.productoptiontypes().subscribe((resOptionType: any) => {
        this.OptionType = [];
        this.OptionType = Array.isArray(resOptionType.data) ? resOptionType.data : [];
        resolve(this.OptionType)
      }, error => {
        resolve(false);
      });
    });
  }
  onItemSelect($event: any) {
    console.log("$event[0]",$event[0]);
    if ($event && $event != null && $event.length > 0) {
      this._optionValue.option_type_id = $event[0].option_type_id;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
