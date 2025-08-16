import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ApiService } from './api.service';
import { CommonService } from './common.service';
import { PageTitleService } from './title.service';
import { ScriptLoaderService } from './script-loader.service';
import { Router } from '@angular/router';
import { EncryptedStorage } from './encryptedstorage.service';
import { AppSessionService } from './appsession.service';
@Injectable({ providedIn: 'root' })
export class BaseServiceHelper {

    constructor(public _apiService: ApiService,
        public _commonService: CommonService,
        //public _alertMessageService: AlertMessageService,
        public _router: Router,
        public _pageTitleService: PageTitleService,
        public _scriptLoaderService: ScriptLoaderService,
        public _encryptedStorage: EncryptedStorage,
        public _appSessionService: AppSessionService) { }
}