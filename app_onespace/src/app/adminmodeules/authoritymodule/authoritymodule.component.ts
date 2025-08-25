import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { catchError, finalize, first, map, Observable, of, Subscription } from 'rxjs';
import { SweetAlertOptions } from 'sweetalert2';
import { WebDService } from '../../_appservice/webdpanel.service';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-authoritymodule',
  standalone: true,
  imports: [SweetAlert2Module,CommonModule,RouterModule],
  templateUrl: './authoritymodule.component.html',
  styleUrl: './authoritymodule.component.scss'
})
export class AuthoritymoduleComponent {

  isCollapsed1 = false;

  isLoading = false;
  AuthorityModule: any = [];


  navigate(){
    this._base._router.navigate(['/app/manageauthority/0']);
  }
  navigateaddform() {
    this._base._router.navigate(['/app/manageauthority/0']);
  }

  @ViewChild('noticeSwal')
  noticeSwal!: SwalComponent;

  swalOptions: SweetAlertOptions = {};

  modalConfig: NgbModalOptions = {
    modalDialogClass: 'modal-dialog modal-dialog-centered mw-650px',
  };


  constructor(private _cdr: ChangeDetectorRef, private renderer: Renderer2, private modalService: NgbModal, private _webDService: WebDService, public _base: BaseServiceHelper,) { }

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    this.getAuthority();
  }

  onSubmit(event: Event, myForm: NgForm) {

  }

  extractText(obj: any): string {
    var textArray: string[] = [];

    for (var key in obj) {
      if (typeof obj[key] === 'string') {
        // If the value is a string, add it to the 'textArray'
        textArray.push(obj[key]);
      } else if (typeof obj[key] === 'object') {
        // If the value is an object, recursively call the function and concatenate the results
        textArray = textArray.concat(this.extractText(obj[key]));
      }
    }

    // Use a Set to remove duplicates and convert back to an array
    var uniqueTextArray = Array.from(new Set(textArray));

    // Convert the uniqueTextArray to a single string with line breaks
    var text = uniqueTextArray.join('\n');

    return text;
  }

  showAlert(swalOptions: SweetAlertOptions) {
    let style = swalOptions.icon?.toString() || 'success';
    if (swalOptions.icon === 'error') {
      style = 'danger';
    }
    this.swalOptions = Object.assign({
      buttonsStyling: false,
      confirmButtonText: "Ok, got it!",
      customClass: {
        confirmButton: "btn btn-" + style
      }
    }, swalOptions);
    this._cdr.detectChanges();
    this.noticeSwal.fire();
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
  private unsubscribe: Subscription[] = [];


  getAuthority() {
    this._webDService.getauthority().subscribe((resAuthorityModule: any) => {
      this.AuthorityModule = [];
      this.AuthorityModule = Array.isArray(resAuthorityModule.data) ? resAuthorityModule.data : [];
      this._cdr.detectChanges();
    });
  }
}
