import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { ApiService } from '../../../../../app/services/api.service';
import { SmartTableData } from '../../../../@core/data/smart-table';
import { NbDialogService } from '@nebular/theme';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { ToasterConfig } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { AuthService } from '../../../../services/auth.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'ngx-dialog-name-prompt',
  templateUrl: 'dialog-name-prompt.component.html',
  styleUrls: ['dialog-name-prompt.component.scss'],
})

export class DialogNamePromptComponent {
  VendorsComponentobject: any;
  CrewMembersComponentobject: any;
  crewMembers:any = [];
  vendorMembers:any = [];
  DeliveryAgentMembers:any = [];
  DeliveryAgentManagerMembers:any = [];
  AdminMembers:any = [];

  constructor(protected ref: NbDialogRef<DialogNamePromptComponent>,
    private apiService: ApiService,
    private auth: AuthService,
    private service: SmartTableData,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private spinner: NgxSpinnerService) {
    
  }

  cancel() {
    this.ref.close(null);
  }

  data: any;
 
  submit(name: any, email: any) {
    if(!name || !email){
      this.showToast('danger', '', 'Please enter the required fields');  
      return; 
    }
    let EMAIL_REGEXP = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if ( !EMAIL_REGEXP.test(email)) {
      this.showToast('danger', '', 'Please enter a valid Email');  
      return; 
    }
   
    this.spinner.show();
    const userRole =  localStorage.getItem('userRole');
    const venuesID =  localStorage.getItem('venuesID');
  
    this.data = {
      "venueId": venuesID,
      "email": email,
      "userRole": userRole,
      "name": name
    }
    if(localStorage.getItem('userRole') == 'crew'){
      this.data.vendorId = localStorage.getItem('VendorID');
    }
    /* setTimeout(() => {
      this.spinner.hide();
    }, 2000); */
    this.apiService.createUser(this.data).subscribe((res)=>{
      this.spinner.hide();
      if(res){
        if(res.status == true){
          if(userRole == 'vendor'){
            this.apiService.getVendorList().subscribe((res)=>{
              const data = res.body.users;
              this.vendorMembers = data;
              this.ref.close(this.vendorMembers); 
            });
            this.showToast('success', '', 'Vendor added successfully');
          } 
          else if(userRole == 'crew'){
            const id = localStorage.getItem('VendorID');
            this.apiService.getCrewMembers(id).subscribe((res)=>{
              const data = res.body.users;
                this.crewMembers = data;
                this.ref.close(this.crewMembers);
            }); 
            this.showToast('success', '', 'Crew Member added successfully');   
          } 
          else if(userRole == 'deliveryAgent'){
            this.apiService.getDeliveryAgents().subscribe((res)=>{
              const data = res.body.users;
                this.DeliveryAgentMembers = data;
                this.ref.close(this.DeliveryAgentMembers);
            }); 
            this.showToast('success', '', 'Delivery Agent added successfully');   
          }
          else if(userRole == 'daManager'){
            this.apiService.getDeliveryAgentManagers().subscribe((res)=>{
              const data = res.body.users;
                this.DeliveryAgentManagerMembers = data;
                this.ref.close(this.DeliveryAgentManagerMembers);
            }); 
            this.showToast('success', '', 'Delivery Agent Manager added successfully');   
          }
          else if(userRole == 'admin'){
            this.apiService.getAdmins().subscribe((res)=>{
              const data = res.body.users;
                this.AdminMembers = data;
                this.ref.close(this.AdminMembers);
            }); 
            this.showToast('success', '', 'Admin added successfully');   
          }

        }  
      }
    },err=> {
      this.spinner.hide();
      if(err.status == 500 && err.error.error == "ConflictError: The user already exists."){
        this.showToast('success', '', 'The user already exists');  
      }
      throw err;
    })
  };

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
