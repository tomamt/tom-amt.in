import { Component, OnInit, Input } from '@angular/core';
import { SmartTableData } from '../../../@core/data/smart-table';
import { ApiService } from '../../../../app/services/api.service';
import { NbDialogService } from '@nebular/theme';
import { Router } from '@angular/router';
import { ToasterConfig } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { AuthService } from '../../../services/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/switchMap';
import { EnvironmentService } from '../../../../environments/environment.service';
import { SocketService } from '../../../services/socket.service';
import { Subscription } from 'rxjs';
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
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss'],
})
export class PaymentsComponent implements OnInit {
  
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
  paymentsList:any = [];
  
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
  socketURL:any = '';
  socketSubscription: Subscription;
  constructor(private service: SmartTableData, 
    private apiService: ApiService,
    private auth: AuthService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private envService: EnvironmentService,
    private socketservices:SocketService) {
      this.socketURL = this.envService.read('socketURL');
  }

  currency:any;
  ngOnInit(){
    this.payments();
    this.socketPayments()
    this.currency =localStorage.getItem('CurrencySymbol');
  }

  socketPayments(){
    this.socketservices.connect();
    this.socketSubscription = this.socketservices.getPaymentList().subscribe(message => {
      this.paymentStatus(message)
    });
  }

  paymentStatus(data){
    if( this.page.currentPage == 1){
      let oredrfiredData = JSON.parse(data);
      oredrfiredData.paymentType = oredrfiredData.orderId.paymentMethod;
      oredrfiredData.amount = oredrfiredData.orderId.totalAmount;
      this.removeByAttr(this.paymentsList, '_id', oredrfiredData._id); 
      this.paymentsList.unshift(oredrfiredData);
    } else {
      this.payments()
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

  viewPayment(payment){
    localStorage.setItem('PaymentID', payment._id);
    this.router.navigate(['/pages/orders/view-payments']); 
  }

  payments(){
    this.spinner.show();
    this.apiService.payments(this.vendorId, this.page, 'past').subscribe((res)=>{
      this.spinner.hide();
      this.paymentsList=res.transactions;
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
    this.payments();
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
