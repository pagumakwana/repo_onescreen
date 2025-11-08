import { CommonModule } from '@angular/common';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import _ from 'lodash';
import { enAppSession } from '../../../_appmodel/sessionstorage';
import { menuStructure } from '../../../_appmodel/_model';
import { BaseServiceHelper } from '../../../_appservice/baseHelper.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService } from '../../../authmodule/_authservice/auth.service';
declare var feather: any;

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss'
})
export class AdminSidebarComponent implements OnInit {
  constructor(public _base: BaseServiceHelper, private _cdr: ChangeDetectorRef, private _auth: AuthService) { }

  userModule: any[] = [];
  menuStructure: Array<any> = [];
  _menuStructure: menuStructure = {};

  _profilepicture: string = '/FileStorage/avatar-1.jpg';
  _fullname: string = '';
  public fullname: string = '';
  @Output() allMenu: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    this.getAuthorityModule();
    this._base._encryptedStorage.get(enAppSession.profilepicture).then((resPicture) => {
      this._base._encryptedStorage.get(enAppSession.fullname).then((resfullname) => {
        if (resPicture != null && resPicture != '' && resPicture != undefined) {
          this._profilepicture = resPicture;
        }
        if (resfullname != null && resfullname != '' && resfullname != undefined) {
          this._fullname = resfullname;
        }
        this._cdr.detectChanges();
      });
    });
  }

  ngAfterViewInit() {
    // initial feather run (if feather available)
    if (typeof feather?.replace === 'function') feather.replace();
  }

  ngAfterViewChecked() {
    // ensure icons remain rendered
    if (typeof feather?.replace === 'function') feather.replace();
  }

  getAuthorityModule() {
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => {
      this._base._commonService.getauthoritymodule(user_id).then((resUserModule: any) => {
        // ensure array
        this.userModule = Array.isArray(resUserModule) ? resUserModule : [];
        // build tree
        this.menuStructure = this.list_to_tree(this.userModule);
        // initialize expanded flag false for all nodes
        this.prepareNodes(this.menuStructure);
        if (typeof feather?.replace === 'function') {
          // run asynchronously to ensure DOM updated
          setTimeout(() => feather.replace(), 0);
        }
        this._cdr.detectChanges();
      }).catch(err => {
        console.error('getauthoritymodule error', err);
      });
    }).catch(err => {
      console.error('encryptedStorage get user_id error', err);
    });
  }

  // Recursively set expanded = false for all nodes
  private prepareNodes(nodes: any[]) {
    if (!nodes || !nodes.length) return;
    for (const n of nodes) {
      (n as any).expanded = false;
      if (n.children && n.children.length > 0) {
        this.prepareNodes(n.children);
      }
    }
  }

  // Convert flat list to nested tree
  list_to_tree(list: any[]) {
    const map: Record<number, any> = {};
    const roots: any[] = [];

    // first pass: create map entries and children array
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      map[item.module_id] = { ...item, children: [] };
    }

    // second pass: link children to parents
    for (const id in map) {
      const node = map[id];
      const parentId = node.module_parent_id;
      if (parentId && parentId !== 0 && map[parentId]) {
        map[parentId].children.push(node);
      } else if (!parentId || parentId === 0) {
        roots.push(node);
      } else {
        // parent not found - treat as root (safe fallback)
        roots.push(node);
      }
    }

    return roots;
  }

  // toggle expand/collapse (called when clicking parent row)
  toggleMenu(menu: any, event?: MouseEvent) {
    if (event) {
      // prevent link navigation when clicking caret/parent
      event.preventDefault();
      event.stopPropagation();
    }
    menu.expanded = !menu.expanded;
    // rerun CD to update classes and feather icons if needed
    if (typeof feather?.replace === 'function') {
      // run asynchronously to ensure DOM updated
      setTimeout(() => feather.replace(), 0);
    }
    this._cdr.detectChanges();
  }

  // Called when clicking a leaf item (no children)
  navigateToMenu(menu: any, allMenu?: any) {
    this._menuStructure = {
      module_id: menu.module_id,
      module_parent_id: menu.module_parent_id,
      moduleicon: menu.moduleicon,
      modulerouting: menu.modulerouting,
      children: menu.children,
      meuItems: allMenu,
      modulename: menu.modulename
    };
    this.allMenu.emit(this._menuStructure);

    if (menu.modulerouting != null && menu.modulerouting !== '' && menu.modulerouting !== '/') {
      this._base._router.navigate([menu.modulerouting]);
    } else {
      this._base._router.navigate(['app', menu.modulename]);
    }
  }


  logout() {
    this._auth.logout();
    this._cdr.detectChanges();
  }
}
