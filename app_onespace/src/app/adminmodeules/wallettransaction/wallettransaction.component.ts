import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { wallet_transaction, wallet_withdrawal } from '../../_appmodel/_model';
import { dataTableConfig } from '../../_appmodel/_componentModel';
import { WebdtableComponent } from '../../layout_template/webdtable/webdtable.component';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { WebDService } from '../../_appservice/webdpanel.service';
import { NgbModal, NgbModalModule, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { enAppSession } from '../../_appmodel/sessionstorage';

@Component({
  selector: 'app-wallettransaction',
  standalone: true,
  imports: [CommonModule, RouterModule, SweetAlert2Module, NgbModalModule, FormsModule, ReactiveFormsModule, WebdtableComponent],
  templateUrl: './wallettransaction.component.html',
  styleUrl: './wallettransaction.component.scss'
})
export class WallettransactionComponent {
  @ViewChild('dataTableCom', { static: false }) tableObj!: WebdtableComponent;
  @ViewChild('walletdataTableCom', { static: false }) wallettableObj!: WebdtableComponent;
  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  @ViewChild('removecouponSwal')
  public readonly removecouponSwal!: SwalComponent;

  @ViewChild('deleteSwal')
  public readonly deleteSwal!: SwalComponent;

  @ViewChild('delsuccessSwal')
  public readonly delsuccessSwal!: SwalComponent;

  @ViewChild('invalidcodeSwal')
  public readonly invalidcodeSwal!: SwalComponent;

  @ViewChild('failureSwal')
  public readonly failureSwal!: SwalComponent;
  @ViewChild('paysuccessSwal')
  public readonly paysuccessSwal!: SwalComponent;
  @ViewChild('formModal', { static: true }) formModal!: TemplateRef<any>;

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

  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  _wallettransaction: wallet_transaction = {};
  _walletwithdrawal: wallet_withdrawal = {};

  transactionMaster: any = [];
  withdrawalMaster: any = [];
  fgwallet!: FormGroup;

  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    public _fbwallet: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _modalService: NgbModal,) { }

  ngOnInit(): void {
    this.initform();
    this.getwallettransaction();
    this.getwalletwithdrawal();
  }

  initform() {
    this.fgwallet = this._fbwallet.group({
      amount: ['']
    })
  }
  openModal() {
    this.modalRef = this.modalService.open(this.formModal, {
      size: 's',
      backdrop: true,
      centered: true
    });
  }

  tableConfig: dataTableConfig = {
    tableData: [],
    tableConfig: [
      { identifer: "createddatetime", title: "Date", type: "date" },
      { identifer: "previous_balance", title: "Previous Balance", type: "text" },
      { identifer: "transaction_amount", title: "Transaction Amount", type: "text" },
      { identifer: "wallet_balance_amt", title: "Balance Amount", type: "text" },
      { identifer: "wallet_balance_amt", title: "Order Number", type: "text" },
      // { identifer: "", title: "Action", type: "buttonIcons", buttonIconList: [{ title: 'Edit', class: 'avtar avtar-s btn btn-primary', iconClass: 'ti ti-pencil' }, { title: 'Delete', class: 'avtar avtar-s btn btn-danger', iconClass: 'ti ti-trash' }] },
    ],
    isCustom: {
      current: 0,
      steps: 10,
      total: 0,
      callbackfn: this.getwallettransaction.bind(this)
    }
  }

  // wallettableConfig: dataTableConfig = {
  //   tableData: [],
  //   tableConfig: [
  //     { identifer: "createddatetime", title: "Date", type: "date" },
  //     { identifer: "contact_person_name", title: "Vendor Name", type: "text" },
  //     { identifer: "is_approved", title: "Status", type: "text" },
  //     { identifer: "createdname", title: "Requested Name", type: "text" },
  //     { identifer: "updatedname", title: "Updated Name", type: "text" },
  //     { identifer: "", title: "Action", type: "buttonIcons", buttonIconList: [{ title: 'Apporve', class: 'avtar avtar-s btn btn-primary', iconClass: 'ti ti-pencil' }, { title: 'Reject', class: 'avtar avtar-s btn btn-danger', iconClass: 'ti ti-trash' }] },],

  //   isCustom: {
  //     current: 0,
  //     steps: 10,
  //     total: 0,
  //     callbackfn: this.getwalletwithdrawal.bind(this)
  //   }
  // }

  wallettableConfig: dataTableConfig = {
    tableData: [],
    tableConfig: [
      { identifer: "createddatetime", title: "Date", type: "date" },
      { identifer: "contact_person_name", title: "Vendor Name", type: "text" },
      { identifer: "is_approved", title: "Status", type: "statusIcon" }, // 👈 custom type
      { identifer: "createdname", title: "Requested Name", type: "text" },
      { identifer: "updatedname", title: "Updated Name", type: "text" },
      {
        identifer: "",
        title: "Action",
        type: "buttonIcons",
        buttonIconList: [
          { title: 'Approve', class: 'avtar avtar-s btn btn-primary', iconClass: 'ti ti-pencil' },
          { title: 'Reject', class: 'avtar avtar-s btn btn-danger', iconClass: 'ti ti-trash' }
        ]
      }
    ],
    isCustom: {
      current: 0,
      steps: 10,
      total: 0,
      callbackfn: this.getwalletwithdrawal.bind(this)
    }
  };

  getwallettransaction() {
    let obj = this._base._commonService.getcatalogrange(this.tableConfig?.isCustom?.steps, (this.tableConfig?.isCustom?.current ?? 0) + 1)
    let start = obj[obj.length - 1].replace(/ /g, '').split('-')[0];
    let end = obj[obj.length - 1].replace(/ /g, '').split('-')[1];
    this._webDService.getwallet_transaction('all', 0, parseInt(start), parseInt(end)).subscribe((restransactionMaster: any) => {
      this.transactionMaster = restransactionMaster.data;
      this.transactionMaster = Array.isArray(restransactionMaster.data) ? restransactionMaster.data : [];
      if (this.tableConfig?.isCustom) {
        this.tableConfig.isCustom.total = restransactionMaster.count;
      }
      this.tableConfig.tableData = this.transactionMaster;
      this.tableObj.initializeTable();
      this._cdr.detectChanges();
    });
  }

  getwalletwithdrawal() {
    let obj = this._base._commonService.getcatalogrange(this.wallettableConfig?.isCustom?.steps, (this.wallettableConfig?.isCustom?.current ?? 0) + 1)
    let start = obj[obj.length - 1].replace(/ /g, '').split('-')[0];
    let end = obj[obj.length - 1].replace(/ /g, '').split('-')[1];
    this._webDService.getwithdrawal_request('all', 0, parseInt(start), parseInt(end)).subscribe((reswithdrawalMaster: any) => {
      this.withdrawalMaster = reswithdrawalMaster.data;
      this.withdrawalMaster = Array.isArray(reswithdrawalMaster.data) ? reswithdrawalMaster.data : [];
      if (this.wallettableConfig?.isCustom) {
        this.wallettableConfig.isCustom.total = reswithdrawalMaster.count;
      }
      this.wallettableConfig.tableData = this.withdrawalMaster;
      this.wallettableObj.initializeTable();
      this._cdr.detectChanges();
    });
  }

  setamount(flag: any) {
    this._base._commonService.markFormGroupTouched(this.fgwallet)
    if (this.fgwallet.valid) {
      this._base._encryptedStorage.get(enAppSession.client_id).then(client_id => {
        this._base._encryptedStorage.get(enAppSession.project_id).then(project_id => {
          this._walletwithdrawal.amount = this.fgwallet.value.amount;
          this._walletwithdrawal.client_id = parseInt(client_id);
          this._walletwithdrawal.project_id = parseInt(project_id);
          this.addmodifyamount(flag);
        });
      });
    }
  }

  addmodifyamount(flag: any) {
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this._base._encryptedStorage.get(enAppSession.fullname).then(fullname => {
        this._walletwithdrawal.flag = 'request'
        this._walletwithdrawal.createdname = fullname;
        this._walletwithdrawal.createdby = parseInt(user_id);
        this._webDService.wallet_withdrawal_req(this._walletwithdrawal).subscribe((response: any) => {
          let isRedirect: boolean = true
          if (response === 'Request accepted') {
            isRedirect = false;
          }

          if (isRedirect && flag) {
            setTimeout(() => {
              // this.saveSwal.fire()
              setTimeout(() => {
                this._base._router.navigate(['/app/manageproduct']);
                location.reload();
              }, 1500);
            }, 1000);
          }
        });
      });
    });
  }
}
