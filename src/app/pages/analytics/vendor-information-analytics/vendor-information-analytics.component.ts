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
  
@Component({
  selector: 'ngx-smart-table',
  templateUrl: './vendor-information-analytics.component.html',
  styleUrls: ['./vendor-information-analytics.component.scss'],
})

export class VendorInformationAnalyticsComponent implements OnInit {  
  datepickerChanges:boolean = false;
  vendorList:any[]=[];
  datagrouped:any[] =[];
  data:any[] = [];
  data2:any[] = [];
  viaAnalytics = [{label:'Orders', value:{id:1,type:'Orders'}},{label:'Sales', value:{id:2,type:'Sales'}},{label:'Location', value:{id:3,type:'Location'}},
  /*{label:'Order Category', value:{id:4,type:'Order Category'}}*/]
  selected: any;
  alwaysShowCalendars: boolean;
  showRangeLabelOnInput: boolean;
  keepCalendarOpeningWithRange: boolean;
  showchart:boolean = false;
  maxDate: moment.Moment;
  minDate: moment.Moment;
  startDate:any;
  endDate:any;
  invalidDates: moment.Moment[] = [];
  selectedVendor:any ;
  dateGrouped:Date;
  chartTitle:any='';
  selectedVIAanalytics:any = {id:1,type:'Orders'}
  viaType:string = 'vendors-orders';
  ranges: any = {
    Today: [moment(), moment()],
    Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [
      moment()
        .subtract(1, 'month')
        .startOf('month'),
      moment()
        .subtract(1, 'month')
        .endOf('month')
    ],
    'Last 3 Month': [
      moment()
        .subtract(3, 'month')
        .startOf('month'),
      moment()
        .subtract(1, 'month')
        .endOf('month')
    ]
  };

