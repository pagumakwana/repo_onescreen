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
      question: "What is ONESCREEN?", answer: `ONESCREEN is a digital outdoor advertising brand that runs LED display ads on moving vehicles like trucks, taxis, autos, and wearable digital screens to give your brand maximum visibility.`
    },
    { question: "How does ONESCREEN advertising work?", answer: "We transform vehicles and wearable screens into mobile billboards. You choose the vehicle type, route, screen format, and time slot—then your ad runs dynamically across targeted locations." },
    { question: "What types of vehicles are available for advertising?", answer: "We offer a range of options including L-shaped LED trucks, taxi-top screens, auto panels, and portable human-carried LED screens." },
    { question: "How can I book an ad campaign with ONESCREEN?", answer: "Booking is simple—choose your vehicle, route, screen, and preferred time slot, then confirm your booking directly through our platform." },
    { question: "Can I update or change my ad after it’s live?", answer: "No, you can’t change your ad." },
    { question: "What areas or cities does ONESCREEN cover?", answer: "ONESCREEN offers service in only surat. " },
    { question: "What are the benefits of using ONESCREEN compared to traditional outdoor ads?", answer: "Unlike static billboards, ONESCREEN provides dynamic, mobile, and eye-catching digital displays that engage audiences wherever they are." },
    { question: "How long can my ad campaign run?", answer: "Campaigns are flexible—you can book short-term, daily, weekly, or long-term durations depending on your marketing goals and budget." },
    { question: "What kind of brands or businesses can advertise with ONESCREEN?", answer: "ONESCREEN is ideal for all industries—retail, fashion, real estate, FMCG, events, hospitality, and start-ups seeking impactful visibility." },
    { question: "What is the cost of advertising with ONESCREEN?", answer: "Pricing depends on factors like vehicle type, route, campaign duration, and time slot. However, we offer <strong>best price guarantees</strong> for all campaigns." },
    { question: "How can I track my campaign performance?", answer: "We provide live updates, route monitoring, and performance insights so you can measure visibility and impact in real time." }
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
