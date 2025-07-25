import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SweetAlertOptions } from 'sweetalert2';
import { BaseServiceHelper } from '../../../_appservice/baseHelper.service';
import { WebDService } from '../../../_appservice/webdpanel.service';
import { ActivatedRoute } from '@angular/router';
import { fileChoosenDataModel, fileConfigModel, productMaster, SaveModuleFileModel } from '../../../_appmodel/_model';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { enAppSession } from '../../../_appmodel/sessionstorage';
import { WebdtexteditorComponent } from '../../../layout_template/webdtexteditor/webdtexteditor.component';
import { MultiselectComponent } from '../../../layout_template/multiselect/multiselect.component';

@Component({
  selector: 'app-addmodifyproduct',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,WebdtexteditorComponent, MultiselectComponent],
  templateUrl: './addmodifyproduct.component.html',
  styleUrl: './addmodifyproduct.component.scss'
})
export class AddmodifyproductComponent {
  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading!: boolean;
  private unsubscribe: Subscription[] = [];

  fgproductmaster!: FormGroup
  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    private _cdr: ChangeDetectorRef,
    public _fbproductMaster: FormBuilder,
    private _activatedRouter: ActivatedRoute) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
  }

   public productSubscribe!: Subscription;
  _productMaster: productMaster = {};
  product_id: any;
  CategoryMaster: any = [];
  BrandMaster: any = [];
  private isProductModify: boolean = false;

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
      ModuleType: 'product',
      ModuleID: 0,
      fileextension: '',
    }
  }

  public _configCategory: IDropdownSettings = {
    singleSelection: true,
    idField: 'category_id',
    textField: 'category',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  public _configBrand: IDropdownSettings = {
    singleSelection: true,
    idField: 'brand_id',
    textField: 'brand_name',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  initForm() {
    this.fgproductmaster = this._fbproductMaster.group({
      product_id: [''],
      product_name: ['', [Validators.required]],
      isactive: [true],
      thumbnail: [''],
      lstcategory: ['', [Validators.required]],
      lstbrand: ['', [Validators.required]],
      textarea: this._fbproductMaster.group({
        description: [''],
      })
    })
  }
  ngOnInit(): void {
    this.initForm();
    this.product_id = this._activatedRouter.snapshot.paramMap.get('product_id');
    this.getcategory();
    // this.getbrand();
    if (this.product_id != '0') {
      this.getproductmaster(this.product_id);
    }
  }

  // saveModuleFile_helper() {
  //   let fileData: Array<SaveModuleFileModel> = this._base._commonService.joinArray(this.getFilesInfo('thumbnail'))
  //   if (fileData.length > 0)
  //     this.saveModuleFile_multi_helper(fileData, fileData.length, [])
  //   else {
  //     this.addmodifyproductmaster(this.flagType);
  //   }
  // }

  // saveModuleFile_multi_helper(arrayData: Array<SaveModuleFileModel>, counter: number, resolveData: Array<any>) {
  //   this._base._commonService.saveModuleFile(arrayData[counter - 1].files, arrayData[counter - 1], this.fgproductmaster.controls[arrayData[counter - 1].fileidentifier].value).then((uploadResponse: Array<any>) => {
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
  //       this._productMaster.filemanager = resolveData
  //       this.addmodifyproductmaster(this.flagType);
  //     }
  //   })
  // }

  getproductmaster(product_id:any) {
    return new Promise((resolve, reject) => {
      this._webDService.getproduct('Details', product_id).subscribe((resproductMaster: any) => {
        let productMaster = Array.isArray(resproductMaster.data) ? resproductMaster.data : [];
        this._productMaster = productMaster[0];
        this.isProductModify = true;
        this.fgproductmaster.controls['product_name'].setValue(this._productMaster.product_name);
        // this.fgproductmaster.controls['textarea'].get('description').setValue(this._productMaster.product_description);
        this.fgproductmaster.controls['lstcategory'].setValue(this._productMaster.lstcategory);
        this.fgproductmaster.controls['lstbrand'].setValue(this._productMaster.lstbrand);
        this.fgproductmaster.controls['isactive'].setValue(this._productMaster.isactive);
        this._productMaster.filemanager = Array.isArray(this._productMaster.filemanager) ? this._productMaster.filemanager : [];
        this.initFilesUrl(this._productMaster.filemanager)
        resolve(true)
      }, error => {
        resolve(false);
      });
    });
  }

  flagType: any;
  setproductMaster(flag:any) {
    this.flagType = flag;
    this.isLoading$.next(true);
    this._base._commonService.markFormGroupTouched(this.fgproductmaster)
    if (this.fgproductmaster.valid) {
      this._base._encryptedStorage.get(enAppSession.client_id).then(client_id => {
        this._base._encryptedStorage.get(enAppSession.project_id).then(project_id => {
          this._productMaster.product_name = this.fgproductmaster.value.product_name;
          this._productMaster.product_description = this.fgproductmaster.value.textarea.description;
          this._productMaster.lstcategory = this.fgproductmaster.value.lstcategory;
          this._productMaster.lstbrand = this.fgproductmaster.value.lstbrand;
          this._productMaster.isactive = this.fgproductmaster.value.isactive;
          this._productMaster.client_id = parseInt(client_id);
          this._productMaster.project_id = parseInt(project_id);
           this.addmodifyproductmaster(this.flagType);
          // this.saveModuleFile_helper();
        });
      });
    } else {
      setTimeout(() => {
        this.isLoading$.next(false);
        this._cdr.detectChanges();
      }, 1500);
    }
  }

  addmodifyproductmaster(flag:any) {
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this._base._encryptedStorage.get(enAppSession.fullname).then(fullname => {
        this._productMaster.flag = this.isProductModify ? 'MODIFYPRODUCT' : 'NEWPRODUCT';
        this._productMaster.createdname = fullname;
        this._productMaster.user_id = parseInt(user_id);
        this._webDService.manageproduct(this._productMaster).subscribe((response: any) => {
          let isRedirect: boolean = true
          if (response === 'productexists') {
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
              this.successSwal.fire().then(() => {
                // Navigate to the list page after confirmation
                this._base._router.navigate(['/app/product/manageproduct']);
              });
            }, 1000);
          }
        });
      });
    });
  }

  getcategory() {
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

  // getbrand() {
  //   return new Promise((resolve, rejects) => {
  //     this._webDService.getbrand('all').subscribe((resbrandMaster: any) => {
  //       this.BrandMaster = [];
  //       this.BrandMaster = Array.isArray(resbrandMaster.data) ? resbrandMaster.data : [];
  //       resolve(true)
  //     }, error => {
  //       resolve(false)
  //     })
  //   });
  // }

  onCategory($event:any) {
    if ($event && $event != null && $event != '' && $event.length > 0) {
      this._productMaster.category_id = $event[0].category_id;
    }
  }

  onBrand($event:any) {
    if ($event && $event != null && $event != '' && $event.length > 0) {
      this._productMaster.brand_id = $event[0].brand_id;
    }
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
          ModuleID: this._productMaster.product_id,
          fileidentifier: FileManager[i].fileidentifier,
          ModuleType: 'product',
          fileextension: FileManager[i].fileextension,
        }
        this.fileChoosenData[FileManager[i].fileidentifier].push(filesData)
        this.fgproductmaster.controls[FileManager[i].fileidentifier].setValue('uploaded')
        this.fgproductmaster.controls[FileManager[i].fileidentifier].updateValueAndValidity()
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
