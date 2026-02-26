import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
            'project_id': "1",
            'X-Content-Type-Options': 'nosniff',
            'Access-Control-Allow-Origin': '*',
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

    getOtp(endpoint: string, body?: any) {
        return this.http.get(endpoint, body);
    }
    postt(endpoint: string, body?: any) {
        return this.http.post(endpoint, body);
    }

    post_otp(endpoint: string, mobileNo: string, otp: string) {
        const _body = new HttpParams()
            .set('mobile_no', mobileNo)
            .set('otp', otp);

        const headers = new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded'
        });

        return this.http.post(endpoint, _body.toString(), { headers });
    }

    // send_otp(name: string, phone: string, otp: string) {
    //     const _body = {
    //         "channelId": "6492e61c86d8b49d6ceca0dc",
    //         "channelType": "whatsapp",
    //         "recipient": {
    //             "name": name,
    //             "phone": `91${phone}`
    //         },
    //         "whatsapp": {
    //             "type": "template",
    //             "template": {
    //                 "templateName": "verification_code",
    //                 "bodyValues": {
    //                     "otp": otp
    //                 }
    //             }
    //         }
    //     }

    //     const headers = new HttpHeaders({
    //         'Content-Type': 'application/json',
    //         'apiKey': '645387bdd13214c03efe4c5d',
    //         'apiSecret': 'b108678ac3d143c4a837d4206dea3f8e'
    //     });

    //     return this.http.post('https://server.gallabox.com/devapi/messages/whatsapp', _body.toString(), { headers });
    // }
}