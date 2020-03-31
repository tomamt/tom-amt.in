import { Component, OnInit, Input } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { SmartTableData } from '../../../@core/data/smart-table';
import { ApiService } from '../../../../app/services/api.service';

import { Router } from '@angular/router';

import { ToasterConfig } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus,
  NbGlobalPhysicalPosition,
  NbToastrService,
 } from '@nebular/theme';
import { AuthService } from '../../../services/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { tickFormat } from '@swimlane/ngx-charts';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import * as io from 'socket.io-client';
import { EnvironmentService } from '../../../../environments/environment.service';
import { SocketService } from '../../../services/socket.service';
import { Subscription } from 'rxjs';
export class PageState {
  currentPage: number;
  pageSize: number;
  totalItems?: number;
  numberOfPages?: number;
  search?: string;
} 
export class PaginateOptions {
  spanPages: number;
  firstPage: boolean;
  previousPage: boolean;
  nextPage: boolean;
  lastPage: boolean;
  titles: {
    firstPage: string;
    lastPage: string;
    previousPage: string;
    nextPage: string;
  };
 
}
@Component({
  selector: 'ngx-smart-table',
  templateUrl: './live-orders.component.html',
  styleUrls: ['./live-orders.component.scss'],
})
export class LiveOrdersComponent implements OnInit {
  
  defaults: PaginateOptions = {
    spanPages : 2,
    previousPage: true,
    nextPage: true,
    firstPage: true,
    lastPage: true,
    titles: {
      firstPage: '<<',
      previousPage: '<',
      lastPage: '>>',
      nextPage: '>',
    },
   
  };
  socketURL:any = '';
  page: PageState = {
    currentPage : 1,
    pageSize : 10,
    totalItems: null,
    search: ""
  };

  orderListAll:any = [];
  
  key: string = 'createdDate';
  reverse: boolean = false;
  socket: SocketIOClient.Socket;
  
  sort(key){
    this.key = key;
    this.reverse = !this.reverse;
  }
  p: number = 1;
  ioConnection: any;
  @Input() products$: Observable<any>;
  userid:any;
  vendorId:string = null;
  messages: any[] = [];
  socketSubscription: Subscription;
  constructor(private service: SmartTableData, 
    private apiService: ApiService,
    private auth: AuthService,
    
    private toastrService: NbToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,private envService: EnvironmentService,
    private socketservices:SocketService) {
      this.socketURL = this.envService.read('socketURL');
  }

  currency: any;
  currentDateTime: any;
  ngOnInit(){
    this.spinner.show();
    this.orderList();
    this.socketLiveOrder()
    this.currency =localStorage.getItem('CurrencySymbol');  
    const dateobj = new Date(); 
    this.currentDateTime= dateobj.toISOString();  
  }

  socketLiveOrder(){
    this.socketservices.connect();
    this.socketSubscription = this.socketservices.getNotification().subscribe(message => {
      //console.log('socketLiveOrder',message)
      this.orderstatus(message)
    });
  }

  orderstatus(data){
    if( this.page.currentPage == 1){
      let oredrfiredData = JSON.parse(data);
      if(localStorage.getItem('UserRole') == 'vendor'){ 
        this.vendorId =localStorage.getItem('VendorID'); 
        if(oredrfiredData.vendorId._id == this.vendorId){
          this.removeByAttr(this.orderListAll, '_id', oredrfiredData._id); 
          this.orderListAll.unshift(oredrfiredData);
        }
      } else {
        this.removeByAttr(this.orderListAll, '_id', oredrfiredData._id); 
        this.orderListAll.unshift(oredrfiredData);
      }
    } else {
      this.orderList()
    }
  }
  
  searchField:any = '';
  search(){
    if(this.searchField!= undefined){
      this.page.search = this.searchField;
      this.orderList();
    }
  }

  removeByAttr (arr, attr, value){
    var i = arr.length;
    while(i--){
      if( arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value ) ){ 
          arr.splice(i,1);
      }
    }
    return arr;
  }

  editorder(order){
    localStorage.setItem('OrderID', order._id);
    this.router.navigate(['/pages/orders/view-orders']); 
  }

  orderList(){
    if(localStorage.getItem('UserRole') == 'vendor'){ 
      this.vendorId =localStorage.getItem('VendorID'); 
    } else {
     this.vendorId = "";
    }
    if(this.searchField && this.searchField.length>0){
      this.spinner.show();
    }
    this.apiService.orderList(this.vendorId, this.page, 'now').subscribe((res)=>{
      this.spinner.hide();
      this.orderListAll=res.orders;
      this.page = {
        currentPage : this.page.currentPage,
        pageSize : 10,
        totalItems: res.totalCount,
        search: this.searchField
      };
    });
  }

  setPage(pageState: PageState) {
    this.page = {
      currentPage : pageState.currentPage,
      pageSize : 10,
      totalItems: pageState.totalItems,
      search: this.searchField
    };
    this.orderList();
  }

  public addButton(event){

  }

  public deleteButton(event){
    
  }

  public editButton(event){
    
  }
  
  config: ToasterConfig;

  private showToast(type: NbComponentStatus, body: string, title: string) {
    const config = {
      status: type,
      destroyByClick: true,
      duration: 2000,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      preventDuplicates: false,
    };
    const titleContent = title ? `${title}` : '';
    this.toastrService.show(
      body,
      `${titleContent}`,
      config);
  }

}
