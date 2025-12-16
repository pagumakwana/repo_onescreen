import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WebdtableComponent } from '../../layout_template/webdtable/webdtable.component';
import { dataTableConfig } from '../../_appmodel/_componentModel';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { WebDService } from '../../_appservice/webdpanel.service';

@Component({
  selector: 'app-contactusmodule',
  standalone: true,
  imports: [WebdtableComponent,CommonModule,RouterModule,FormsModule],
  templateUrl: './contactusmodule.component.html',
  styleUrl: './contactusmodule.component.scss'
})
export class ContactusmoduleComponent implements OnInit{
  @ViewChild('dataTableCom', { static: false }) tableObj!: WebdtableComponent;

  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    private _cdr: ChangeDetectorRef) { }


    tableConfig: dataTableConfig = {
      tableTitle:'Manage Enquiry',
      tableData: [],
      displayPaging:true,
      tableConfig: [
        { identifer: "createddatetime", title: "Date", type: "date" },
        { identifer: "fullname", title: "Full Name", type: "text" },
        { identifer: "email_id", title: "Email ID", type: "text" },
        { identifer: "mobile_no", title: "Mobile Number", type: "text" },
        { identifer: "description", title: "Description", type: "text" }],
      isCustom: {
        current: 0,
        steps: 10,
        total: 0,
        callbackfn: this.getContactus.bind(this)
      }
    }
  
    ngOnInit(): void {
      this.getContactus();
    }

    Contactus:any=[];
    getContactus() {
      let obj = this._base._commonService.getcatalogrange(this.tableConfig?.isCustom?.steps, (this.tableConfig?.isCustom?.current ?? 0) + 1)
      let start = obj[obj.length - 1].replace(/ /g, '').split('-')[0];
      let end = obj[obj.length - 1].replace(/ /g, '').split('-')[1];
      this._webDService.getcontactdetails(0,parseInt(start),parseInt(end)).subscribe((resLabel: any) => {
        this.Contactus = resLabel.data;
        this.Contactus = Array.isArray(resLabel.data) ? resLabel.data : [];
        if (this.tableConfig?.isCustom) {
          this.tableConfig.isCustom.total = resLabel.count;
        }
        this.tableConfig.tableData = this.Contactus;
        this.tableObj.initializeTable();
        this._cdr.detectChanges();
      });
    }
  

}
