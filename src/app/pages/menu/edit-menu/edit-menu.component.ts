import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from '../../../../app/services/api.service';
import { ToasterConfig } from 'angular2-toaster';
import { Router, ActivatedRoute } from '@angular/router';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService} from '@nebular/theme';
import { AuthService } from '../../../services/auth.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { UploadFileService } from '../../../services/upload-file.service';
import { EnvironmentService } from '../../../../environments/environment.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NgbModal,ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { Observable } from 'rxjs';

export interface Consignment {
    id:number;
    sender:string;
    consignmentNo:string;
    receivedDate:string;
    transportMode:string;
    vehicleReg:string;
    mondayItems:Item[];
  
}

export interface Item{
  teaType:string;
  noOfContainers:number;
  weightPerContainerinKgs:number;
  totalItemWeight:number
      
}

@Component({
  selector: 'ngx-edit-menu',
  templateUrl: './edit-menu.component.html',
  styleUrls: ['./edit-menu.component.scss']
})

export class EditMenuComponent implements OnInit {
  count:number = 0;
  count2:number = 0;
  disabletab: Boolean;
  vendorID: string;
  currency:any;
  consignmentForm :FormGroup;
  tuesdayForm:FormGroup;
  time = {hour: 13, minute: 30};
  meridian = true;
  vendorHours: any;
  @ViewChild('tabGroup',{ static: false }) tabGroup;
  tabSelct: any = '0';
  
  itemsInvalidMsg = {};

  controlErrorLabels = {
      consignmentNo : 'Consignment Number',
      receivedDate : 'Received Date',
      sender : 'Sender'
  }  

  constructor(private apiService: ApiService,
    private auth: AuthService,
    private toastrService: NbToastrService,
    private router: Router,
    private uploadService:UploadFileService,
    public envService: EnvironmentService,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private route: ActivatedRoute) {

    this.createForm();
    this.currency =localStorage.getItem('CurrencySymbol');
    const MenuId = localStorage.getItem('MenuId');
    if(MenuId){
      this.getMenuDetails(MenuId);  
    } else {
      this.addMenuDetails();
    }

    this.vendorID = localStorage.getItem('VendorID');
    this.vendorHours = false;
  }

  ngOnInit() {    
    this.getVendorTags(localStorage.getItem('VendorID'));  
    this.getVendorSection(localStorage.getItem('VendorID'));   
    this.getVendorOperatingHours(localStorage.getItem('VendorID')); 
    if(localStorage.getItem('MenuId')){
      this.getMenuOperatingHours(localStorage.getItem('MenuId')); 
    } else {
      this.createForm();
    }      
    this.getStatus();    
  }

  previousPage(){
    window.history.back();
  }

  toggleMeridian() {
    this.meridian = !this.meridian;
  }

  createForm() {
    this.consignmentForm = this.fb.group({
      id:'',
      mondayItems:this.fb.array([this.createMondayItem()]),
      tuesdayItems:this.fb.array([this.createMondayItem()]),
      wednesdayItems:this.fb.array([this.createMondayItem()]),
      thursdayItems:this.fb.array([this.createMondayItem()]),
      fridayItems:this.fb.array([this.createMondayItem()]),
      saturdayItems:this.fb.array([this.createMondayItem()]),
      sundayItems:this.fb.array([this.createMondayItem()]),
    });
  }

  mondayitemsnew: any;
  tuesdayitemsnew: any;
  wednesdayitemsnew: any;
  thursdayitemsnew: any;
  fridayitemsnew: any;
  saturdayitemsnew: any;
  sundayitemsnew: any;

  createForm1() {
    this.mondayitemsnew=[];
    for(let i in this.monday){ 
      this.mondayitemsnew.push(this.createMondayItem2(this.monday[i]));
    }
    if(this.monday.length == 0){
      this.mondayitemsnew.push(this.createMondayItem());
    }

    this.tuesdayitemsnew=[];
    for(let i in this.tuesday){
      this.tuesdayitemsnew.push(this.createMondayItem2(this.tuesday[i]));
    }
    if(this.tuesday.length == 0){
      this.tuesdayitemsnew.push(this.createMondayItem());
    }

    this.wednesdayitemsnew=[];
    for(let i in this.wednesday){
      this.wednesdayitemsnew.push(this.createMondayItem2(this.wednesday[i]));
    }
    if(this.wednesday.length == 0){
      this.wednesdayitemsnew.push(this.createMondayItem());
    }

    this.thursdayitemsnew=[];
    for(let i in this.thursday){
      this.thursdayitemsnew.push(this.createMondayItem2(this.thursday[i]));
    }
    if(this.thursday.length == 0){
      this.thursdayitemsnew.push(this.createMondayItem());
    }

    this.fridayitemsnew=[];
    for(let i in this.friday){
      this.fridayitemsnew.push(this.createMondayItem2(this.friday[i]));
    }
    if(this.friday.length == 0){
      this.fridayitemsnew.push(this.createMondayItem());
    }

    this.saturdayitemsnew=[];
    for(let i in this.saturday){
      this.saturdayitemsnew.push(this.createMondayItem2(this.saturday[i]));
    }
    if(this.saturday.length == 0){
      this.saturdayitemsnew.push(this.createMondayItem());
    }

    this.sundayitemsnew=[];
    for(let i in this.sunday){
      this.sundayitemsnew.push(this.createMondayItem2(this.sunday[i]));
    }
    if(this.sunday.length == 0){
      this.sundayitemsnew.push(this.createMondayItem());
    }

    this.consignmentForm = this.fb.group({
      id:'',
      mondayItems:this.fb.array(this.mondayitemsnew),
      tuesdayItems:this.fb.array(this.tuesdayitemsnew),
      wednesdayItems:this.fb.array( this.wednesdayitemsnew),
      thursdayItems:this.fb.array(this.thursdayitemsnew),
      fridayItems:this.fb.array(this.fridayitemsnew),
      saturdayItems:this.fb.array(this.saturdayitemsnew),
      sundayItems:this.fb.array(this.sundayitemsnew),
    });
  }

  createMondayItem2(value): FormGroup {
    if(value && value.starttime){
      let itemGrp:FormGroup =  this.fb.group({
        starttime:{hour: value.starttime.hour, minute: value.starttime.minute, second: 0},
        endtime:{hour: value.endtime.hour, minute: value.endtime.minute, second: 0},
        _id: value._id
      });
      return itemGrp;
    } else {
      let itemGrp:FormGroup =  this.fb.group({
        starttime:{hour: 0, minute: 0, second: 0},
        endtime:{hour: 0, minute: 0, second: 0}
      });
      return itemGrp;
    }    
  }
  private msToTime(duration:number) {
    let milliseconds = parseInt(((duration % 1000) / 100).toString()),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours : number = Math.floor((duration / (1000 * 60 * 60)) % 24); 
    return {hours:hours ,minutes: minutes ,seconds:  seconds ,milliseconds: milliseconds};
  }
private ValidateItemTime(data:any){
  let startdate = new Date();
  let endate = new Date();
  let startdatesecond = new Date();
  let endatesecond = new Date();
  let result  = {
    status:true,
    Message:""
  };

  data.forEach((element,i) => {
    startdate = new Date("1/1/2020 " + element.starttime.hour + ":" + element.starttime.minute + ":" + element.starttime.second)
    endate = new Date("1/1/2020 " + element.endtime.hour + ":" + element.endtime.minute + ":" + element.endtime.second)
    
    data.forEach((data,k) => {
      startdatesecond = new Date("1/1/2020 " + data.starttime.hour + ":" + data.starttime.minute + ":" + data.starttime.second)
      endatesecond = new Date("1/1/2020 " + data.endtime.hour + ":" + data.endtime.minute + ":" + data.endtime.second)

      if(startdate.toString() == startdatesecond.toString() && endate.toString() == endatesecond.toString() && i != k){
        result.status = false;
        result.Message = " duplicated time slots cannot be added  ";
      } else if(startdatesecond > startdate  &&  startdatesecond < endate && i != k){
        result.status = false;
        result.Message = " available hours slots are overlapping";
      };
    }); 
  });
return result;
}; 

