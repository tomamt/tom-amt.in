import { Component, OnInit, Input } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { SmartTableData } from '../../../@core/data/smart-table';
import { ApiService } from '../../../../app/services/api.service';
import { NbDialogService } from '@nebular/theme';
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
//import {Event} from '../../../models/event';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';

import { EnvironmentService } from '../../../../environments/environment.service';
export class PageState {
  currentPage: number;
  pageSize: number;
  totalItems?: number;
  numberOfPages?: number;
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
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.scss'],
})
export class RatingsComponent implements OnInit {
  
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
  
  page: PageState = {
    currentPage : 1,
    pageSize : 10,
    totalItems: null
  };
  ratingListAll:any = [];
  
  //sorting
  key: string = 'createdDate';
  reverse: boolean = false;
 
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
  constructor(private service: SmartTableData, 
    private apiService: ApiService,
    private auth: AuthService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,private envService: EnvironmentService) {
      
  }

  currency:any;
  ngOnInit(){
    this.ratingList();
    this.currency =localStorage.getItem('CurrencySymbol');
  }

  editorder(order){
    localStorage.setItem('OrderID', order.orderId._id);
    this.router.navigate(['/pages/orders/view-rating']); 
  }

  ratingList(){
    this.spinner.show();
    this.apiService.ratings(this.page).subscribe((res)=>{
      this.spinner.hide();
      this.ratingListAll=res.ratings;
      this.page = {
        currentPage : this.page.currentPage,
        pageSize : 10,
        totalItems: res.totalCount
      };
    });
    
    
  }

  setPage(pageState: PageState) {
    this.page = {
      currentPage : pageState.currentPage,
      pageSize : 10,
      totalItems: pageState.totalItems
    };
    this.ratingList();
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
