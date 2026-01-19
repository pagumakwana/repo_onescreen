import { ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { WebDService } from '../../_appservice/webdpanel.service';
import { enAppSession } from '../../_appmodel/sessionstorage';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModalModule, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { dataTableConfig, tableEvent } from '../../_appmodel/_componentModel';
import { WebdtableComponent } from '../../layout_template/webdtable/webdtable.component';

@Component({
  selector: 'app-leadsmodule',
  standalone: true,
  imports: [RouterModule, CommonModule, NgbModalModule, WebdtableComponent],
  templateUrl: './leadsmodule.component.html',
  styleUrl: './leadsmodule.component.scss'
})
export class LeadsmoduleComponent {

  @ViewChild('VideoModal', { static: true }) VideoModal!: TemplateRef<any>;
  @ViewChild('dataTableCom', { static: false }) tableObj!: WebdtableComponent;
  userdashboard: any = {};
  quoteDetails: any = [];

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
    private _modalService: NgbModal,
    private _router: Router) {
  }

  orderdetail: any = [];

  ngOnInit(): void {

    this.getOderDetails();
  }

  tableConfig: dataTableConfig = {
    tableData: [],
    displayPaging: true,
    tableTitle: 'New Leads',
    tableConfig: [
      // { identifer: "createddatetime", title: "Date", type: "date" },
      // { identifer: "order_number", title: "Order#", type: "link" },
      { identifer: "name", title: "Fullname", type: "text" },
      { identifer: "mobile_number", title: "Mobile Number", type: "text" },
      { identifer: "location", title: "Location", type: "text" },
      { identifer: "additional_details", title: "Additional Details", type: "text" },
    ],
    isCustom: {
      current: 0,
      steps: 10,
      total: 0,
      callbackfn: this.getOderDetails.bind(this)
    }
  }

  // tableClick(dataItem: tableEvent) {
  //   if (dataItem?.action?.type == 'link' || (dataItem?.action?.type == 'buttonIcons' && dataItem.actionInfo.title == "View")) {
  //      this._router.navigate(['/app/uploadmedia',dataItem?.tableItem?.order_id]);
  //   }
  // }

  tableClick(dataItem: tableEvent) {
    if (dataItem.action?.type == 'link' || (dataItem.action?.type == 'buttonIcons' && dataItem.actionInfo.title == "View")) {
      this.modifyinvoice(dataItem.tableItem);
    } else if (dataItem.action?.type == 'buttonIcons' && dataItem.actionInfo.title == "Delete") {
      this.modifyinvoice(dataItem.tableItem);
    }
  }

  modifyinvoice(data: any) {
    this._base._router.navigate([`app/raisedquotation/${data.quotation_id}`]);
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

  getOderDetails() {
    this._base._encryptedStorage.get(enAppSession.user_id).then((user_id: any) => {


      let obj = this._base._commonService.getcatalogrange(this.tableConfig?.isCustom?.steps, (this.tableConfig?.isCustom?.current ?? 0) + 1)
      let start = obj[obj.length - 1].replace(/ /g, '').split('-')[0];
      let end = obj[obj.length - 1].replace(/ /g, '').split('-')[1];
      this._webDService.getleads('all', 0,parseInt(start), parseInt(end)).subscribe((resquoteDetails: any) => {
        this.quoteDetails = [];
        this.quoteDetails = Array.isArray(resquoteDetails.data) ? resquoteDetails.data : [];
        if (this.tableConfig?.isCustom) {
          this.tableConfig.isCustom.total = resquoteDetails.count;
        }
        this.tableConfig.tableData = this.quoteDetails;
        this.tableObj.initializeTable();
        this._cdr.detectChanges();
      });
    });
  }
}