  createMondayItem(): FormGroup {
    let itemGrp:FormGroup =  this.fb.group({
      starttime:{hour: 0, minute: 0, second: 0},
      endtime:{hour: 0, minute: 0, second: 0},
    });
    return itemGrp;
  }

  createTuesdayItem(): FormGroup {
    let itemGrpTues:FormGroup =  this.fb.group({
      starttime:{hour: 0, minute: 0, second: 0},
      endtime:{hour: 23, minute: 59, second: 0},
    });
    return itemGrpTues;
  }

  addItem(){
    if (Object.keys(this.itemsInvalidMsg).length === 0){
      let itemArr : FormArray = this.consignmentForm.get("mondayItems") as FormArray; 
      if(itemArr.value.length > 0){
        let datavalid = this.ValidateItemTime(itemArr.value);
        if(datavalid.status){
          itemArr.push(this.createMondayItem()); 
        }else{
           this.showToast('danger', '', datavalid.Message);
        }
      }   
    }
  }

  addItem2(){
    if (Object.keys(this.itemsInvalidMsg).length === 0){
      let itemArr2 : FormArray = this.consignmentForm.get("tuesdayItems") as FormArray; 
      if(itemArr2.value.length > 0){
        let datavalid = this.ValidateItemTime(itemArr2.value);
        if(datavalid.status){
          itemArr2.push(this.createMondayItem()); 
        }else{
           this.showToast('danger', '', datavalid.Message);
        }
      }
    }
  }

  addItemwednesday(){
    if (Object.keys(this.itemsInvalidMsg).length === 0){
      let itemArr2 : FormArray = this.consignmentForm.get("wednesdayItems") as FormArray; 
      if(itemArr2.value.length > 0){
        let datavalid = this.ValidateItemTime(itemArr2.value);
        if(datavalid.status){
          itemArr2.push(this.createMondayItem()); 
        }else{
           this.showToast('danger', '', datavalid.Message);
        }
      }
    }
  }
  
  addItemthursday(){
    if (Object.keys(this.itemsInvalidMsg).length === 0){
      let itemArr2 : FormArray = this.consignmentForm.get("thursdayItems") as FormArray; 
      if(itemArr2.value.length > 0){
        let datavalid = this.ValidateItemTime(itemArr2.value);
        if(datavalid.status){
          itemArr2.push(this.createMondayItem()); 
        }else{
           this.showToast('danger', '', datavalid.Message);
        }
      }
    }
  }

  addItemfriday(){
    if (Object.keys(this.itemsInvalidMsg).length === 0){
      let itemArr2 : FormArray = this.consignmentForm.get("fridayItems") as FormArray; 
      if(itemArr2.value.length > 0){
        let datavalid = this.ValidateItemTime(itemArr2.value);
        if(datavalid.status){
          itemArr2.push(this.createMondayItem()); 
        }else{
           this.showToast('danger', '', datavalid.Message);
        }
      }
    }
  }

  addItemsaturday (){
    if (Object.keys(this.itemsInvalidMsg).length === 0){
      let itemArr2 : FormArray = this.consignmentForm.get("saturdayItems") as FormArray; 
      if(itemArr2.value.length > 0){
        let datavalid = this.ValidateItemTime(itemArr2.value);
        if(datavalid.status){
          itemArr2.push(this.createMondayItem()); 
        }else{
           this.showToast('danger', '', datavalid.Message);
        }
      }
    }
  }
  
  addItemsunday(){
    if (Object.keys(this.itemsInvalidMsg).length === 0){
      let itemArr2 : FormArray = this.consignmentForm.get("sundayItems") as FormArray; 
      if(itemArr2.value.length > 0){
        let datavalid = this.ValidateItemTime(itemArr2.value);
        if(datavalid.status){
          itemArr2.push(this.createMondayItem()); 
        }else{
           this.showToast('danger', '', datavalid.Message);
        }
      }
    }
  }
  
  deleteItem(i,value){
    if(value && value.value && value.value._id){
      this.spinner.show();
      this.apiService.deleteMenuAvailableHours(value.value._id).subscribe((res)=>{
        this.spinner.hide();
        if(res.status == true){
          let itemArr : FormArray = this.consignmentForm.get("mondayItems") as FormArray;
          itemArr.removeAt(i);
          this.showToast('success', '', 'Deleted Succesfully');
        } 
      });
    } else {
      let itemArr : FormArray = this.consignmentForm.get("mondayItems") as FormArray;
      itemArr.removeAt(i);
    }
  }

  deleteItem2(i,value){
    if(value && value.value && value.value._id){
      this.spinner.show();
      this.apiService.deleteMenuAvailableHours(value.value._id).subscribe((res)=>{
        if(res.status == true){
          let itemArr2 : FormArray = this.consignmentForm.get("tuesdayItems") as FormArray;
          itemArr2.removeAt(i);  
          this.spinner.hide();
          this.showToast('success', '', 'Deleted Succesfully');
        }
      });
    } else {
      let itemArr2 : FormArray = this.consignmentForm.get("tuesdayItems") as FormArray;
      itemArr2.removeAt(i);  
    }
  }
  
  deleteItemwednesday(i,value){
    if(value && value.value && value.value._id){
      this.spinner.show();
      this.apiService.deleteMenuAvailableHours(value.value._id).subscribe((res)=>{
        if(res.status == true){
          let itemArr2 : FormArray = this.consignmentForm.get("wednesdayItems") as FormArray;
          itemArr2.removeAt(i);  
          this.spinner.hide();
          this.showToast('success', '', 'Deleted Succesfully');
        }
      });
    } else {
      let itemArr2 : FormArray = this.consignmentForm.get("wednesdayItems") as FormArray;
      itemArr2.removeAt(i);  
    }
    
  }

  deleteItemthursday(i,value){
    if(value && value.value && value.value._id){
      this.spinner.show();
      this.apiService.deleteMenuAvailableHours(value.value._id).subscribe((res)=>{
        if(res.status == true){
          let itemArr2 : FormArray = this.consignmentForm.get("thursdayItems") as FormArray;
          itemArr2.removeAt(i);  
          this.spinner.hide();
          this.showToast('success', '', 'Deleted Succesfully');
        }
      });
    } else {
      let itemArr2 : FormArray = this.consignmentForm.get("thursdayItems") as FormArray;
      itemArr2.removeAt(i);  
    }
    
  }

  deleteItemfriday(i,value){
    if(value && value.value && value.value._id){
      this.spinner.show();
      this.apiService.deleteMenuAvailableHours(value.value._id).subscribe((res)=>{
        if(res.status == true){
          let itemArr2 : FormArray = this.consignmentForm.get("fridayItems") as FormArray;
          itemArr2.removeAt(i);
          this.spinner.hide();
          this.showToast('success', '', 'Deleted Succesfully');
        }
      });
    } else {
      let itemArr2 : FormArray = this.consignmentForm.get("fridayItems") as FormArray;
      itemArr2.removeAt(i);
    }
  }

  deleteItemsaturday (i,value){
    if(value && value.value && value.value._id){
      this.spinner.show();
      this.apiService.deleteMenuAvailableHours(value.value._id).subscribe((res)=>{
        if(res.status == true){
          let itemArr2 : FormArray = this.consignmentForm.get("saturdayItems") as FormArray;
          itemArr2.removeAt(i);
          this.spinner.hide();
          this.showToast('success', '', 'Deleted Succesfully');
        }
      });
    } else {
      let itemArr2 : FormArray = this.consignmentForm.get("saturdayItems") as FormArray;
      itemArr2.removeAt(i);
    }  
  }

