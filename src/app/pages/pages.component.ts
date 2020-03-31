import { Component } from '@angular/core';
import { ApiService } from '../../app/services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `
})
export class PagesComponent {
  //menu:[];
  menu = [{}];
  userId: string;
  UserRoleCheck:any;

  constructor(private auth: AuthService,private apiService: ApiService) {
    
    this.UserRoleCheck = localStorage.getItem('UserRole');
    if(this.UserRoleCheck !='superAdmin' || this.UserRoleCheck !='admin' || 
    this.UserRoleCheck !='daManager' || this.UserRoleCheck !='vendor'){
     // this.auth.logout();
     
    }
  }
  
  ngOnInit(): void { 
    this.getMenu(); 
    
  }

  async getMenu(){ 
    //await this.auth.localAuthSetup();
    this.userId = localStorage.getItem('UserId');
    const userid = this.userId;
    this.apiService.getMenu(userid).subscribe((res)=>{
      const data = res.body.users.userRoles.menus;
      this.menu = data;
      localStorage.setItem('venuesID', res.body.users.users.venueId);
      this.getVenue();     
    });
  }

  async getVenue(){ 
    const venuesID = localStorage.getItem('venuesID');
    this.apiService.getVenue(venuesID).subscribe((res)=>{
     localStorage.setItem('CurrencySymbol', res.body.venues.currencySymbol);
    });
  }

  

}
