import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { vendorModel } from '../../../_appmodel/_model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseServiceHelper } from '../../../_appservice/baseHelper.service';
import { WebDService } from '../../../_appservice/webdpanel.service';
import { ActivatedRoute } from '@angular/router';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { WebdmediauploadComponent } from '../../../layout_template/webdmediaupload/webdmediaupload.component';
import { MultiselectComponent } from '../../../layout_template/multiselect/multiselect.component';
import { WebdtexteditorComponent } from '../../../layout_template/webdtexteditor/webdtexteditor.component';
import { CommonModule } from '@angular/common';
import { SweetAlertOptions } from 'sweetalert2';
import { enAppSession } from '../../../_appmodel/sessionstorage';

@Component({
  selector: 'app-addmodifyvendor',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, WebdtexteditorComponent, SweetAlert2Module],
  templateUrl: './addmodifyvendor.component.html',
  styleUrl: './addmodifyvendor.component.scss'
})
export class AddmodifyvendorComponent {
  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  navigateBack() {
    this._base._router.navigate(['/app/managevendor']);
  }


  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading!: boolean;
  private unsubscribe: Subscription[] = [];
  fgvendor!: FormGroup
  constructor(
    public _base: BaseServiceHelper,
    private _webDService: WebDService,
    public _fbvendor: FormBuilder,
    private _activatedRouter: ActivatedRoute,
    private _cdr: ChangeDetectorRef) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
  }

  isvendorDisable: boolean = false;
  _vendor: vendorModel = {};
  vendor_id: any;

  ngOnInit(): void {
    this.initiForm();
    this.vendor_id = this._activatedRouter.snapshot.paramMap.get('vendor_id');
    debugger
    if (this.vendor_id != '0') {
      this.getvendordetails(this.vendor_id);
    }
  }

  initiForm() {
    this.fgvendor = this._fbvendor.group({
      vendor_id: [0],
      contact_person_name: [''],
      company_name: [''],
      email_id: [''],
      mobile_no: [''],
      isactive: [true],
      textarea: this._fbvendor.group({
        description: [''],
      })
    })
  }

  getvendordetails(vendor_id: any) {
    return new Promise((resolve, reject) => {
      this._webDService.getvendor('all', vendor_id).subscribe((resVendorDetails: any) => {
        let vendorMaster = Array.isArray(resVendorDetails.data) ? resVendorDetails.data : [];
        this._vendor = vendorMaster[0];
        this.fgvendor.controls['contact_person_name'].setValue(this._vendor.contact_person_name);
        this.fgvendor.controls['company_name'].setValue(this._vendor.company_name);
        this.fgvendor.controls['email_id'].setValue(this._vendor.email_id);
        this.fgvendor.get('textarea.description')?.setValue(this._vendor.vendor_address);
        this.fgvendor.controls['mobile_no'].setValue(this._vendor.mobile_no);
        this.fgvendor.controls['isactive'].setValue(this._vendor.isactive);
        resolve(true)
      }, error => {
        resolve(false);
      });
    });
  }

  flagType: any;
  setvendor(flag: any) {
    this.flagType = flag;
    this._base._commonService.markFormGroupTouched(this.fgvendor)
    if (this.fgvendor.valid) {
      this._base._encryptedStorage.get(enAppSession.client_id).then(client_id => {
        this._base._encryptedStorage.get(enAppSession.project_id).then(project_id => {
          this._vendor.contact_person_name = this.fgvendor.value.contact_person_name;
          this._vendor.company_name = this.fgvendor.value.company_name;
          this._vendor.email_id = this.fgvendor.value.email_id;
          this._vendor.vendor_address = this.fgvendor.value.textarea.description;
          this._vendor.mobile_no = this.fgvendor.value.mobile_no;
          this._vendor.isactive = this.fgvendor.value.isactive;
          this._vendor.client_id = parseInt(client_id);
          this._vendor.project_id = parseInt(project_id);
          this.addmodifyvendor(flag)
        });
      });
    }
  }

  addmodifyvendor(flag: any) {
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this._base._encryptedStorage.get(enAppSession.fullname).then(fullname => {
        this._vendor.flag = this.vendor_id == '0' ? 'NEWVENDOR' : 'MODIFYVENDOR';
        this._vendor.createdname = fullname;
        this._vendor.createdby = parseInt(user_id);
        this._webDService.managevendor(this._vendor).subscribe((response: any) => {
          let isRedirect: boolean = true
          if (response === 'vendorexists') {
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
                this._base._router.navigate(['/app/managevendor']);
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