  deleteItemsunday(i,value){
    if(value && value.value && value.value._id){
      this.spinner.show();
      this.apiService.deleteMenuAvailableHours(value.value._id).subscribe((res)=>{
        if(res.status == true){
          let itemArr2 : FormArray = this.consignmentForm.get("sundayItems") as FormArray;
          itemArr2.removeAt(i); 
          this.spinner.hide();
          this.showToast('success', '', 'Deleted Succesfully');
        }
      });
    } else {
      let itemArr2 : FormArray = this.consignmentForm.get("sundayItems") as FormArray;
      itemArr2.removeAt(i); 
    }
  }

  onCancel(){
    this.router.navigateByUrl("/consignments");
  }

  menuDetails: any;
  renderValue:boolean;
  
  public getMenuDetails(MenuId){
    this.apiService.getMenuDetails(MenuId).subscribe((res)=>{
      const data = res.body.menuItems;
      this.menuDetails = data;
      if(!this.menuDetails.mediaId){
        this.menuDetails.mediaId = {rectangle: "", square: "", bgColor:"#ffffff" };
      }
     
      if(this.menuDetails.status=='inactive'){
      this.renderValue=true;
      } else {
        this.renderValue=false;
      }
      this.disabletab = false;
    });
  }
  
  public getVendorTags(id){
    this.apiService.getVendorTags(id).subscribe((res)=>{
      const data = res.body.vendorTags;
      this.dropdownList = data; 
      if(this.menuDetails && this.menuDetails.vendorTag){
        this.menuDetails.vendorTagId = [];
        for(let k in this.menuDetails.vendorTag) {
          for(let i in this.dropdownList) {
            if(this.menuDetails.vendorTag[k]._id == this.dropdownList[i]._id){
              this.menuDetails.vendorTagId.push(this.dropdownList[i])
            }
          }
        }
      }
    });
  }

  public getVendorSection(id){
    this.apiService.getVendorSection(id).subscribe((res)=>{
      const data = res.body.vendorMenuSection;
      this.dropdownList2 = data; 
      if(localStorage.getItem('MenuId')){
        this.getSectionByMenu(localStorage.getItem('MenuId'));
      }
    });
  }

  public getSectionByMenu(id){
    this.apiService.getSectionByMenu(id).subscribe((res)=>{
      this.menuDetails.vendorSectionId = res.body;
      this.menuDetails.vendorSectiondata = JSON.parse(JSON.stringify(res.body));;
    });
  }
 
  availableHours: any= [];
  hoursCount: any;

private validatealltimeslot(day:string,errortitle:string) {
  let itemArr: FormArray = this.consignmentForm.get(day) as FormArray;
  if (itemArr.value.length > 0) {
    let datavalid = this.ValidateItemTime(itemArr.value);
    if(!datavalid.status){
      this.showToast('danger', '',  errortitle + datavalid.Message);
    };
    return datavalid.status;
  }
  return true;
}

saveAvailableHours(){
  this.spinner.show();
  this.availableHours = [];
  this.hoursCount = 0;
  this.count = 0;
  const menuItemId =  localStorage.getItem('MenuId');

  // validating time slot
    if(!this.validatealltimeslot("mondayItems","Monday") ||  
        !this.validatealltimeslot("tuesdayItems","Tuesday") ||
        !this.validatealltimeslot("wednesdayItems","Wednesday")||
        !this.validatealltimeslot("thursdayItems","Thursday") ||
        !this.validatealltimeslot("fridayItems","Friday") ||
        !this.validatealltimeslot("saturdayItems","Saturday") ||
        !this.validatealltimeslot("sundayItems","Sunday") 
    )
    { 
      this.spinner.hide(); 
      return;
    }
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    this.consignmentForm.value.mondayItems.forEach(obj => {
      obj.opening = obj.starttime.hour+'.'+obj.starttime.minute;
      obj.closing = obj.endtime.hour+'.'+obj.endtime.minute; 
      obj.dayOfWeek = 1;
      if(obj._id){
        this.availableHours.push({
          dayOfWeek: obj.dayOfWeek,
          opening: obj.opening,
          closing: obj.closing, 
          menuItemId: menuItemId,
          _id: obj._id,
          timezone: timezone,
          day: "Monday"
        });
      } else {
        this.availableHours.push({
          dayOfWeek: obj.dayOfWeek,
          opening: obj.opening,
          closing: obj.closing, 
          menuItemId: menuItemId,
          timezone: timezone,
          day: "Monday"
        });
      }
      this.hoursCount = this.hoursCount + (obj.closing - obj.opening);
    });
   
    this.consignmentForm.value.tuesdayItems.forEach(obj => {
      obj.opening=obj.starttime.hour+'.'+obj.starttime.minute;
      obj.closing=obj.endtime.hour+'.'+obj.endtime.minute; 
      obj.dayOfWeek = 2;
      if(obj._id){
        this.availableHours.push({
          dayOfWeek: obj.dayOfWeek,
          opening: obj.opening,
          closing: obj.closing, 
          menuItemId: menuItemId,
          _id: obj._id,
          timezone: timezone,
          day: "Tuesday"
        });
      } else {
        this.availableHours.push({
          dayOfWeek: obj.dayOfWeek,
          opening: obj.opening,
          closing: obj.closing, 
          menuItemId: menuItemId,
          timezone: timezone,
          day: "Tuesday"
        });
      }
      this.hoursCount = this.hoursCount + (obj.closing - obj.opening);
    });

    this.consignmentForm.value.wednesdayItems.forEach(obj => {
      obj.opening=obj.starttime.hour+'.'+obj.starttime.minute;
      obj.closing=obj.endtime.hour+'.'+obj.endtime.minute; 
      obj.dayOfWeek = 3;
      if(obj._id){
        this.availableHours.push({
          dayOfWeek: obj.dayOfWeek,
          opening: obj.opening,
          closing: obj.closing, 
          menuItemId: menuItemId,
          _id: obj._id,
          timezone: timezone,
          day: "Wednesday"
        });
      } else {
        this.availableHours.push({
          dayOfWeek: obj.dayOfWeek,
          opening: obj.opening,
          closing: obj.closing, 
          menuItemId: menuItemId,
          timezone: timezone,
          day: "Wednesday"
        });
      }
      this.hoursCount = this.hoursCount + (obj.closing - obj.opening);
    });

    this.consignmentForm.value.thursdayItems.forEach(obj => {
      obj.opening=obj.starttime.hour+'.'+obj.starttime.minute;
      obj.closing=obj.endtime.hour+'.'+obj.endtime.minute; 
      obj.dayOfWeek = 4;
      if(obj._id){
        this.availableHours.push({
          dayOfWeek: obj.dayOfWeek,
          opening: obj.opening,
          closing: obj.closing, 
          menuItemId: menuItemId,
          _id: obj._id,
          timezone: timezone,
          day: "Thursday"
        });
      } else {
        this.availableHours.push({
          dayOfWeek: obj.dayOfWeek,
          opening: obj.opening,
          closing: obj.closing, 
          menuItemId: menuItemId,
          timezone: timezone,
          day: "Thursday"
        });
      }
      this.hoursCount = this.hoursCount + (obj.closing - obj.opening);
    });

    this.consignmentForm.value.fridayItems.forEach(obj => {
      obj.opening=obj.starttime.hour+'.'+obj.starttime.minute;
      obj.closing=obj.endtime.hour+'.'+obj.endtime.minute; 
      obj.dayOfWeek = 5;
      if(obj._id){
        this.availableHours.push({
          dayOfWeek: obj.dayOfWeek,
          opening: obj.opening,
          closing: obj.closing, 
          menuItemId: menuItemId,
          _id: obj._id,
          timezone: timezone,
          day: "Friday"
        });
      } else {
        this.availableHours.push({
          dayOfWeek: obj.dayOfWeek,
          opening: obj.opening,
          closing: obj.closing, 
          menuItemId: menuItemId,
          timezone: timezone,
          day: "Friday"
        });
      }
      this.hoursCount = this.hoursCount + (obj.closing - obj.opening);
    });

    this.consignmentForm.value.saturdayItems.forEach(obj => {
      obj.opening=obj.starttime.hour+'.'+obj.starttime.minute;
      obj.closing=obj.endtime.hour+'.'+obj.endtime.minute; 
      obj.dayOfWeek = 6;
      if(obj._id){
        this.availableHours.push({
          dayOfWeek: obj.dayOfWeek,
          opening: obj.opening,
          closing: obj.closing, 
          menuItemId: menuItemId,
          _id: obj._id,
          timezone: timezone,
          day: "Saturday"
        });
      } else {
        this.availableHours.push({
          dayOfWeek: obj.dayOfWeek,
          opening: obj.opening,
          closing: obj.closing, 
          menuItemId: menuItemId,
          timezone: timezone,
          day: "Saturday"
        });
      }
      this.hoursCount = this.hoursCount + (obj.closing - obj.opening);
    });

    this.consignmentForm.value.sundayItems.forEach(obj => {
      obj.opening=obj.starttime.hour+'.'+obj.starttime.minute;
      obj.closing=obj.endtime.hour+'.'+obj.endtime.minute; 
      obj.dayOfWeek = 7;
      if(obj._id){
        this.availableHours.push({
          dayOfWeek: obj.dayOfWeek,
          opening: obj.opening,
          closing: obj.closing, 
          menuItemId: menuItemId,
          _id: obj._id,
          timezone: timezone,
          day: "Sunday"
        });
      } else {
        this.availableHours.push({
          dayOfWeek: obj.dayOfWeek,
          opening: obj.opening,
          closing: obj.closing, 
          menuItemId: menuItemId,
          timezone: timezone,
          day: "Sunday"
        });
      }
      this.hoursCount = this.hoursCount + (obj.closing - obj.opening);
    });
   
    if(this.hoursCount == 0){
      this.spinner.hide();
      this.showToast('danger', '', 'Please fill menu available hours');
      return;
    }
    
    for(let i in this.availableHours){
      if( Number(this.availableHours[i].opening) > Number(this.availableHours[i].closing)){
        this.spinner.hide();
        this.showToast('danger', 'Start time should be less than End time', 'Please check the Available Hours on '+this.availableHours[i].day);
        return;
      }
      if( Number(this.availableHours[i].opening) == Number(this.availableHours[i].closing)){
        this.spinner.hide();
        this.showToast('danger', 'Start time should not be same as the End time', 'Please check the Available Hours on '+this.availableHours[i].day);
        return;
       }
    }

    for(let i in this.availableHours){
      for(let j in this.vendorOperatingHours){
        if(this.availableHours[i].dayOfWeek == this.vendorOperatingHours[j].dayOfWeek){
         if(Number(this.availableHours[i].opening) < Number(this.vendorOperatingHours[j].opening)){
            this.spinner.hide();
            this.showToast('danger', 'Menu Availability times for the day does not match with the Restaurant timings.', 'Please check the Available Hours on '+this.availableHours[i].day);
            return;
          }
          if(Number(this.availableHours[i].closing) > Number(this.vendorOperatingHours[j].closing)){
            this.spinner.hide();
            this.showToast('danger', 'Menu Availability times for the day does not match with the Restaurant timings.', 'Please check the Available Hours on '+this.availableHours[i].day);
            return;
          }
        }
      }
    }
    
    if(this.vendorHours == true && this.menuOperatingHours.length>0){
      this.apiService.deleteMenuHours(menuItemId).subscribe((res)=>{
        this.vendorHours = false;
        this.saveMenuTime();
      });
    } else {
      this.saveMenuTime();
    }   
  }

