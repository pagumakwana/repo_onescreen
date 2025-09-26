import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { wallet_master, wallet_transaction, wallet_withdrawal } from '../../_appmodel/_model';
import { dataTableConfig, tableEvent } from '../../_appmodel/_componentModel';
import { WebdtableComponent } from '../../layout_template/webdtable/webdtable.component';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { WebDService } from '../../_appservice/webdpanel.service';
import { NgbModal, NgbModalModule, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { enAppSession } from '../../_appmodel/sessionstorage';
import settlements from 'razorpay/dist/types/settlements';
import { orderBy } from 'lodash';

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

  @ViewChild('approveSwal')
  public readonly approveSwal!: SwalComponent;

  @ViewChild('rejectSwal')
  public readonly rejectSwal!: SwalComponent;

  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  @ViewChild('requestsuccSwal')
  public readonly requestsuccSwal!: SwalComponent;

  @ViewChild('failureSwal')
  public readonly failureSwal!: SwalComponent;
  @ViewChild('pendingSwal')
  public readonly pendingSwal!: SwalComponent;
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
  _walletmaster: wallet_master = {};
  walletwidget: any = {};
  user_id: any;

  transactionMaster: any = [];
  withdrawalMaster: any = [];
  walletMaster: any = [];
  fgwallet!: FormGroup;

  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    public _fbwallet: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _modalService: NgbModal,
    private _activatedRouter: ActivatedRoute) { }

  ngOnInit(): void {
    this.initform();
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this.user_id = parseInt(user_id);
      this.getwalletwidget(this.user_id);
    });
    this.getwallettransaction();
    this.getwalletwithdrawal();
    this.getwalletmaster();

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
      //  { identifer: "", title: "Action", type: "buttonIcons", buttonIconList: [{ title: 'Edit', class: 'btn btn-primary btn-sm', iconClass: 'feather icon-edit' }, { title: 'Delete', class: 'btn btn-danger btn-sm', iconClass: 'feather icon-trash-2' }] },],
    ],
    isCustom: {
      current: 0,
      steps: 10,
      total: 0,
      callbackfn: this.getwallettransaction.bind(this)
    }
  }

  tableClick(dataItem: tableEvent) {
    if (dataItem.action?.type == 'link' || (dataItem.action?.type == 'buttonIcons' && dataItem.actionInfo.title == "Approve")) {
      console.log(dataItem.tableItem)
      this.approveRequest(dataItem.tableItem, 'approved');
    } else if (dataItem.action?.type == 'buttonIcons' && dataItem.actionInfo.title == "Reject") {
      this.approveRequest(dataItem.tableItem, 'rejected');
    }
  }
  wallettableConfig: dataTableConfig = {
    tableData: [],
    tableConfig: [
      { identifer: "createddatetime", title: "Date", type: "date" },
      { identifer: "contact_person_name", title: "Vendor Name", type: "text" },
      // { identifer: "is_approved", title: "Status", type: "text" }, // 👈 custom type
      { identifer: "createdname", title: "Requested Name", type: "text" },
      { identifer: "updatedname", title: "Updated Name", type: "text" },
      {
        identifer: "",
        title: "Action",
        type: "buttonIcons",
        buttonIconList: [
          { title: 'Approve', class: 'avtar avtar-s btn btn-primary', iconClass: 'fa fa-check' },
          { title: 'Reject', class: 'avtar avtar-s btn btn-danger', iconClass: 'fa fa-times' }
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
      // if (this.wallettableConfig?.isCustom) {
      //   this.wallettableConfig.isCustom.total = reswithdrawalMaster.count;
      // }
      // this.wallettableConfig.tableData = this.withdrawalMaster;
      // this.wallettableObj.initializeTable();
      this._cdr.detectChanges();
    });
  }

  getwalletwidget(user_id: any) {
    this._webDService.getwalletwidget(user_id).subscribe({
      next: (res: any) => {
        this.walletwidget = res?.data || {};
        console.log("walletwidget", this.walletwidget);
        this._cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error fetching dashboard data", err);
        this.walletwidget = {};
      }
    });
  }

  getwalletmaster() {
    this._webDService.getwalletmaster('all', 0, 0, 0).subscribe((reswalletMaster: any) => {
      this.walletMaster = reswalletMaster.data;
      this.walletMaster = Array.isArray(reswalletMaster.data) ? reswalletMaster.data : [];
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
        this._walletwithdrawal.wallet_master_id = this.walletMaster[0]?.wallet_master_id;
        this._walletwithdrawal.vendor_id = parseInt(user_id);
        this._walletwithdrawal.createdname = fullname;
        this._walletwithdrawal.createdby = parseInt(user_id);
        this._webDService.wallet_withdrawal_req(this._walletwithdrawal).subscribe({
          next: (response: any) => {
            if (response === 'Request accepted') {
              setTimeout(() => {
                this.requestsuccSwal.fire();
                setTimeout(() => {
                  this.requestsuccSwal.close()
                  location.reload();
                }, 1500);
              }, 1000);
            } else if (response === 'requestpending') {
              setTimeout(() => {
                this.pendingSwal.fire();
                setTimeout(() => {
                  this.pendingSwal.close();
                  location.reload();
                }, 1500);
              }, 1000);
            } else {
              setTimeout(() => {
                this.failureSwal.fire();
                setTimeout(() => {
                  this.failureSwal.close();
                  location.reload();
                }, 1500);
              }, 1000);
            }
          },
          error: () => {
            setTimeout(() => {
              this.failureSwal.fire();
              setTimeout(() => this.failureSwal.close(), 1500);
            }, 1000);
          }
        });
      });
    });
  }

  approveRequest(data: any, flag: string) {
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this._base._encryptedStorage.get(enAppSession.fullname).then(fullname => {

        this._walletwithdrawal = {};
        this._walletwithdrawal.withdrawal_request_id = parseInt(data);
        this._walletwithdrawal.wallet_master_id = this.walletMaster[0]?.wallet_master_id;
        this._walletwithdrawal.createdby = user_id;
        this._walletwithdrawal.createdname = fullname;
        this._walletwithdrawal.flag = flag;
        if (flag === 'approved') {
          this.approveSwal.fire().then((clicked) => {
            if (clicked.isConfirmed) {
              this._webDService.wallet_withdrawal_req(this._walletwithdrawal).subscribe((resStatus: any) => {
                if (resStatus === 'Approved') {
                  this.successSwal.fire();
                  setTimeout(() => {
                    this.successSwal.close();
                    location.reload();
                    this._cdr.detectChanges();
                  }, 500);
                }
              });
            }
          });
        } else if (flag === 'rejected') {
          this.rejectSwal.fire().then((clicked) => {
            if (clicked.isConfirmed) {
              this._webDService.wallet_withdrawal_req(this._walletwithdrawal).subscribe((response: any) => {
                if (response === 'Rejected') {
                  this.successSwal.fire();
                  setTimeout(() => {
                    this.successSwal.close();
                    location.reload();
                    this._cdr.detectChanges();
                  }, 500);
                }
              });
            }
          });
        }
      });
    });
  }
}
