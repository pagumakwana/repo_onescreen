import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
declare var $: any;
import configData from "../../assets/projectConfig.json";
import * as _ from 'lodash';
import { ApiConstant } from '../_appmodel/apiconstant';
import { SaveModuleFileModel } from '../_appmodel/_model';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { enAppSession } from '../_appmodel/sessionstorage';
import { EncryptedStorage } from './encryptedstorage.service';

@Injectable({ providedIn: 'root' })
export class CommonService {
    constructor(public _apiService: ApiService,
        public _encryptedStorage: EncryptedStorage,
        private _router: Router) {
    }

    browser: any
    public isOnline: boolean = true;
    public hasOnline: boolean = false;
    public ipAddress: string = "";
    public cdnURL = configData.cdnURL;
    public cdnAPPURL = configData.cdnAPPURL;
    public authoritycontrolList: any = [];
    public navigation(url: any = []) {
        this._router.navigate(url);
    }

    guid() {
        return this._p8(null) + this._p8(true) + this._p8(true) + this._p8(null);
    }

    private _p8(s: any) {
        var p = (Math.random().toString(16) + "000000000").substr(2, 8);
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }

    isMobile(): boolean {
        if (window.location.href.indexOf('file://') >= 0) {
            return true;
        }
        else {
            return false;
        }
    }

    /**Get Public IP Address */
    // getIpAddress() {
    //     return this._apiService.getExternal(environment.ipifyUrl);
    // }

    platform(): string {
        return this.browserSpecs.name;
    }

    private browserSpecs = (function () {
        var ua = navigator.userAgent, tem,
            M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return { name: 'IE', version: (tem[1] || '') };
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if (tem != null) return { name: tem[1].replace('OPR', 'Opera'), version: tem[2] };
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
        return { name: M[0], version: M[1] };
    })();


    public randomNumber() {
        return (Math.floor((Math.random() * 899999) + 100000));
    }


    generatePaddingData(data: any, length: any) {
        let result = "";
        for (let index = 0; index < length; index++) {
            result = result + data;
        }
        return result;
    }

