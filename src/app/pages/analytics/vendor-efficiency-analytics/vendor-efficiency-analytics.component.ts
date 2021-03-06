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
  selector: 'ngx-vendor-efficiency-analytics',
  templateUrl: './vendor-efficiency-analytics.component.html',
  styleUrls: ['./vendor-efficiency-analytics.component.scss']
})
export class VendorEfficiencyAnalyticsComponent {

  datepickerChanges:boolean = false;
  startDate:any;
  endDate:any;
  datagrouped:any[] =[];
  fullFillement:any[] = [];
  dateGrouped:Date;
  cancellationgrouped:any[] = []
  selected: any;
  alwaysShowCalendars: boolean;
  showRangeLabelOnInput: boolean;
  keepCalendarOpeningWithRange: boolean;
  maxDate: moment.Moment;
  minDate: moment.Moment;
  vendorList: any;
  selectedVendor: any;
  invalidDates: moment.Moment[] = [];
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

  timezone: any;
  constructor(private service: SmartTableData, 
    private apiService: ApiService,
    private auth: AuthService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private router: Router) {
     let r = {"status":true,"chartData":[{"time":"tx","0":12,"15":13,"30":14,"45":24},{"time":"r","0":3,"15":5,"30":6,"45":4}]}
    this.dateGrouped = new Date()
    this.maxDate = moment().add(0,  'weeks');
    this.minDate = moment().subtract(3, 'days');
    this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    this.alwaysShowCalendars = true;
    this.keepCalendarOpeningWithRange = true;
    this.showRangeLabelOnInput = true;
    this.selected = {startDate: moment().subtract(1, 'years'), endDate: moment()};
    setTimeout(() => {
      this.invalidDates = [moment().add(2, 'days'), moment().add(3, 'days'), moment().add(5, 'days')];
    }, 5000);
      
  }

  ngOnInit() { 
    var m = moment(this.selected.startDate);
            m.set({hour:0,minute:0,second:0,millisecond:0})
    
    this.startDate = m.format('YYYY-MM-DD');
    this.endDate = moment(this.selected.endDate).format('YYYY-MM-DD');
   // this.AvgOderTime();
   // this.ratingefficiancy();
    this.vendorsList();
  }

  rangeClicked(range) {

  }

  datesUpdated(range) {
    var m = moment(this.selected.startDate);
    m.set({hour:0,minute:0,second:0,millisecond:0})
    
    this.startDate = m.format('YYYY-MM-DD 00:00');
    this.endDate = moment(this.selected.endDate).format('YYYY-MM-DD 23:59');
    this.AvgOderTime();
    this.AavgfullFillement();
  }

  onDateSelect(event){
    var m = moment(event);
    m.set({hour:0,minute:0,second:0,millisecond:0})
    var r = moment(event);
    r.set({hour:23,minute:59,second:59,millisecond:59})
    this.startDate = m.format('YYYY-MM-DD 00:00');
    this.endDate = r.format('YYYY-MM-DD 23:59');
    this.AvgOderTime();
    this.AavgfullFillement();
  }
  
  datagroupedChart:boolean=false;
  AvgOderTime(){
    this.datagroupedChart = false;
   /* var m = moment(this.selected.startDate);
    m.set({hour:0,minute:0,second:0,millisecond:0})
    
    this.startDate = m.format('YYYY-MM-DD');
    this.endDate = moment(this.selected.endDate).format('YYYY-MM-DD');*/
    var statrdate = new Date(this.startDate).toISOString();
    var endDate = new Date(this.endDate).toISOString();
    if(!this.selectedVendor){
      return;
    }
    let arg = {
      startDate: statrdate,
      endDate: endDate,
      vendorID: this.selectedVendor.id,
      timezone:this.timezone
    }
    
    this.apiService.VEAAavgOrderTime(arg).subscribe((res)=>{
      if(res.chartData.length>0){
        this.datagrouped = res.chartData;
        if(res.chartData && res.chartData[0] && res.chartData[0].avgTime >= 0){
          this.datagroupedChart = true;
        }
      }else{
        this.datagrouped = []
      }
     
    })
  }
  fullFillementChart:boolean=false;
  AavgfullFillement(){
    this.fullFillementChart=false;
   /* var m = moment(this.selected.startDate);
    m.set({hour:0,minute:0,second:0,millisecond:0})
    
    this.startDate = m.format('YYYY-MM-DD');
    this.endDate = moment(this.selected.endDate).format('YYYY-MM-DD');*/
    var statrdate = new Date(this.startDate).toISOString();
    var endDate = new Date(this.endDate).toISOString();
    if(!this.selectedVendor){
      return;
    }
    let arg = {
      startDate: statrdate,
      endDate: endDate,
      vendorID: this.selectedVendor.id,
      timezone:this.timezone
    }
   
    this.apiService.VEAAavgfullFillementTime(arg).subscribe((res)=>{
      if(res.chartData.length>0){
        this.fullFillement = res.chartData;
        if(res.chartData && res.chartData[0] && res.chartData[0].avgTime >= 0){
          this.fullFillementChart=true;
        }
        
      }else{
        this.fullFillement = []
      }
    })
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
        this.AvgOderTime();
        this.AavgfullFillement();
      }
    });
  }

  vendorSelect(terminalData){
    this.selectedVendor = terminalData;
    this.AvgOderTime();
    this.AavgfullFillement();
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

