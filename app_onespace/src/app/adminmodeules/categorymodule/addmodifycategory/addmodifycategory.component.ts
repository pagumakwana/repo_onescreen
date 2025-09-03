import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import * as _ from "lodash";
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { BaseServiceHelper } from '../../../_appservice/baseHelper.service';
import { WebDService } from '../../../_appservice/webdpanel.service';
import { ActivatedRoute } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { categoryMaster, fileChoosenDataModel, fileConfigModel, SaveModuleFileModel } from '../../../_appmodel/_model';
import { enAppSession } from '../../../_appmodel/sessionstorage';
import { MultiselectComponent } from '../../../layout_template/multiselect/multiselect.component';
import { CommonModule } from '@angular/common';
import { WebdtexteditorComponent } from '../../../layout_template/webdtexteditor/webdtexteditor.component';
import { WebdmediauploadComponent } from '../../../layout_template/webdmediaupload/webdmediaupload.component';

@Component({
  selector: 'app-addmodifycategory',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, MultiselectComponent, SweetAlert2Module, WebdtexteditorComponent, WebdmediauploadComponent],
  templateUrl: './addmodifycategory.component.html',
  styleUrl: './addmodifycategory.component.scss'
})
export class AddmodifycategoryComponent {
  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  navigateBack() {
    this._base._router.navigate(['/app/managecategory']);
  }

  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading!: boolean;
  fgcategorymaster!: FormGroup
  private unsubscribe: Subscription[] = [];

  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    public _fbCategoryMaster: FormBuilder,
    private _activatedRouter: ActivatedRoute,
    private _cdr: ChangeDetectorRef) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
  }

  public categorySubscribe!: Subscription;
  _categoryMaster: categoryMaster = {};
  aliasname: any;
  category_id: any;
  CategoryMaster: any = [];
  flagType: boolean = false;
  TypeMaster: any = [];
  private isTypeMasterModify: boolean = false;

  public _configType: IDropdownSettings = {
    singleSelection: true,
    idField: 'typemaster_id',
    textField: 'typemaster',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  public _configCat: IDropdownSettings = {
    singleSelection: true,
    idField: 'category_id',
    textField: 'category',
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
      ModuleType: 'category',
      ModuleID: 0,
      fileextension: undefined
    }
  }

  initform() {
    this.fgcategorymaster = this._fbCategoryMaster.group({
      category_id: [0],
      parent_category_id: [0],
      typemaster_id: [0, [Validators.required]],
      typemaster: [''],
      lsttypemaster: ['', [Validators.required]],
      lstparentcategory: [''],
      aliasname: [''],
      isfeatured: [false],
      thumbnail: [''],
      isactive: [true],
      displayorder: [0],
      category: ['', [Validators.required]],
      textarea: this._fbCategoryMaster.group({
        description: [''],
      })
    })
  }

  ngOnInit(): void {
    this.initform();
    this.category_id = this._activatedRouter.snapshot.paramMap.get('category_id');

    this.gettypemasterdetails().then((resType) => {
      if (resType) {
        this.getcategorydetails().then((resCatgeory) => {
          if (resCatgeory && this.category_id != '0') {
            this.getcategory(this.category_id);
          }
        });
      }
    });
    this.fgcategorymaster.controls['category'].valueChanges.subscribe((value: string) => {
      value = value.replace(/ /g, '-').toLowerCase().trim();
      value = value.replace(/&/g, 'and').toLowerCase().trim();
      value = value.replace(/\//g, 'or').toLowerCase().trim();
      value = value.replace(/\./g, '_').toLowerCase().trim();
      this.fgcategorymaster.controls['alisaname']?.setValue(value);
      this.fgcategorymaster.controls['alisaname']?.updateValueAndValidity()
    });
    setTimeout(() => {
      this._cdr.detectChanges();
    }, 250);
  }

  saveModuleFile_helper() {
    let fileData: Array<SaveModuleFileModel> = this._base._commonService.joinArray(this.getFilesInfo('thumbnail'))
    if (fileData.length > 0)
      this.saveModuleFile_multi_helper(fileData, fileData.length, [])
    else {
      this.addmodifycategoryMaster(this.flagType);
    }
  }

  saveModuleFile_multi_helper(
    arrayData: Array<SaveModuleFileModel>,
    counter: number,
    resolveData: Array<any>
  ) {
    const currentItem: SaveModuleFileModel = arrayData[counter - 1];

    const fileIdentifier: string = currentItem.fileidentifier ?? '';
    const rawValue = this.fgcategorymaster.controls[fileIdentifier]?.value;
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
          this._categoryMaster.filemanager = resolveData;
          this.addmodifycategoryMaster(this.flagType);
        }
      });
  }

  getcategory(category_id: any) {
    return new Promise((resolve, reject) => {
      this._webDService.getcategory('Details', 0, 'null', category_id, 'null', false, 0, 'null', parseInt('0'), parseInt('0')).subscribe((resCategoryMaster: any) => {
        let categoryMaster = Array.isArray(resCategoryMaster.data) ? resCategoryMaster.data : [];
        this._categoryMaster = categoryMaster[0];
        debugger
        this.isTypeMasterModify = true;
        this.fgcategorymaster.controls['category'].setValue(this._categoryMaster.category);
        this.fgcategorymaster.controls['isfeatured'].setValue(this._categoryMaster.isfeatured);
        this.fgcategorymaster.controls['isactive'].setValue(this._categoryMaster.isactive);
        this.fgcategorymaster.get('textarea.description')?.setValue(this._categoryMaster.description);
        this.fgcategorymaster.controls['aliasname'].setValue(this._categoryMaster.aliasname);
        this.fgcategorymaster.controls['category_id'].setValue(this._categoryMaster.category_id);
        this.fgcategorymaster.controls['parent_category_id'].setValue(this._categoryMaster.parent_category_id);
        this.fgcategorymaster.controls['typemaster_id'].setValue(this._categoryMaster.typemaster_id);
        this.fgcategorymaster.controls['typemaster'].setValue(this._categoryMaster.typemaster);
        this.fgcategorymaster.controls['displayorder'].setValue(this._categoryMaster.displayorder);
        this._categoryMaster.filemanager = Array.isArray(this._categoryMaster.filemanager) ? this._categoryMaster.filemanager : []
        this.fgcategorymaster.controls['lsttypemaster'].setValue(this._categoryMaster.lsttypemaster);
        this.fgcategorymaster.controls['lstparentcategory'].setValue(this._categoryMaster.lstparentcategory);
        this._categoryMaster.filemanager = Array.isArray(this._categoryMaster.filemanager) ? this._categoryMaster.filemanager : [];
        this.initFilesUrl(this._categoryMaster.filemanager)
        resolve(true)
      }, error => {
        resolve(false);
      });
    });
  }

  setcategoryMaster(flag: any) {
    this.flagType = flag;
    this.isLoading$.next(true);
    this._base._commonService.markFormGroupTouched(this.fgcategorymaster)
    if (this.fgcategorymaster.valid) {
      this._base._encryptedStorage.get(enAppSession.client_id).then(client_id => {
        this._base._encryptedStorage.get(enAppSession.project_id).then(project_id => {
          this._categoryMaster.category = this.fgcategorymaster.value.category;
          this._categoryMaster.description = this.fgcategorymaster.value.textarea.description;
          this._categoryMaster.aliasname = this.fgcategorymaster.value.aliasname;
          this._categoryMaster.isfeatured = this.fgcategorymaster.value.isfeatured;
          this._categoryMaster.isactive = this.fgcategorymaster.value.isactive;
          this._categoryMaster.displayorder = this.fgcategorymaster.value.displayorder;
          this._categoryMaster.category_id = this.fgcategorymaster.value.category_id;
          this._categoryMaster.parent_category_id = this.fgcategorymaster.value.parent_category_id;
          this._categoryMaster.typemaster_id = this.fgcategorymaster.value.typemaster_id;
          let typemaster = this._base._commonService.getDropDownText(this._categoryMaster.typemaster_id, this.TypeMaster, 'typemaster_id');
          this._categoryMaster.typemaster = typemaster ? typemaster.typemaster : '';
          this._categoryMaster.client_id = client_id;
          this._categoryMaster.project_id = project_id;

          this._categoryMaster.lsttypemaster = [];
          this.TypeMaster.filter((res: any) => {
            let index: number = _.findIndex(this.fgcategorymaster.value.lstsociety, (o: any) => {
              return o.typemaster_id == res.typemaster_id
            })
            if (index > -1) {
              this._categoryMaster.lsttypemaster.push(res);
            }
          });
          this._categoryMaster.lstparentcategory = [];
          this.TypeMaster.filter((res: any) => {
            let index: number = _.findIndex(this.fgcategorymaster.value.lstparentcategory, (o: any) => {
              return o.category_id == res.category_id
            })
            if (index > -1) {
              this._categoryMaster.lstparentcategory.push(res);
            }
          });
          this._categoryMaster.filemanager = []
          // this.addmodifycategoryMaster(flag);
          this.saveModuleFile_helper()
        });
      });
    }
  }
  addmodifycategoryMaster(flag: any) {
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this._base._encryptedStorage.get(enAppSession.fullname).then(fullname => {
        this._categoryMaster.flag = this.isTypeMasterModify ? 'MODIFYCATEGORY' : 'NEWCATEGORY';
        this._categoryMaster.createdname = fullname;
        this._categoryMaster.user_id = parseInt(user_id);
        this._webDService.category(this._categoryMaster).subscribe((response: any) => {
          debugger
          let isRedirect: boolean = true
          if (response === 'categoryexists') {
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
                this._base._router.navigate(['/app/managecategory']);
              }, 1500);
            }, 1000);
          }
        });
      });
    });
  }
  getcategorydetails() {
    return new Promise((resolve, rejects) => {
      this._webDService.getcategory('all').subscribe((rescategoryMaster: any) => {
        this.CategoryMaster = [];
        this.CategoryMaster = Array.isArray(rescategoryMaster.data) ? rescategoryMaster.data : [];

        resolve(true)
      }, error => {
        resolve(false)
      })
    });
  }
  gettypemasterdetails() {
    return new Promise((resolve, rejects) => {
      this._webDService.gettypemaster('all', 'null').subscribe((restypeMaster: any) => {
        debugger
        this.TypeMaster = [];
        this.TypeMaster = Array.isArray(restypeMaster.data) ? restypeMaster.data : [];

        resolve(true)
      }, error => {
        resolve(false)
      })
    });
  }

  onItemSelect($event: any) {
    if ($event && $event != null && $event != '' && $event.length > 0) {
      this.fgcategorymaster.controls['typemaster_id'].setValue($event[0]?.typemaster_id);
      this.fgcategorymaster.controls['typemaster'].setValue($event[0]?.typemaster);
    } else {
      this._categoryMaster.typemaster_id = 0;
      this._categoryMaster.typemaster = '';
    }
  }

  onSelectCat($event: any) {
    if ($event && $event != null && $event != '' && $event.length > 0) {
      this.fgcategorymaster.controls['parent_category_id'].setValue($event[0]?.category_id);
    } else {
      this.fgcategorymaster.controls['parent_category_id'].setValue(0);
      this._categoryMaster.parent_category_id = 0;
    }
  }

  initFilesUrl(FileManager: Array<any>) {
    console.log("initFileManager", FileManager)
    for (let i in FileManager) {
      // FileManager[i].FileIdentifier = FileManager[i].FileIdentifier == 'BigImage' ? 'thumbnail' : FileManager[i].FileIdentifier
      // FileManager[i].FileIdentifier = FileManager[i].FileIdentifier == 'ServiceVideo' ? 'ServiceVideoUrl' : FileManager[i].FileIdentifier
      if (FileManager[i].fileidentifier) {
        let filesData: fileChoosenDataModel = {
          file: null,
          thumb: this._base._commonService.cdnURL + FileManager[i].filepath,
          file_id: FileManager[i].file_id,
          displayorder: FileManager[i].displayorder,
          ModuleID: this._categoryMaster.category_id,
          fileidentifier: FileManager[i].fileidentifier,
          ModuleType: 'category',
          fileextension: FileManager[i].fileextension,
        }
        this.fileChoosenData[FileManager[i].fileidentifier].push(filesData)
        this.fgcategorymaster.controls[FileManager[i].fileidentifier].setValue('uploaded')
        this.fgcategorymaster.controls[FileManager[i].fileidentifier].updateValueAndValidity()
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
