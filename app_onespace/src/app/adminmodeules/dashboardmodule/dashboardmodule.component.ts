import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { WebDService } from '../../_appservice/webdpanel.service';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { dataTableConfig } from '../../_appmodel/_componentModel';
import { WebdtableComponent } from '../../layout_template/webdtable/webdtable.component';

@Component({
  selector: 'app-dashboardmodule',
  standalone: true,
  imports: [WebdtableComponent],
  templateUrl: './dashboardmodule.component.html',
  styleUrl: './dashboardmodule.component.scss'
})
export class DashboardmoduleComponent {
  @ViewChild('dataTableCom', { static: false }) tableObj!: WebdtableComponent;
  userdashboard: any = {};
  orderDetails: any = [];
  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    private _cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getuserdashboard();
    this.getOderDetails();
  }

  tableConfig: dataTableConfig = {
    tableData: [],
    tableConfig: [
      // { identifer: "createddatetime", title: "Date", type: "date" },
      { identifer: "order_number", title: "Order Number", type: "text" },
      { identifer: "payment_type", title: "Payment Type", type: "text" },
      { identifer: "payment_order_id", title: "Payment OrderId", type: "text" },
      { identifer: "payment_response", title: "Response", type: "text" },
      //  { identifer: "", title: "Action", type: "buttonIcons", buttonIconList: [{ title: 'Edit', class: 'btn btn-primary btn-sm', iconClass: 'feather icon-edit' }, { title: 'Delete', class: 'btn btn-danger btn-sm', iconClass: 'feather icon-trash-2' }] },],],
    ],
    isCustom: {
      current: 0,
      steps: 10,
      total: 0,
      callbackfn: this.getOderDetails.bind(this)
    }
  }
  // getuserdashboard() {
  //   return new Promise((resolve, reject) => {
  //     this._webDService.getdashboardwidget('all', 0).subscribe((resUserdashboard: any) => {
  //       this.userdashboard = [];
  //       this.userdashboard = Array.isArray(resUserdashboard.data) ? resUserdashboard.data : [];
  //       // this._cdr.detectChanges();
  //       console.log("userdashboard", this.userdashboard)
  //       resolve(true);
  //     });
  //   });
  // }

  getuserdashboard() {
    this._webDService.getdashboardwidget('all', 0).subscribe({
      next: (res: any) => {
        // 👇 Assign default empty object to avoid undefined errors
        this.userdashboard = res?.data || {};
        console.log("userdashboard", this.userdashboard);
        this._cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error fetching dashboard data", err);
        this.userdashboard = {}; // 👈 fallback to safe object
      }
    });
  }

  getOderDetails() {
    let obj = this._base._commonService.getcatalogrange(this.tableConfig?.isCustom?.steps, (this.tableConfig?.isCustom?.current ?? 0) + 1)
    let start = obj[obj.length - 1].replace(/ /g, '').split('-')[0];
    let end = obj[obj.length - 1].replace(/ /g, '').split('-')[1];
    this._webDService.getorderdetails('all', 0, parseInt(start), parseInt(end)).subscribe((resorderDetails: any) => {
      this.orderDetails = resorderDetails.data;
      this.orderDetails = Array.isArray(resorderDetails.data) ? resorderDetails.data : [];
      if (this.tableConfig?.isCustom) {
        this.tableConfig.isCustom.total = resorderDetails.count;
      }
      this.tableConfig.tableData = this.orderDetails;
      this.tableObj.initializeTable();
      this._cdr.detectChanges();
    });
  }
}
