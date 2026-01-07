import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { WebdtableComponent } from '../../layout_template/webdtable/webdtable.component';
import { dataTableConfig } from '../../_appmodel/_componentModel';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { WebDService } from '../../_appservice/webdpanel.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { productMaster, userorderproductModel } from '../../_appmodel/_model';
import { NgbDateParserFormatter, NgbDateStruct, NgbInputDatepicker, NgbModal, NgbModalOptions, NgbModalRef, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from '../../_appservice/dateformat';

@Component({
  selector: 'app-screenbooking',
  standalone: true,
  imports: [CommonModule, WebdtableComponent, NgbModule, FormsModule, ReactiveFormsModule],
  templateUrl: './screenbooking.component.html',
  styleUrl: './screenbooking.component.scss',
  providers: [
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter }
  ],
})
export class ScreenbookingComponent {
  @ViewChild('dataTableCom', { static: false }) tableObj!: WebdtableComponent;
  @ViewChild("selection_date", { static: true }) from_date!: NgbInputDatepicker;

  productMaster: any = [];
  orderProduct: any = [];
  _productMaster: productMaster = {}
  _orderproduct: userorderproductModel = {}

  fgproduct!: FormGroup;
  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    public _fbcoupon: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _fb: FormBuilder) { }

  tableConfig: dataTableConfig = {
    tableData: [],
    displayPaging:true,
    tableTitle: 'Booking Details',
    tableConfig: [
      { identifer: "createddatetime", title: "Date", type: "date" },
      { identifer: "timeslot_category", title: "From Date", type: "text" },
      { identifer: "from_date", title: "From Date", type: "date" },
      { identifer: "to_date", title: "To Date", type: "date" },
      { identifer: "interval_category", title: "Interval", type: "text" },
      { identifer: "repetition_category", title: "Repetition", type: "text" },
      { identifer: "isactive", title: "Status", type: "status" },
      // { identifer: "product_description", title: "Description", type: "text" },
      // { identifer: "", title: "Action", type: "buttonIcons", buttonIconList: [{ title: 'Edit', class: 'btn btn-primary btn-sm', iconClass: 'feather icon-edit' }, { title: 'Delete', class: 'btn btn-danger btn-sm', iconClass: 'feather icon-trash-2' }] },],
    ], isCustom: {
      current: 0,
      steps: 10,
      total: 0,
      callbackfn: this.getproductMaster.bind(this)
    }
  }

  ngOnInit(): void {
    this.initForm()
    this.getproductMaster();
  }

  initForm() {
    this.fgproduct = this._fb.group({
     search_date: ['']
    })

     const today = new Date();
    const currentDate: NgbDateStruct = {
      year: today.getFullYear(),
      month: today.getMonth() + 1,
      day: today.getDate()
    };
    this.fgproduct.controls['search_date'].setValue(currentDate);
  }

  formatDate(date: NgbDateStruct | null): string | null {
    if (!date) return null;
    const { year, month, day } = date;
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  getproductMaster() {
    const search_date = this.formatDate(this.fgproduct.get('search_date')?.value);

    this._webDService.getorderproduct(search_date || "").subscribe((resorderProduct: any) => {
      this.orderProduct = Array.isArray(resorderProduct.data) ? resorderProduct.data : [];
      if (this.tableConfig?.isCustom) {
        this.tableConfig.isCustom.total = resorderProduct.count;
      }
      this.tableConfig.tableData = this.orderProduct;
      this.tableObj.initializeTable();
      this._cdr.detectChanges();
    });
  }

  onFilter() {
    this.getproductMaster();
  }

  clear() {
    this.initForm();
    this.getproductMaster();
  }
}
