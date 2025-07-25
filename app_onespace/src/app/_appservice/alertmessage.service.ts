import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Injectable()
export class AlertMessageService {
    constructor(private _ToastrService: ToastrService) { }

    success(Message:any) {
        this._ToastrService.success(Message);
    }

    warning(Message:any) {
        this._ToastrService.warning(Message);
    }

    error(Message:any) {
        this._ToastrService.error(Message);
    }
    info(Message:any) {
        this._ToastrService.info(Message);
    }

}