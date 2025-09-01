import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { enAppSession } from '../../_appmodel/sessionstorage';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { WebDService } from '../../_appservice/webdpanel.service';
import { NgbModal, NgbModalModule, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-manageorders',
  standalone: true,
  imports: [RouterModule, CommonModule, NgbModalModule, FormsModule, ReactiveFormsModule],
  templateUrl: './manageorders.component.html',
  styleUrl: './manageorders.component.scss'
})
export class ManageordersComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal!: TemplateRef<any>;

  public modalRef!: NgbModalRef;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    private _cdr: ChangeDetectorRef,
    private modalService: NgbModal,) {
  }

  public pendingMedia: any = [];
  ngOnInit(): void {
    this.get_pendingmediaupload();
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
  get_pendingmediaupload() {
    this._base._encryptedStorage.get(enAppSession.user_id).then((user_id: any) => {
      this._webDService.getpendingmediaupload(user_id, 0, 0).subscribe((respendingMedia: any) => {
        this.pendingMedia = respendingMedia.data;
        this.pendingMedia = Array.isArray(respendingMedia.data) ? respendingMedia.data : [];
        this._cdr.detectChanges();
      });
    });
  }

  media_approved(order_product_map_id: number, status: number, comment: string = '') {
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this._base._encryptedStorage.get(enAppSession.fullname).then(full_name => {
        const payload = {
          order_product_map_id: order_product_map_id,
          is_media_approved: status,
          media_comments: comment,
          createdby: user_id,     
          createdname: full_name, 
        };

        this._webDService.media_status_update(payload).subscribe({
          next: (res: any) => {
            console.log("Media status updated:", res);
            this.get_pendingmediaupload();
            this.modalRef?.close();
            if (this.modalRef) {
            this.modalRef.close();
          }
          },
          error: (err) => {
            console.error("Failed to update media status:", err);
          }
        });
      });
    });
  }


}
