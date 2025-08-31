import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import configData from "../../assets/projectConfig.json";
import { EncryptedStorage } from './encryptedstorage.service';
import { enAppSession } from '../_appmodel/sessionstorage';

@Injectable({
    providedIn: 'root'  // <- ADD THIS
})
export class ApiService implements OnDestroy {
    apiURL: any = configData.apiBaseURL;
    // public setProjectDataSubscription = new Subject<boolean>();
    // public subscriptionData: Subscription;
    objProjectData: {
        client_id: string;
        project_id: string;
    } | undefined
    httpOptions: any;
    httpFileOptions: any;
    setProjectDataSubscription: any;
    constructor(private http: HttpClient, public _encrypt: EncryptedStorage,
    ) {
        this.getprojectData();
    }
    ngOnDestroy(): void {
        // this.subscriptionData.unsubscribe()
    }
    getprojectData() {
        // this._encrypt.get(enAppSession.client_id).then(client_id => {
        //     this._encrypt.get(enAppSession.project_id).then(project_id => {
        this.objProjectData = {
            client_id: '1',
            project_id: '1'
        }
        let httpOptions = {
            headers: this.setHeaders()
        }
        let httpFileOption = {
            headers: this.setHeadersFile()
        }
        this.httpOptions = httpOptions;
        this.httpFileOptions = httpFileOption;
        //     })
        // })
    }

    setHeaders() {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Content-Type-Options': 'nosniff',
            'Access-Control-Allow-Origin': '*',
            'client_id': "1",
            'project_id': "1",
        })
    }

    setHeadersFile() {
        return new HttpHeaders({
            'client_id': "1",
            'project_id': "1"
        })
    }

    get(endpoint: string) {
        return this.http.get(this.apiURL + '/' + endpoint, this.httpOptions);
    }

    post(endpoint: string, body?: any) {
        return this.http.post(this.apiURL + '/' + endpoint, body, this.httpOptions);
    }

    postFile(endpoint: string, bodyFile?: any) {

        const formData = new FormData();
        for (let i = 0; i < bodyFile.length; i++) {
            let file: File = bodyFile[i];
            formData.append('UploadFile_' + i, file, file.name)
        }
        return this.http.post(this.apiURL + '/' + endpoint, formData, this.httpFileOptions);
    }

    // postFile(endpoint: string, bodyFile?: FileList) {
    //     const formData = new FormData();
    //     for (let i = 0; i < bodyFile.length; i++) {
    //         let file: File = bodyFile[i];
    //         formData.append('UploadFile_' + i, file, file.name)
    //     }
    //     return this.http.post(this.apiURL + '/' + endpoint, formData);
    // }

    getExternal(endpoint: string, reqOpts?: any) {
        return this.http.get(endpoint, reqOpts);
    }

    postExternal(endpoint: string, body?: any) {
        return this.http.post(endpoint, body, this.httpOptions);
    }

}