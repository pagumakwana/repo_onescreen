import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Validators } from 'ngx-editor';
import { Observable, Subscription, first } from 'rxjs';
import { userModel } from '../_appmodel/_model';
import { BaseServiceHelper } from '../_appservice/baseHelper.service';
import { WebDService } from '../_appservice/webdpanel.service';
import { AuthService } from './_authservice/auth.service';

@Component({
  selector: 'app-authmodule',
  standalone: true,
  imports: [RouterModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './authmodule.component.html',
  styleUrl: './authmodule.component.scss',
  providers: [AuthService, WebDService, BaseServiceHelper]
})
export class AuthmoduleComponent implements OnInit {
  hasError: boolean | undefined;
  isLoading$: Observable<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    public _base: BaseServiceHelper,
    private _fbSignIn: FormBuilder,
    private authService: AuthService,
    private _webDService: WebDService,
    private _cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {
    this.isLoading$ = this.authService.isLoading$;
    this.route.queryParams.subscribe(params => {
      this.redirectUrl = params['q'] ?? null;
    });
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this._base._router.navigate(['/']);
    }
  }

  public formSignIn!: FormGroup;
  _userModel: userModel = {};
  returnUrl!: string;
  redirectUrl: string | null = null;

  ngOnInit(): void {
    this.initForm();

  }

  initForm() {
    this.formSignIn = this._fbSignIn.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  setSignInModel() {
    
    this._base._commonService.markFormGroupTouched(this.formSignIn)
    if (this.formSignIn.valid) {
      this._userModel.username = this.formSignIn.value.username;
      this._userModel.password = this.formSignIn.value.password;
      this.SignInCustomer(this._userModel.username, this._userModel.password);
    } else {
      // this.isLoading$ = false;
    }
  }

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
                    this._base._router.navigate([this.redirectUrl[0]]);
                  } else {
                    this._base._router.navigate(['home']);
                  }
                  this.loginsuccess = false;
                  this._cdr.detectChanges();
                }, 500);
              }
            })
          }, error => {
            // this.isLoading = false;
            //this._base._alertMessageService.error("Please try after some time or Contact Support!");
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
  getUserModule(user_id: any) {
    return new Promise((resolve, reject) => {
      this._base._commonService.getauthoritymodule(user_id).then((resUserModule: any) => {
        let UserModule = [];
        UserModule = Array.isArray(resUserModule.data) ? resUserModule.data : [];
        resolve(UserModule)
      }, error => {
        resolve(false);
      });
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  goToSignup() {
    if (this.redirectUrl) {
      this._base._router.navigate(['signup'],{ queryParams: { q: [this.redirectUrl] } });
    } else {
      this._base._router.navigate(['signup']);
    }
  }
}