  public saveMenuTime(){
    
    /*var availableHours = [];
    for(let i in this.availableHours){
      if(this.availableHours[i].opening &&  this.availableHours[i].closing){
        if(this.availableHours[i].dayOfWeek == 1){
          var today = new Date();
          today.setDate(today.getDate() - (today.getDay() + 6) % 7);
          var dd = String(today.getDate()).padStart(2, '0');
          var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
          var yyyy = today.getFullYear();
          var date = mm + '/' + dd + '/' + yyyy;
        } 
        else if(this.availableHours[i].dayOfWeek == 2){
          var today = new Date();
          today.setDate(today.getDate() - (today.getDay() + 5) % 7);
          var dd = String(today.getDate()).padStart(2, '0');
          var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
          var yyyy = today.getFullYear();
          var date = mm + '/' + dd + '/' + yyyy;
        }
        else if(this.availableHours[i].dayOfWeek == 3){
          var today = new Date();
          today.setDate(today.getDate() - (today.getDay() + 4) % 7);
          var dd = String(today.getDate()).padStart(2, '0');
          var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
          var yyyy = today.getFullYear();
          var date = mm + '/' + dd + '/' + yyyy;
        }
        else if(this.availableHours[i].dayOfWeek == 4){
          var today = new Date();
          today.setDate(today.getDate() - (today.getDay() + 3) % 7);
          var dd = String(today.getDate()).padStart(2, '0');
          var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
          var yyyy = today.getFullYear();
          var date = mm + '/' + dd + '/' + yyyy;
        }
        else if(this.availableHours[i].dayOfWeek == 5){
          var today = new Date();
          today.setDate(today.getDate() - (today.getDay() + 2) % 7);
          var dd = String(today.getDate()).padStart(2, '0');
          var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
          var yyyy = today.getFullYear();
          var date = mm + '/' + dd + '/' + yyyy;
        }
        else if(this.availableHours[i].dayOfWeek == 6){
          var today = new Date();
          today.setDate(today.getDate() - (today.getDay() + 1) % 7);
          var dd = String(today.getDate()).padStart(2, '0');
          var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
          var yyyy = today.getFullYear();
          var date = mm + '/' + dd + '/' + yyyy;
        }
        else if(this.availableHours[i].dayOfWeek == 7){
          var today = new Date();
          today.setDate(today.getDate() - (today.getDay() + 0) % 7);
          var dd = String(today.getDate()).padStart(2, '0');
          var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
          var yyyy = today.getFullYear();
          var date = mm + '/' + dd + '/' + yyyy;
        }
      
        var time1 = this.availableHours[i].opening.split("."); 
        var time2 = this.availableHours[i].closing.split("."); 
      
        var d1 = new Date(date);
        d1.setHours(d1.getHours() + time1[0]);
        (d1).setMinutes(d1.getMinutes() + time1[1]);

        var d2 = new Date(date);
        d2.setHours(d2.getHours() + time2[0]);
        (d2).setMinutes(d2.getMinutes() + time2[1]);

        var isoDate1 = new Date(d1).toISOString();
        var isoDate2 = new Date(d2).toISOString();
      
        var opening1 = new Date(isoDate1);
        var opening2 = opening1.getUTCHours()+"."+opening1.getUTCMinutes();
      
        var closing1 = new Date(isoDate2);
        var closing2 = closing1.getUTCHours()+"."+closing1.getUTCMinutes();
      
        if(opening1.getUTCDay() == 0){
          var dayOfWeek = 7;
        } else {
          var dayOfWeek = opening1.getUTCDay();
        }
      
        if(opening1.getUTCDate() == closing1.getUTCDate()){
          this.availableHours[i].dayOfWeek = dayOfWeek;
          this.availableHours[i].opening = opening2;
          this.availableHours[i].closing = closing2;
        } else { 
          this.availableHours[i].dayOfWeek = dayOfWeek;
          this.availableHours[i].opening = opening2;
          this.availableHours[i].closing = "23.59";
          var newtime = {
            dayOfWeek: dayOfWeek, 
            opening: "00.00", 
            closing: closing2, 
            menuItemId: this.availableHours[i].menuItemId,
            timezone: this.availableHours[i].timezone,
            day: this.availableHours[i].day
          };
          availableHours.push(newtime);
        }
      }   
    }
    this.availableHours = this.availableHours.concat(availableHours); 
    */
    const sectionHours = async () => {
      if(this.count<this.availableHours.length){
        const result = await returnHours(this.availableHours[this.count]);
      } else {
        this.menuDetails.status = 'active';
        this.apiService.editMenuStatus(this.menuDetails).subscribe((res)=>{
          this.spinner.hide();
          this.tabSelct = 4;
          this.getMenuOperatingHours(localStorage.getItem('MenuId')); 
          this.showToast('success', '', 'Saved Succesfully');
        });
      }
    }
      
    const returnHours = obj => {
      this.apiService.saveMenuAvailableHours(obj).subscribe((res)=>{
        this.count++;
        sectionHours()
      });
    }
    
    sectionHours().then((data) =>{ 
    })
  }
  
