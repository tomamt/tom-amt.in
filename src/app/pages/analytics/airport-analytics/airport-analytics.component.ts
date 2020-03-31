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
  selector: 'ngx-airport-analytics',
  templateUrl: './airport-analytics.component.html',
  styleUrls: ['./airport-analytics.component.scss']
})
export class AirportAnalyticsComponent implements OnInit {  
  termnalList:any[]=[];
  data:any[] = [];
  data2:any[] = [];
  
  selected: any;
  alwaysShowCalendars: boolean;
  showRangeLabelOnInput: boolean;
  keepCalendarOpeningWithRange: boolean;
  maxDate: moment.Moment;
  minDate: moment.Moment;
  startDate:any;
  endDate:any;
  invalidDates: moment.Moment[] = [];
  selectedTerminal:any ;
  showchart: boolean = false;
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

    this.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      this.maxDate = moment().add(0,  'weeks');
    this.minDate = moment().subtract(3, 'days');
    
    this.alwaysShowCalendars = true;
    this.keepCalendarOpeningWithRange = true;
    this.showRangeLabelOnInput = true;
    this.selected = {startDate: moment().subtract(30, 'days'), endDate: moment()};
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
    this.airportAnalytics()
  }
  ngOnInit() { 
    
    this.teminalList();
   
  }

  teminalList(){
    this.apiService.getTerminalList().subscribe((res)=>{
      this.termnalList = [];

      res.deliveryAreas.map(data =>{
        this.termnalList.push(
          {label:data.name, value:{id:data._id, name: data.name}})
      })
      if(this.termnalList.length>0){
        this.selectedTerminal = this.termnalList[0].value;
        this.airportAnalytics()
      }
    });
  }
  terminalSelect(terminalData){
    this.selectedTerminal = terminalData;
    this.airportAnalytics();

  }
  airportAnalytics(){
    var statrdate = new Date(this.startDate).toISOString();
    var endDate = new Date(this.endDate).toISOString();
    
    if(this.selectedTerminal){
      let arg = {
        terminalid: this.selectedTerminal.id,
        startDate:statrdate,
        endDate:endDate,
        timezone:this.timezone
      }
     
      this.apiService.airportAnalytics(arg).subscribe((res)=>{
        let dataChart = [];
        res.gate.map(data =>{
          dataChart.push(
            {gate:data.name, deliveries: data.orderCount})
        })
        if(dataChart.length>0){
          this.showchart = true;
          this.data = dataChart;
        } else {
          this.showchart = false;
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
