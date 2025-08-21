import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import _ from 'lodash';
import { enAppSession } from '../../../_appmodel/sessionstorage';
import { menuStructure } from '../../../_appmodel/_model';
import { BaseServiceHelper } from '../../../_appservice/baseHelper.service';
declare var feather: any;

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss'
})
export class AdminSidebarComponent implements OnInit, AfterViewInit, AfterViewChecked {

  constructor(public _base: BaseServiceHelper, private _cdr: ChangeDetectorRef) { }

  userModule: any;
  menuStructure: Array<any> = []
  _menuStructure: menuStructure = {};
  public fullname: string = '';
  @Output() allMenu: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    this.getAuthorityModule();
  }
  ngAfterViewInit() {
    feather.replace();
  }

  ngAfterViewChecked() {
    feather.replace();
  }
  getAuthorityModule() {
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this._base._commonService.getauthoritymodule(user_id).then((resUserModule: any) => {
        this.userModule = [];
        this.userModule = Array.isArray(resUserModule) ? resUserModule : [];
        this.menuStructure = this.list_to_tree(this.userModule);
        if (this.menuStructure.length > 0)
          this.menuHtml = this.buildMenu(this.menuStructure);
        this._cdr.detectChanges();
      });
    });
  }
  // Build HTML string recursively
  buildMenu(nodes: any[]): string {
    debugger
    let html = '<ul class="pc-navbar">';
    for (let node of nodes) {
      const hasChildren = node.children && node.children.length > 0;
      html += `<li class="pc-item ${hasChildren ? 'pc-hasmenu' : ''}">`;
      html += `
        <a class="pc-link">
          <span class="pc-micon">
            <i class="ph-duotone ${node.icon || 'ph-gauge'}"></i>
          </span>
          <span class="pc-mtext">${node.modulename}</span>
          ${hasChildren ? `<span class="pc-arrow"><i data-feather="chevron-right"></i></span>` : ''}
          ${node.badge ? `<span class="pc-badge">${node.badge}</span>` : ''}
        </a>
      `;

      if (hasChildren) {
        html += '<ul class="pc-submenu">';
        for (let child of node.children) {
          html += `
            <li class="pc-item">
              <a class="pc-link">${child.modulename}</a>
            </li>
          `;
        }
        html += '</ul>';
      }

      html += '</li>';
    }
    html += '</ul>';

    console.log(html)
    return html;
  }

  generateMenuData(arrayData: any) {
    for (let obj of arrayData) {
      if (obj.module_parent_id == 0) {
        this.menuStructure.push(obj)
      } else {

      }
    }
  }

  getChildData(dataId: any) {
    let index = _.findIndex(this.userModule, (o: any) => {
      o.module_id = dataId
    })
    return index > -1 ? this.userModule[index] : []
  }
  public menuHtml: string = '';

  list_to_tree(list: any) {
    let map: { [key: number]: number } = {}, node, roots = [], i;

    for (i = 0; i < list.length; i += 1) {
      map[list[i].module_id] = i; // initialize the map
      list[i].children = []; // initialize the children
    }

    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node.module_parent_id !== parseInt("0")) {
        // if you have dangling branches check that map[node.module_parent_id] exists
        list[map[node.module_parent_id]]?.children?.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }

  logout() {
    this._base._appSessionService.clearUserSession();
    setTimeout(() => {
      this._base._router.navigate(['/auth']);
    }, 1000);
  }

  onRouterLinkActive(event: any) {
    console.log("event", event);
  }

  navigateToMenu(menu: any, allMenu: any) {
    this._menuStructure = {
      module_id: menu.module_id,
      module_parent_id: menu.module_parent_id,
      moduleicon: menu.moduleicon,
      modulerouting: menu.modulerouting,
      children: menu.children,
      meuItems: allMenu,
      modulename: menu.modulename
    }
    this.allMenu.emit(this._menuStructure);
    if (menu.modulerouting != '' && menu.modulerouting != undefined && menu.modulerouting != null) {
      this._base._router.navigate([menu.modulerouting]);
    } else {
      this._base._router.navigate(['app', menu.modulename]);
    }
  }
}
