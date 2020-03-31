import { Component } from '@angular/core';

@Component({
  selector: 'ngx-ecommerce',
  templateUrl: './e-commerce.component.html',
})
export class ECommerceComponent {
  UserRoleCheck:any;
  enableDashbaord:boolean;
  constructor(){
    this.dasboardCheck();
  }

  public dasboardCheck(){
    this.enableDashbaord = false;
    this.UserRoleCheck = localStorage.getItem('UserRole');
    if(this.UserRoleCheck =='superAdmin' || this.UserRoleCheck =='admin' || 
    this.UserRoleCheck =='daManager' || this.UserRoleCheck =='vendor'){
      this.enableDashbaord = true;
    }
  }
}
