import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Options } from 'select2';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

@Component({
  selector: 'webd-multiselect',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,NgMultiSelectDropDownModule],
  templateUrl: './multiselect.component.html',
  styleUrl: './multiselect.component.scss'
})
export class MultiselectComponent implements OnInit {
  @Input() data: Array<any> = []
  @Input() config!: IDropdownSettings | undefined;
  @Input() textField!: string
  @Input() valueField!: string
  @Input() formControl!: FormControl;
  @Input() isMultiSelect: boolean = false;
  @Input() placeholder!: string;
  @Output() onSelection: EventEmitter<any> = new EventEmitter();
  public options!: Options;
  public exampleData!: Array<any>;
  public _value!: string[];
  public showControl: boolean = false
  public dropdownSettings!: IDropdownSettings | undefined;
  constructor(private fb: FormBuilder, private _cdr: ChangeDetectorRef) {
    this.fb.control('');
  }

  get value(): string[] {
    return this.formControl.value;
    // return this._value;
  }
  set value(value: string[]) {
    // this._value = value;
    this.formControl.setValue(value)
    this.onSelectionChange(value);
  }


  ngOnDestroy(): void {
    this.showControl = false
  }
  ngOnInit() {
    this.dropdownSettings = this.config;
    setTimeout(() => {
      this.showControl = true;
      this._value = [];
      this._value = this.formControl.value;
      this._cdr.detectChanges();
    }, 500);

    this.options = {
      width: '250',
      multiple: this.isMultiSelect,
      tags: true
    };
  }



  get listData() {
    for (let item of this.data) {
      debugger
      item[this.config?.idField!] = item[this.valueField!];
      item[this.config?.textField!] = item[this.textField!];
    }
    return this.data
  }

  onSelectionChange($event: any) {
    this.onSelection.emit($event);
  }
}
