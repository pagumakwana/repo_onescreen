import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import _ from 'lodash';
import { ITreeOptions, TreeComponent, TreeModule, TreeNode } from '@ali-hm/angular-tree-component';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { treeConfig } from './treeview.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'webd-treeview',
  standalone: true,
  imports: [TreeModule,CommonModule, FormsModule,ReactiveFormsModule],
  templateUrl: './webdtreeview.component.html',
  styleUrl: './webdtreeview.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class WebdtreeviewComponent implements OnInit {

  @Input() treeConfigData!: treeConfig;
  @Input() control!: FormControl;
  @Output() treeEvent = new EventEmitter();


  constructor(public _base: BaseServiceHelper, private _cdr: ChangeDetectorRef) { }


  nodes: Array<any> = [{}]
  treeObject!: TreeComponent
  checkBoxData = {    
    checked:[] as any[],
    checkedObj: [] as any[]
  }

  treeOption: ITreeOptions = {
    displayField: undefined,
    childrenField: undefined,
    idField: undefined,
    nodeHeight: 23,
    allowDrag: (node) => {

      return false;
    },
    allowDrop: (node) => {

      return false;
    },
    useVirtualScroll: true,
    animateExpand: true,
    scrollContainer: <HTMLElement>document.body.parentElement
  };

  ngOnInit(): void {
    this.treeOption.displayField = this.treeConfigData.displayField;
    this.treeOption.childrenField = this.treeConfigData.childrenField;
    this.treeOption.idField = this.treeConfigData.idField;
  }

  setCheckedData() {
    if (this.control.value && Array.isArray(this.control.value)) {
      for (let nodeId of this.control.value) {
        let node: TreeNode = this.treeObject.treeModel.getNodeById(nodeId?.module_id ? nodeId.module_id.toString():nodeId.toString())
        if (node) {
          node.data.isChecked = true;
      
          // ✅ Check before pushing into array
          if (!this.checkBoxData.checked.includes(node.id)) {
            this.checkBoxData.checked.push(node.id);
          }
      
          if (!this.checkBoxData.checkedObj.some((n: TreeNode) => n.id === node.id)) {
            this.checkBoxData.checkedObj.push(node);
          }
        }
      }
    }
  }
  

  onInitialized(tree: TreeComponent) {
    
    
    this.treeObject = tree

    this.initialize()
  }

  initialize() {
    
    if (Array.isArray(this.treeConfigData.treeData) && this.treeConfigData.treeData.length > 0) {

      this.treeConfigData.treeData.map(item => {
        item.isChecked = false
      })
    } else {
      this.treeConfigData.treeData = []
    }
    this.nodes = this.treeConfigData.treeData
    
    setTimeout(() => {
      this.setCheckedData();
    }, 100);
    this.control.valueChanges.subscribe(res => {
      this.setCheckedData();
    })

    this.treeObject.sizeChanged();
    this.treeObject.treeModel.update();
    this._cdr.detectChanges();
  }

  filterInArray(data: Array<any>, key: string | undefined, value: any, returnIndexOnly: boolean = false): null | any {
    
    let index: number = _.findIndex(data, (o: any) => {
      return key ? o[key] : o == value
    })
    return index > -1 ? returnIndexOnly ? index : data[index] : null
  }
  //--------------------------CheckBox functions start-------------------------
  checkBoxChecked(event: object | any, node: TreeNode) {
    
    let isChecked: boolean = event ? event.target.checked : null
    this.addRemoveIds(isChecked, node.id)
    node.data.isChecked = isChecked
    this.checkAllChildrens(node.data.children, isChecked)
    this.checkForParents(node)
    
    this.checkBoxData.checkedObj = []
    for (let id of this.checkBoxData.checked) {
      this.checkBoxData.checkedObj.push(this.treeObject.treeModel.getNodeById(id))
    }
    this.treeEvent.emit(this.checkBoxData)

  }

  addRemoveIds(isAdd: boolean, id: string | number) {
    
    let data: any = this.filterInArray(this.checkBoxData.checked, undefined, id, true)
    let isPresent: boolean = data ? true : (typeof data == 'number' && data > -1)
    if (isAdd == true && !isPresent) {
      this.checkBoxData.checked.push(id)
    } else if (isAdd == false && isPresent) {
      this.checkBoxData.checked.splice(data, 1)
    }

  }

  checkForParents(node: TreeNode) {
    let nodepath = node.path
    if (nodepath.length > 0) {
      nodepath.splice(nodepath.length - 1, 1)
      for (let i = nodepath.length - 1; i >= 0; i--) {
        
        this.checkForParents_helper(nodepath[i])
      }
    }
  }

  checkForParents_helper(id:any) {
    let node: TreeNode = this.treeObject.treeModel.getNodeById(id)
    let count = 0
    for (let nodeItem of node.data.children) {
      if (nodeItem.isChecked)
        count++;
    }
    node.data.isChecked = count > 0
    this.addRemoveIds(count > 0, node.data[this.treeConfigData.idField])
  }

  checkAllChildrens(nodeList:any, isChecked: boolean) {
    for (let node of nodeList) {
      node.isChecked = isChecked
      this.addRemoveIds(isChecked, node[this.treeConfigData.idField])
      if (Array.isArray(node.children) && node.children.length > 0)
        this.checkAllChildrens(node.children, isChecked)
    }
  }


  //--------------------------CheckBox functions end-------------------------






}
