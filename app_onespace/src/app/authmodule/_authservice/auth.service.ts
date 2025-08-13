import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { userModel } from '../../_appmodel/_model';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { WebDService } from '../../_appservice/webdpanel.service';
import { environment } from '../../../environments/environments.prod';


@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;

  // public fields
  currentUser$: Observable<userModel | undefined>;
  isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<userModel | any>;
  isLoadingSubject: BehaviorSubject<boolean>;

  get currentUserValue(): userModel {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: userModel) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private _webDService: WebDService,
    private _base: BaseServiceHelper,
    private router: Router
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.currentUserSubject = new BehaviorSubject<userModel | null>(null);
    this.currentUser$ = this.currentUserSubject.asObservable();
    this.isLoading$ = this.isLoadingSubject.asObservable();
    const subscr = this.getUserByToken().subscribe();
    this.unsubscribe.push(subscr);
  }

  // public methods
  login(email: string, password: string): Observable<any> {
    this.isLoadingSubject.next(true);
    return this._webDService.loginCustomer(email, password).pipe(
      map((_user: userModel) => {
        localStorage.setItem('_user', JSON.stringify(_user));
        const result = this.setAuthFromLocalStorage(_user);
        return result;
      }),
      switchMap(() => this.getUserByToken()),
      catchError((err) => {
        console.error('err', err);
        return of(undefined);
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  logout() {
    localStorage.removeItem(this.authLocalStorageToken);
    this._base._appSessionService.clearUserSession();
    this.router.navigate(['/auth/login'], {
      queryParams: {},
    });
  }

  getUserByToken(): Observable<userModel | undefined> {
    const _user = this.getAuthFromLocalStorage();
    if (!_user || !_user.user_id) {
      return of(undefined);
    }
  
    this.isLoadingSubject.next(true);
    return this.getUserBy_Token(_user.user_id).pipe(
      map((_user) => {
        if (_user) {
          this.currentUserSubject.next(_user);
        } else {
          this.logout();
        }
        return _user;
      }),
      finalize(() => this.isLoadingSubject.next(false))
    );
  }
  
  getUserBy_Token(token: number): Observable<userModel | undefined> {
    let userData: string | null = localStorage.getItem('_user');
    let user: userModel | undefined;
  
    if (userData) {
      user = JSON.parse(userData) as userModel;
    }
  
    if (!user) {
      return of(undefined);
    }
  
    return of(user);
  }
  


  // forgotPassword(email: string): Observable<boolean> {
  //   this.isLoadingSubject.next(true);
  //   return this._webDService
  //     .forgotPassword(email)
  //     .pipe(finalize(() => this.isLoadingSubject.next(false)));
  // }

  // private methods
  private setAuthFromLocalStorage(_user: userModel): boolean {
    // store auth authToken/refreshToken/epiresIn in local storage to keep user logged in between page refreshes
    if (_user && _user.user_id) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(_user));
      return true;
    }
    return false;
  }

  private getAuthFromLocalStorage(): userModel | undefined {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      if (!lsValue) {
        return undefined;
      }

      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
