import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SweetAlertOptions } from 'sweetalert2';
import { BaseServiceHelper } from '../../../_appservice/baseHelper.service';
import { WebDService } from '../../../_appservice/webdpanel.service';
import { ActivatedRoute } from '@angular/router';
import { NgbDateStruct, NgbInputDatepicker, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { userModel } from '../../../_appmodel/_model';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { enAppSession } from '../../../_appmodel/sessionstorage';
import { MultiselectComponent } from '../../../layout_template/multiselect/multiselect.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addmodifyuser',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule,NgbModule, MultiselectComponent,SweetAlert2Module, CommonModule],
  templateUrl: './addmodifyuser.component.html',
  styleUrl: './addmodifyuser.component.scss'
})
export class AddmodifyuserComponent {
  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  navigateBack(){
    this._base._router.navigate(["app/manageuser"])
  }
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading!: boolean;
  private unsubscribe: Subscription[] = [];

  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    public _fbUser: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _activatedRouter: ActivatedRoute) {
    const current = new Date();
    this.minDate = { year: current.getFullYear(), month: current.getMonth() - 5, day: current.getDate() };
    this.maxDate = { year: current.getFullYear() + 1, month: current.getMonth(), day: current.getDate() }
  }

  @ViewChild("dob", { static: true }) travellingdate!: NgbInputDatepicker;
  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  public lstProject: any = [];
  public lstAuthority: any = [];
  public lstVendor: any=[];
  public lstProduct: any=[];
  _userModel: userModel = {};
  userid: any;
  public dataSubscribe!: Subscription;
  private isUserModify: boolean = false;
  private isFormModify: boolean = false;
  fgUser!: FormGroup;

  public _configProject: IDropdownSettings = {
    singleSelection: true,
    idField: 'project_id',
    textField: 'projectname',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  public _configAuthority: IDropdownSettings = {
    singleSelection: true,
    idField: 'authority_id',
    textField: 'authority',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  public _configVendor: IDropdownSettings = {
    singleSelection: true,
    idField: 'vendor_id',
    textField: 'contact_person_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  public _configProduct: IDropdownSettings = {
    singleSelection: false,
    idField: 'product_id',
    textField: 'product_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  initform() {
    this.fgUser = this._fbUser.group({
      user_id: [0],
      fullname: ['', [Validators.required]],
      // username: [''],
      email_id: ['', [Validators.required]],
      mobilenumber: ['', [Validators.required]],
      password: ['', [Validators.required]],
      website: [''],
      dob: [null],
      // lstproject: [''],
      lstauthority: [''],
      lstvendor:[''],
      lstproduct:[''],
      bio: [''],
      commission: [''],
      is_approved: [''],
      // project_id: [''],
      // projectname: [''],
      authority_id: [''],
      authority: [''],
      isactive:[true],
    })
  }

  onItemSelect($event:any) {
    if ($event && $event != null) {
      this._userModel.project_id = $event[0]?.project_id;
      // this.fgUser.controls.projectname.setValue($event[0]?.projectname);
    }
  }
  onAuthoritySelect($event:any) {
    if ($event && $event != null) {
      this._userModel.authority_id = $event[0]?.authority_id;
      // this.fgUser.controls.authority.setValue($event[0]?.authority);
    }
  }
  onVendorSelect($event:any) {
    if ($event && $event != null) {
      this._userModel.vendor_id = $event[0]?.vendor_id;
    }
  }
  onProductSelect($event:any) {
    if ($event && $event != null) {
      this._userModel.product_id = $event[0]?.product_id;
    }
  }
  ngAfterViewInit(): void {
    this._base._pageTitleService.setTitle('Manage Users', 'Manage Users');
  }
  ngOnInit(): void {
    this.initform();
    this.userid = this._activatedRouter.snapshot.paramMap.get('user_id');
    this.getAuthority();
    // this.getProject();
    this.getVendor();
    this.getProduct();
    debugger
    if (this.userid != '0')
      this.getUserList(this.userid);
  }


  getUserList(user_id:any) {
    return new Promise((resolve, reject) => {
      this._webDService.userlist('Detail', user_id).subscribe((resUserListdata: any) => {
        let userListData = Array.isArray(resUserListdata.data) ? resUserListdata.data : [];
        this._userModel = userListData[0];
        this.isUserModify = true;
        this.fgUser.controls['fullname'].setValue(this._userModel.fullname);
        // this.fgUser.controls['username'].setValue(this._userModel.username);
        this.fgUser.controls['email_id'].setValue(this._userModel.email_id);
        this.fgUser.controls['mobilenumber'].setValue(this._userModel.mobilenumber);
        this.fgUser.controls['password'].setValue(this._userModel.password);
        debugger
        this.fgUser.controls['dob'].setValue(this._base._commonService.fromModeltoDate(this._userModel.dob));
        this.fgUser.controls['bio'].setValue(this._userModel.bio);
        this.fgUser.controls['website'].setValue(this._userModel.website);
        this.fgUser.controls['commission'].setValue(this._userModel.commission);
        this.fgUser.controls['user_id'].setValue(this._userModel.user_id);
        this.fgUser.controls['lstauthority'].setValue(this._userModel.lstauthority);
        // this.fgUser.controls['lstproject'].setValue(this._userModel.lstproject);
        this.fgUser.controls['lstvendor'].setValue(this._userModel.lstvendor);
        this.fgUser.controls['lstproduct'].setValue(this._userModel.lstproduct);
        this.fgUser.controls['isactive'].setValue(this._userModel.isactive);
        resolve(true)
      }, error => {
        resolve(false);
      });
    });
  }

  flagType: any
  setUserModel(flag:any) {
    this.isLoading$.next(true);
    this.flagType = flag;
    this._base._commonService.markFormGroupTouched(this.fgUser);
    if (this.fgUser.valid) {
      let travelldate = this.fgUser.value.dob;
      this._base._encryptedStorage.get(enAppSession.client_id).then(client_id => {
        this._base._encryptedStorage.get(enAppSession.project_id).then(project_id => {
          this._userModel.fullname = this.fgUser.value.fullname;
          this._userModel.username = this.fgUser.value.email_id;
          this._userModel.email_id = this.fgUser.value.email_id;
          this._userModel.mobilenumber = this.fgUser.value.mobilenumber;
          this._userModel.password = this.fgUser.value.password;
          this._userModel.dob = `${travelldate.year}-${travelldate.month}-${travelldate.day}`;
          this._userModel.bio = this.fgUser.value.bio || null;
          this._userModel.website = this.fgUser.value.website || null;
          this._userModel.commission = this.fgUser.value.commission;
          // this._userModel.lstproject = this.fgUser.value.lstproject;
          this._userModel.lstauthority = this.fgUser.value.lstauthority;
          this._userModel.lstvendor = this.fgUser.value.lstvendor;
          this._userModel.lstproduct = this.fgUser.value.lstproduct;
          this._userModel.client_id = client_id;
          this._userModel.project_id = project_id;
          this.addmodifyuser(flag);
        });
      });
    }
  }
  addmodifyuser(flag:any) {
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this._base._encryptedStorage.get(enAppSession.fullname).then(fullname => {
        debugger
        this._userModel.flag = this.isUserModify ? 'MODIFYUSER' : 'NEWUSER';
        this._userModel.createdname = fullname;
         this._userModel.createdby = Number(user_id) || 0; 
        this._webDService.useraddmodify(this._userModel).subscribe((response: any) => {
          let isRedirect: boolean = true
          if (response === 'userexists') {
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
                this._base._router.navigate(['/app/manageuser']);
              }, 1500);
            }, 1000);
          }
        });
      });
    });
  }

  getProject() {
    this._base._encryptedStorage.get(enAppSession.client_id).then(client_id => {
      this._webDService.getproject('all', 'null', 0, client_id).subscribe((resProjectData: any) => {
        this.lstProject = [];
        let resprojectdata = Array.isArray(resProjectData.data) ? resProjectData.data : [];
        this.lstProject = resprojectdata;
      }, error => {

      });
    });
  }

  getAuthority() {
    this._webDService.getauthority().subscribe((resAuthorityData: any) => {
      this.lstAuthority = [];
      let resauthoritydata = Array.isArray(resAuthorityData.data) ? resAuthorityData.data : [];
      this.lstAuthority = resauthoritydata;
    }, error => {
    });
  }

  getVendor() {
    this._webDService.getvendor().subscribe((resVendor: any) => {
      this.lstVendor = [];
      let resvendordata = Array.isArray(resVendor.data) ? resVendor.data : [];
      this.lstVendor = resvendordata;
    }, error => {
    });
  }

  getProduct() {
    this._webDService.getproduct().subscribe((resProduct: any) => {
      this.lstProduct = [];
      let resproductdata = Array.isArray(resProduct.data) ? resProduct.data : [];
      this.lstProduct = resproductdata;
    }, error => {
    });
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }


}
