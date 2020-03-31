import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ApiService } from '../../../../app/services/api.service';
import { ToasterConfig } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { LocalDataSource } from 'ng2-smart-table';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { AuthService } from '../../../services/auth.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { UploadFileService } from '../../../services/upload-file.service';
import { EnvironmentService } from '../../../../environments/environment.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NgbModal,ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
export class defaultTagModel{
  _id:  any;
  name: string;
 
}
@Component({
  selector: 'ngx-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit  {
 
  @ViewChild('tabGroup',{ static: false }) tabGroup;
  tabSelct: any = '0';
  
  userprofile:any;
  userid:any;
  source: LocalDataSource = new LocalDataSource();
  source2: LocalDataSource = new LocalDataSource();
  vendorID:any;
  closeResult: string;
  consignmentForm :FormGroup;
  tuesdayForm:FormGroup;
  itemsInvalidMsg = {};
 
  meridian = true;
  controlErrorLabels = {
    consignmentNo : 'Consignment Number',
    receivedDate : 'Received Date',
    sender : 'Sender'
  } 

  constructor(private apiService: ApiService,config: NgbModalConfig,
    private auth: AuthService,
    private toastrService: NbToastrService,
    private uploadService:UploadFileService,
    public envService: EnvironmentService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router,
    private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.userid = localStorage.getItem('UserId');
    this.getVendorDetails(this.userid); 
    
  }

  status:any;
  dropdownSettings1:any;
  defaultTag2:any;
  ngOnInit() {
    this.vendorID = localStorage.getItem('VendorID');
    this.defaultTags();
    this.getVendorTags(this.vendorID); 
    this.getVendorSection(this.vendorID); 
    this.getStatus();
    this.getTerminals(localStorage.getItem('venuesID')); 
    this.getOperatingHours(this.vendorID); 
    
  this.dropdownSettings1 = { 
    singleSelection: false, 
    text:"Select Countries",
    selectAllText:'Select All',
    unSelectAllText:'UnSelect All',
    enableSearchFilter: true,
    classes:"myclass custom-class"


    
  };
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

  getVendorDetails(id){   
    this.apiService.getVendorDetails(id).subscribe((res)=>{
      this.userprofile=res.body.vendors[0];
      
      if(!this.userprofile.bgColor){
        this.userprofile.bgColor = '#ffffff';
      }
      if(!this.userprofile.deliveryAreaId){
        this.userprofile.deliveryAreaId = "";
      } else {
        this.userprofile.deliveryAreaId = this.userprofile.deliveryAreaId._id;
        this.selectdeliveryLocationById(this.userprofile.deliveryAreaId);
      }
      if(!this.userprofile.deliveryLocationId){
        this.userprofile.deliveryLocationId = "";
      } else {
        this.userprofile.deliveryLocationId = this.userprofile.deliveryLocationId._id;
      }
    });
  }

  saveMedia(){
    
    if(!this.userprofile.profilePicture || !this.userprofile.mediaId){
      this.showToast('danger', '', 'Please upload the Profile images'); 
      return;
    }
    this.spinner.show();
  
    this.apiService.editvendors(this.userprofile).subscribe((res)=>{
      this.spinner.hide();
      this.tabSelct = 2;
      if(res.status == true){
        this.showToast('success', '', 'Saved Succesfully');
      } else {
          this.showToast('danger', '', 'Error');
      } 
    });  
  }
  
  savedetails(){
    if(!this.userprofile.name || !this.userprofile.phoneNumber || 
      !this.userprofile.deliveryAreaId || !this.userprofile.deliveryLocationId || 
      !this.userprofile.cuisineType || !this.userprofile.license || 
      !this.userprofile.taxId ){
        this.showToast('danger', '', 'Please enter the required fields');  
        return; 
    }
    
    this.spinner.show();
    this.userprofile.id = this.userprofile._id;
    this.apiService.editvendors(this.userprofile).subscribe((res)=>{
      this.spinner.hide();
      this.tabSelct = 1;
      if(res.status == true){
        if(this.userprofile.userId && this.userprofile.userId._id){
          this.apiService.UpdateUserName(this.userprofile).subscribe((res)=>{
            if(res.status == true){
              this.showToast('success', '', 'Saved Succesfully');
            } else { 
              this.showToast('danger', '', 'Error');
            }
          });
        } else { 
          this.showToast('success', '', 'Saved Succesfully');
        } 
      } else {
          this.showToast('danger', '', 'Error');
      } 
    });
  }

  settings = {
    actions: {
      position:  'right',
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
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      name: {
        title: 'Tag Name',
        type: 'html',
          valuePrepareFunction: (cell, row) => {
             return this.getHtmlForCell(cell,row);
          }
      },    
    },
    rowClassFunction: (row) => {
      if(row.data.defaultTagId){
        return 'hide-action';
      } 
  },
  };
  getHtmlForCell(value: string,row: any) {
    if(row.defaultTagId) {
        return `<a title="You are not allowed to edit Default Tags">${ value }</a>`;
     }
    else{
      return `<a >${ value }</a>`;
}
}
  savesectiontab(){
    if(this.vendorSections.length == 0){
      this.showToast('danger', '', 'Please add Section'); 
    } else {
      this.tabSelct = 4;
    } 
  }

  savetagtab(){
    if(this.vendortags.length == 0){
      this.showToast('danger', '', 'Please add Tags'); 
    } else {
      this.tabSelct = 0;
      this.showToast('success', '', 'Saved Succesfully');
    } 
  }

  count:number = 0;
  disableTagButton:boolean=false;
  savetagtab2(){
    this.disableTagButton = true;
    if(!this.defaultTagDetails[0]){
      this.showToast('danger', '', 'Please select any tag to proceed.'); 
      this.disableTagButton = false;
      return;
    }
    const data= [];
      for(let i in this.defaultTagDetails){
        data.push({
          defaultTagId: this.defaultTagDetails[i]._id, 
          name:         this.defaultTagDetails[i].name,
          vendorId:     this.vendorID
        });
    }
    for(let m in this.vendortags){
      for(let k in data){
        if(this.vendortags[m].defaultTagId == data[k].defaultTagId){
          delete data[k];
        }
      }
    }

    this.count = 0;
    const TagDetail = async () => {
      if(this.count<data.length){
        const result = await returnTags(data[this.count]);
      } else {
        this.spinner.hide();
        this.getVendorTags(this.vendorID); 
        this.tabSelct = 4;
        this.showToast('success', '', 'Saved Succesfully');  
        this.disableTagButton = false;
      }
    }
    const returnTags = obj => {
      this.spinner.show();
      if(obj){
        this.apiService.createVendorTags(obj).subscribe((res)=>{
          this.count++;
          TagDetail()
        });
      } else {
        this.count++;
        TagDetail()
      }
      
    }

    TagDetail().then(() =>{  
    });
    
  }
 // defaultTagDetails:defaultTagModel[] =[ {_id: "", name: ""}];
 defaultTagDetails:any;
  defaultTag: any;
  vendortags: any;
  public getVendorTags(id){
    this.vendortags = [];
  
    this.apiService.getVendorTags(id).subscribe((res)=>{
      const data = res.body.vendorTags;
      this.vendortags = data;
      this.source.load(data); 
      this.defaultTagDetails = [];
      for(let j in this.vendortags){
        if(this.vendortags[j].defaultTagId){
          this.defaultTagDetails.push({
            _id:  this.vendortags[j].defaultTagId,
            name: this.vendortags[j].name,
           // id: this.vendortags[j].defaultTagId,
//itemName: this.vendortags[j].name
          })
        } 
      }       
    });
  }

  
  public defaultTags(){
    this.apiService.defaultTags().subscribe((res)=>{
      //this.defaultTag = res.body.defaultTags;
      this.defaultTag2 = [];
      for(let i in res.body.defaultTags){
        this.defaultTag2.push({"_id":res.body.defaultTags[i]._id,"name":res.body.defaultTags[i].name})
      }
    });
  }

  public OnItemDeSelect(item:any){
    for(let k in this.vendortags){
      if(this.vendortags[k].defaultTagId){
        if(this.vendortags[k].defaultTagId == item._id){
        this.getVendorTags(this.vendorID); 
        this.showToast('danger', '', 'Please remove the tag from the below table');
        return;
        }
      }
    }
  }

  public onDeSelectAll(item:any){
    this.getVendorTags(this.vendorID); 
    this.showToast('danger', '', 'Please remove the tag from the below table');
    return;
  }
  
  
  vendorSections: any;
  public getVendorSection(id){
    this.vendorSections = [];
    this.apiService.getVendorSection(id).subscribe((res)=>{
      const data = res.body.vendorMenuSection;
      this.vendorSections = data;
      this.source2.load(data);  
    });
  }

  monday: any;
  tuesday: any;
  wednesday: any;
  thursday: any;
  friday: any;
  saturday: any;
  sunday: any;

  public getOperatingHours(id){
    this.apiService.getOperatingHours(id).subscribe((res)=>{
      const data = res.body.vendorOperatingHours;
     
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

      if(res.body.totalCount == 0){
        this.createForm();
      } else {
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
            this.monday = {
              starttime: {
                hour: digits1[0],
                minute: digits1[1]
              },
              endtime: {
                hour: digits2[0],
                minute: digits2[1]
              },
              _id: data[i]._id
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
            this.tuesday = {
              starttime: {
                hour: digits1[0],
                minute: digits1[1]
              },
              endtime: {
                hour: digits2[0],
                minute: digits2[1]
              },
              _id: data[i]._id
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
            this.wednesday = {
              starttime: {
                hour: digits1[0],
                minute: digits1[1]
              },
              endtime: {
                hour: digits2[0],
                minute: digits2[1]
              },
              _id: data[i]._id
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
            this.thursday = {
              starttime: {
                hour: digits1[0],
                minute: digits1[1]
              },
              endtime: {
                hour: digits2[0],
                minute: digits2[1]
              },
              _id: data[i]._id
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
            this.friday = {
              starttime: {
                hour: digits1[0],
                minute: digits1[1]
              },
              endtime: {
                hour: digits2[0],
                minute: digits2[1]
              },
              _id: data[i]._id
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
            this.saturday = {
              starttime: {
                hour: digits1[0],
                minute: digits1[1]
              },
              endtime: {
                hour: digits2[0],
                minute: digits2[1]
              },
              _id: data[i]._id
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
            this.sunday = {
              starttime: {
                hour: digits1[0],
                minute: digits1[1]
              },
              endtime: {
                hour: digits2[0],
                minute: digits2[1]
              },
              _id: data[i]._id
            }
          }
        }
        this.createForm1();
      }
    });
  }

  terminals: any;
  public getTerminals(id){
    this.apiService.getTerminals(id).subscribe((res)=>{
      const data = res.body.deliveryAreas;
      this.terminals = data;
    });
  }

  public cleardeliveryLocation(){
    this.userprofile.deliveryLocationId = "";
  }
  gates: any;
  public selectdeliveryLocationById(id){
    this.apiService.getGates(id).subscribe((res)=>{
      const data = res.body.deliveryLocations;
      this.gates = data;
    });
  }

  dropdownSettings = {
    singleSelection: false,
    //idField: '_id',
    //textField: 'name',
   // selectAllText: 'Select All',
    //unSelectAllText: 'UnSelect All',
    //itemsShowLimit: 0,
    enableSearchFilter: true,
    labelKey:'name',
    primaryKey:'_id',
    enableCheckAll:false,
    badgeShowLimit:0,
    text:'Select default tag',
    //allowSearchFilter: true
  };
   
  onCreateConfirm(event): void {
    if(event.newData.name == ""){
      this.showToast('danger', '', 'Please enter the required fields');  
      return;
    }
    for(let i in this.vendortags){
      if(event.newData.name.toLowerCase() == this.vendortags[i].name.toLowerCase()){
        this.showToast('danger', '', 'Tag name already exists');  
        return;
      }
    }

    for(let i in this.defaultTag){
      if(event.newData.name.toLowerCase() == this.defaultTag[i].name.toLowerCase()){
        this.showToast('danger', 'Please select tag from Default tag list', 'Tag name already exists in Default tag');  
        return;
      }
    }
    
    
    this.spinner.show();
    event.newData.vendorId = this.vendorID;
     this.apiService.createVendorTags(event.newData).subscribe((res)=>{
      this.spinner.hide();
       if(res){
         if(res.status == true){
          this.showToast('success', '', 'Saved Succesfully');
           this.getVendorTags(this.vendorID); 
           event.confirm.resolve();
         } else {
           this.showToast('danger', '', 'Error');
           this.getVendorTags(this.vendorID); 
           event.confirm.resolve();
         }
       }
       });
     
   }
 
   onDeleteConfirm(event): void {
    if(confirm("Are you sure you want to delete?")) {
      this.spinner.show();
     this.apiService.deleteVendorTags(event.data._id).subscribe((res)=>{
      this.spinner.hide();
        if(res){
          if(res.status == true){
            this.showToast('success', '', 'Succesfully Deleted');
            this.getVendorTags(this.vendorID); 
            event.confirm.resolve();
          } else {
            this.showToast('danger', '', 'Error');
            this.getVendorTags(this.vendorID); 
            event.confirm.resolve();
          }
        }
      });
    }
    
     
  }
 
   onEditConfirm(event): void {
    if(event.data.defaultTagId){
      this.showToast('danger', '', 'You are not allowed to edit Default Tags');
      event.confirm.resolve(event.data.name);
      return;
    }
    this.spinner.show();
     this.apiService.editVendorTags(event.newData).subscribe((res)=>{
      this.spinner.hide();
       if(res){
         if(res.status == true){
          this.showToast('success', '', 'Saved Succesfully');
           this.getVendorTags(this.vendorID); 
           event.confirm.resolve();
         } else {
           this.showToast('danger', '', 'Error');
           this.getVendorTags(this.vendorID); 
           event.confirm.resolve();
         }
       }
    });
   }

   settings2 = {
    actions: {
      position:  'right',
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
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      name: {
        title: 'Section Name',
        type: 'string',
      },    
    },
  };

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
                this.MediaData = {  
                  mediaId : res.id,
                  bgColor : this.userprofile.bgColor, 
                  id : localStorage.getItem('VendorID')
                }
              } 
                this.apiService.editvendorMedia(this.MediaData).subscribe((res)=>{
                  this.spinner.hide();
                  if(res.status == true){
                    this.getVendorDetails(localStorage.getItem('UserId')); 
                    this.selectedFiles2 =null;
                    this.croppedImage = null;
                    this.showToast('success', '', 'Image saved successfully');
                  } else {
                      this.showToast('danger', '', 'Error');
                  } 
                });
            });
          }
        })
      } else{
        this.showToast('danger', '', 'Error');
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
     
    imageChangedEvent: any = '';
    croppedImage: any = '';
    selectedRatio: number = 1/1;
    selectedFiles2: any;
    @ViewChild('myInput',{ static: false })
    myInputVariable: ElementRef;
    
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
    croppedfile2:any;
    selectedRatio2: number = 1/1;
    imageChangedEvent2:any;
    selectedFiles3:any;
    croppedImage2:any;

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
                  this.MediaData = {  
                    profilePicture : res.id,
                    bgColor : this.userprofile.bgColor,
                    id : localStorage.getItem('VendorID')
                  } 
                  this.apiService.editvendorMedia(this.MediaData).subscribe((res)=>{
                    this.spinner.hide();
                    if(res.status == true){
                      this.getVendorDetails(localStorage.getItem('UserId')); 
                      this.selectedFiles3 = null;
                      this.croppedImage2 = null;
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
          this.showToast('danger', '', 'Error');
        }
      });
    }

    changeAspectRatio(ratio){
      if(ratio == 1){
        this.selectedRatio = 1;
      }
      else{
        this.selectedRatio2 = 1.618;
      }
    }

    

  onCreateConfirm2(event): void {
    if(event.newData.name == ""){
      this.showToast('danger', '', 'Please enter the required fields');  
      return;
    }
    this.spinner.show();
    event.newData.vendorId = this.vendorID;
     this.apiService.createVendorSection(event.newData).subscribe((res)=>{
      this.spinner.hide();
       if(res){
         if(res.status == true){
          this.showToast('success', '', 'Saved Succesfully');
           this.getVendorSection(this.vendorID); 
           event.confirm.resolve();
         } else {
           this.showToast('danger', '', 'Error');
           this.getVendorSection(this.vendorID); 
           event.confirm.resolve();
         }
       }
       });
   }

   onEditConfirm2(event): void {
    this.spinner.show();
    this.apiService.editVendorSection(event.newData).subscribe((res)=>{
      this.spinner.hide();
      if(res){
        if(res.status == true){
          this.showToast('success', '', 'Saved Succesfully');
          this.getVendorSection(this.vendorID); 
          event.confirm.resolve();
        } else {
          this.showToast('danger', '', 'Error');
          this.getVendorSection(this.vendorID); 
          event.confirm.resolve();
        }
      }
    });
   }
 
   onDeleteConfirm2(event): void {
     if(event.data.menuItems.length > 0){
      this.showToast('danger', '', 'This section cannot be deleted as there are menu items associated with it. Please try after removing the section from the menu items.');
      return;
     }
     if(confirm("Are you sure you want to delete?")) {
      this.spinner.show();
      this.apiService.deleteVendorSection(event.data._id).subscribe((res)=>{
        this.spinner.hide();
        if(res){
          if(res.status == true){
            this.showToast('success', '', 'Succesfully Deleted');
            this.getVendorSection(this.vendorID); 
            event.confirm.resolve();
          } else {
            this.showToast('danger', '', 'Error');
            this.getVendorSection(this.vendorID); 
            event.confirm.resolve();
          }
        }
      });
    }
    
     
   }

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
  

  public getStatus(){
    this.status = [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ];
  }

  createMondayItem(): FormGroup {
    let itemGrp:FormGroup =  this.fb.group({
      starttime:{hour: 0, minute: 0, second: 0},
      endtime:{hour: 0, minute: 0, second: 0},
    });
    return itemGrp;
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

  createForm1() {
    this.consignmentForm = this.fb.group({
    id:'',
    mondayItems:this.fb.array([this.createMondayItem2(this.monday)]),
    tuesdayItems:this.fb.array([this.createMondayItem2(this.tuesday)]),
    wednesdayItems:this.fb.array([this.createMondayItem2(this.wednesday)]),
    thursdayItems:this.fb.array([this.createMondayItem2(this.thursday)]),
    fridayItems:this.fb.array([this.createMondayItem2(this.friday)]),
    saturdayItems:this.fb.array([this.createMondayItem2(this.saturday)]),
    sundayItems:this.fb.array([this.createMondayItem2(this.sunday)]),
  });
}



  availableHours: any= [];
  hoursCount: any;
  saveAvailableHours(){
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    this.availableHours = [];
    this.hoursCount = 0;
    const vendorId =  localStorage.getItem('VendorID');
    
     this.consignmentForm.value.mondayItems.forEach(obj => {
       obj.opening=obj.starttime.hour+'.'+obj.starttime.minute;
       obj.closing=obj.endtime.hour+'.'+obj.endtime.minute; 
       obj.dayOfWeek = 1;
       if(obj._id){
        this.availableHours.push({
          dayOfWeek: obj.dayOfWeek,
          opening: obj.opening,
          closing: obj.closing, 
          _id: obj._id,
          timezone: timezone,
          day: "Monday"
        });
       } else {
        this.availableHours.push({
          dayOfWeek: obj.dayOfWeek,
          opening: obj.opening,
          closing: obj.closing, 
          vendorId: vendorId,
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
          _id: obj._id,
          timezone: timezone,
          day: "Tuesday"
        });
       } else {
        this.availableHours.push({
          dayOfWeek: obj.dayOfWeek,
          opening: obj.opening,
          closing: obj.closing, 
          vendorId: vendorId,
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
          _id: obj._id,
          timezone: timezone,
          day: "Wednesday"
        });
       } else {
        this.availableHours.push({
          dayOfWeek: obj.dayOfWeek,
          opening: obj.opening,
          closing: obj.closing, 
          vendorId: vendorId,
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
          _id: obj._id,
          timezone: timezone,
          day: "Thursday"
        });
       } else {
        this.availableHours.push({
          dayOfWeek: obj.dayOfWeek,
          opening: obj.opening,
          closing: obj.closing, 
          vendorId: vendorId,
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
          _id: obj._id,
          timezone: timezone,
          day: "Friday"
        });
       } else {
        this.availableHours.push({
          dayOfWeek: obj.dayOfWeek,
          opening: obj.opening,
          closing: obj.closing, 
          vendorId: vendorId,
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
          _id: obj._id,
          timezone: timezone,
          day: "Saturday"
        });
       } else {
        this.availableHours.push({
          dayOfWeek: obj.dayOfWeek,
          opening: obj.opening,
          closing: obj.closing, 
          vendorId: vendorId,
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
          _id: obj._id,
          timezone: timezone,
          day: "Sunday"
        });
       } else {
        this.availableHours.push({
          dayOfWeek: obj.dayOfWeek,
          opening: obj.opening,
          closing: obj.closing, 
          vendorId: vendorId,
          timezone: timezone,
          day: "Sunday"
        }); 
       }
       this.hoursCount = this.hoursCount + (obj.closing - obj.opening);
      });
      
      if(this.hoursCount == 0){
        this.spinner.hide();
        this.showToast('danger', '', 'Please fill Hours of Operation');
        return;
      }
      for(let i in this.availableHours){
        if( Number(this.availableHours[i].opening) > Number(this.availableHours[i].closing)){
          this.spinner.hide();
          this.showToast('danger', 'Start time should be less than End time', 'Please check the Business Hours on '+this.availableHours[i].day);
          return;
        }
        if( Number(this.availableHours[i].opening) == Number(this.availableHours[i].closing)){
          this.spinner.hide();
          this.showToast('danger', 'Start time should not be same as the End time', 'Please check the Business Hours on '+this.availableHours[i].day);
          return;
         }
      }
      /*var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      var date = mm + '/' + dd + '/' + yyyy;

      for(let i in this.availableHours){
        if(this.availableHours[i].opening &&  this.availableHours[i].closing){
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
          
          this.availableHours[i].opening = opening2;
          this.availableHours[i].closing = closing2;
        }   
      }*/
    
     const sectionHours = async () => {
       this.availableHours.forEach(async values => {
        const result = await returnHours(values);
       });
     }
      
     const returnHours = obj => {
       this.apiService.saveVendorableHours(obj).subscribe((res)=>{
         return res;
       });
     }
      
     sectionHours().then(() =>{
      this.tabSelct = 3;
      this.showToast('success', '', 'Saved Succesfully');
     })
       
   }

  
}
