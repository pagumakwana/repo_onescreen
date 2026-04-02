import { ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { WebDService } from '../../_appservice/webdpanel.service';
import { enAppSession } from '../../_appmodel/sessionstorage';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModalModule, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { dataTableConfig, tableEvent } from '../../_appmodel/_componentModel';
import { WebdtableComponent } from '../../layout_template/webdtable/webdtable.component';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-quotationmodule',
  standalone: true,
  imports: [RouterModule, CommonModule, NgbModalModule, WebdtableComponent, SweetAlert2Module],
  templateUrl: './quotationmodule.component.html',
  styleUrl: './quotationmodule.component.scss'
})
export class QuotationmoduleComponent {

  swalOptions: SweetAlertOptions = { buttonsStyling: false };
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
    tableTitle: 'Raised Quotation',
    tableConfig: [
      // { identifer: "createddatetime", title: "Date", type: "date" },
      // { identifer: "order_number", title: "Order#", type: "link" },
      { identifer: "fullname", title: "Fullname", type: "text" },
      { identifer: "quotation_number", title: "Quotation Number", type: "text" },
      { identifer: "sales_person_details", title: "Sales Person Details", type: "text" },
      { identifer: "referal_person_details", title: "Referal Person Details", type: "text" },
      { identifer: "quotation_total", title: "Total Amount", type: "text" },
      { identifer: "quotation_subtotal", title: "SubTotal Amount", type: "text" },
      { identifer: "quotation_discount", title: "Discount Amount", type: "text" },
      { identifer: "", title: "Action", type: "button", buttonList: [{ name: 'Move', class: 'btn btn-primary btn-sm', iconClass: '' }, { name: 'Download', class: 'btn btn-primary btn-sm', iconClass: ''}] },
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
    debugger
    const quotationNo = dataItem.tableItem?.quotation_id;
    if (dataItem.action?.type == 'button' && dataItem.actionInfo.name == "Move") {
      this.move_to_cart(quotationNo);
    } else if (dataItem.action?.type == 'button' && dataItem.actionInfo.name == "Download") {
      this.modifyinvoice(dataItem.tableItem);
    }
  }

  modifyinvoice(data: any) {
    const quotationNo = data?.quotation_number;
    window.open(
      `https://onespaceinterior.com/public/OneScreenReports/QUOTATION-${quotationNo}.pdf`,
      '_blank'
    );
    // this._base._router.navigate([`app/raisedquotation/${data.quotation_id}`]);
  }

  @ViewChild('movesuccessSwal')
  public readonly movesuccessSwal!: SwalComponent;
  move_to_cart(quotation_id: any) {
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this._base._encryptedStorage.get(enAppSession.fullname).then(full_name => {
        this._webDService.move_to_cart(quotation_id, 0, user_id).subscribe((resquote: any) => {
          if (resquote && resquote.includes('updatesuccess')) {
            this.movesuccessSwal.fire();
            setTimeout(() => {
              this.movesuccessSwal.close();
              this.getOderDetails();
              this._cdr.markForCheck();
            }, 1000);
          }
        });
      });
    });
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
      this._webDService.getquotedetails('all', 0, user_id, parseInt(start), parseInt(end)).subscribe((resquoteDetails: any) => {
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
