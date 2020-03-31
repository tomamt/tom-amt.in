import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { ToasterConfig } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';
import { NbComponentStatus,
  NbGlobalPhysicalPosition,
  NbToastrService,
 } from '@nebular/theme';
import { AuthService } from '../../../services/auth.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { UploadFileService } from '../../../services/upload-file.service';
import { EnvironmentService } from '../../../../environments/environment.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NgbModal,ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { SmartTableData } from '../../../@core/data/smart-table';

@Component({
  selector: 'ngx-profile',
  templateUrl: './view-delivery-agent.component.html',
  styleUrls: ['./view-delivery-agent.component.scss']
})
export class ViewDeliveryAgentComponent implements OnInit {
 
  userprofile:any;
  deliveryAgentId:any;
  agentDetails:any;
  
  tabSelct: any = '0';
  currency: any;
  dateRange:any;
  
  constructor(private apiService: ApiService,config: NgbModalConfig,
    private auth: AuthService,
    private toastrService: NbToastrService,
    private uploadService:UploadFileService,
    public envService: EnvironmentService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private router: Router,
    private service: SmartTableData) {
   
    this.deliveryAgentId = localStorage.getItem('deliveryAgentId');
    this.getDeliveryAgentDetails(this.deliveryAgentId); 
    this.getDeliveryAgentByid(this.deliveryAgentId); 
    this.getDeliveryAgentWorkingHours(this.deliveryAgentId);    
    this.getDeliveryAgentCueentQueue(this.deliveryAgentId);        
  }
  deliveryAgentCueentQueue:any = [];
  status:any;
  
  ngOnInit() {
    this.getStatus();
    this.currency =localStorage.getItem('CurrencySymbol');
    this.getTerminals(localStorage.getItem('venuesID')); 
  }

  previousPage(){
    window.history.back();
  }
  

  getDeliveryAgentDetails(id){   
    this.apiService.getDeliveryAgentDetails(id).subscribe((res)=>{
      this.userprofile=res.body.users.users;
    });
  }

  getDeliveryAgentByid(id){ 
    this.agentDetails = {};  
    this.apiService.getDeliveryAgentByid(id).subscribe((res)=>{
      if(res.body.deliveryAgents && res.body.deliveryAgents[0]){
        this.agentDetails=res.body.deliveryAgents[0];
      }
      
      if(!this.agentDetails.phoneNumber){
        this.agentDetails.phoneNumber = "";
      }
      if(!this.agentDetails.empId){
        this.agentDetails.empId = "";
      }
      /*if(!this.agentDetails.deliveryAreaId){
        this.agentDetails.deliveryAreaId = "";
      }*/
    });
  }

  source: LocalDataSource = new LocalDataSource();
  agentWorkingHours : any;
  totalWorkingHours: any;
  noShowCount: any;

  getDeliveryAgentWorkingHours(id){   
    this.apiService.getDeliveryAgentWorkingHours(id,'','').subscribe((res)=>{
      const data = res.body.daWorkingHours.agentWorkingRes;
      this.totalWorkingHours = res.body.daWorkingHours.totalHours;
      this.noShowCount = res.body.daWorkingHours.noShowCount;
      this.agentWorkingHours = data;
      this.source.load(data); 
    });
  }

  public getStatus(){
    this.status = [
      { value: 'active', label: 'Active' },
      { value: 'locked', label: 'Inactive' },
    ];
  }

  terminals: any;
  public getTerminals(id){
    this.apiService.getTerminals(id).subscribe((res)=>{
      const data = res.body.deliveryAreas;
      this.terminals = data;
    });
  }

  public getDeliveryAgentCueentQueue(id){
    this.apiService.getDeliveryAgentCueentQueue(id).subscribe((res)=>{
      const data = res.body['orders'];
      this.deliveryAgentCueentQueue = data;
      
    });
  }

  savedetails(){
    if(!this.userprofile.name || !this.userprofile.status || 
      !this.agentDetails.empId || !this.agentDetails.phoneNumber ){
        this.showToast('danger', '', 'Please enter the required fields');  
        return; 
    }
    this.spinner.show();
    this.apiService.UpdateDeliveyAgent(this.userprofile).subscribe((res)=>{
      if(this.agentDetails._id){
        this.apiService.UpdateDeliveyAgentByID(this.agentDetails).subscribe((res)=>{
          this.spinner.hide();
          if(res.status == true){
            this.tabSelct = 1;
            this.showToast('success', '', 'Succesfully saved');
          } else {
              this.showToast('danger', '', 'Error');
          }
        });
      } else {
        this.spinner.hide();
          if(res.status == true){
            this.tabSelct = 1;
            this.showToast('success', '', 'Succesfully saved');
          } else {
              this.showToast('danger', '', 'Error');
          }
      }
    });
  } 

  canceldetails(){
    this.router.navigateByUrl("/pages/users/delivery-agents");
  }

  nexttab(){
    this.tabSelct = 2;
  }

  forceClockOut(){
    if(this.deliveryAgentCueentQueue.length>0){
      this.showToast('danger', '', 'The DA has orders in their queue, please re-assign the queue and try again.');
      return;
    }
   if(this.agentWorkingHours && this.agentWorkingHours[0] && this.agentWorkingHours[0]._id){
     if(this.agentWorkingHours[0].clockOut){
      this.showToast('danger', '', 'User is already clocked out');
     } else {
      this.spinner.show();
      this.agentWorkingHours[0].clockOut =  new Date();
      this.apiService.forceClockOut(this.agentWorkingHours[0]).subscribe((res)=>{
        this.spinner.hide();
        if(res.status == true){
          this.showToast('success', '', 'Successfully updated');
          this.getDeliveryAgentWorkingHours(this.deliveryAgentId);    
        } else {
            this.showToast('danger', '', 'Error');
        }
      });
     }
   } else {
    this.showToast('danger', '', 'User is not Clocked In');
   }
  }

