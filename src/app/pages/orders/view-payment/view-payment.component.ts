import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import * as io from 'socket.io-client';
import { SocketService } from '../../../services/socket.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'ngx-view-payment',
  templateUrl: './view-payment.component.html',
  styleUrls: ['./view-payment.component.scss']
})
export class ViewPaymentComponent implements OnInit {
  socketSubscription: Subscription;
  constructor(private apiService: ApiService,
    private socketservices:SocketService,
    private router: Router) {

  }

  PaymentDetails:any;
  currency:any;
  ngOnInit() {
    this.getPaymentDetails(localStorage.getItem('PaymentID'));
    this.currency =localStorage.getItem('CurrencySymbol');
  }
 
  previousPage(){
    window.history.back();
  }

  getPaymentDetails(id){
    this.apiService.getPaymentDetails(id).subscribe((res)=>{
      this.PaymentDetails=res.body.transactions;
      //console.log('this.PaymentDetails',this.PaymentDetails);
    })
  }

}
