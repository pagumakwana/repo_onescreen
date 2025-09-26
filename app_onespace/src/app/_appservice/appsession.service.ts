
import { Injectable, EventEmitter, Output } from '@angular/core';
import { enAppSession } from '../_appmodel/sessionstorage';
import { Observable } from 'rxjs';
import { EncryptedStorage } from './encryptedstorage.service';
@Injectable({ providedIn: 'root' })
export class AppSessionService {
    constructor(public _encryptedStorage: EncryptedStorage) { }
    setUserSession(responseData: any, userConfig: any): Observable<any> {
        return new Observable(observer => {
            this._encryptedStorage.set(enAppSession.username, responseData.username);
            this._encryptedStorage.set(enAppSession.user_id, responseData.user_id);
            this._encryptedStorage.set(enAppSession.fullname, responseData.fullname);
            this._encryptedStorage.set(enAppSession.mobilenumber, responseData.mobilenumber);
            this._encryptedStorage.set(enAppSession.email_id, responseData.email_id);
            this._encryptedStorage.set(enAppSession.profilepicture, responseData.profilepicture);
            this._encryptedStorage.set(enAppSession.haslogin, true);
            this._encryptedStorage.set(enAppSession.password, responseData.password);
            this._encryptedStorage.set(enAppSession.address, responseData.address);
            this._encryptedStorage.set(enAppSession.clientlist, JSON.stringify(userConfig.clientlist));
            this._encryptedStorage.set(enAppSession.projectlist, JSON.stringify(userConfig.projectlist));
            this._encryptedStorage.set(enAppSession.usermodulelist, JSON.stringify(userConfig.usermodulelist));
            this._encryptedStorage.set(enAppSession.lstauthority, JSON.stringify(responseData.lstauthority));
            this._encryptedStorage.set(enAppSession.society_id, '');
            this._encryptedStorage.set(enAppSession.complex_id, '');
            this._encryptedStorage.set(enAppSession.wing_id, '');
            this._encryptedStorage.set(enAppSession.client_id, 1);
            this._encryptedStorage.set(enAppSession.project_id, 1);
            setTimeout(() => {
                observer.next(true);
                observer.complete();
            }, 100);
        });
    }

    clearUserSession() {
        this._encryptedStorage.set(enAppSession.username, '');
        this._encryptedStorage.set(enAppSession.user_id, '');
        this._encryptedStorage.set(enAppSession.fullname, '');
        this._encryptedStorage.set(enAppSession.mobilenumber, '');
        this._encryptedStorage.set(enAppSession.email_id, '');
        this._encryptedStorage.set(enAppSession.haslogin, false);
        this._encryptedStorage.set(enAppSession.password, '');
        this._encryptedStorage.set(enAppSession.address, '');
        this._encryptedStorage.set(enAppSession.clientlist, '');
        this._encryptedStorage.set(enAppSession.projectlist, '');
        this._encryptedStorage.set(enAppSession.society_id, '');
        this._encryptedStorage.set(enAppSession.complex_id, '');
        this._encryptedStorage.set(enAppSession.wing_id, '');
        this._encryptedStorage.set(enAppSession.usermodulelist, '');
        this._encryptedStorage.set(enAppSession.profilepicture, '');
        this._encryptedStorage.set(enAppSession.lstauthority, '');
        localStorage.setItem('_user', '');
    }

}