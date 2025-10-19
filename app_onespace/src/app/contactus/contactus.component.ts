import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { enAppSession } from '../_appmodel/sessionstorage';
import { Validators } from 'ngx-editor';
import { contactDetails } from '../_appmodel/_model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WebDService } from '../_appservice/webdpanel.service';
import { BaseServiceHelper } from '../_appservice/baseHelper.service';
import { CommonModule } from '@angular/common';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-contactus',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SweetAlert2Module],
  templateUrl: './contactus.component.html',
  styleUrl: './contactus.component.scss'
})
export class ContactusComponent {
  private unsubscribe: Subscription[] = [];
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  fgcontactdetails!: FormGroup
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading!: boolean;
  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    private _cdr: ChangeDetectorRef,
    public _fbcontactdetails: FormBuilder,
    private _activatedRouter: ActivatedRoute) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
  }
  public budgetSubscribe!: Subscription;
  isSuccessModal_Open = false;
  _contactDetails: contactDetails = {};
  contact_id: any;
  private iscontactModify: boolean = false;
  isFormSubmit: boolean = false;
  ngAfterViewInit(): void { }

  ngOnInit(): void {
    this.initForm();
    this.contact_id = this._activatedRouter.snapshot.paramMap.get('contact_id');
    // if (this.contact_id != '0')
    //   this.getcontact(this.contact_id);
    setTimeout(() => {
      this._cdr.detectChanges();
    }, 500);
  }


  initForm() {
    this.fgcontactdetails = this._fbcontactdetails.group({
      contact_id: [0],
      fullname: ['', [Validators.required]],
      description: [''],
      email_id: ['', [Validators.required]],
      mobile_no: ['', [Validators.required]],
      subject_line: [''],
    })
  }

  setcontactdetail(flag: any) {
    this.isFormSubmit = false;
    this.isLoading$.next(true);
    this._base._commonService.markFormGroupTouched(this.fgcontactdetails)
    if (this.fgcontactdetails.valid) {
      this._base._encryptedStorage.get(enAppSession.client_id).then(client_id => {
        this._base._encryptedStorage.get(enAppSession.project_id).then(project_id => {
          this._contactDetails.fullname = this.fgcontactdetails.value.fullname;
          this._contactDetails.description = this.fgcontactdetails.value.description;
          this._contactDetails.email_id = this.fgcontactdetails.value.email_id;
          this._contactDetails.mobile_no = this.fgcontactdetails.value.mobile_no;
          this._contactDetails.subject_line = this.fgcontactdetails.value.subject_line;
          this._contactDetails.client_id = parseInt(client_id);
          this._contactDetails.project_id = parseInt(project_id);
          this.addmodifycontact(flag);
          this.fgcontactdetails.reset();
          this.fgcontactdetails.markAsUntouched();
          this.fgcontactdetails.markAsPristine();

        });
      });
    } else {
      this.isFormSubmit = true;
      setTimeout(() => {
        this.isLoading$.next(false);
        this._cdr.detectChanges();
      }, 1500);
    }

  }

  addmodifycontact(flag: any) {
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this._base._encryptedStorage.get(enAppSession.fullname).then(fullname => {
        // this._contactDetails.flag = this.iscontactModify ? 'MODIFYBUDGET' : 'NEWBUDGET';
        this._contactDetails.createdname = fullname;
        this._contactDetails.user_id = parseInt(user_id);
        this._webDService.managecontactdetails(this._contactDetails).subscribe((response: any) => {
          let isRedirect: boolean = true
          if (response === 'contactexists') {
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
                this.successSwal.close();
                // this._base._router.navigate(['/app/managelabel']);
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
