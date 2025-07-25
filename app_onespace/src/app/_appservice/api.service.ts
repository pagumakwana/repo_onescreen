import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import configData from "../../assets/projectConfig.json";
import { EncryptedStorage } from './encryptedstorage.service';
import { enAppSession } from '../_appmodel/sessionstorage';
import { userModel } from '../_appmodel/_model';
import { Observable } from 'rxjs';

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
        society_id: string;
        complex_id: string;
        wing_id: string;
        clientname: string;
        projectname: string;
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
        this._encrypt.get(enAppSession.client_id).then(client_id => {
            this._encrypt.get(enAppSession.project_id).then(project_id => {
                this._encrypt.get(enAppSession.society_id).then(society_id => {
                    this._encrypt.get(enAppSession.complex_id).then(complex_id => {
                        this._encrypt.get(enAppSession.wing_id).then(wing_id => {
                            this._encrypt.get(enAppSession.clientname).then(clientname => {
                                this._encrypt.get(enAppSession.projectname).then(projectname => {
                                    this.objProjectData = {
                                        client_id: client_id,
                                        project_id: project_id,
                                        society_id: society_id,
                                        complex_id: complex_id,
                                        wing_id: wing_id,
                                        clientname: clientname,
                                        projectname: projectname
                                    }
                                    let httpOptions = {
                                        headers: this.setHeaders()
                                    }
                                    let httpFileOption = {
                                        headers: this.setHeadersFile()
                                    }
                                    this.httpOptions = httpOptions;
                                    this.httpFileOptions = httpFileOption;
                                })
                            })
                        })
                    })
                })
            })
        })
    }

    setHeaders() {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'X-Content-Type-Options': 'nosniff',
            'Access-Control-Allow-Origin': '*',
            'client_id': this.objProjectData?.client_id ? this.objProjectData?.client_id : "1",
            'clientname': this.objProjectData?.clientname ? this.objProjectData?.clientname : "-",
            'project_id': this.objProjectData?.project_id ? this.objProjectData?.project_id : "1",
            'projectname': this.objProjectData?.projectname ? this.objProjectData?.projectname : "-",
            'society_id': this.objProjectData?.society_id ? this.objProjectData?.society_id : "1",
            'complex_id': this.objProjectData?.complex_id ? this.objProjectData?.complex_id : "1",
            'wing_id': this.objProjectData?.wing_id ? this.objProjectData?.wing_id : "1"
        })
    }

    setHeadersFile() {
        return new HttpHeaders({
            'client_id': this.objProjectData?.client_id ? this.objProjectData?.client_id : "0",
            'project_id': this.objProjectData?.project_id ? this.objProjectData?.project_id : "0",
            'society_id': this.objProjectData?.society_id ? this.objProjectData?.society_id : "1",
            'complex_id': this.objProjectData?.complex_id ? this.objProjectData?.complex_id : "1",
            'wing_id': this.objProjectData?.wing_id ? this.objProjectData?.wing_id : "1"
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