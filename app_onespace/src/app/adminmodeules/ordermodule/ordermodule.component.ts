import { ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { WebDService } from '../../_appservice/webdpanel.service';
import { enAppSession } from '../../_appmodel/sessionstorage';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModal, NgbModalModule, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ordermodule',
  standalone: true,
  imports: [RouterModule, CommonModule, NgbModalModule],
  templateUrl: './ordermodule.component.html',
  styleUrl: './ordermodule.component.scss'
})
export class OrdermoduleComponent {


  @ViewChild('VideoModal', { static: true }) VideoModal!: TemplateRef<any>;


  public get modalService(): NgbModal {
    return this._modalService;
  }
  public set modalService(value: NgbModal) {
    this._modalService = value;
  }
  public modalRef!: NgbModalRef;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    private _cdr: ChangeDetectorRef,
    private _modalService: NgbModal,) {
  }

  orderdetail: any = [];
  ngOnInit(): void {
    ``
    this.get_orderdetail();
  }

  selectedVideoUrl: string | null = null;
  openvideo(videoUrl: string) {
    this.selectedVideoUrl = videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4';
    this.modalRef = this.modalService.open(this.VideoModal, {
      size: 's',
      backdrop: true,
      centered: true
    });
  }
  get_orderdetail() {
    this._base._encryptedStorage.get(enAppSession.user_id).then((user_id: any) => {
      this._webDService.getpendingmediaupload(user_id, 0, 0).subscribe((resorderdetail: any) => {
        const dataArray = Array.isArray(resorderdetail.data) ? resorderdetail.data : [];
        this.orderdetail = dataArray.filter((item: any) => item.is_media_approved === 1);
        this._cdr.detectChanges();
      });
    });
  }
}