  monday: any;
  tuesday: any;
  wednesday: any;
  thursday: any;
  friday: any;
  saturday: any;
  sunday: any;

  menuOperatingHours: any= [];
  public getMenuOperatingHours(id){
    this.apiService.getMenuOperatingHours(id).subscribe((res)=>{
      const data = res.body.menuItemAvailableHours;
     this.menuOperatingHours = data;
      if(res.body.totalCount == 0){
        this.createForm();
      } else {
        this.monday=[];
        this.tuesday=[];
        this.wednesday=[];
        this.thursday=[];
        this.friday=[];
        this.saturday=[];
        this.sunday=[];
        /*var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        var date = mm + '-' + dd + '-' + yyyy;
        for(let j in data){
          if(data[j].opening && data[j].closing) {

            if(data[j].dayOfWeek == 1){
              var today = new Date();
              today.setDate(today.getDate() - (today.getDay() + 6) % 7);
              var dd = String(today.getDate()).padStart(2, '0');
              var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
              var yyyy = today.getFullYear();
              var date = mm + '/' + dd + '/' + yyyy;
            } 
            else if(data[j].dayOfWeek == 2){
              var today = new Date();
              today.setDate(today.getDate() - (today.getDay() + 5) % 7);
              var dd = String(today.getDate()).padStart(2, '0');
              var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
              var yyyy = today.getFullYear();
              var date = mm + '/' + dd + '/' + yyyy;
            }
            else if(data[j].dayOfWeek == 3){
              var today = new Date();
              today.setDate(today.getDate() - (today.getDay() + 4) % 7);
              var dd = String(today.getDate()).padStart(2, '0');
              var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
              var yyyy = today.getFullYear();
              var date = mm + '/' + dd + '/' + yyyy;
            }
            else if(data[j].dayOfWeek == 4){
              var today = new Date();
              today.setDate(today.getDate() - (today.getDay() + 3) % 7);
              var dd = String(today.getDate()).padStart(2, '0');
              var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
              var yyyy = today.getFullYear();
              var date = mm + '/' + dd + '/' + yyyy;
            }
            else if(data[j].dayOfWeek == 5){
              var today = new Date();
              today.setDate(today.getDate() - (today.getDay() + 2) % 7);
              var dd = String(today.getDate()).padStart(2, '0');
              var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
              var yyyy = today.getFullYear();
              var date = mm + '/' + dd + '/' + yyyy;
            }
            else if(data[j].dayOfWeek == 6){
              var today = new Date();
              today.setDate(today.getDate() - (today.getDay() + 1) % 7);
              var dd = String(today.getDate()).padStart(2, '0');
              var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
              var yyyy = today.getFullYear();
              var date = mm + '/' + dd + '/' + yyyy;
            }
            else if(data[j].dayOfWeek == 7){
              var today = new Date();
              today.setDate(today.getDate() - (today.getDay() + 0) % 7);
              var dd = String(today.getDate()).padStart(2, '0');
              var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
              var yyyy = today.getFullYear();
              var date = mm + '/' + dd + '/' + yyyy;
            }
            
            var time1 = data[j].opening.split("."); 
            var newdate1 = new Date(date+' '+time1[0]+':'+time1[1]+' UTC');
            newdate1.toString();
            var H1 = newdate1.getHours();
            var M1 = newdate1.getMinutes()
            var opening = H1+'.'+M1;
            data[j].opening = opening;

            var time2 = data[j].closing.split("."); 
            var newdate2 = new Date(date+' '+time2[0]+':'+time2[1]+' UTC');
            newdate2.toString();
            var H2 = newdate2.getHours();
            var M2 = newdate2.getMinutes()
            var closing = H2+'.'+M2;
            data[j].closing = closing;

            if(newdate1.getDay() == 0){
              var dayOfWeek = 7;
            } else {
              var dayOfWeek = newdate1.getDay();
            }
            data[j].dayOfWeek = dayOfWeek;
          }
        }*/ 
        for(let i in data){
          if(data[i].dayOfWeek == 1){
            let digits1 = data[i].opening.toString().split('.').map(Number);
            let digits2 = data[i].closing.toString().split('.').map(Number);
            if(!digits1[1]){
              digits1[1] = 0;
            }
            if(!digits2[1]){
              digits2[1] = 0;
            }
            this.monday.push({
              starttime: {
                hour: digits1[0],
                minute: digits1[1]
              },
              endtime: {
                hour: digits2[0],
                minute: digits2[1]
              },
              _id: data[i]._id
            });
          }
          if(data[i].dayOfWeek == 2){
            let digits1 = data[i].opening.toString().split('.').map(Number);
            let digits2 = data[i].closing.toString().split('.').map(Number);
            if(!digits1[1]){
              digits1[1] = 0;
            }
            if(!digits2[1]){
              digits2[1] = 0;
            }
            this.tuesday.push({
              starttime: {
                hour: digits1[0],
                minute: digits1[1]
              },
              endtime: {
                hour: digits2[0],
                minute: digits2[1]
              },
              _id: data[i]._id
            });
          }
          if(data[i].dayOfWeek == 3){
            let digits1 = data[i].opening.toString().split('.').map(Number);
            let digits2 = data[i].closing.toString().split('.').map(Number);
            if(!digits1[1]){
              digits1[1] = 0;
            }
            if(!digits2[1]){
              digits2[1] = 0;
            }
            this.wednesday.push({
              starttime: {
                hour: digits1[0],
                minute: digits1[1]
              },
              endtime: {
                hour: digits2[0],
                minute: digits2[1]
              },
              _id: data[i]._id
            });
          }
          if(data[i].dayOfWeek == 4){
            let digits1 = data[i].opening.toString().split('.').map(Number);
            let digits2 = data[i].closing.toString().split('.').map(Number);
            if(!digits1[1]){
              digits1[1] = 0;
            }
            if(!digits2[1]){
              digits2[1] = 0;
            }
            this.thursday.push({
              starttime: {
                hour: digits1[0],
                minute: digits1[1]
              },
              endtime: {
                hour: digits2[0],
                minute: digits2[1]
              },
              _id: data[i]._id
            });
          }
          if(data[i].dayOfWeek == 5){
            let digits1 = data[i].opening.toString().split('.').map(Number);
            let digits2 = data[i].closing.toString().split('.').map(Number);
            if(!digits1[1]){
              digits1[1] = 0;
            }
            if(!digits2[1]){
              digits2[1] = 0;
            }
            this.friday.push({
              starttime: {
                hour: digits1[0],
                minute: digits1[1]
              },
              endtime: {
                hour: digits2[0],
                minute: digits2[1]
              },
              _id: data[i]._id
            });
          }
          if(data[i].dayOfWeek == 6){
            let digits1 = data[i].opening.toString().split('.').map(Number);
            let digits2 = data[i].closing.toString().split('.').map(Number);
            if(!digits1[1]){
              digits1[1] = 0;
            }
            if(!digits2[1]){
              digits2[1] = 0;
            }
            this.saturday.push({
              starttime: {
                hour: digits1[0],
                minute: digits1[1]
              },
              endtime: {
                hour: digits2[0],
                minute: digits2[1]
              },
              _id: data[i]._id
            });
          }
          if(data[i].dayOfWeek == 7){
            let digits1 = data[i].opening.toString().split('.').map(Number);
            let digits2 = data[i].closing.toString().split('.').map(Number);
            if(!digits1[1]){
              digits1[1] = 0;
            }
            if(!digits2[1]){
              digits2[1] = 0;
            }
            this.sunday.push({
              starttime: {
                hour: digits1[0],
                minute: digits1[1]
              },
              endtime: {
                hour: digits2[0],
                minute: digits2[1]
              },
              _id: data[i]._id
            });
          }
        }
        this.createForm1();
      }
    });
  }

