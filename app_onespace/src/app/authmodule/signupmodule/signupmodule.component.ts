import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { BehaviorSubject, first, Subscription } from 'rxjs';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { WebDService } from '../../_appservice/webdpanel.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { userModel, userRegistration } from '../../_appmodel/_model';
import { enAppSession } from '../../_appmodel/sessionstorage';
import { SweetAlertOptions } from 'sweetalert2';
import { AuthService } from '../_authservice/auth.service';

@Component({
  selector: 'app-signupmodule',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NgbModule, SweetAlert2Module, CommonModule, RouterModule],
  templateUrl: './signupmodule.component.html',
  styleUrl: './signupmodule.component.scss'
})
export class SignupmoduleComponent {
  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  close() {
    this._base._router.navigate(["home"])
  }
  navigateBack() {
    this._base._router.navigate(["product"])
  }
  auth() {
    this._base._router.navigate(['/auth'])
  }
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading!: boolean;
  private unsubscribe: Subscription[] = [];
  public error_message = 'Something went wrong. Please try again later. If the issue persists, kindly contact support.'
  redirectUrl: string | null = null;

  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    public _fbUser: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private authService: AuthService,
    private route: ActivatedRoute) {
 this.route.queryParams.subscribe(params => {
      this.redirectUrl = params['q'] ?? null;
      console.log('Query param q =', this.redirectUrl);
    });
  }

  public lstProject: any = [];
  public lstAuthority: any = [];
  _userregister: userRegistration = {};
  public dataSubscribe!: Subscription;
  private isUserModify: boolean = false;
  fgUser!: FormGroup;

  isModalOpen = true;

  initform() {
    this.fgUser = this._fbUser.group({
      user_id: [0],
      fullname: ['', [Validators.required]],
      // username: [''],
      email_id: [''],
      mobilenumber: ['', [Validators.required]],
      password: ['', [Validators.required]],
      isactive: [true],
    })
  }


  ngAfterViewInit(): void {
    this._base._pageTitleService.setTitle('Manage Users', 'Manage Users');
  }
  ngOnInit(): void {
    this.initform();
  }

  flagType: any
  setUserModel(flag: any) {
    this.isLoading$.next(true);
    this.flagType = flag;
    this._base._commonService.markFormGroupTouched(this.fgUser);
    if (this.fgUser.valid) {
      this._base._encryptedStorage.get(enAppSession.client_id).then(client_id => {
        this._base._encryptedStorage.get(enAppSession.project_id).then(project_id => {
          this._userregister.fullname = this.fgUser.value.fullname;
          this._userregister.email_id = this.fgUser.value.email_id;
          this._userregister.mobilenumber = this.fgUser.value.mobilenumber;
          this._userregister.password = this.fgUser.value.password;
          this._userregister.client_id = client_id;
          this._userregister.project_id = project_id;
          this.addmodifyuser(flag);
        });
      });
    }
  }
  addmodifyuser(flag: any) {
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this._base._encryptedStorage.get(enAppSession.fullname).then(fullname => {
        debugger
        this._userregister.flag = this.isUserModify ? 'MODIFYUSER' : 'NEWUSER';
        this._userregister.createdname = fullname;
        this._userregister.createdby = Number(user_id) || 0;
        this._webDService.signUp(this._userregister).subscribe((response: any) => {
          let isRedirect: boolean = true
          if (response === 'userexists') {
            isRedirect = false;
            this.hasError = true;
            this.error_message = 'A user already exists with the provided email ID or mobile number.';
            setTimeout(() => {
              this.isLoading$.next(false);
              this._cdr.detectChanges();
            }, 1500);
          } else if (response.includes('newsuccess')) {
            this.hasError = false;
            this.SignInCustomer(this._userregister.mobilenumber, this._userregister.password);
          }
         
        });
      });
    });
  }
  hasError: boolean | undefined;
  loginsuccess: boolean = false;
  SignInCustomer(_username: string = '', _passsword: string = '') {
    this.hasError = false;
    const loginSubscr = this.authService
      .login(_username, _passsword)
      .pipe(first())
      .subscribe((user: userModel | undefined) => {
        if (user) {
          this.getUserConfig(user.user_id).then(resUserConfig => {
            this._base._appSessionService.setUserSession(user, (resUserConfig as any[])[0]).subscribe((res: any) => {
              if (res) {
                this.loginsuccess = true;
                setTimeout(() => {
                  if (this.redirectUrl != null) {
                    this._base._router.navigate([this.redirectUrl]);
                  } else {
                    this._base._router.navigate(['home']);
                  }
                  this.loginsuccess = false;
                  this._cdr.detectChanges();
                  this.isLoading$.next(false);
                }, 500);
              }
            })
          }, error => {
            this.hasError = true;
            this.error_message = 'Something went wrong. Please try again later. If the issue persists, kindly contact support.';
          });
        } else {
          this.hasError = true;
        }
      });
    this.unsubscribe.push(loginSubscr);
  }

  getUserConfig(user_id: any) {
    return new Promise((resolve, reject) => {
      this._webDService.getuserconfig(user_id).subscribe((resUserModule: any) => {
        let UserModule = [];
        UserModule = Array.isArray(resUserModule) ? resUserModule : [];
        resolve(UserModule)
      }, error => {
        resolve(false);
      });
    });
  }

  goToSignin() {
    if (this.redirectUrl) {
      this._base._router.navigate(['auth'],{ queryParams: { q: [this.redirectUrl] } });
    } else {
      this._base._router.navigate(['auth']);
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
