import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgbModal, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { WebdmediauploadComponent } from '../layout_template/webdmediaupload/webdmediaupload.component';
import { enAppSession } from '../_appmodel/sessionstorage';
import { fileChoosenDataModel, fileConfigModel, media_upload, SaveModuleFileModel } from '../_appmodel/_model';
import { BaseServiceHelper } from '../_appservice/baseHelper.service';
import { WebDService } from '../_appservice/webdpanel.service';
import { SweetAlertOptions } from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-thankyoumodule',
  standalone: true,
  imports: [RouterModule, SweetAlert2Module, CommonModule, FormsModule, ReactiveFormsModule, WebdmediauploadComponent],
  templateUrl: './thankyoumodule.component.html',
  styleUrl: './thankyoumodule.component.scss'
})
export class ThankyoumoduleComponent implements OnInit {

  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    private _cdr: ChangeDetectorRef,
    public _fbmedia: FormBuilder,
    private _activatedRouter: ActivatedRoute,
    private _modalService: NgbModal,
    private http: HttpClient) {
  }

  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;
  @ViewChild('uploadsuccessSwal')
  public readonly uploadsuccessSwal!: SwalComponent;


  swalOptions: SweetAlertOptions = { buttonsStyling: false };

  public get modalService(): NgbModal {
    return this._modalService;
  }
  public set modalService(value: NgbModal) {
    this._modalService = value;
  }

  @ViewChild('formModal', { static: true }) formModal!: TemplateRef<any>;
  @ViewChild('formMediaModal', { static: true }) formMediaModal!: TemplateRef<any>;

  @ViewChild('VideoModal', { static: true }) VideoModal!: TemplateRef<any>;


  fileChoosenData: { [key: string]: Array<fileChoosenDataModel> } = {
    thumbnail: []
  }

  fileConfig: { [key: string]: fileConfigModel } = {
    thumbnail: {
      fileValidationInfo: {
        fileType: ['video/mp4'],
        size: 104857600 //100mb
      },
      isMulti: true,
      fileidentifier: 'thumbnail',
      ModuleType: 'orders',
      ModuleID: 0,
      fileextension: '',
    }
  }

  public modalRef!: NgbModalRef;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };

  _media_upload: media_upload = {}
  order_id: any = 0;
  public pendingMedia: any = [];
  ngOnInit(): void {
    this.order_id = this._activatedRouter.snapshot.paramMap.get('order_id');
    this.get_pendingmediaupload(this.order_id);
  }

  selectedOrderId: number = 0;
  rejectComment: string = '';
  openModal(order_product_map_id: number) {
    this.selectedOrderId = order_product_map_id;
    this.rejectComment = '';
    this.modalRef = this.modalService.open(this.formModal, {
      size: 's',
      backdrop: true,
      centered: true
    });
  }

  get_pendingmediaupload(order_id: any = 0) {
    this._base._encryptedStorage.get(enAppSession.user_id).then((user_id: any) => {
      if(user_id==undefined || user_id==null || user_id==''){
        user_id = 0;
      }
      this._webDService.getpendingmediaupload(user_id, order_id || 0, 0, 0).subscribe((respendingMedia: any) => {
        this.pendingMedia = respendingMedia.data;
        this.pendingMedia = Array.isArray(respendingMedia.data) ? respendingMedia.data : [];
        this._cdr.detectChanges();
      });
    });
  }


  fgmedia!: FormGroup
  initiForm() {
    this.fgmedia = this._fbmedia.group({
      order_product_map_id: [0],
      thumbnail: ['']
    })
  }
  open_upload_media(order_product_map_id: number) {
    this.initiForm();
    this.selectedOrderId = order_product_map_id;

    this.modalRef = this.modalService.open(this.formMediaModal, {
      size: 's',
      backdrop: true,
      centered: true
    });
  }
  saveModuleFile_helper() {
    debugger
    let fileData: Array<SaveModuleFileModel> = this._base._commonService.joinArray(this.getFilesInfo('thumbnail'))
    if (fileData.length > 0)
      this.saveModuleFile_multi_helper(fileData, fileData.length, [])
    else {
      this.addmedia();
    }
  }

  saveModuleFile_multi_helper(
    arrayData: Array<SaveModuleFileModel>,
    counter: number,
    resolveData: Array<any>
  ) {
    const currentItem: SaveModuleFileModel = arrayData[counter - 1];

    const fileIdentifier: string = currentItem.fileidentifier ?? '';
    const rawValue = this.fgmedia.controls[fileIdentifier]?.value;
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
          this._media_upload.filemanager = resolveData;
          this._media_upload.thumbnail = resolveData[0]?.filepath;
          this.addmedia();
        }
      });
  }

  upload_media() {
    debugger
    this._base._commonService.markFormGroupTouched(this.fgmedia)
    if (this.fgmedia.valid) {
      this._media_upload.order_product_map_id = this.selectedOrderId;
      this._media_upload.filemanager = []
      this.saveModuleFile_helper()
    }
  }

  addmedia() {
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this._base._encryptedStorage.get(enAppSession.fullname).then(fullname => {
        this._media_upload.createdname = fullname;
        this._media_upload.createdby = parseInt(user_id);
        this._webDService.media_upload(this._media_upload).subscribe((response: any) => {
          let isRedirect: boolean = true
          if (response === 'newsuccess') {
            this.uploadsuccessSwal?.fire()
            setTimeout(() => {
              this.uploadsuccessSwal?.close();
              if (this.modalRef) {
                this.modalRef.close();
              }
              location.reload();
            }, 500);
            this._cdr.detectChanges();
            isRedirect = false;
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
          ModuleID: this._media_upload.order_product_map_id,
          fileidentifier: FileManager[i].fileidentifier,
          ModuleType: 'product_media',
          fileextension: FileManager[i].fileextension,
        }
        this.fileChoosenData[FileManager[i].fileidentifier].push(filesData)
        this.fgmedia.controls[FileManager[i].fileidentifier].setValue('uploaded')
        this.fgmedia.controls[FileManager[i].fileidentifier].updateValueAndValidity()
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

  // viewinvoice() {
  //   this._base._router.navigate([`/app/invoice/${this.order_id}`]);
  // }

  viewinvoice() {
  this._base._router.navigate(['app','invoice',this.order_id])
}
  selectedVideoUrl: string | null = null;
  openvideo(videoUrl: string) {
    this.selectedVideoUrl = videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4';
    this.modalRef = this.modalService.open(this.VideoModal, {
      size: 'l',
      backdrop: true,
      centered: true
    });
    console.log("video", this.selectedVideoUrl);
  }

}
