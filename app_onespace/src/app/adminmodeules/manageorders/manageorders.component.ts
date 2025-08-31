import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { enAppSession } from '../../_appmodel/sessionstorage';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { WebDService } from '../../_appservice/webdpanel.service';

@Component({
  selector: 'app-manageorders',
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: './manageorders.component.html',
  styleUrl: './manageorders.component.scss'
})
export class ManageordersComponent implements OnInit {


  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    private _cdr: ChangeDetectorRef,) {
  }

  public pendingMedia :any=[];
  ngOnInit(): void {
    this.get_pendingmediaupload();
  }

  get_pendingmediaupload() {
    this._base._encryptedStorage.get(enAppSession.user_id).then((user_id:any) => {
      this._webDService.getpendingmediaupload(user_id, 0, 0).subscribe((respendingMedia: any) => {
        this.pendingMedia = respendingMedia.data;
        this.pendingMedia = Array.isArray(respendingMedia.data) ? respendingMedia.data : [];
        this._cdr.detectChanges();
      });
    });
  }
}
