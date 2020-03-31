import { Injectable, Injector, ErrorHandler} from '@angular/core';
import { AuthService } from './auth.service';
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
    providedIn: 'root'
  })

export class GlobalErrorHandler implements ErrorHandler {
    auth: any;
    constructor(private injector: Injector,private spinner: NgxSpinnerService) {
        setTimeout(() => {
            this.auth = this.injector.get(AuthService);
          })
    }

    handleError(error) {  
        if(error.status === 401){
            this.auth.logout();
        }
       this.spinner.hide();
        throw error;
    }
}
