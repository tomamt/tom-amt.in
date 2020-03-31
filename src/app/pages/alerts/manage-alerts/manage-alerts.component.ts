import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from '../../../../app/services/api.service';
import { ToasterConfig } from 'angular2-toaster';
import { Router, ActivatedRoute } from '@angular/router';

import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService, NbDialogService} from '@nebular/theme';
import { AuthService } from '../../../services/auth.service';
import { EnvironmentService } from '../../../../environments/environment.service';
import { NgxSpinnerService } from "ngx-spinner";
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { Observable } from 'rxjs/Observable';
//import {Event} from '../../../models/event';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { SmartTableData } from '../../../@core/data/smart-table';
import { ManageProblemsComponent } from '../dialog/manage-problems/manage-problems.component';
import * as io from 'socket.io-client';
import { Subscription } from 'rxjs';
import { SocketService } from '../../../services/socket.service';
export interface DialogData {
  animal: string;
  name: string;
}

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
  selector: 'ngx-anage-alerts',
  templateUrl: './manage-alerts.component.html',
  styleUrls: ['./manage-alerts.component.scss']
})

export class ManageAlertsComponent implements OnInit {
  
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
    totalItems: null
  };
  CrewIssueList:any = [];
  
  //sorting
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
    private toastrService: NbToastrService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private envService: EnvironmentService,
    public dialog: MatDialog,
    private socketservices:SocketService) {
    /*  orderlistService.messages.subscribe(msg => {
        console.log("Response from websocket: " + msg);
      });*/
      this.socketURL = this.envService.read('socketURL');
    //console.log(" this.socketURL", this.socketURL)
   
  }

  ngOnInit(){
   
    this.CrewIssuesList();
    this.socketLiveOrder();
  }
  socketLiveOrder(){
    this.socketservices.connect();
    this.socketSubscription = this.socketservices.getcrewIssue().subscribe(message => {
     
      this.orderstatus(message);
    });
  }
 

 orderstatus(data){
   //console.log("data",data)
   if( this.page.currentPage == 1){
     let oredrfiredData = JSON.parse(data);
     this.removeByAttr(this.CrewIssueList, '_id', oredrfiredData._id); 
     this.CrewIssueList.unshift(oredrfiredData);
   }else{
     this.CrewIssuesList()
   }
  
   //this.orderListAll
 }
 removeByAttr (arr, attr, value){
   var i = arr.length;
   while(i--){
      if( arr[i] 
          && arr[i].hasOwnProperty(attr) 
          && (arguments.length > 2 && arr[i][attr] === value ) ){ 

          arr.splice(i,1);

      }
   }
   return arr;
}
  editorder(order){
    localStorage.setItem('OrderID', order._id);
    this.router.navigate(['/pages/orders/view-orders']); 
  }

  CrewIssuesList(){
    this.spinner.show();
      this.apiService.Issueslist('crew-issue', this.page).subscribe((res)=>{
        this.spinner.hide();
       this.CrewIssueList=res.issues;
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
    this.CrewIssuesList();
  }
  addButton(data): void {
    const context = { text: 'Text to be set in window text property' };
    const dialogRef = this.dialog.open(ManageProblemsComponent, {
      width: '800px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result && result == 'success'){
        this.CrewIssuesList();
    }
    });
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