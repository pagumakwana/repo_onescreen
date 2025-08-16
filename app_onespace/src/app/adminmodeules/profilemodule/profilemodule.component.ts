import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Validators } from 'ngx-editor';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct, NgbInputDatepicker, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { fileChoosenDataModel, fileConfigModel, SaveModuleFileModel, userModel } from '../../_appmodel/_model';
import { enAppSession } from '../../_appmodel/sessionstorage';
import { AuthService } from '../../authmodule/_authservice/auth.service';
import { WebDService } from '../../_appservice/webdpanel.service';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { WebdmediauploadComponent } from '../../layout_template/webdmediaupload/webdmediaupload.component';
import { WebdtexteditorComponent } from "../../layout_template/webdtexteditor/webdtexteditor.component";
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-profilemodule',
  standalone: true,
  imports: [SweetAlert2Module,CommonModule, FormsModule, ReactiveFormsModule, WebdmediauploadComponent, NgbModule, WebdtexteditorComponent],
  providers:[AuthService,WebDService,BaseServiceHelper],
  templateUrl: './profilemodule.component.html',
  styleUrl: './profilemodule.component.scss'
})
export class ProfilemoduleComponent {
  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  @ViewChild('deleteSwal')
  public readonly deleteSwal!: SwalComponent;

  @ViewChild('errorSwal')
  public readonly errorSwal!: SwalComponent;

  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  showChangeEmailForm: boolean = false;
  showChangePasswordForm: boolean = false;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading!: boolean;
  private unsubscribe: Subscription[] = [];
  userDetails: any;
  _userDetail: userModel = {};
  fgUser!: FormGroup
  UserDetails!: any[];
  public isConfirmed: boolean = false;

  constructor(private cdr: ChangeDetectorRef,
    public _base: BaseServiceHelper,
    private _webDService: WebDService,
    public _fbUser: FormBuilder,
    private _activatedRouter: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private router: Router,
    private auth: AuthService,

  ) {
    const current = new Date();
    this.minDate = { year: current.getFullYear(), month: current.getMonth() - 5, day: current.getDate() };
    this.maxDate = { year: current.getFullYear() + 1, month: current.getMonth(), day: current.getDate() }
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
  }

  @ViewChild("dob", { static: true }) travellingdate!: NgbInputDatepicker;
  minDate: NgbDateStruct;
  maxDate: NgbDateStruct;
  _userModel: userModel = {}
  user_id: any;
  isFormSubmit: boolean = false;
  private isUserModify: boolean = false;

  initform() {
    this.fgUser = this._fbUser.group({
      user_id: [0],
      profilepicture: [''],
      fullname: ['', [Validators.required]],
      username: [''],
      email_id: ['', [Validators.required]],
      mobilenumber: ['', [Validators.required]],
      password: ['', [Validators.required]],
      website: [''],
      dob: [''],
      bio: [''],
      project_id: [''],
      projectname: [''],
      authority_id: [''],
      authority: [''],
      textarea: this._fbUser.group({
        description: [''],
      })
    })
  }

  ngOnInit() {
    this.initform();
    // this.getUserList();
    if (this.user_id != '0')
      this.getUserList(this.user_id);


  }


