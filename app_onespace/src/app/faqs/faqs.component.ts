import { ChangeDetectorRef, Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
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
  selector: 'app-faqs',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,SweetAlert2Module],
  templateUrl: './faqs.component.html',
  styleUrl: './faqs.component.scss'
})
export class FaqsComponent {
  activeIndex: number | null = null;
  innerHeights: string[] = [];

  @ViewChildren('inner') innerElements!: QueryList<ElementRef>;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('successSwal')
    public readonly successSwal!: SwalComponent;

  faqList = [
    {
      question: "How to sell camera on www.cameratosell.com", answer: `<ul>
		  <li>Login to www.cameratosell.com</li>
		  <li>Select the device you want to sell and select the correct details of your device.</li>
		  <li>A Quote will be generated based on your selections.</li>
		  <li>Schedule a pickup time and we will collect your device from your residential address and pay you instantly.</li>
		</ul>`
    },
    { question: "Are there any documents required to sell my device?", answer: "Yes, we will need your KYC documents (ID Proof and address proof) for security purposes." },
    { question: "Is the quotation received on the website final quotation?", answer: "Yes, if all the details filled by you match with the actual device, then you will receive the exact amount quoted on the website." },
    { question: "Can you collect my device in a public place?", answer: "No, we only collect your device from your residential address." },
    { question: "Is there any pickup charge?", answer: "No, there are no pickup charges. It is completely free." },
    { question: "What happens to my sold device?", answer: "We rectify all the issues in your device and provide it to a used camera dealer who in return sells them to second-hand buyers." },
    { question: "What if I can't find my device in your list?", answer: "Where there is a will, there is a way. Just select the 'Others' option and submit the form, we will get back to you as soon as possible." },
    { question: "Why do you need the original invoice of my device?", answer: "Original invoice is the best proof of your ownership of the device and helps you in fetching better rates." },
    { question: "If my model is not available on cameratosell, how to sell a camera online?", answer: "Can't find your Camera Model on cameratosell? Please drop us a mail at info@cameratosell.com with details about the Camera Brand, Model, Lenses & Condition, and we will get back to you ASAP with the quote." },
    { question: "Where can I reach you for prompt resolution of queries and/or complaints?", answer: "You can reach us at info@cameratosell.com" }
  ];

  private unsubscribe: Subscription[] = [];
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
  _contactDetails: contactDetails = {};
  contact_id: any;
  isSuccessModal_Open = false;
  private iscontactModify: boolean = false;
  isFormSubmit: boolean = false;
  ngAfterViewInit() {
    // Dynamically get heights for all accordions
    this.innerHeights = this.innerElements.map(inner => inner.nativeElement.scrollHeight + 'px');
  }

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


  toggleAccordion(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
  }
}
