import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { enAppSession } from '../_appmodel/sessionstorage';
import { contactDetails, fileChoosenDataModel, fileConfigModel, leadsmodel, SaveModuleFileModel } from '../_appmodel/_model';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { WebDService } from '../_appservice/webdpanel.service';
import { BaseServiceHelper } from '../_appservice/baseHelper.service';
import { CommonModule } from '@angular/common';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { WebdmediauploadComponent } from '../layout_template/webdmediaupload/webdmediaupload.component';
import * as _ from 'lodash';


@Component({
  selector: 'app-manageleads',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SweetAlert2Module, WebdmediauploadComponent],
  templateUrl: './manageleads.component.html',
  styleUrl: './manageleads.component.scss'
})
export class ManageleadsComponent {
  private unsubscribe: Subscription[] = [];
  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  fgleads!: FormGroup
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading!: boolean;
  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    private _cdr: ChangeDetectorRef,
    public _fbleads: FormBuilder,
    private _activatedRouter: ActivatedRoute) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
  }
  public budgetSubscribe!: Subscription;
  isSuccessModal_Open = false;
  _leadsmodel: leadsmodel = {};
  leads_id: any;
  private iscontactModify: boolean = false;
  isFormSubmit: boolean = false;
  ngAfterViewInit(): void { }

  ngOnInit(): void {
    this.initForm();
    this.leads_id = this._activatedRouter.snapshot.paramMap.get('leads_id');
    // if (this.contact_id != '0')
    //   this.getcontact(this.contact_id);
    setTimeout(() => {
      this._cdr.detectChanges();
    }, 500);
  }


  initForm() {
    this.fgleads = this._fbleads.group({
      leads_id: [0],
      name: ['', [Validators.required]],
      mobile_number: ['', [Validators.required]],
      location: [''],
      additional_details: [''],
      thumbnail: [''],
      thumbnail2: [''],
      otp: ['']
    })
  }

  showOtpField = false;
  setcontactdetail(flag: any) {
    this.isFormSubmit = false;
    this.isLoading$.next(true);
    this._base._commonService.markFormGroupTouched(this.fgleads)
    if (this.fgleads.valid) {
      this._base._encryptedStorage.get(enAppSession.client_id).then(client_id => {
        this._base._encryptedStorage.get(enAppSession.project_id).then(project_id => {
          this._leadsmodel.name = this.fgleads.value.name;
          this._leadsmodel.mobile_number = this.fgleads.value.mobile_number;
          this._leadsmodel.location = this.fgleads.value.location;
          this._leadsmodel.additional_details = this.fgleads.value.additional_details;
          this._leadsmodel.client_id = parseInt(client_id);
          this._leadsmodel.project_id = parseInt(project_id);
          this._leadsmodel.filemanager = [];
          this.saveModuleFile_helper('media')
          // this.addmodifycontact(flag);
          this.showOtpField = true;
        });
      });
    } else {
      this.isFormSubmit = true;
      setTimeout(() => {
        this.isLoading$.next(false);
        this._cdr.detectChanges();
      }, 1500);
    }

  }

  apiOtp: string = '';
  addmodifycontact(flag: any) {
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this._base._encryptedStorage.get(enAppSession.fullname).then(fullname => {
        this._leadsmodel.flag = this.iscontactModify ? 'MODIFYLEADS' : 'NEWLEADS';
        this._leadsmodel.createdname = fullname;
        this._leadsmodel.createdby = parseInt(user_id);
        this._webDService.manageleads(this._leadsmodel).subscribe((response: any) => {
          debugger
          if (typeof response === 'string' && response.startsWith('newsuccess~')) {
            const parts = response.split('~');
            this.apiOtp = parts[1];
            const mobile = this.fgleads.value.mobile_number;
           
           
            this.fgleads.get('otp')?.setValidators([Validators.required]);
            this.fgleads.get('otp')?.updateValueAndValidity();
            this._cdr.detectChanges(); this._webDService.sendOtp(mobile, this.apiOtp).subscribe(() => {
              this.showOtpField = true;
              // make otp required

            });
            this.OTPsuccess = true;
            setTimeout(() => {
              this.OTPsuccess = false;
            }, 1200);
            debugger
            this._webDService.leads({name:this._leadsmodel.name,description:this._leadsmodel.additional_details}).subscribe((res: any) => {
              console.log("res", res)
            })
           

          }

        });

      });
    });
  }
  invalidOTP: boolean = false;
  OTPsuccess: boolean = false;
  verifyOtp(fgleads: any) {
    this._base._commonService.markFormGroupTouched(this.fgleads)
    if (this.fgleads.valid) {
      const enteredOtp = this.fgleads.value.otp;

      if (!enteredOtp) {
        return;
      }

      if (enteredOtp === this.apiOtp) {

        // ✅ SUCCESS
        this.successSwal.fire();

        setTimeout(() => {
          this.successSwal.close();
          location.reload();
        }, 1500);

      } else {
        // ❌ INVALID OTP
        this.invalidOTP = true;
        setTimeout(() => {
          this.invalidOTP = false;
        }, 1200);
      }
    }
  }

  public moduleType: any = 'leads';
  fileChoosenData: { [key: string]: Array<fileChoosenDataModel> } = {
    thumbnail: [],
    thumbnail2: []
  }

  fileConfig: { [key: string]: fileConfigModel } = {
    thumbnail: {
      fileValidationInfo: { fileType: ['image/svg', 'image/jpeg', 'image/jpeg', 'image/png'], size: 3145728 },
      isMulti: true,
      fileidentifier: 'thumbnail',
      ModuleType: this.moduleType,
      ModuleID: 0,
      fileextension: '',
    },
    thumbnail2: {
      fileValidationInfo: { fileType: ['image/svg', 'image/jpeg', 'image/jpeg', 'image/png'], size: 3145728 },
      isMulti: true,
      fileidentifier: 'thumbnail2',
      ModuleType: this.moduleType,
      ModuleID: 0,
      fileextension: '',
    }
  }

  flagtype: string = ''
  saveModuleFile_helper(media: any) {
    let fileData: Array<SaveModuleFileModel> = this._base._commonService.joinArray(
      this.getFilesInfo('thumbnail'),
      this.getFilesInfo('thumbnail2')
    );

    // let fileData: Array<SaveModuleFileModel> = this._base._commonService.joinArray(this.getFilesInfo('thumbnail'));(this.getFilesInfo('adharcard'));(this.getFilesInfo('pancard'))
    if (fileData.length > 0)
      this.saveModuleFile_multi_helper(fileData, fileData.length, [], media)
    else {
      this._leadsmodel.filemanager?.filter((resFile: any) => {
        let index = _.findIndex(media, (o: any) => {
          return o["subidentifier"] == resFile.subidentifier
        });
        if (index > -1)
          resFile.ref_id = media[index].passenger_id;
      });
      this.addmodifycontact(this.flagtype);
    }
  }

  saveModuleFile_multi_helper(arrayData: Array<SaveModuleFileModel>, counter: number, resolveData: Array<any>, media: any) {
    this._base._commonService.saveModuleFile(arrayData[counter - 1].files ?? [], arrayData[counter - 1]).then((uploadResponse) => {
      if (Array.isArray(uploadResponse)) {
        this.returnPassengerID(media, arrayData[counter - 1].subidentifier).then((res_ref_id) => {
          for (let uploadedFile of uploadResponse) {
            uploadedFile.fileidentifier = arrayData[counter - 1].fileidentifier
            uploadedFile.subidentifier = arrayData[counter - 1].subidentifier
            uploadedFile.itemidentifier = arrayData[counter - 1].itemidentifier
            uploadedFile.ref_id = res_ref_id
          }

          resolveData = this._base._commonService.joinArray(resolveData, uploadResponse)
          if (counter > 1) {
            counter--
            this.saveModuleFile_multi_helper(arrayData, counter, resolveData, media)
          } else {
            this._leadsmodel.filemanager = resolveData
            this.addmodifycontact(this.flagtype);
          }
        })
      }
    })
  }

  returnPassengerID(passengerData: any, subidentifier: any) {
    return new Promise((resolve, reject) => {
      let index = _.findIndex(passengerData, (o: any) => {
        return o["subidentifier"] == subidentifier
      });
      let ref_id = parseInt(passengerData[index].passenger_id);
      resolve(ref_id);
    });
  }
  initFilesUrl(FileManager: Array<any>) {
    for (let i in FileManager) {
      if (FileManager[i].fileidentifier) {
        let filesData: fileChoosenDataModel = {
          file: null,
          thumb: this._base._commonService.cdnURL + FileManager[i].filepath,
          file_id: FileManager[i].file_id,
          displayorder: FileManager[i].displayorder,
          ModuleID: this._leadsmodel.leads_id,
          fileidentifier: FileManager[i].fileidentifier,
          ModuleType: 'serviceprovider',
          fileextension: FileManager[i].fileextension,
          fileArrayIdentifier: FileManager[i].itemidentifier,
          subidentifier: FileManager[i].subidentifier,
          itemidentifier: FileManager[i].itemidentifier,
        }
        this.fileChoosenData[FileManager[i].fileidentifier].push(filesData)
        this.fgleads.controls[FileManager[i].fileidentifier].setValue('uploaded')
        this.fgleads.controls[FileManager[i].fileidentifier].updateValueAndValidity()
      }
    }
  }

  getFilesInfo(fileidentifier: string): SaveModuleFileModel {
    let arrayReturn: any = []
    for (let i in this.fileChoosenData[fileidentifier]) {
      this.fileChoosenData[fileidentifier][i].displayorder = (1 + parseInt(i))
      if (this.fileChoosenData[fileidentifier][i].file_id == 0) {
        let filesData: SaveModuleFileModel = {
          file_id: this.fileChoosenData[fileidentifier][i].file_id,
          ModuleID: this.fileChoosenData[fileidentifier][i].ModuleID,
          ModuleType: this.fileChoosenData[fileidentifier][i].ModuleType,
          fileidentifier: this.fileChoosenData[fileidentifier][i].fileidentifier,
          displayorder: this.fileChoosenData[fileidentifier][i].displayorder,
          files: this.fileChoosenData[fileidentifier][i].file,
          indexidentifier: ((this.fileChoosenData[fileidentifier][i] as any).FileUploaderIndex - 1),
          subidentifier: this.fileChoosenData[fileidentifier][i].subidentifier,
          itemidentifier: this.fileChoosenData[fileidentifier][i].itemidentifier
        }
        arrayReturn.push(filesData)
      }
    }
    return arrayReturn
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

}