  isInvalidDate = (m: moment.Moment) =>  {
    return this.invalidDates.some(d => d.isSame(m, 'day') );
  }
  timezone: any;
  constructor(private service: SmartTableData, 
    private apiService: ApiService,
    private auth: AuthService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private router: Router) {
      this.datagrouped = [{"State":"CA","Under 5 Years":2704659,"5 to 13 Years":4499890,"14 to 17 Years":2159981,"18 to 24 Years":3853788,"25 to 44 Years":10604510,"45 to 64 Years":8819342,"65 Years and Over":4114496},{"State":"TX","Under 5 Years":2027307,"5 to 13 Years":3277946,"14 to 17 Years":1420518,"18 to 24 Years":2454721,"25 to 44 Years":7017731,"45 to 64 Years":5656528,"65 Years and Over":2472223},{"State":"NY","Under 5 Years":1208495,"5 to 13 Years":2141490,"14 to 17 Years":1058031,"18 to 24 Years":1999120,"25 to 44 Years":5355235,"45 to 64 Years":5120254,"65 Years and Over":2607672},{"State":"FL","Under 5 Years":1140516,"5 to 13 Years":1938695,"14 to 17 Years":925060,"18 to 24 Years":1607297,"25 to 44 Years":4782119,"45 to 64 Years":4746856,"65 Years and Over":3187797},{"State":"IL","Under 5 Years":894368,"5 to 13 Years":1558919,"14 to 17 Years":725973,"18 to 24 Years":1311479,"25 to 44 Years":3596343,"45 to 64 Years":3239173,"65 Years and Over":1575308},{"State":"PA","Under 5 Years":737462,"5 to 13 Years":1345341,"14 to 17 Years":679201,"18 to 24 Years":1203944,"25 to 44 Years":3157759,"45 to 64 Years":3414001,"65 Years and Over":1910571}];
      this.maxDate = moment().add(0,  'weeks');
    this.minDate = moment().subtract(3, 'days');
    this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.alwaysShowCalendars = true;
    this.keepCalendarOpeningWithRange = true;
    this.showRangeLabelOnInput = true;
    this.dateGrouped = new Date()
    this.selected = {startDate: moment().subtract(365, 'days'), endDate: moment()};
    setTimeout(() => {
      this.invalidDates = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];
    }, 5000);
   
      
      
  }
  rangeClicked(range) {
  }
  datesUpdated(range) {
   
    var m = moment(this.selected.startDate);
            m.set({hour:0,minute:0,second:0,millisecond:0})
    
    this.startDate = m.format('YYYY-MM-DD 00:00');
    this.endDate = moment(this.selected.endDate).format('YYYY-MM-DD 23:59');
    this.viaAirportAnalytics()
  }
  onDateSelect(event){
    var m = moment(event);
    m.set({hour:0,minute:0,second:0,millisecond:0})
    var r = moment(event);
    r.set({hour:23,minute:59,second:59,millisecond:59})


this.startDate = m.format('YYYY-MM-DD 00:00');
this.endDate = r.format('YYYY-MM-DD 23:59');
  }
  ngOnInit() { 
     var m = moment(this.selected.startDate);
            m.set({hour:0,minute:0,second:0,millisecond:0})
    
    this.startDate = m.format('YYYY-MM-DD 00:00');
    this.endDate = moment(this.selected.endDate).format('YYYY-MM-DD 23:59');
    this.vendorsList();
   
  }

  vendorsList(){
    this.apiService.getvendorList().subscribe((res)=>{
      this.vendorList = [];
      res.vendors.map(data =>{
        this.vendorList.push(
          {label:data.name, value:{id:data._id, name: data.name}})
      })
      if(this.vendorList.length>0){
        this.selectedVendor = this.vendorList[0].value;
        this.viaAirportAnalytics()
      }
    });
  }
 
  vendorSelect(terminalData){
    this.selectedVendor = terminalData;
    this.viaAirportAnalytics();

  }
  viaAnalyticsvendorSelect(viaType){
    if(this.selectedVIAanalytics.type == 'Order Category'){
      var m = moment(this.dateGrouped);
      m.set({hour:0,minute:0,second:0,millisecond:0})
      this.startDate = m.format('YYYY-MM-DD 00:00');
      this.endDate = moment(this.dateGrouped).format('YYYY-MM-DD 23:59');
      this.datepickerChanges= true;
      this.viaAirportAnalytics();
    }else{
      this.selectedVIAanalytics = viaType;
      this.datepickerChanges= false;
      this.viaAirportAnalytics();
    }
    
  }
  viaAirportAnalytics(){
    //let statrdate = new Date(this.selected.startDate).setUTCHours(0,0,0,0);
    if(this.selectedVendor && this.selectedVIAanalytics){
      if(this.selectedVIAanalytics.type == 'Orders'){
        this.viaType = 'vendors-orders';
        this.chartTitle = "Monthly Orders";
      }else if(this.selectedVIAanalytics.type == 'Sales'){
        this.viaType = 'vendors-sales';
        this.chartTitle = "Montly Sales";
      }else if(this.selectedVIAanalytics.type == 'Location'){
        this.viaType = 'vendors-location';
        this.chartTitle = "Drop off Location";
      }else if(this.selectedVIAanalytics.type == 'Order Category'){
        this.viaType = 'vendors-location'
        this.chartTitle = "Order Category";
      }
      var statrdate = new Date(this.startDate).toISOString();
      var endDate = new Date(this.endDate).toISOString();
      let arg = {
        type: this.viaType,
        vendorid: this.selectedVendor.id,
        startDate:statrdate,
        endDate:endDate,
        timezone:this.timezone
      }
     
      this.apiService.VIAAnalytics(arg).subscribe((res)=>{
        let dataChart = [];
        
        if(this.selectedVIAanalytics.type == 'Orders' ){
         
          res.chartData.map(data =>{
            dataChart.push(
              {month:data.monthName, count: data.count})
          })
          if(dataChart.length>0){
            this.showchart = true;
            this.data = [{type:'Orders',data:dataChart}];
          }else{
            this.showchart = false;
            this.data = []
          }
        }else if(this.selectedVIAanalytics.type == 'Sales'){
         
          res.chartData.map(data =>{
            dataChart.push(
              {month:data.monthName, count: data.count})
          })
          if(dataChart.length>0){
            this.showchart = true;
            this.data = [{type:'Sales',data:dataChart}];
          }else{
            this.showchart = false;
            this.data = []
          }
        }else if(this.selectedVIAanalytics.type == 'Location'){ 
          res.chartData.map(data =>{
            dataChart.push(
              {month:data.name, count: data.orderCount})
          })
          if(dataChart.length>0){
            this.data =  [{type:'Location',data:dataChart}];;
          }else{
            this.showchart = true;
            this.data = [];
            this.showchart = false;
          }
        }else if(this.selectedVIAanalytics.type == 'Order Category'){

        }
        
      })
    }
   
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