    padStartData(padString: any, targetLength: number, padValue: any) {
        let result = padString;
        if (targetLength > padString.length) {
            result = this.generatePaddingData(padValue, targetLength - padString.length) + padString;
        }
        return result;
    }
    sortByKey(array: any, key: any) {
        return array.sort(function (a: any, b: any) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 0 : 1));
        });
    }

    numberOnly(event: any) {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;

    }

    /**
* Marks all controls in a form group as touched
* @param formGroup - The form group to touch
*/
    public markFormGroupTouched(formGroup: FormGroup) {
        (<any>Object).values(formGroup.controls).forEach((control: any) => {
            control.markAsTouched();

            if (control.controls) {
                this.markFormGroupTouched(control);
            }
        });
    }

    fileImageUpload(files: FileList | string, moduleName: string) {
        return new Promise((resolve, reject) => {
            let isUpload: boolean = files ? (files.length > 0) : false
            if (isUpload) {
                this.uploadFile(files, moduleName).subscribe(url => {
                    resolve(url)
                })
            } else {
                resolve(null)
            }
        })
    }

    removeFile(file_id: any) {
        return this._apiService.post(ApiConstant.common.removefile + "?file_id=" + file_id);
    }

    uploadFile(filesData: any, module: any) {
        return this._apiService.postFile(`${ApiConstant.common.uploadfile}?module=${module}`, filesData);
    }

    SaveModuleFile(filesData: any, Data: SaveModuleFileModel, options?: any) {
        // let params = `?FileManagerID=${Data.FileManagerID}&ModuleID=${Data.ModuleID}&ModuleType=${Data.ModuleType}&FileIdentifier=${Data.FileIdentifier}&Sequence=${Data.Sequence}`
        let params = `?module=${Data.ModuleType}`
        return this._apiService.postFile(ApiConstant.common.uploadfile + params, [filesData]);
    }

    saveModuleFile(files: FileList | string | Array<any>, Data: SaveModuleFileModel, type = 'upload') {
        return new Promise((resolve, reject) => {

            // let isUpload: boolean = files && type == 'upload' ? (files.length > 0) : false
            let isUpload: any = (files && type == 'upload')

            if (isUpload) {
                this.SaveModuleFile(files, Data).subscribe(url => {
                    resolve(url)
                })
            } else {
                // resolve(JSON.parse(JSON.stringify(this.sampleRes)))
                resolve([])
            }
        })
    }

    //Joins Multiple Array into One
    joinArray(...args: any) {
        return args.reduce((acc: any, val: any) => [...acc, ...val]);
    }

    //Join from Object Key
    plunk(ArrayData: Array<any>, key: string) {
        return ArrayData.map(e => e[key]).join(",");
    }

    getImageDimension(fileInput: any): Observable<any> {
        return new Observable(observer => {
            let _URL = window.URL
            let img: any;
            img = new Image();
            img.onload = function () {
                img.height = this.height;
                img.width = this.width;
            }
            img.src = _URL.createObjectURL(fileInput);
            setTimeout(() => {
                let size = { width: img.width, height: img.height }
                observer.next(size);
                observer.complete();
            }, 1000);
        });
    }
    readImage(inputValue: any): Observable<any> {
        return new Observable(observer => {
            let imageFile: any;
            var file: File = typeof inputValue == 'object' ? inputValue : inputValue.files[0];
            var myReader: FileReader = new FileReader();
            myReader.readAsDataURL(file);
            myReader.onloadend = (e) => {
                setTimeout(() => {
                    imageFile = myReader.result;
                    observer.next(imageFile);
                    observer.complete();
                }, 1000);
            }
        });
    }
    // getDropDownText(id:any, object:any, columnname:any) {
    //     let index = _.findIndex(object, (o: any) => {
    //         return o[columnname] == id
    //     })
    //     return index > -1 ? object[index] : null
    // }
    // bindMultiSelect(ArrayData: Array<any> = [], object:any) {
    //     let arrayReturnData: Array<any> = []
    //     for (let item of ArrayData) {
    //         arrayReturnData.push(this.getDropDownText(item.category_id, object, 'category_id'))
    //     }
    //     return arrayReturnData
    // }

    // list_to_tree(listData: Array<any>, idField: string, parentidField: string) {
    //     let map = {}, node, roots = [], i;

    //     for (i = 0; i < listData.length; i += 1) {
    //         map[listData[i][idField]] = i; // initialize the map
    //         listData[i].children = []; // initialize the children
    //     }

    //     for (i = 0; i < listData.length; i += 1) {
    //         node = listData[i];
    //         if (node[parentidField] !== parseInt("0")) {
    //             // if you have dangling branches check that map[node[parentidField]] exists
    //             listData[map[node[parentidField]]].children.push(node);
    //         } else {
    //             roots.push(node);
    //         }
    //     }

    //     return roots;
    // }

    private getauthoritycontrols(user_id = 0, module_aliasname = '') {
        return this._apiService.get(`${ApiConstant.config.getauthoritycontrols}?user_id=${user_id}&module_aliasname=${module_aliasname}`);
    }
    private getauthoritymodules(user_id = 0) {
        return this._apiService.get(`${ApiConstant.config.getauthoritymoduls}?user_id=${user_id}`);
    }

    getauthoritycontrol(user_id: any, module_aliasname = '') {
        return new Promise((resolve, rej) => {
            this.getauthoritycontrols(user_id, module_aliasname).subscribe((res: any) => {
                res = Array.isArray(res.data) && res.data.length > 0 ? res.data : [];
                resolve(res);
            });
        })

    }
    getauthoritymodule(user_id: any) {
        return new Promise((resolve, rej) => {
            this.getauthoritymodules(user_id).subscribe((res: any) => {
                res = Array.isArray(res.data) && res.data.length > 0 ? res.data : [];
                resolve(res);
            });
        })

    }

    getcatalogrange(requestdatalength: any, currentindex: number, repeatIndex: number = -1): Array<string> | string {
        let RangeCount: Array<any> = [];
        let n = 1;
        requestdatalength = requestdatalength ? parseInt(requestdatalength) : 1;
        requestdatalength =
            typeof requestdatalength == "number" && !isNaN(requestdatalength) ? requestdatalength : 1;
        RangeCount.push(
            requestdatalength == 1 ? `${1} - ${requestdatalength + 1}` : `${1} - ${requestdatalength}`
        );
        while (n < currentindex) {
            let value =
                requestdatalength == 1
                    ? `${requestdatalength + n * 2} - ${requestdatalength + n * 2 + 1}`
                    : `${requestdatalength * n + 1} - ${requestdatalength * n + requestdatalength}`;
            RangeCount.push(value);
            n++;
        }

        return repeatIndex > -1 ? RangeCount[repeatIndex] : RangeCount;
    }
    getDropDownText(id: any, object: any, columnname: any) {
        let index = _.findIndex(object, (o: any) => {
            return o[columnname] == id
        })
        return index > -1 ? object[index] : null
    }

    list_to_tree(listData: Array<any>, idField: string, parentidField: string) {
        let map: any, node, roots = [], i;

        for (i = 0; i < listData.length; i += 1) {
            map[listData[i][idField]] = i; // initialize the map
            listData[i].children = []; // initialize the children
        }

        for (i = 0; i < listData.length; i += 1) {
            node = listData[i];
            if (node[parentidField] !== parseInt("0")) {
                // if you have dangling branches check that map[node[parentidField]] exists
                listData[map[node[parentidField]]].children.push(node);
            } else {
                roots.push(node);
            }
        }

        return roots;
    }

    readonly DELIMITER = '-';

    fromModeltoDate(value: string | null): NgbDateStruct | null {
        if (value) {
            const date = value.split(this.DELIMITER);
            return {
                year: parseInt(date[0], 10),
                month: parseInt(date[1], 10),
                day: parseInt(date[2], 10),
            };
        }
        return null
    }

    get_portal_config(sessiona_key_name:any) {
        return new Promise((resolve, rej) => {
            this._encryptedStorage.get(enAppSession.portal_config).then((res_portalconfig: any) => {
                let _obj_portalConfig = JSON.parse(res_portalconfig);
                resolve(_obj_portalConfig?.find((pc:any) => pc.config_name === sessiona_key_name)?.config_value);
            });
        });
    }



}