import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { Subscription } from 'rxjs';
import { SweetAlertOptions } from 'sweetalert2';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { WebdtableComponent } from '../../layout_template/webdtable/webdtable.component';
import { enAppSession } from '../../_appmodel/sessionstorage';
import { tableEvent } from '../../_appmodel/_componentModel';
import { portalconfigModel, moduledataModel } from '../../_appmodel/_model';
import { BaseServiceHelper } from '../../_appservice/baseHelper.service';
import { SignalRService } from '../../_appservice/signalR.service';
import { WebDService } from '../../_appservice/webdpanel.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-portalconfig',
  templateUrl: './portalconfig.component.html',
  standalone: true,
  imports: [SweetAlert2Module, CommonModule,RouterModule],
  styleUrl: './portalconfig.component.scss'
})
export class PortalconfigComponent implements OnInit {

  @ViewChild('deleteSwal')
  public readonly deleteSwal!: SwalComponent;

  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  swalOptions: SweetAlertOptions = { buttonsStyling: false };

  dataTable: any;
  constructor(public _base: BaseServiceHelper,
    private _webDService: WebDService,
    private _cdr: ChangeDetectorRef,
    private _signalRService: SignalRService
  ) { }

  portalconfigMaster: any = [];
  search: string = '';
  _portalconfigModel: portalconfigModel = {};

  _moduledataModel: moduledataModel = {};

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    this._base._encryptedStorage.get(enAppSession.user_id).then(user_id => this.UserId = +user_id);
    this.getUserConfiguration();
    // this.getportalconfig();
  }




  clearSearch() {
    this.search = '';
  }


  // User Config List
  public userConfigData = [];
  private UserId: number = 0;


  // -------------------------------------------- User Config List -----------------------------------------
  private getUserConfiguration() {
    this._webDService.getportalconfig('all', 0, '','null', 0, 0).subscribe({
      next: (resdata: any) => {
        this.userConfigData =  Array.isArray(resdata.data) ? resdata.data : [];
        debugger
        console.log("Processed userConfigData:", this.userConfigData);
        this.userConfigData.forEach((data:any) => {
          data.isEditable = false;
          if (data.config_type == 'DropDown') {
            data.config_data = JSON.parse(data.config_data);
          };
        });
      },
      error: (e) => {
        console.error(e);
        // this._base._alertMessageService.error("Something went wrong !!");
      },
      complete: () => {
        this._cdr.detectChanges();
      }
    })
  };

  public submitConfiguration(configData: any) {
    if (!configData) {
      console.error('No configuration data provided.');
      alert('Missing configuration data.');
      return;
    }

    // Optional: Try to start SignalR but don't block the update if it fails
    if (!this._signalRService.isConnected()) {
      console.warn('SignalR not connected — attempting to reconnect...');
      this._signalRService.startConnection();
    }

    // Always proceed with HTTP update, even if SignalR fails
    const data: any = {
      flag: 'update',
      createdby: this.UserId,
      config_id: configData.config_id,
      config_name: configData.config_name,
      config_value: configData.config_value,
      config_type: configData.config_type,
      isactive: true,
      description: configData.description
    };

    if (Object.prototype.hasOwnProperty.call(configData, 'config_data')) {
      data['config_data'] = JSON.stringify(configData.config_data);
    }

    console.log('Submitting update to backend:', data);

    this._webDService.manageportalconfig(data).subscribe({
      next: (res: any) => {
        console.log('Backend response:', res);

        if (res === 'updatesuccess') {
          alert('Configuration updated successfully.');
          configData.isEditable = false; // optionally toggle edit mode off
        } else {
          console.warn('Update failed or unexpected response:', res);
          alert('Update failed — check details.');
        }

        this.getUserConfiguration();
      },
      error: (err) => {
        console.error('Backend error:', err);
        alert('An error occurred during update.');
      }
    });
  }


  public allowEdit(configData:any) {
    configData.isEditable = true;
  };

}
