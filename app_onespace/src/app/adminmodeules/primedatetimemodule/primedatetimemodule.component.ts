import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbDateParserFormatter, NgbDatepickerModule, NgbDateStruct, NgbInputDatepicker, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { WebdtableComponent } from '../../layout_template/webdtable/webdtable.component';
import { dataTableConfig, tableEvent } from '../../_appmodel/_componentModel';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { WebDService } from '../../_appservice/webdpanel.service';
import { SweetAlertOptions } from 'sweetalert2';
import { BehaviorSubject, Subscription } from 'rxjs';
import { enAppSession } from '../../_appmodel/sessionstorage';
import { datetimedetails } from '../../_appmodel/_model';
import { ValidationService } from '../../_appservice/validation.service';
import { NgbDateCustomParserFormatter } from '../../_appservice/dateformat';

@Component({
  selector: 'app-primedatetimemodule',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, WebdtableComponent, RouterModule, NgbDatepickerModule, SweetAlert2Module],
  templateUrl: './primedatetimemodule.component.html',
  styleUrl: './primedatetimemodule.component.scss',
  providers:[  { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }]
})
export class PrimedatetimemoduleComponent implements OnInit {

  @ViewChild('dataTableCom', { static: false }) tableObj!: WebdtableComponent;


  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  minDate: NgbDateStruct | null = null;

  @ViewChild("prime_date", { static: true }) prime_date!: NgbInputDatepicker;

  @ViewChild('deleteSwal')
  public readonly deleteSwal!: SwalComponent;

  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  _datetimedetails: datetimedetails = {};
  fgprimedate!: FormGroup;

  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    public _fbprimedate: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private modalService: NgbModal,) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);

    const current = new Date();
    this.minDate = { year: current.getFullYear(), month: current.getMonth() + 1, day: current.getDate() };
  }

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading!: boolean;
  private unsubscribe: Subscription[] = [];

  tableConfig: dataTableConfig = {
    tableData: [],
    displayPaging: true,
    tableTitle: 'Manage Prime Date',
    tableConfig: [
      // { identifer: "createddatetime", title: "Date", type: "date" },
      { identifer: "prime_date", title: "Prime Date", type: "date" },
      { identifer: "date_price", title: "Date Price", type: "text" },
      { identifer: "isactive", title: "Status", type: "status" },
      // { identifer: "product_description", title: "Description", type: "text" },
      { identifer: "", title: "Action", type: "buttonIcons", buttonIconList: [{ title: 'Delete', class: 'btn btn-danger btn-sm', iconClass: 'feather icon-trash-2' }] },],
    isCustom: {
      current: 0,
      steps: 10,
      total: 0,
      callbackfn: this.getprimedate.bind(this)
    }
  }

  primedateMaster: any = [];

  readonly DELIMITER = '-';
  toDateModel(date: NgbDateStruct | null): string | null {
    return date ? date.year + this.DELIMITER + date.month + this.DELIMITER + date.day : null;
  }

  ngOnInit(): void {
    this.initform();
    this.getprimedate();
  }

  initform() {
    this.fgprimedate = this._fbprimedate.group({
      date_id: [0],
      date_price: [0, Validators.required],
      prime_date: ['', Validators.required]
    });
  }

  getprimedate() {
    let obj = this._base._commonService.getcatalogrange(this.tableConfig?.isCustom?.steps, (this.tableConfig?.isCustom?.current ?? 0) + 1)
    let start = obj[obj.length - 1].replace(/ /g, '').split('-')[0];
    let end = obj[obj.length - 1].replace(/ /g, '').split('-')[1];
    this._webDService.getprimedate('all', 0, parseInt(start), parseInt(end)).subscribe((resprimedate: any) => {
      this.primedateMaster = [];
      this.primedateMaster = Array.isArray(resprimedate.data) ? resprimedate.data : [];
      if (this.tableConfig?.isCustom) {
        this.tableConfig.isCustom.total = resprimedate.count;
      }
      this.tableConfig.tableData = this.primedateMaster;
      this.tableObj.initializeTable();
      this._cdr.detectChanges();
    });
  }

  tableClick(dataItem: tableEvent) {
    if (dataItem?.action?.type == 'link' || (dataItem?.action?.type == 'buttonIcons' && dataItem.actionInfo.title == "Edit")) {
      this.modifyprimedate(dataItem.tableItem, 'MODIFYPRIMEDATE');
    } else if (dataItem?.action?.type == 'buttonIcons' && dataItem.actionInfo.title == "Delete") {
      this.modifyprimedate(dataItem.tableItem, 'DELETEPRODUCT');
    }
  }

  modifyprimedate(data: any, flag: any) {
    this._datetimedetails = data;
    this._datetimedetails.flag = flag;
    this._datetimedetails.date_id = data.date_id;
    if (flag == 'DELETEPRODUCT') {
      this.deleteSwal.fire().then((clicked) => {
        if (clicked.isConfirmed) {
          this._webDService.primedatdetails(this._datetimedetails).subscribe((response: any) => {
            if (response == 'deletesuccess') {
              this.primedateMaster.filter((res: any, index: number) => {
                if (res.date_id === this._datetimedetails.date_id) {
                  this.primedateMaster.splice(index, 1);
                  this.deleteSwal.close();
                  this._cdr.detectChanges();
                }
              });
            }
          }, error => {
            // this._base._alertMessageService.error("Something went wrong !!");
          });
        }
      });
    }
  }


  setprimedate(flag: any) {
    this.isLoading$.next(true);
    this._base._commonService.markFormGroupTouched(this.fgprimedate)
    if (this.fgprimedate.valid) {
      debugger
      this._datetimedetails.date_price = this.fgprimedate.value.date_price;
      this._datetimedetails.prime_date = this.toDateModel(this.fgprimedate.value.prime_date);
      this.addmodifyprimedate(flag);
    }
  }

  addmodifyprimedate(flag: any) {
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this._base._encryptedStorage.get(enAppSession.fullname).then(fullname => {
        this._datetimedetails.flag = 'ADDPRIMEDATE';
        this._datetimedetails.createdname = fullname;
        this._datetimedetails.user_id = parseInt(user_id);
        this._webDService.primedatdetails(this._datetimedetails).subscribe((response: any) => {
          let isRedirect: boolean = true
          if (response === 'newsuccess') {
            isRedirect = false;
            this.getprimedate();
          }
          this.isLoading$.next(false);
          this._cdr.detectChanges();
        });
      });
    });
  }


}
