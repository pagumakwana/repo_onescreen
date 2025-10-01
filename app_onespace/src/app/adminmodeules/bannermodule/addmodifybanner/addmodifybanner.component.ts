import { ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SweetAlertOptions } from 'sweetalert2';
import { BaseServiceHelper } from '../../../_appservice/baseHelper.service';
import { WebDService } from '../../../_appservice/webdpanel.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { banner, fileChoosenDataModel, fileConfigModel, SaveModuleFileModel } from '../../../_appmodel/_model';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { enAppSession } from '../../../_appmodel/sessionstorage';
import * as _ from "lodash";
import { WebdtexteditorComponent } from '../../../layout_template/webdtexteditor/webdtexteditor.component';
import { MultiselectComponent } from '../../../layout_template/multiselect/multiselect.component';
import { WebdmediauploadComponent } from '../../../layout_template/webdmediaupload/webdmediaupload.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addmodifybanner',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, WebdtexteditorComponent, MultiselectComponent, WebdmediauploadComponent, SweetAlert2Module, RouterLink],
  templateUrl: './addmodifybanner.component.html',
  styleUrl: './addmodifybanner.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AddmodifybannerComponent {
  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  // confirmGoBack() {
  //   this.deleteSwal.fire();
  // }

  navigateBack() {
    this._base._router.navigate(['/app/managebanner']);
  }


  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading!: boolean;
  private unsubscribe: Subscription[] = [];
  fgbanner!: FormGroup
  constructor(
    public _base: BaseServiceHelper,
    private _webDService: WebDService,
    public _fbbanner: FormBuilder,
    private _activatedRouter: ActivatedRoute,
    private _cdr: ChangeDetectorRef) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
  }

  isBannerDisable: boolean = false;
  _banner: banner = {};
  banner_id: any;
  CategoryMaster: any = [];
  TypeMaster: any = [];
  LabelMaster: any = [];

  public _configCategory: IDropdownSettings = {
    singleSelection: true,
    idField: 'category_id',
    textField: 'category',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  public _configType: IDropdownSettings = {
    singleSelection: true,
    idField: 'typemaster_id',
    textField: 'typemaster',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  public _configLabel: IDropdownSettings = {
    singleSelection: true,
    idField: 'label_id',
    textField: 'label',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  fileChoosenData: { [key: string]: Array<fileChoosenDataModel> } = {
    thumbnail: []
  }

  fileConfig: { [key: string]: fileConfigModel } = {
    thumbnail: {
      fileValidationInfo: {
        fileType: ['image/svg', 'image/jpeg', 'image/jpg', 'image/png'],
        size: 3145728
      },
      isMulti: true,
      fileidentifier: 'thumbnail',
      ModuleType: 'banner',
      ModuleID: 0,
      fileextension: '',
    }
  }

  ngOnInit(): void {
    this.initiForm();
    this.banner_id = this._activatedRouter.snapshot.paramMap.get('banner_id');
    debugger
    if (this.banner_id != '0') {
      this.getbannerdetails(this.banner_id);
    }
    this.gettypemasterdetails();
    this.getlabeldetails();
  }

  initiForm() {
    this.fgbanner = this._fbbanner.group({
      banner_id: [0],
      title: [''],
      subtitle: [''],
      url: [''],
      displayorder: [0],
      lsttypemaster: [[]],
      lstcategory: ['', [Validators.required]],
      lstlabel: [[]],
      thumbnail: [''],
      isactive: [true],
      isfeatured: [true],
      textarea: this._fbbanner.group({
        description: [''],
      })
    })
  }

  saveModuleFile_helper() {
    let fileData: Array<SaveModuleFileModel> = this._base._commonService.joinArray(this.getFilesInfo('thumbnail'))
    if (fileData.length > 0)
      this.saveModuleFile_multi_helper(fileData, fileData.length, [])
    else {
      this.addmodifybanner(this.flagType);
    }
  }

  saveModuleFile_multi_helper(
    arrayData: Array<SaveModuleFileModel>,
    counter: number,
    resolveData: Array<any>
  ) {
    const currentItem: SaveModuleFileModel = arrayData[counter - 1];

    const fileIdentifier: string = currentItem.fileidentifier ?? '';
    const rawValue = this.fgbanner.controls[fileIdentifier]?.value;
    const controlValue: string | undefined =
      typeof rawValue === 'string' ? rawValue : undefined;
    const files: string | any[] | FileList = currentItem.files ?? '';

    this._base._commonService
      .saveModuleFile(files, currentItem, controlValue)
      .then((uploadResponse: any) => {
        const responseArray: any[] = Array.isArray(uploadResponse)
          ? uploadResponse
          : [];

        for (let uploadedFile of responseArray) {
          uploadedFile.fileidentifier = fileIdentifier;
        }

        resolveData = this._base._commonService.joinArray(
          resolveData,
          responseArray
        );

        if (counter > 1) {
          counter--;
          this.saveModuleFile_multi_helper(arrayData, counter, resolveData);
        } else {
          this._banner.filemanager = resolveData;
          this.addmodifybanner(this.flagType);
        }
      });
  }

  getbannerdetails(banner_id: any) {
    return new Promise((resolve, reject) => {
      this._webDService.getbanner('Details', banner_id).subscribe((resBannerDetails: any) => {
        let bannerMaster = Array.isArray(resBannerDetails.data) ? resBannerDetails.data : [];
        this._banner = bannerMaster[0];
        this.fgbanner.controls['title'].setValue(this._banner.title);
        this.fgbanner.controls['subtitle'].setValue(this._banner.subtitle);
        this.fgbanner.controls['url'].setValue(this._banner.url);
        this.fgbanner.get('textarea.description')?.setValue(this._banner.description);
        this.fgbanner.controls['lstcategory'].setValue(this._banner.lstcategory);
        this.fgbanner.controls['lsttypemaster'].setValue(this._banner.lsttypemaster);
        this.fgbanner.controls['lstlabel'].setValue(this._banner.lstlabel);
        this.fgbanner.controls['isactive'].setValue(this._banner.isactive);
        this.fgbanner.controls['displayorder'].setValue(this._banner.displayorder);
        this._banner.filemanager = Array.isArray(this._banner.filemanager) ? this._banner.filemanager : []
        this.initFilesUrl(this._banner.filemanager)
        resolve(true)
      }, error => {
        resolve(false);
      });
    });
  }

  flagType: any;
  setbanner(flag: any) {
    this.flagType = flag;
    this._base._commonService.markFormGroupTouched(this.fgbanner)
    if (this.fgbanner.valid) {
      this._base._encryptedStorage.get(enAppSession.project_id).then(project_id => {
        this._banner.title = this.fgbanner.value.title;
        this._banner.subtitle = this.fgbanner.value.subtitle;
        this._banner.description = this.fgbanner.value.textarea.description;
        this._banner.displayorder = this.fgbanner.value.displayorder;
        this._banner.url = this.fgbanner.value.url;
        this._banner.lsttypemaster = [];
        this.TypeMaster.filter((res: any) => {
          let index: number = _.findIndex(this.fgbanner.value.lsttypemaster, (o: any) => {
            return o.typemaster_id == res.typemaster_id
          })
          if (index > -1) {
            this._banner.lsttypemaster.push(res);
          }
        });
        this._banner.lstcategory = [];
        this.CategoryMaster.filter((res: any) => {
          let index: number = _.findIndex(this.fgbanner.value.lstcategory, (o: any) => {
            return o.category_id == res.category_id
          })
          if (index > -1) {
            this._banner.lstcategory.push(res);
          }
        });
        this._banner.lstlabel = [];
        this.LabelMaster.filter((res: any) => {
          let index: number = _.findIndex(this.fgbanner.value.lstlabel, (o: any) => {
            return o.label_id == res.label_id
          })
          if (index > -1) {
            this._banner.lstlabel.push(res);
          }
        });
        this._banner.isactive = this.fgbanner.value.isactive;
        this._banner.project_id = parseInt(project_id);
        this._banner.filemanager = []
        this.saveModuleFile_helper()
        // this.addmodifybanner(flag);
      });
    }
  }

  addmodifybanner(flag: any) {
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this._base._encryptedStorage.get(enAppSession.fullname).then(fullname => {
        this._banner.flag = this.banner_id == '0' ? 'NEWBANNER' : 'MODIFYBANNER';
        this._banner.createdname = fullname;
        this._banner.user_id = parseInt(user_id);
        this._webDService.banner(this._banner).subscribe((response: any) => {
          let isRedirect: boolean = true
          if (response === 'bannerexists') {
            // Show warning if society already exists
            // this._base._alertMessageService.warning("Society already exists!");
            isRedirect = false;
          }

          setTimeout(() => {
            this.isLoading$.next(false);
            this._cdr.detectChanges();
          }, 1500);

          if (isRedirect && flag) {
            setTimeout(() => {
              this.successSwal.fire()
              setTimeout(() => {
                this._base._router.navigate(['/app/managebanner']);
              }, 1500);
            }, 1000);
          }
        });
      });
    });
  }

  //setting up files during modify
  initFilesUrl(FileManager: Array<any>) {
    for (let i in FileManager) {
      if (FileManager[i].fileidentifier) {
        let filesData: fileChoosenDataModel = {
          file: null,
          thumb: this._base._commonService.cdnURL + FileManager[i].filepath,
          file_id: FileManager[i].file_id,
          displayorder: FileManager[i].displayorder,
          ModuleID: this._banner.banner_id,
          fileidentifier: FileManager[i].fileidentifier,
          ModuleType: 'banner',
          fileextension: FileManager[i].fileextension,
        }
        this.fileChoosenData[FileManager[i].fileidentifier].push(filesData)
        this.fgbanner.controls[FileManager[i].fileidentifier].setValue('uploaded')
        this.fgbanner.controls[FileManager[i].fileidentifier].updateValueAndValidity()
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

  gettypemasterdetails() {
    this._webDService.gettypemaster().subscribe((restypeMaster: any) => {
      this.TypeMaster = [];
      this.TypeMaster = Array.isArray(restypeMaster.data) ? restypeMaster.data : [];
      this._cdr.detectChanges();
    });
  }
  getlabeldetails() {
    this._webDService.getlabelmaster('all').subscribe((reslabelMaster: any) => {
      this.LabelMaster = [];
      this.LabelMaster = Array.isArray(reslabelMaster.data) ? reslabelMaster.data : [];
      this._cdr.detectChanges();
    });
  }

  getcategorydetails(typemaster_id: any) {
    this._webDService.getcategory('all', typemaster_id).subscribe((rescategoryMaster: any) => {
      this.CategoryMaster = [];
      this.CategoryMaster = Array.isArray(rescategoryMaster.data) ? rescategoryMaster.data : [];
      this._cdr.detectChanges();
    });
  }
  onSelectionChange($event: any) {
    if ($event && $event != null && $event.length > 0) {
      this.isBannerDisable = $event[0].typemaster_id == 0
      let typemaster_id = $event && $event?.length > 0 ? $event[0]?.typemaster_id : 0;
      this._banner.lstcategory = [];
      this.fgbanner.controls['lstcategory'].setValue([]);
      this.getcategorydetails(typemaster_id);
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
