import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import * as io from 'socket.io-client';
import { SocketService } from '../../../services/socket.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'ngx-view-orders',
  templateUrl: './view-orders.component.html',
  styleUrls: ['./view-orders.component.scss']
})
export class ViewOrdersComponent implements OnInit {
  socketSubscription: Subscription;
  constructor(private apiService: ApiService,
    private socketservices:SocketService,
    private router: Router) {

  }

  orderdetails:any;
  currency:any;
  ngOnInit() {
    this.getOrderdetails(localStorage.getItem('OrderID'));
    this.socketLiveOrder();
    this.currency =localStorage.getItem('CurrencySymbol');
  }

  previousPage(){
    window.history.back();
  }
  
 socketLiveOrder(){
  this.socketservices.connect();
  this.socketSubscription = this.socketservices.getNotification().subscribe(message => {
   
    this.orderstatus(message)
  });
}


 orderstatus(data){
  let oredrfiredData = JSON.parse(data);
   if(this.orderdetails._id === oredrfiredData._id){
    this.orderdetails = oredrfiredData;
   }
    
 }
 
  getOrderdetails(id){
    this.apiService.getOrderdetails(id).subscribe((res)=>{
      this.orderdetails=res.body['order'];
      //console.log('this.orderdetails',this.orderdetails);
    })
  }

}