  registerNoShow(){
    const data = {
      userId : localStorage.getItem('deliveryAgentId')
    }
    this.spinner.show();
    this.apiService.registerNoShow(data).subscribe((res)=>{
      this.spinner.hide();
      if(res.status == true){
        this.showToast('success', '', 'Successfully saved');
        this.getDeliveryAgentWorkingHours(this.deliveryAgentId);    
      } else {
          this.showToast('danger', '', 'Error');
      }
    });
  }

  startDateYear: any;
  startDateMonth: any;
  startDateDay: any;
  endDateYear: any;
  endDateMonth: any;
  endDateDay: any;

  filter(){
    if(!this.dateRange.startDate || !this.dateRange.endDate){
      this.showToast('danger', '', 'Please select start date and end date to filter');
      return;
    }
    let startDate = new Date(this.dateRange.startDate._d);
    this.startDateYear = startDate.getFullYear();
    this.startDateMonth = startDate.getMonth()+1;
    this.startDateDay = startDate.getDate();
    if (this.startDateDay < 10) {
      this.startDateDay = '0' + this.startDateDay;
    }
    if (this.startDateMonth < 10) {
      this.startDateMonth = '0' + this.startDateMonth;
    }
    let newStartDate =  this.startDateYear+'-' + this.startDateMonth + '-'+ this.startDateDay;

    let endDate = new Date(this.dateRange.endDate._d);
    this.endDateYear = endDate.getFullYear();
    this.endDateMonth = endDate.getMonth()+1;
    this.endDateDay = endDate.getDate();
    if (this.endDateDay < 10) {
      this.endDateDay = '0' + this.endDateDay;
    }
    if (this.endDateMonth < 10) {
      this.endDateMonth = '0' + this.endDateMonth;
    }   
    let newEndDate =  this.endDateYear +'-' + this.endDateMonth + '-'+ this.endDateDay;

    this.apiService.getDeliveryAgentWorkingHours(localStorage.getItem('deliveryAgentId'),newStartDate,newEndDate).subscribe((res)=>{
      const data = res.body.daWorkingHours.agentWorkingRes;
      this.totalWorkingHours = res.body.daWorkingHours.totalHours;
      this.noShowCount = res.body.daWorkingHours.noShowCount;
      this.agentWorkingHours = data;
      this.source.load(data); 
    });
  }
  
  settings = {
    mode: 'external',
    actions: {
      position:  'right',
      edit: false,
      delete:false,
      add:false
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i title="Block user" class="fas fa-user-lock" ></i>',
      confirmDelete: true,
    },
    columns: {
      createdDate: {
        title: 'Date',
        type: 'date',
        valuePrepareFunction: (value) => { 
          if(value){
            let fullYear;
            let month; 
            let day;
            let  dataTime;
            dataTime = new Date(value+' UTC');
            day = dataTime.getDate().toString();
            month = dataTime.getMonth()+1;
            fullYear = dataTime.getFullYear().toString();
            if(day<10){
              day = "0"+day;
            }
            if(month<10){
              month = "0"+month;
            }
            return fullYear+"/"+month+"/"+day;
          } else {
            return "";
          }
        }
      }, 
      clockIn: {
        title: 'Clock IN',
        type: 'string',
        valuePrepareFunction: (value) => { 
          if(value){
            let  hours;
            let  minutes;
            let fullYear;
            let month; 
            let day;
            let  dataTime;
            let  ampm;
            dataTime = new Date(value+' UTC');
            hours = dataTime.getHours();
            minutes = dataTime.getMinutes();
            ampm  = "am";
            if( hours > 12 ) {
              hours -= 12;
              ampm = "pm";
            }
            if(hours<10){
              hours = "0"+hours;
            }
            if(minutes<10){
              minutes = "0"+minutes;
            }
            day = dataTime.getDate();
            month = dataTime.getMonth()+1;;
            fullYear = dataTime.getFullYear().toString().substr(-2);
            if(day<10){
              day = "0"+day;
            }
            if(month<10){
              month = "0"+month;
            }
            return hours+":"+minutes+ampm+" "+fullYear+"/"+month+"/"+day;
          } else {
            return "";
          }
        }
      }, 
      clockOut: {
        title: 'Clock Out',
        type: 'string',
        valuePrepareFunction: (value) => { 
          if(value){
            let  hours;
            let  minutes;
            let fullYear;
            let month; 
            let day;
            let  dataTime;
            let  ampm;
            dataTime = new Date(value+' UTC');
            hours = dataTime.getHours();
            minutes = dataTime.getMinutes();
            ampm  = "am";
            if( hours > 12 ) {
              hours -= 12;
              ampm = "pm";
            }
            if(hours<10){
              hours = "0"+hours;
            }
            if(minutes<10){
              minutes = "0"+minutes;
            }
            day = dataTime.getDate();
            month = dataTime.getMonth()+1;;
            fullYear = dataTime.getFullYear().toString().substr(-2);
            if(day<10){
              day = "0"+day;
            }
            if(month<10){
              month = "0"+month;
            }
            return hours+":"+minutes+ampm+" "+fullYear+"/"+month+"/"+day;
          } else {
            return "";
          }
        }
      }, 
      diffTime: {
        title: 'Total Hours',
        type: 'string',
      }, 
    },
  };
  
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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
