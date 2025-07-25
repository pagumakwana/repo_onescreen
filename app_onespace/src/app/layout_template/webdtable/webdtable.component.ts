import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { fromEvent, debounceTime, map } from 'rxjs';
import { dataTableConfig, tableEvent } from '../../_appmodel/_componentModel';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Api, Config } from 'datatables.net';
import { DataTableDirective } from 'angular-datatables';
import { SweetAlertOptions } from 'sweetalert2';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'webd-table',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './webdtable.component.html',
  styleUrl: './webdtable.component.scss',
  providers: [] 
})
export class WebdtableComponent implements OnInit {
  @Input() modal!: TemplateRef<any>;
  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };
  private modalRef!: NgbModalRef;
  dtOptions: Config = {};
  @Input() route: string = '/';
  @Input() datatableConfig: Config = {};
  @Output() deleteEvent = new EventEmitter<number>();
  @Output() editEvent = new EventEmitter<number>();
  @Output() createEvent = new EventEmitter<boolean>();

  @Output() tableEvent = new EventEmitter();
  @Output() buttonEvent: EventEmitter<any> = new EventEmitter();

  swalOptions: SweetAlertOptions = { buttonsStyling: false };
  @Input() reload!: EventEmitter<boolean>;
  @ViewChild(DataTableDirective, { static: false })
  private datatableElement!: DataTableDirective;
  private clickListener!: () => void;

  @ViewChild('deleteSwal')
  public readonly deleteSwal!: SwalComponent;

  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;
  private idInAction!: number;
  @Input() config!: dataTableConfig;
  @Input() control!: FormControl;

  @ViewChild('dataTable', { static: true }) table: ElementRef | undefined;
  dataTable: any;
  tableRecords: Array<any> = []
  pages: { [key: number]: Array<any> } = {}
  imageBaseUrl: string = 'https://api.cameratosell.com';
  ishide: boolean = true
  isCheckAll = false
  // selectedStep = 10
  stepsArray = [
    { text: '10', value: 10 },
    { text: '20', value: 20 },
    { text: '50', value: 50 },
    { text: '100', value: 100 },
    { text: '200', value: 200 },
  ]
  pageArray: (number | string)[] = [];

  // Get the size of an object
  Object_size(obj: any) {
    let size = 0
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };

  constructor(public _base: BaseServiceHelper,
    private _cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private renderer: Renderer2,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      dom: "<'row'<'col-sm-12'tr>>" +
        "<'d-flex justify-content-between'<'col-sm-12 col-md-5'i><'d-flex justify-content-between'p>>",
      processing: true,
      language: {
        processing: '<span class="spinner-border spinner-border-sm align-middle"></span> Loading...'
      }, ...this.datatableConfig
    };
    this.renderActionColumn();

    this.setupSweetAlert();

    if (this.reload) {
      this.reload.subscribe(data => {
        this.modalService.dismissAll();
        this.datatableElement.dtInstance.then((dtInstance: Api) => dtInstance.ajax.reload());
      });
    }
  }
  renderActionColumn(): void {
    const actionColumn = {
      sortable: false,
      title: 'Actions',
      render: (data: any, type: any, full: any) => {
        const editButton = `
          <button class="btn btn-icon btn-active-light-primary w-30px h-30px me-3" data-action="edit" data-id="${full.id}">
            <i class="ki-duotone ki-pencil fs-3"><span class="path1"></span><span class="path2"></span></i>
          </button>`;

        const deleteButton = `
          <button class="btn btn-icon btn-active-light-primary w-30px h-30px" data-action="delete" data-id="${full.id}">
            <i class="ki-duotone ki-trash fs-3">
              <span class="path1"></span><span class="path2"></span>
              <span class="path3"></span><span class="path4"></span><span class="path5"></span>
            </i>
          </button>`;

        const buttons = [];

        if (this.editEvent.observed) {
          buttons.push(editButton);
        }

        if (this.deleteEvent.observed) {
          buttons.push(deleteButton);
        }

        return buttons.join('');
      },
    };

    if (this.dtOptions.columns) {
      this.dtOptions.columns.push(actionColumn);
    }
  }

  setupSweetAlert() {
    this.swalOptions = {
      buttonsStyling: false,
    };
  }

  ngAfterViewInit() {
    this.clickListener = this.renderer.listen(document, 'click', (event) => {
      const closestBtn = event.target.closest('.btn');
      if (closestBtn) {
        const { action, id } = closestBtn.dataset;
        this.idInAction = id;

        switch (action) {
          case 'view':
            this.router.navigate([`${this.route}/${id}`]);
            break;

          case 'create':
            this.createEvent.emit(true);
            this.modalRef = this.modalService.open(this.modal, this.modalConfig);
            break;

          case 'edit':
            this.editEvent.emit(this.idInAction);
            this.modalRef = this.modalService.open(this.modal, this.modalConfig);
            break;

          case 'delete':
            this.deleteSwal.fire().then((clicked) => {
              if (clicked.isConfirmed) {
                this.successSwal.fire();
              }
            });
            break;
        }
      }
    });

    this.triggerFilter();

  }

  triggerDelete() {
    this.deleteEvent.emit(this.idInAction);
  }

  triggerFilter() {
    fromEvent<KeyboardEvent>(document, 'keyup')
      .pipe(
        debounceTime(50),
        map(event => {
          const target = event.target as HTMLElement;
          const action = target.getAttribute('data-action');
          const value = (target as HTMLInputElement).value?.trim().toLowerCase();

          return { action, value };
        })
      )
      .subscribe(({ action, value }) => {
        if (action === 'filter') {
          this.datatableElement.dtInstance.then((dtInstance: Api) => dtInstance.search(value).draw());
        }
      });
  }
  stepChange(event: any) {
    if (this.config.isCustom) {
      this.config.isCustom.current = 0
    }
    this.pageIndexingArrayCreation()
  }

  pageIndexingArrayCreation(isLoad: boolean = true) {
    // if (this.Object_size(this.pages) == 0) {
    this.pages = {}
    let total = this.config.isCustom ? this.config.isCustom?.total : 0;
    let steps = this.config.isCustom ? this.config.isCustom?.steps : 0;
    let pageTotal = total / steps;
    for (let i = 0; i < pageTotal; i++) {
      this.pages[i] = []
    }

    if (isLoad) this.loadRecords()
    // }
  }

  jumpDirect(page: number) {
    if (this.config.isCustom) {
      this.config.isCustom.current = page
    }
    this.loadRecords()
  }

  loadRecords() {
    if (this.config.isCustom) {
      if (this.pages[this.config.isCustom.current] && this.pages[this.config.isCustom.current].length)
        this.tableRecords = this.pages[this.config.isCustom.current]
      else {
        // this.pageIndexingArrayCreation(false)
        this.config.isCustom.callbackfn()
      }
      this.calculatePages()
    }
  }

  calculatePages() {
    if (this.config.isCustom) {
      this.pageArray = []
      let pageTotal = this.config.isCustom.total / this.config.isCustom.steps
      let current = this.config.isCustom.current


      if (pageTotal < 8) {
        for (let i = 0; i < pageTotal; i++) {
          this.pageArray.push(i)
        }
      } else {
        if (current <= 4) {
          for (let i = 0; i < 5; i++) {
            this.pageArray.push(i)
          }
          this.pageArray.push('...')
          this.pageArray.push(pageTotal - 1)
        } else if (current > pageTotal - 6) {
          this.pageArray.push(0)
          this.pageArray.push('...')
          for (let i = pageTotal - 5; i < pageTotal; i++) {
            this.pageArray.push(i)
          }
        } else {
          this.pageArray.push(0)
          this.pageArray.push('...')
          this.pageArray.push(current - 1)
          this.pageArray.push(current)
          this.pageArray.push(current + 1)
          this.pageArray.push('...')
          this.pageArray.push(pageTotal - 1)
        }
      }
      this._cdr.detectChanges();
      // this.pageIndexingArrayCreation()
    }
  }
  showPageNo(page: any) {
    return typeof page == 'number' ? page + 1 : page
  }

  next() {
    if (this.config.isCustom) {
      this.config.isCustom.current++
      this.loadRecords()
    }
  }
  previous() {
    if (this.config.isCustom) {
      this.config.isCustom.current--
      this.loadRecords()
    }
  }


  get isCustom() {
    return this.config.isCustom ? this.config.isCustom : false
  }

  checkBoxSetup() {
    if (this.config.showCheckBox) {
      this.config.tableData?.map((item:any) => {
        return item.isChecked_DataTable = this.isCheckAll
      })
    }
  }

  checkALlItems(event: any) {
    if (this.config.tableData) {
      for (let item of this.config.tableData) {
        item.isChecked_DataTable = event.target.checked
      }
    }
    this.tableClick(undefined, 'checkedBox')
  }

  initializeTable() {
    // this.tableRecords = this.config.tableData
    setTimeout(() => {
      this.checkBoxSetup()
      this.dataTable = $(this.table?.nativeElement);
      // this.dataTable.DataTable();
      if (this.Object_size(this.pages) == 0) this.pageIndexingArrayCreation()
      this.pages[this.config.isCustom?.current ? this.config.isCustom.current:0] = this.config.tableData

      if (this.config?.isCustom?.total) this.loadRecords()
      this.ishide = false

      setTimeout(() => {
        this.setCheckedData();
      }, 100);
      this.control?.valueChanges.subscribe(res => {
        this.setCheckedData();
      })
    }, 500);
  }

  setCheckedData() {

    if (this.control?.value && Array.isArray(this.control?.value)) {
      this.config?.tableData?.filter((res: any) => {
        res.isChecked_DataTable = this.control.value.includes(res);
      })
    }
  }

  getNestedObject(data: any, path: Array<string>) {
    path.forEach(function (key) {
      data = data?.[key] ?? '';
    });
    return data;
  }

  tableClick(tableItem: any, action: any, actionInfo?: any) {
    setTimeout(() => {
      let checkedItems = this.config?.tableData?.filter((item:any) => item.isChecked_DataTable)
      let emitData: tableEvent = {
        tableItem: tableItem,
        action: action,
        actionInfo: actionInfo,
        checkedData: checkedItems
      }
      this.isCheckAll = checkedItems?.length == this.config?.tableData?.length

      this.tableEvent.emit(emitData)
    }, 50);
  }

  buttonClick(event:any) {

    if (event.isStatic) {
      this.buttonEvent.emit(event.isAddModify);
    } else {
      this.buttonEvent.emit(event);
    }
  }


}