  getUserList(user_id:any) {
    return new Promise((resolve, reject) => {
      this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
        this._webDService.userlist('Detail', user_id).subscribe((resUserListdata: any) => {
          let userListData = Array.isArray(resUserListdata.data) ? resUserListdata.data : [];
          // this._userModel.user_id = resUserListdata.user_id;
          this._userModel = userListData[0];
          this.isUserModify = true;
          this.fgUser.controls['fullname'].setValue(this._userModel.fullname);
          this.fgUser.controls['username'].setValue(this._userModel.username);
          this.fgUser.controls['email_id'].setValue(this._userModel.email_id);
          this.fgUser.controls['mobilenumber'].setValue(this._userModel.mobilenumber);
          this.fgUser.controls['password'].setValue(this._userModel.password);
          this.fgUser.controls['dob'].setValue(this._base._commonService.fromModeltoDate(this._userModel.dob));
          this.fgUser.get('textarea.description')?.setValue(this._userModel.bio);
          this.fgUser.controls['website'].setValue(this._userModel.website);
          this._userModel.filemanager = Array.isArray(this._userModel.filemanager) ? this._userModel.filemanager : [];
          this.initFilesUrl(this._userModel.filemanager)
          resolve(true)
        }, error => {
          resolve(false);
        });
      });
    });
  }



  // flagType: string = null
  // setUserModel(flag) {
  //   this.isLoading$.next(true);
  //   this.isFormSubmit = false;
  //   this.flagType = flag;
  //   if (this.fgUser.valid) {
  //     let travelldate = this.fgUser.value.dob;
  //     this._base._commonService.markFormGroupTouched(this.fgUser);
  //     this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
  //       this._userModel.fullname = this.fgUser.value.fullname;
  //       this._userModel.username = this.fgUser.value.email_id;
  //       this._userModel.email_id = this.fgUser.value.email_id;
  //       this._userModel.mobilenumber = this.fgUser.value.mobilenumber;
  //       this._userModel.password = this.fgUser.value.password;
  //       this._userModel.dob = `${travelldate.year}-${travelldate.month}-${travelldate.day}`;
  //       this._userModel.bio = this.fgUser.value.textarea.description;
  //       this._userModel.website = this.fgUser.value.website;
  //       this.addmodifyuser(flag);
  //     });
  //     this.isFormSubmit = true;
  //   }

  // }
  flagType: any
  setUserModel(flag:any) {
    this.flagType = flag;
    this._base._commonService.markFormGroupTouched(this.fgUser);
    debugger
    if (this.fgUser.valid) {
      let travelldate = this.fgUser.value.dob;
      this._base._encryptedStorage.get(enAppSession.client_id).then(client_id => {
        this._base._encryptedStorage.get(enAppSession.project_id).then(project_id => {
          this._userModel.fullname = this.fgUser.value.fullname;
          this._userModel.username = this.fgUser.value.email_id;
          this._userModel.email_id = this.fgUser.value.email_id;
          this._userModel.mobilenumber = this.fgUser.value.mobilenumber;
          this._userModel.password = this.fgUser.value.password;
          this._userModel.dob = travelldate ? `${travelldate.year}-${travelldate.month}-${travelldate.day}` : null;
          this._userModel.bio = this.fgUser.value.textarea.description;
          this._userModel.website = this.fgUser.value.website;
          this._userModel.client_id = client_id;
          this._userModel.project_id = project_id;
          this._userModel.filemanager = []
          this.addmodifyuser(flag);
          // this.saveModuleFile_helper()
        });
      });
    }
  }

  addmodifyuser(flag:any) {
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this._base._encryptedStorage.get(enAppSession.fullname).then(fullname => {
        this._userModel.flag = this.isUserModify ? 'MODIFYUSER' : 'NEWUSER';
        this._userModel.createdname = fullname;
        this._userModel.createdby = user_id;
        this._webDService.useraddmodify(this._userModel).subscribe((response: any) => {
          let isRedirect: boolean = true
          if (response === 'userexists') {
            isRedirect = false;
          }

          setTimeout(() => {
            this.isLoading$.next(false);
            this._cdr.detectChanges();
          }, 1500);

          if (isRedirect && flag) {
            setTimeout(() => {
              this.successSwal.fire().then(() => {
                this._base._router.navigate(['/app/profile/overview']);
              });
            }, 1000);
          }
        });

      });
    });
  }

  fileChoosenData: { [key: string]: Array<fileChoosenDataModel> } = {
    profilepicture: []
  }

  fileConfig: { [key: string]: fileConfigModel } = {
    profilepicture: {
      fileValidationInfo: {
        fileType: ['image/svg', 'image/jpeg', 'image/jpg', 'image/png'],
        size: 3145728
      },
      isMulti: true,
      fileidentifier: 'profilepicture',
      ModuleType: 'profile_picture',
      ModuleID: 0,
      fileextension: '',
    }
  }

  // saveModuleFile_helper() {
  //   let fileData: Array<SaveModuleFileModel> = this._base._commonService.joinArray(this.getFilesInfo('profilepicture'))
  //   if (fileData.length > 0)
  //     this.saveModuleFile_multi_helper(fileData, fileData.length, [])
  //   else {
  //     this.addmodifyuser(this.flagType);
  //   }
  // }

  
  // saveModuleFile_multi_helper(arrayData: Array<SaveModuleFileModel>, counter: number, resolveData: Array<any>) {
  //   this._base._commonService.saveModuleFile(arrayData[counter - 1].files, arrayData[counter - 1], this.fgUser.controls[arrayData[counter - 1].fileidentifier].value).then((uploadResponse: Array<any>) => {
  //     if (Array.isArray(uploadResponse)) {
  //       for (let uploadedFile of uploadResponse) {
  //         uploadedFile.fileidentifier = arrayData[counter - 1].fileidentifier
  //       }
  //     }
  //     resolveData = this._base._commonService.joinArray(resolveData, uploadResponse)
  //     if (counter > 1) {
  //       counter--
  //       this.saveModuleFile_multi_helper(arrayData, counter, resolveData)
  //     } else {
  //       this._userModel.filemanager = resolveData
  //       this.addmodifyuser(this.flagType);
  //     }
  //   })
  // }

  //setting up files during modify
  initFilesUrl(FileManager: Array<any>) {
    for (let i in FileManager) {
      if (FileManager[i].fileidentifier) {
        let filesData: fileChoosenDataModel = {
          file: null,
          thumb: this._base._commonService.cdnURL + FileManager[i].filepath,
          file_id: FileManager[i].file_id,
          displayorder: FileManager[i].displayorder,
          ModuleID: this._userModel.user_id,
          fileidentifier: FileManager[i].fileidentifier,
          ModuleType: 'overview',
          fileextension: FileManager[i].fileextension,
        }
        this.fileChoosenData[FileManager[i].fileidentifier].push(filesData)
        this.fgUser.controls[FileManager[i].fileidentifier].setValue('uploaded')
        this.fgUser.controls[FileManager[i].fileidentifier].updateValueAndValidity()
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