  dropdownList = [];
  dropdownList2 = [];
  selectedItems = [];

  dropdownSettings = {
    singleSelection: false,
    enableSearchFilter: true,
    labelKey:'name',
    primaryKey:'_id',
    badgeShowLimit:5,
    text:'Menu Tag',
  };

  dropdownSettings2 = {
    singleSelection: false,
    enableSearchFilter: true,
    labelKey:'name',
    primaryKey:'_id',
    badgeShowLimit:5,
    text:'Menu Section',
  };

  status:any;

  onItemSelect(item: any) {
    //console.log(item);
  }
  onSelectAll(mondayItems: any) {
   // console.log(items);
  }

  saveTag (){  
    if( !this.menuDetails.vendorTagId || (this.menuDetails.vendorTagId && this.menuDetails.vendorTagId.length == 0) ){
      this.showToast('danger', '', 'Please select any tag');
      return;
    }
    this.spinner.show();
    this.apiService.UpdateMenuTag(this.menuDetails).subscribe((res)=>{
      this.spinner.hide();
      if(res.status == true){
        this.router.navigateByUrl("/pages/menu/manage-menu");
        this.showToast('success', '', 'Saved Succesfully');
      } else {
          this.showToast('danger', '', 'Error');
      } 
    });
  }
 
  menuSectionDetails: any;
  removedseaction: any;

  savesection (){
    if( !this.menuDetails.vendorSectionId || (this.menuDetails.vendorSectionId && this.menuDetails.vendorSectionId.length == 0)  ){
      this.showToast('danger', '', 'Please select any section');
      return;
    }
    this.menuSectionDetails = {"menuItems":[{"menuItemId":localStorage.getItem('MenuId')}]};
    this.count2 = 0;
    const sectionDetail = async () => {
      if(this.count2<this.menuDetails.vendorSectionId.length){
        const result = await returnSection(this.menuDetails.vendorSectionId[this.count2]);
      } else {
        this.spinner.hide();
        this.tabSelct = 3;
        this.showToast('success', '', 'Saved Succesfully');
        this.getMenuDetails(localStorage.getItem('MenuId')); 
        this.getVendorTags(localStorage.getItem('VendorID'));  
        this.getVendorSection(localStorage.getItem('VendorID')); 
      }
    }  
    const returnSection = obj => {
      this.spinner.show();
      this.apiService.UpdateMenuSection(this.menuSectionDetails,obj._id).subscribe((res)=>{
        this.count2++;
        sectionDetail()
      });
    }
    sectionDetail().then(() =>{
    });
    
    if(this.menuDetails.vendorSectiondata && this.menuDetails.vendorSectiondata.length > 0){
      var b1 = this.menuDetails.vendorSectiondata; 
      var b2 = this.menuDetails.vendorSectionId;
      var results = b1.filter(item1 => 
      !b2.some(item2 => (item2._id === item1._id && item2.name === item1.name)))
      
      const DeleteSectionDetail = async () => {
        results.forEach(async values => {
         const result = await returnDeleteSection(values);
        });
      }  
      const returnDeleteSection = obj => {
        this.apiService.DeleteMenuSection(this.menuSectionDetails,obj._id).subscribe((res)=>{
          return res;
        });
      } 
      DeleteSectionDetail().then(() =>{
        console.log("Succesfully Deleted");
      });
    }
  } 

  public getStatus(){
    this.status = [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ];
  }

  public addMenuDetails(){
    this.renderValue=true;
    this.disabletab = true;
    this.menuDetails = { 
      name: "", 
      description:"", 
      price: "", 
      status: "inactive", 
      currencyId: {name: "" }, 
     // vendorTagId: {name: "" },
      mediaId: {rectangle: "", square: "", bgColor:"#ffffff" },
      preparationTime: "", 
      availableHours: "", 
    };
  } 

  public savedetails(){
    if(!this.menuDetails.name || !this.menuDetails.description || 
      !this.menuDetails.price || !this.menuDetails.preparationTime ){
        this.showToast('danger', '', 'Please enter the required fields');  
        return; 
    }
    this.spinner.show();
    if(this.menuDetails._id){
      this.apiService.editMenu(this.menuDetails).subscribe((res)=>{
        this.spinner.hide();
        if(res.status == true){
          this.tabSelct = 1;
          this.getMenuDetails(localStorage.getItem('MenuId'));  
          this.getVendorTags(localStorage.getItem('VendorID'));  
          this.getVendorSection(localStorage.getItem('VendorID'));  
          this.showToast('success', '', 'Saved Succesfully');
        } else {
            this.showToast('danger', '', 'Error');
        } 
      });
    } else {
      this.apiService.addMenu(this.menuDetails).subscribe((res)=>{
        this.spinner.hide();
        if(res.status == true){
          this.tabSelct = 1;
          localStorage.setItem('MenuId', res.id);
          this.getMenuDetails(localStorage.getItem('MenuId'));  
          this.getVendorTags(localStorage.getItem('VendorID'));  
          this.getVendorSection(localStorage.getItem('VendorID'));  
          this.disabletab = false;
          this.showToast('success', 'Please add menu item image and menu section to activate the menu', 'Succesfully Saved');
        } else {
            this.showToast('danger', '', 'Error');
        } 
      });
    }
  }

  OnBeforeChange: Observable<boolean> = Observable.create((observer) => {
    if(this.renderValue==true){
      if( (!this.menuDetails._id) || (this.menuDetails.mediaId.rectangle && !this.menuDetails.mediaId.rectangle._id) || 
      (this.menuDetails.mediaId.square && !this.menuDetails.mediaId.square._id) || 
       (this.menuDetails.vendorSectionId && !this.menuDetails.vendorSectionId[0]) ||
        !this.menuOperatingHours[0] ){
          this.showToast('danger', '', 'Please complete the mandatory items in the menu and try again');
    }else{
      observer.next(true);
    }
    }else{
    observer.next(true);
    }
    return () => clearTimeout();
  });
  
  onChange(event) {
      if(event == true){
        this.menuDetails.status= 'inactive';
      }else{
        this.menuDetails.status = 'active';
      } 
      if( (this.menuDetails.mediaId.rectangle && !this.menuDetails.mediaId.rectangle._id) || 
      (this.menuDetails.mediaId.square && !this.menuDetails.mediaId.square._id) || 
       (this.menuDetails.vendorSectionId && !this.menuDetails.vendorSectionId[0]) ||
       (!this.menuOperatingHours && !this.menuOperatingHours[0]) ){
        this.showToast('danger', '', 'Please fill all mandatory fields to activate the menu');
        return;
      } 
     
      this.apiService.editMenuStatus(this.menuDetails).subscribe((res)=>{
        this.showToast('success', '', 'Saved Succesfully');
      }); 
    }

  MediaData: any;

