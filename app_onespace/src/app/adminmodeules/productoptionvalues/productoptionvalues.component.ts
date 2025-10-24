import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { WebdtableComponent } from '../../layout_template/webdtable/webdtable.component';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { SweetAlertOptions } from 'sweetalert2';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { WebDService } from '../../_appservice/webdpanel.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import {  productoptionvalue } from '../../_appmodel/_model';
import { dataTableConfig, tableEvent } from '../../_appmodel/_componentModel';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-productoptionvalues',
  standalone: true,
  imports: [WebdtableComponent, SweetAlert2Module, ReactiveFormsModule, FormsModule, CommonModule,RouterModule],
  templateUrl: './productoptionvalues.component.html',
  styleUrl: './productoptionvalues.component.scss'
})
export class ProductoptionvaluesComponent {
  @ViewChild('dataTableCom', { static: false }) tableObj!: WebdtableComponent;
  @ViewChild('deleteSwal')
  public readonly deleteSwal!: SwalComponent;

  @ViewChild('saveSwal')
  public readonly saveSwal!: SwalComponent;

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading!: boolean;
  private unsubscribe: Subscription[] = [];

  navigateaddform() {
    this._base._router.navigate(['/app/managevalues/0']);
  }
  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;
  swalOptions: SweetAlertOptions = { buttonsStyling: false };

  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    private _cdr: ChangeDetectorRef,
    public _fb: FormBuilder,) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
  }

  importFile!: FormData;
  OptionValue: any = [];
  _optionValue: productoptionvalue = {};

  //done
  tableConfigoptionvalue: dataTableConfig = {
    tableData: [],
    tableTitle:'Manage Product Options',
    tableConfig: [
      { identifer: "createddatetime", title: "Date", type: "date" },
      { identifer: "title", title: "Option Type", type: "text" },
      { identifer: "option_value", title: "Value", type: "text" },
      { identifer: "display_order", title: "Display Order", type: "text" },
      { identifer: "", title: "Action", type: "buttonIcons", buttonIconList: [{ title: 'Edit', class: 'btn btn-primary btn-sm', iconClass: 'feather icon-edit' }, { title: 'Delete', class: 'btn btn-danger btn-sm', iconClass: 'feather icon-trash-2' }] },],
    isCustom: {
      current: 0,
      steps: 10,
      total: 0,
      callbackfn: this.getoptionValue.bind(this)
    }
  }


  ngOnInit(): void {
    // this.initForm();
    this.getoptionValue();
  }

  initForm() {
   
  }

  tableClick(dataItem: tableEvent) {
    if (dataItem?.action?.type == 'link' || (dataItem?.action?.type == 'buttonIcons' && dataItem.actionInfo.title == "Edit")) {
      this.modifylabel(dataItem.tableItem, 'MODIFYOPTIONVALUE');
    } else if (dataItem?.action?.type == 'buttonIcons' && dataItem.actionInfo.title == "Delete") {
      this.modifylabel(dataItem.tableItem, 'DELETEOPTIONVALUE');
    }
  }

  exportToExcel() {
    const htmlToText = (html: string): string => {
      const tempElement = document.createElement('div');
      tempElement.innerHTML = html;
      return tempElement.textContent || tempElement.innerText || '';
    };
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const selectedColumns = this.OptionValue.map((item: any) => {
      return {
        Date: formatDate(item.createddatetime),
        LabelName: item.label,
        TypeMaster: item.typemaster,
        Description: htmlToText(item.description),
        IsActive: item.isactive
      };
    });
  }

  getoptionValue() {
    let obj = this._base._commonService.getcatalogrange(this.tableConfigoptionvalue?.isCustom?.steps, (this.tableConfigoptionvalue?.isCustom?.current ?? 0) + 1)
    let start = obj[obj.length - 1].replace(/ /g, '').split('-')[0];
    let end = obj[obj.length - 1].replace(/ /g, '').split('-')[1];
    this._webDService.productoptionvalues('all', 0, parseInt(start), parseInt(end)).subscribe((resLabel: any) => {
      this.OptionValue = resLabel.data;
      this.OptionValue = Array.isArray(resLabel.data) ? resLabel.data : [];
      if (this.tableConfigoptionvalue?.isCustom) {
        this.tableConfigoptionvalue.isCustom.total = resLabel.count;
      }
      this.tableConfigoptionvalue.tableData = this.OptionValue;
      this.tableObj.initializeTable();
      this._cdr.detectChanges();
    });
  }

  modifylabel(data: any, flag: any) {
    this._optionValue = data;
    this._optionValue.flag = flag;
    if (flag == 'MODIFYOPTIONVALUE') {
      this._base._router.navigate([`/app/managevalues/${data.option_value_id}`]);
    } else if (flag == 'DELETEOPTIONVALUE') {
      this.deleteSwal.fire().then((clicked) => {
        if (clicked.isConfirmed) {
          this._optionValue.isactive = false;
          this._webDService.manageproductoptionvalues(this._optionValue).subscribe((response: any) => {
            if (response == 'deletesuccess') {
              this.OptionValue.filter((res: any, index: number) => {
                if (res.option_value_id === this._optionValue.option_value_id) {
                  this.OptionValue.splice(index, 1);
                  this._cdr.detectChanges();
                  this.successSwal.fire()
                  setTimeout(() => {
                    location.reload();
                  }, 1500);
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
  
}
