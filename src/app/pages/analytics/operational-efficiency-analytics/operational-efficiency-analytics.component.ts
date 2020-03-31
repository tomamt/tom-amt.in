import { Component, OnInit } from '@angular/core';
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
import * as moment from 'moment';
import { DeliveryDuration } from './linechart-chart-oea/DeliveryDurationModel';

  

@Component({
  selector: 'ngx-edit-menu',
  templateUrl: './operational-efficiency-analytics.component.html',
  styleUrls: ['./operational-efficiency-analytics.component.scss']
})

export class OperationalEfficiencyAnalyticsComponent implements OnInit {
  datepickerChanges:boolean = false;
  startDate:any;
  endDate:any;
  datagrouped:any[] =[];
  ratinggrouped:any[] = []; 
  dateGrouped:Date;
  cancellationgrouped:any[] = [] 
  deliverydurationdata:DeliveryDuration = new DeliveryDuration();
  sucessdeliverydata:any[] = [];
  
  timezone: any;
  maxDate: any;
  constructor(private service: SmartTableData, 
    private apiService: ApiService,
    private auth: AuthService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private router: Router) {
    this.dateGrouped = new Date()
    this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;   
  }

  ngOnInit() { 
    this.maxDate = new Date();
    var m = moment(new Date());
    m.set({hour:0,minute:0,second:0,millisecond:0})
    this.startDate = m.format('YYYY-MM-DD 00:00');
    this.endDate = moment(new Date()).format('YYYY-MM-DD 23:59');
    this.ordersefficiancy();
    this.ratingefficiancy();
    this.cancellationefficiancy();
    this.deliveryduration();
    this.sucessfulldeliveries();
  }

  rangeClicked(range) {
  }

  datesUpdated(range) {
    this.ordersefficiancy();
    this.ratingefficiancy();
    this.cancellationefficiancy();
    this.deliveryduration();
    this.sucessfulldeliveries();
  }

  onDateSelect(event){
    var m = moment(event);
    m.set({hour:0,minute:0,second:0,millisecond:0})
    var r = moment(event);
    r.set({hour:23,minute:59,second:59,millisecond:59})
    this.startDate = m.format('YYYY-MM-DD 00:00');
    this.endDate = r.format('YYYY-MM-DD 23:59');
    this.ordersefficiancy();
    this.ratingefficiancy();
    this.cancellationefficiancy();
    this.deliveryduration();
    this.sucessfulldeliveries();  
  }

  ordersefficiancy(){
    var startDate = new Date(this.startDate).toISOString();
    var endDate = new Date(this.endDate).toISOString();
    let arg = {
      startDate:startDate,
      endDate:endDate,
      timezone:this.timezone
    }
    
    this.apiService.VEAAnalytics(arg).subscribe((res)=>{
      if(res.chartData.length>0){
        this.datagrouped = [{type:"orders", data: res.chartData}];
        this.datagrouped
      }else{
        this.datagrouped = []
      }
    })
  }

  ratingefficiancy(){
    var startDate = new Date(this.startDate).toISOString();
    var endDate = new Date(this.endDate).toISOString();
    let arg = {
      startDate:startDate,
      endDate:endDate,
      timezone:this.timezone
    }
    this.apiService.ratingAnalytics(arg).subscribe((res)=>{
      if(res.chartData.length>0){
        this.ratinggrouped = [{type:"ratings", data: res.chartData}];
      }else{
        this.ratinggrouped = []
      }
    })
  }
  deliveryduration(){
    var startDate = new Date(this.startDate).toISOString();
    var endDate = new Date(this.endDate).toISOString();
    let arg = {
      startDate:startDate,
      endDate:endDate,
      timezone:this.timezone
    }
    this.apiService.deliverydurationAnalytics(arg).subscribe((res)=>{
        res.datavalid = false;

      if(res.status && res.chartData.length > 0){
        res.chartData.forEach((element,i) => {
          element.chartData.forEach(element => {
            if(element.avgTime != null && element.avgTime != 0){
              res.datavalid = true;
            }
           // element.avgTime = Math.floor(Math.random() * 20) + 1   ;
            element.time = new Date("1/1/2020 " + element.time + ":00")
          });
        });
         this.deliverydurationdata = res;
      }else{
        this.deliverydurationdata = new DeliveryDuration();

      }
    })
  }
  cancellationefficiancy(){
    var startDate = new Date(this.startDate).toISOString();
    var endDate = new Date(this.endDate).toISOString();
    let arg = {
      startDate:startDate,
      endDate:endDate,
      timezone:this.timezone
    }
    this.apiService.cancellationAnalytics(arg).subscribe((res)=>{
      
      if(res.chartData.length > 0){
        this.cancellationgrouped = [{type:"cancellations", data: res.chartData}];
      }else{
        this.cancellationgrouped = []
      }
    })
  }
  sucessDeliveryEnable:boolean;
  sucessfulldeliveries(){
    var startDate = new Date(this.startDate).toISOString();
    var endDate = new Date(this.endDate).toISOString();
    let arg = {
      startDate:startDate,
      endDate:endDate,
      timezone:this.timezone
    }
    this.apiService.sucessfulldeliveries(arg).subscribe((res)=>{ 
      this.sucessdeliverydata = res;
      if(res && res.chartData && res.chartData.length){   
        this.sucessDeliveryEnable = true;
      } else {
        this.sucessDeliveryEnable = false;
      }
    })
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