  uploadSquareImage() {
    this.spinner.show();
    this.file={'mimeType':this.croppedfile.type,'fileName':this.croppedfile.name};
    this.apiService.postFile(this.file).subscribe((data)=>{
    if(data.status == true){
      this.uploadService.uploadfile(this.croppedfile,data).subscribe(
        (res) =>{
          if(res['status']==204){
            let S3Url = "https://"+this.envService.read('S3bucket')+".s3.amazonaws.com/";
            this.S3filename = S3Url+data.policysiganture.fields.key;
            this.apiService.saveMedia(this.S3filename).subscribe((res)=>{
              if(res.status == true){ 
                this.MediaData = 
                {  "mediaId" : 
                  {  "square" : res.id,
                    "bgColor" : this.menuDetails.mediaId.bgColor
                  },
                  "id" : localStorage.getItem('MenuId')
                } 
                if(this.menuDetails.mediaId && this.menuDetails.mediaId.rectangle){
                  this.MediaData.mediaId.rectangle = this.menuDetails.mediaId.rectangle;
                }
                this.apiService.editMenuMedia(this.MediaData).subscribe((res)=>{
                  this.spinner.hide();
                  if(res.status == true){
                    this.getMenuDetails(localStorage.getItem('MenuId'));  
                    this.getVendorSection(localStorage.getItem('VendorID')); 
                    this.getVendorTags(localStorage.getItem('VendorID'));  
                    this.selectedFiles2 =null;
                    this.croppedImage = null;
                    this.showToast('success', '', 'Image saved successfully');
                  } else {
                      this.showToast('danger', '', 'Error');
                  } 
                });
              }
            });
          }
        })
      } else{
        this.showToast('success', '', 'Error');
      }
    });
  }

    file: any;
    croppedfile: any;
    S3filename: any;
    selectedFiles:any;

    selectFile(event) {
      this.selectedFiles = event.target.files;
    }
    
