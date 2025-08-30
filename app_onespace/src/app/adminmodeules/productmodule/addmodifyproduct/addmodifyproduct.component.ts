import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
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
import { WebdmediauploadComponent } from '../../../layout_template/webdmediaupload/webdmediaupload.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-addmodifyproduct',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, WebdtexteditorComponent, MultiselectComponent, WebdmediauploadComponent, SweetAlert2Module, CommonModule],
  templateUrl: './addmodifyproduct.component.html',
  styleUrl: './addmodifyproduct.component.scss'
})
export class AddmodifyproductComponent {
  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  navigateBack() {
    this._base._router.navigate(["app/manageproduct"])
  }
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
  RouteCategoryMaster: any = [];
  PropertyCategoryMaster: any = [];
  BrandMaster: any = [];
  TimeSlotAttr: any = [];
  RepeAttr: any = [];
  IntervalAttr: any = [];
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

  public _configRouteCategory: IDropdownSettings = {
    singleSelection: true,
    idField: 'category_id',
    textField: 'category',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 5,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
  };

  public _configPropertyCategory: IDropdownSettings = {
    singleSelection: true,
    idField: 'category_id',
    textField: 'category',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 5,
    allowSearchFilter: true,
    closeDropDownOnSelection: true
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
  public _configTime: IDropdownSettings = {
    singleSelection: false,
    idField: 'option_value_id',
    textField: 'option_value',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  public _configRepe: IDropdownSettings = {
    singleSelection: false,
    idField: 'option_value_id',
    textField: 'option_value',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  public _configInterval: IDropdownSettings = {
    singleSelection: false,
    idField: 'option_value_id',
    textField: 'option_value',
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
      lstbrand: [''],
      base_price:[''],
      lsttimeattribute: [''],
      lstrepeattribute: [''],
      lstintervalattribute: [''],
      lsttimeattr: this._fbproductMaster.array([]),
      lstrepeattr: this._fbproductMaster.array([]),
      lstinterattr: this._fbproductMaster.array([]),
      lstcategoryroute: ['', [Validators.required]],
      lstpropertycategoryroute: ['', [Validators.required]],
      textarea: this._fbproductMaster.group({
        description: [''],
      })
    })
  }
  ngOnInit(): void {
    this.initForm();
    this.product_id = this._activatedRouter.snapshot.paramMap.get('product_id');
    this.getcategory('vehicle_type', 0);
    this.getcategory('selected_area', 0);
    this.getbrand();
    this.getoptionvalues('Time Slot').then((res: any) => {
      this.TimeSlotAttr = res;
    });
    this.getoptionvalues('Repetition').then((res: any) => {
      this.RepeAttr = res;
    });
    this.getoptionvalues('Interval').then((res: any) => {
      this.IntervalAttr = res;
    });
    if (this.product_id != '0') {
      this.getproductmaster(this.product_id);
    }
  }

  saveModuleFile_helper() {
    let fileData: Array<SaveModuleFileModel> = this._base._commonService.joinArray(this.getFilesInfo('thumbnail'))
    if (fileData.length > 0)
      this.saveModuleFile_multi_helper(fileData, fileData.length, [])
    else {
      this.addmodifyproductmaster(this.flagType);
    }
  }

  saveModuleFile_multi_helper(
    arrayData: Array<SaveModuleFileModel>,
    counter: number,
    resolveData: Array<any>
  ) {
    const currentItem: SaveModuleFileModel = arrayData[counter - 1];

    const fileIdentifier: string = currentItem.fileidentifier ?? '';
    const rawValue = this.fgproductmaster.controls[fileIdentifier]?.value;
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
          this._productMaster.filemanager = resolveData;
          this.addmodifyproductmaster(this.flagType);
        }
      });
  }

  getproductmaster(product_id: any) {
    return new Promise((resolve, reject) => {
      this._webDService.getproduct('Details', product_id).subscribe((resproductMaster: any) => {
        let productMaster = Array.isArray(resproductMaster.data) ? resproductMaster.data : [];
        debugger
        this._productMaster = productMaster[0];
        this.isProductModify = true;
        this.fgproductmaster.controls['product_name'].setValue(this._productMaster.product_name);
        this.fgproductmaster.get('textarea.description')?.setValue(this._productMaster.product_description);
        this.fgproductmaster.controls['lstcategory'].setValue(this._productMaster.lstcategory);
        this.fgproductmaster.controls['lstcategoryroute'].setValue(this._productMaster.lstcategoryroute);
        this.fgproductmaster.controls['lstpropertycategoryroute'].setValue(this._productMaster.lstpropertycategoryroute);
        this.fgproductmaster.controls['lsttimeattribute'].setValue(this._productMaster.lsttimeattribute);
        this.fgproductmaster.controls['lstrepeattribute'].setValue(this._productMaster.lstrepeattribute);
        this.fgproductmaster.controls['lstintervalattribute'].setValue(this._productMaster.lstintervalattribute);
        this.fgproductmaster.controls['lstbrand'].setValue(this._productMaster.lstbrand);
        this.fgproductmaster.controls['base_price'].setValue(this._productMaster.base_price);
        this.fgproductmaster.controls['isactive'].setValue(this._productMaster.isactive);
        this._productMaster.filemanager = Array.isArray(this._productMaster.filemanager) ? this._productMaster.filemanager : [];
        this._productMaster.lsttimeattribute?.filter((_res:any)=>{
          this.onSelectTime(_res);
        })
        this._productMaster.lstrepeattribute?.filter((_res:any)=>{
          this.onSelectRepe(_res);
        })
        this._productMaster.lstintervalattribute?.filter((_res:any)=>{
          this.onSelectInterval(_res);
        })
        this.initFilesUrl(this._productMaster.filemanager)
        resolve(true)
      }, error => {
        resolve(false);
      });
    });
  }

  flagType: any;
  setproductMaster(flag: any) {
    this.flagType = flag;
    this.isLoading$.next(true);
    this._base._commonService.markFormGroupTouched(this.fgproductmaster)
    if (this.fgproductmaster.valid) {
      this._base._encryptedStorage.get(enAppSession.client_id).then(client_id => {
        this._base._encryptedStorage.get(enAppSession.project_id).then(project_id => {
          debugger
          this._productMaster.product_name = this.fgproductmaster.value.product_name;
          this._productMaster.product_description = this.fgproductmaster.value.textarea.description;
          this._productMaster.lstcategory = this.fgproductmaster.value.lstcategory;
          this._productMaster.lstcategoryroute = this.fgproductmaster.value.lstcategoryroute;
          this._productMaster.lstpropertycategoryroute = this.fgproductmaster.value.lstpropertycategoryroute;
          this._productMaster.lsttimeattribute = this.fgproductmaster.value.lsttimeattr;
          this._productMaster.lstrepeattribute = this.fgproductmaster.value.lstrepeattr;
          this._productMaster.lstintervalattribute = this.fgproductmaster.value.lstinterattr;
          this._productMaster.base_price = this.fgproductmaster.value.base_price;
          this._productMaster.lstattribute = this._base._commonService.joinArray(this._productMaster.lsttimeattribute, this._productMaster.lstrepeattribute, this._productMaster.lstintervalattribute)
          this._productMaster.lstbrand = this.fgproductmaster.value.lstbrand;
          this._productMaster.isactive = this.fgproductmaster.value.isactive;
          this._productMaster.client_id = parseInt(client_id);
          this._productMaster.project_id = parseInt(project_id);
          // this.addmodifyproductmaster(this.flagType);
          this.saveModuleFile_helper();
        });
      });
    } else {
      setTimeout(() => {
        this.isLoading$.next(false);
        this._cdr.detectChanges();
      }, 1500);
    }
  }

  addmodifyproductmaster(flag: any) {
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
              this.successSwal.fire()
              setTimeout(() => {
                this._base._router.navigate(['/app/manageproduct']);
              }, 1500);
            }, 1000);
          }
        });
      });
    });
  }

  getcategory(flag: string = 'product_type', parent_id: number = 0) {
    this._webDService.getcategory('all', 0, flag, 0, 'null', false, parent_id).subscribe((rescategoryMaster: any) => {
      if (flag == 'vehicle_type' && parent_id == 0) {
        this.CategoryMaster = [];
        this.CategoryMaster = Array.isArray(rescategoryMaster.data) ? rescategoryMaster.data : [];
      } else if (flag == 'product_type' && parent_id > 0) {
        this.PropertyCategoryMaster = [];
        this.PropertyCategoryMaster = Array.isArray(rescategoryMaster.data) ? rescategoryMaster.data : [];
      } else if (flag == 'selected_area' && parent_id == 0) {
        this.RouteCategoryMaster = [];
        this.RouteCategoryMaster = Array.isArray(rescategoryMaster.data) ? rescategoryMaster.data : [];
      }
    });
  }

  getbrand() {
    return new Promise((resolve, rejects) => {
      this._webDService.getbrand('all').subscribe((resbrandMaster: any) => {
        this.BrandMaster = [];
        this.BrandMaster = Array.isArray(resbrandMaster.data) ? resbrandMaster.data : [];
        resolve(true)
      }, error => {
        resolve(false)
      })
    });
  }

  onCategory($event: any) {
    if ($event && $event != null && $event != '' && $event.length > 0) {
      this._productMaster.category_id = $event[0].category_id;
      this.getcategory('product_type', this._productMaster.category_id)
    }
  }
  onRouteCategory($event: any) {
    if ($event && $event != null && $event != '' && $event.length > 0) {
      this._productMaster.route_category_id = $event[0].category_id;
    }
  }
  onPropertyCategory($event: any) {
    if ($event && $event != null && $event != '' && $event.length > 0) {
      this._productMaster.property_category_id = $event[0].category_id;
    }
  }

  onBrand($event: any) {
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


  get timeArray(): FormArray {
    return this.fgproductmaster.get("lsttimeattr") as FormArray
  }

  get repetitionArray(): FormArray {
    return this.fgproductmaster.get("lstrepeattr") as FormArray
  }

  get intervalArray(): FormArray {
    return this.fgproductmaster.get("lstinterattr") as FormArray
  }

  onSelectTime($event: any) {
    if ($event && $event != null && $event != '') {
      debugger
      const _repre = this.TimeSlotAttr.filter((res:any)=> res.option_value_id == $event.option_value_id)
      let control: FormGroup = this._fbproductMaster.group({
        product_option_adj_id: [0],
        product_id: [0],
        option_value_id: [$event ? $event.option_value_id : 0],
        option_value: [$event ? $event.option_value : ''],
        price_delta: [$event ? $event?.price_delta :0],
      });
      this.timeArray.push(control);
    }
  }
  onDeSelectTime($event: any) {
    if ($event && $event != null && $event != '') {
      console.log("Deselect : ", $event);
      const _indexTime = this.timeArray.controls.findIndex((ctrl: any) => {
        return ctrl.value.option_value_id === $event?.option_value_id;
      });
      this.timeArray.removeAt(_indexTime);
    }
  }
  onSelectRepe($event: any) {
    if ($event && $event != null && $event != '') {
      debugger
      const _repre = this.RepeAttr.filter((res:any)=> res.option_value_id == $event.option_value_id)
      let control: FormGroup = this._fbproductMaster.group({
        product_option_adj_id: [0],
        product_id: [0],
        option_value_id: [$event ? $event.option_value_id : 0],
        option_value: [$event ? $event.option_value : ''],
        price_delta: [$event ? $event?.price_delta : 0],
      });
      this.repetitionArray.push(control);
    }
  }
  onDeSelectRepe($event: any) {
    if ($event && $event != null && $event != '') {
      console.log("Deselect : ", $event);
      const _indexTime = this.repetitionArray.controls.findIndex((ctrl: any) => {
        return ctrl.value.option_value_id === $event?.option_value_id;
      });
      this.repetitionArray.removeAt(_indexTime);
    }
  }

  onSelectInterval($event: any) {
    if ($event && $event != null && $event != '') {
      debugger
      const _intrvl = this.IntervalAttr.filter((res:any)=> res.option_value_id == $event.option_value_id)
      let control: FormGroup = this._fbproductMaster.group({
        product_option_adj_id: [0],
        product_id: [0],
        option_value_id: [$event ? $event.option_value_id : 0],
        option_value: [$event ? $event.option_value : ''],
        price_delta: [$event ? $event?.price_delta : 0],
      });
      this.intervalArray.push(control);
    }
  }
  onDeSelectInterval($event: any) {
    if ($event && $event != null && $event != '') {
      console.log("Deselect : ", $event);
      const _indexTime = this.intervalArray.controls.findIndex((ctrl: any) => {
        return ctrl.value.option_value_id === $event?.option_value_id;
      });
      this.intervalArray.removeAt(_indexTime);
    }
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  getoptionvalues(flag: string = 'Time Slot') {
    return new Promise((resolve, rejects) => {
      this._webDService.getoptionvalue(flag).subscribe((rescategoryMaster: any) => {
        let _optionvalues = [];
        _optionvalues = Array.isArray(rescategoryMaster.data) ? rescategoryMaster.data : [];

        resolve(_optionvalues)
      }, error => {
        resolve(false)
      })
    });
  }
}
