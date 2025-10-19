import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { fileChoosenDataModel, fileConfigModel } from '../../_appmodel/_model';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { ValidationService } from '../../_appservice/validation.service';

@Component({
  selector: 'webd-mediauploader',
  standalone: true,
  imports: [ CommonModule,
    ReactiveFormsModule,
    FormsModule],
  templateUrl: './webdmediaupload.component.html',
  styleUrl: './webdmediaupload.component.scss'
})
export class WebdmediauploadComponent implements OnInit {


  constructor(public _base: BaseServiceHelper, private fb: FormBuilder, private _cdr: ChangeDetectorRef) { this.fb.control('') }

  @Input() fileChoosenData: Array<fileChoosenDataModel> = [];
  @Input() controlObject!: FormControl | undefined;
  @Input() fileConfig!: fileConfigModel;
  @Input() Title: string = '';
  @Input() FileArrayIdentifier: any;
  @Input() FileUploaderIndex: any;
  @Input() subidentifier: any;
  fileData: any;
  ngOnInit(): void {
    // this._base._scriptLoaderService.loadScripts("scriptupload", ["../../../assets/plugins/file-upload-with-preview.min.js"], false)

  }

  getFileControlValue() {
    let returnKey: string | null = null
    if (this.fileChoosenData.length > 0) {
      let waitingUpload = this.fileChoosenData.filter(item => item.file_id == null)
      returnKey = waitingUpload.length > 0 ? 'upload' : 'uploaded'
    }
    return returnKey
  }

  removeFile(fileIndex: any) {

    if ( this.fileChoosenData[fileIndex]?.file_id != null &&
      this.fileChoosenData[fileIndex]?.file_id > 0)
      this.removeThumbnail(this.fileChoosenData[fileIndex].file_id)

    this.fileChoosenData.splice(fileIndex, 1)
    this.controlObject?.setValue(this.getFileControlValue())
    this._cdr.detectChanges();
  }

  removeThumbnail(ref_image_id: any) {
    this._base._commonService.removeFile(ref_image_id).subscribe((res: any) => {
      if (res == 'success') {
        // this._base._alertMessageService.success('File removed successfully!');
      } else {
        // this._base._alertMessageService.error('Something went wrong!');
      }
    })
  }

  fileChoosen($event:any) {
    debugger
    if ($event.target.files.length > 0) {
      let isValid: boolean = false
      for (let file of $event.target.files) {
        const fileType = this.fileConfig.fileValidationInfo?.fileType || [];
        const size = this.fileConfig.fileValidationInfo?.size || 0;

        if (ValidationService.ValidateFileType_Helper(file, fileType)) {
          if (ValidationService.ValidateFileSize_Helper(file, size)) {
            isValid = true
            this.controlObject?.setValue('upload')
            this.controlObject?.updateValueAndValidity()
            this._base._commonService.readImage(file).subscribe((res: any) => {

              let imgData: fileChoosenDataModel = { file: file, thumb: res, file_id: 0, displayorder: 0, ModuleType: this.fileConfig.ModuleType, fileidentifier: this.fileConfig.fileidentifier, ModuleID: this.fileConfig.ModuleID, fileextension: this.fileConfig.fileextension, }

              this.fileChoosenData.push(imgData);
              setTimeout(() => {
                
                this._cdr.detectChanges();
              }, 200);
            })
          }
        }

        if (!isValid) {
          // this._base._alertMessageService.error(`${file.name} is Invalid`)
        }

      }



    }
  }
}