    private getDismissReason(reason: any): string {
      if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        return 'by clicking on a backdrop';
      } else {
        return  `with: ${reason}`;
      }
    }

    imageChangedEvent: any = '';
    croppedImage: any = '';
    selectedRatio: number = 1/1;
    selectedFiles2: any;
    @ViewChild('myInput',{ static: false })
    myInputVariable: ElementRef;
    closeResult: string;
    
    fileChangeEvent(event: any,content:any): void {
      if(event.target.files.item(0).type!= "image/png" && event.target.files.item(0).type!= "image/jpeg"){
        this.showToast('danger', '', 'Please select a valid image');
        return
      }
      this.imageChangedEvent = event;
      this.selectedFiles2 = event.target.files.item(0).name.replace(/ /g,'');
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title',size: 'lg',backdropClass: 'light-blue-backdrop',windowClass: 'dark-modal'} ).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
        this.uploadSquareImage();
      }, (reason) => {
        this.croppedImage = null;
        this.myInputVariable.nativeElement.value = "";
        this.selectedFiles2 = "";
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
      var arr = event.base64.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), 
      n = bstr.length, 
      u8arr = new Uint8Array(n); 
      while(n--){
        u8arr[n] = bstr.charCodeAt(n);
      }
      this.croppedfile = new File([u8arr], this.selectedFiles2, {type:mime});   
    }

    imageCropped2(event: ImageCroppedEvent) {
      this.croppedImage2 = event.base64;
      var arr = event.base64.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), 
      n = bstr.length, 
      u8arr = new Uint8Array(n); 
      while(n--){
      u8arr[n] = bstr.charCodeAt(n);
      }
      this.croppedfile2 = new File([u8arr], this.selectedFiles3, {type:mime});
    }
    
    fileChangeEvent2(event: any,content2:any): void {
      if(event.target.files.item(0).type!= "image/png" && event.target.files.item(0).type!= "image/jpeg"){
        this.showToast('danger', '', 'Please select a valid image');
        return
      }
      this.imageChangedEvent2 = event;
      this.selectedFiles3 = event.target.files.item(0).name.replace(/ /g,'');
      this.modalService.open(content2, {ariaLabelledBy: 'modal-basic-title',size: 'lg',backdropClass: 'light-blue-backdrop',windowClass: 'dark-modal'} ).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
        this.uploadRectangleImage();
        }, (reason) => {
        this.croppedImage2 = null;
        this.myInputVariable.nativeElement.value = "";
        this.selectedFiles3 = "";
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
    
    changeAspectRatio2(ratio){
      if(ratio == 1){
        this.selectedRatio2 = 1;
      }
      else{
        this.selectedRatio2 = 1.618;
      }
    }

    changeAspectRatio(ratio){
      if(ratio == 1){
        this.selectedRatio = 1;
      }
      else{
        this.selectedRatio2 = 1.618;
      }
    }

    croppedfile2:any;
    selectedRatio2: number = 1/1;
    imageChangedEvent2:any;
    selectedFiles3:any;
    croppedImage2:any;

    SaveBackgroundColor() {
      if( (!this.menuDetails.mediaId.square || !this.menuDetails.mediaId.square.url) || 
      (!this.menuDetails.mediaId.rectangle || !this.menuDetails.mediaId.rectangle.url) ){
        this.showToast('danger', '', 'Please Add Image to save the details');
        return;
      }
      if(!localStorage.getItem('MenuId')){
        return;
      }
      this.spinner.show();
      this.MediaData = 
        {  "mediaId" : 
          { 
            "bgColor" : this.menuDetails.mediaId.bgColor
          },
          "id" : localStorage.getItem('MenuId')
        } 
        if(this.menuDetails.mediaId && this.menuDetails.mediaId.square){
          this.MediaData.mediaId.square = this.menuDetails.mediaId.square;
        }
        if(this.menuDetails.mediaId && this.menuDetails.mediaId.rectangle){
          this.MediaData.mediaId.rectangle = this.menuDetails.mediaId.rectangle;
        }
        this.apiService.editMenuMedia(this.MediaData).subscribe((res)=>{
          this.spinner.hide();
          if(res.status == true){
            this.getMenuDetails(localStorage.getItem('MenuId'));
            this.getVendorSection(localStorage.getItem('VendorID'));  
            this.getVendorTags(localStorage.getItem('VendorID'));  
            this.showToast('success', '', 'Saved successfully');
            this.tabSelct=2;
          } else {
              this.showToast('danger', '', 'Error');
          } 
        });

    }

    uploadRectangleImage() {
      this.spinner.show();
      this.file={'mimeType':this.croppedfile2.type,'fileName':this.croppedfile2.name};
      this.apiService.postFile(this.file).subscribe((data)=>{
      if(data.status == true){
        this.uploadService.uploadfile(this.croppedfile2,data).subscribe(
          (res) =>{
            if(res['status']==204){
              let S3Url = "https://"+this.envService.read('S3bucket')+".s3.amazonaws.com/";
              this.S3filename = S3Url+data.policysiganture.fields.key;
              this.apiService.saveMedia(this.S3filename).subscribe((res)=>{
                if(res.status == true){ 
                  this.MediaData = 
                  {  "mediaId" : 
                    {  "rectangle" : res.id,
                      "bgColor" : this.menuDetails.mediaId.bgColor
                    },
                    "id" : localStorage.getItem('MenuId')
                  } 
                  if(this.menuDetails.mediaId && this.menuDetails.mediaId.square){
                    this.MediaData.mediaId.square = this.menuDetails.mediaId.square;
                  }
                  this.apiService.editMenuMedia(this.MediaData).subscribe((res)=>{
                    this.spinner.hide();
                    if(res.status == true){
                      this.selectedFiles3 = null;
                      this.croppedImage2 = null;
                      this.getMenuDetails(localStorage.getItem('MenuId'));  
                      this.getVendorSection(localStorage.getItem('VendorID'));  
                      this.getVendorTags(localStorage.getItem('VendorID'));  
                      this.showToast('success', '', 'Image saved successfully');
                    } else {
                        this.showToast('danger', '', 'Error');
                    } 
                  });
                }
              });
            }
          })
        } else{
          this.showToast('success', '', 'Error');
        }
      });
    }

    vendorAvailableHours(){
      if(this.vendorHours == false){
        this.getOperatingHours(localStorage.getItem('VendorID')); 
      } else {
        this.getMenuOperatingHours(localStorage.getItem('MenuId'));   
      }
    }

    vendorOperatingHours:any;
    public getVendorOperatingHours(id){
      this.apiService.getOperatingHours(id).subscribe((res)=>{
        this.vendorOperatingHours = res.body.vendorOperatingHours
      });
    }

    day1: any;
    day2: any;
    day3: any;
    day4: any;
    day5: any;
    day6: any;
    day7: any;

    public getOperatingHours(id){
      this.apiService.getOperatingHours(id).subscribe((res)=>{
        const data = res.body.vendorOperatingHours;
        if(res.body.totalCount == 0){
          this.showToast('danger', '', 'Please add Available Hours in Profile page');
        } else {
          /*var today = new Date();
          var dd = String(today.getDate()).padStart(2, '0');
          var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
          var yyyy = today.getFullYear();
          var date = mm + '-' + dd + '-' + yyyy;

          for(let j in data){
            if(data[j].opening && data[j].closing) {
              var time1 = data[j].opening.split("."); 
              var newdate1 = new Date(date+' '+time1[0]+':'+time1[1]+' UTC');
              newdate1.toString();
              var H1 = newdate1.getHours();
              var M1 = newdate1.getMinutes()
              var opening = H1+'.'+M1;
              data[j].opening = opening;

              var time2 = data[j].closing.split("."); 
              var newdate2 = new Date(date+' '+time2[0]+':'+time2[1]+' UTC');
              newdate2.toString();
              var H2 = newdate2.getHours();
              var M2 = newdate2.getMinutes()
              var closing = H2+'.'+M2;
              data[j].closing = closing;
            }
          } */
          for(let i in data){
            if(data[i].dayOfWeek == 1){
              let digits1 = data[i].opening.toString().split('.').map(Number);
              let digits2 = data[i].closing.toString().split('.').map(Number);
              if(!digits1[1]){
                digits1[1] = 0;
              }
              if(!digits2[1]){
                digits2[1] = 0;
              }
              this.day1 = {
                starttime: {
                  hour: digits1[0],
                  minute: digits1[1]
                },
                endtime: {
                  hour: digits2[0],
                  minute: digits2[1]
                },        
              }
              
            }
            if(data[i].dayOfWeek == 2){
              let digits1 = data[i].opening.toString().split('.').map(Number);
              let digits2 = data[i].closing.toString().split('.').map(Number);
              if(!digits1[1]){
                digits1[1] = 0;
              }
              if(!digits2[1]){
                digits2[1] = 0;
              }
              this.day2 = {
                starttime: {
                  hour: digits1[0],
                  minute: digits1[1]
                },
                endtime: {
                  hour: digits2[0],
                  minute: digits2[1]
                },   
              }
            }
            if(data[i].dayOfWeek == 3){
              let digits1 = data[i].opening.toString().split('.').map(Number);
              let digits2 = data[i].closing.toString().split('.').map(Number);
              if(!digits1[1]){
                digits1[1] = 0;
              }
              if(!digits2[1]){
                digits2[1] = 0;
              }
              this.day3 = {
                starttime: {
                  hour: digits1[0],
                  minute: digits1[1]
                },
                endtime: {
                  hour: digits2[0],
                  minute: digits2[1]
                },     
              }
            }
            if(data[i].dayOfWeek == 4){
              let digits1 = data[i].opening.toString().split('.').map(Number);
              let digits2 = data[i].closing.toString().split('.').map(Number);
              if(!digits1[1]){
                digits1[1] = 0;
              }
              if(!digits2[1]){
                digits2[1] = 0;
              }
              this.day4 = {
                starttime: {
                  hour: digits1[0],
                  minute: digits1[1]
                },
                endtime: {
                  hour: digits2[0],
                  minute: digits2[1]
                },         
              }
            }
            if(data[i].dayOfWeek == 5){
              let digits1 = data[i].opening.toString().split('.').map(Number);
              let digits2 = data[i].closing.toString().split('.').map(Number);
              if(!digits1[1]){
                digits1[1] = 0;
              }
              if(!digits2[1]){
                digits2[1] = 0;
              }
              this.day5 = {
                starttime: {
                  hour: digits1[0],
                  minute: digits1[1]
                },
                endtime: {
                  hour: digits2[0],
                  minute: digits2[1]
                },
              }
            }
            if(data[i].dayOfWeek == 6){
              let digits1 = data[i].opening.toString().split('.').map(Number);
              let digits2 = data[i].closing.toString().split('.').map(Number);
              if(!digits1[1]){
                digits1[1] = 0;
              }
              if(!digits2[1]){
                digits2[1] = 0;
              }
              this.day6 = {
                starttime: {
                  hour: digits1[0],
                  minute: digits1[1]
                },
                endtime: {
                  hour: digits2[0],
                  minute: digits2[1]
                },
              }
            }
            if(data[i].dayOfWeek == 7){
              let digits1 = data[i].opening.toString().split('.').map(Number);
              let digits2 = data[i].closing.toString().split('.').map(Number);
              if(!digits1[1]){
                digits1[1] = 0;
              }
              if(!digits2[1]){
                digits2[1] = 0;
              }
              this.day7 = {
                starttime: {
                  hour: digits1[0],
                  minute: digits1[1]
                },
                endtime: {
                  hour: digits2[0],
                  minute: digits2[1]
                },
              }
            }
          }
          this.createForm3();
        }
      });
    }

    createForm3() {
      this.consignmentForm = this.fb.group({
      id:'',
      mondayItems:this.fb.array([this.createAvailableItem(this.day1)]),
      tuesdayItems:this.fb.array([this.createAvailableItem(this.day2)]),
      wednesdayItems:this.fb.array([this.createAvailableItem(this.day3)]),
      thursdayItems:this.fb.array([this.createAvailableItem(this.day4)]),
      fridayItems:this.fb.array([this.createAvailableItem(this.day5)]),
      saturdayItems:this.fb.array([this.createAvailableItem(this.day6)]),
      sundayItems:this.fb.array([this.createAvailableItem(this.day7)]),
    });
  }

  createAvailableItem(value): FormGroup { 
    let itemGrp:FormGroup =  this.fb.group({
      starttime:{hour: value.starttime.hour, minute: value.starttime.minute, second: 0},
      endtime:{hour: value.endtime.hour, minute: value.endtime.minute, second: 0},
      _id: value._id
    });
    return itemGrp;
  }

  canceldetails(){
    this.router.navigateByUrl("/pages/menu/manage-menu");
  }
  
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  dotCount:any;
  checkNumberOnly:any;
  checkString:any;
  cdr:any;

  numberOnly2(event): boolean {          
    const charCode = (event.which) ? event.which : event.keyCode;      
    if (charCode == 46) {
        this.dotCount += 1;
        this.checkNumberOnly = (event.target.value);
        var numericCheck = (event.target.value).toString();
        if (numericCheck.includes('.')) {
          this.dotCount += 1;
        }
        if (this.dotCount > 1) {   
            this.dotCount = 0;
            return false;
        }
    }
    if (charCode > 31 && (charCode < 45 || charCode > 57 || charCode==47)) {
        return false;
    }
    this.checkNumberOnly = (event.target.value);
    if (this.checkNumberOnly != null) {
        var numeric = (event.target.value).toString();
        if (numeric.includes('.')) {
            var checkNumeric = numeric.split('.');
            if (checkNumeric.length > 2) {
                return false;
            }
            this.checkString = checkNumeric[1].split('');
            if (this.checkString.length > 1) {
              return false;
            }
        }
    }
    this.dotCount = 0;
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