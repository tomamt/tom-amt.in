import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';

import { SmartTableData } from '../../../@core/data/smart-table';
import { ApiService } from '../../../../app/services/api.service';

import { NbDialogService } from '@nebular/theme';

import { DialogNamePromptComponent } from '../dialog/dialog-name-prompt/dialog-name-prompt.component';
import { ToasterConfig } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus,
  NbGlobalPhysicalPosition,
  NbToastrService,
 } from '@nebular/theme';
import { AuthService } from '../../../services/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Router } from '@angular/router';

@Component({
  selector: 'button-view',
  template: `
  <ui-switch labelOn="Locked" style="margin-left: 32px;" size="small" [checked]="renderValue" labelOff="Active" (change)="onChange($event)" ></ui-switch>`,
})
export class ButtonViewComponent2 implements ViewCell, OnInit {
  renderValue: boolean;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

  ngOnInit() {
    if(this.value == 'locked'){
      this.renderValue = true;    
    }else{
      this.renderValue = false;
    }
  }

  onChange(event) {
    if(event == true){
      this.rowData.status= 'locked';
      this.save.emit(this.rowData);
    }else{
      this.rowData.status =  'active';
      this.save.emit(this.rowData);
    }
  }
}

@Component({
  selector: 'ngx-smart-table',
  templateUrl: './delivery-agents.component.html',
  styleUrls: ['./delivery-agents.component.scss'],
})
export class DeliveryAgentsComponent {

  editCrewMember: boolean;
  source: LocalDataSource = new LocalDataSource();
  settings:any;

  constructor(private service: SmartTableData, 
    private apiService: ApiService,
    private auth: AuthService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private spinner: NgxSpinnerService,
    private router: Router) {
    
      if(localStorage.getItem('UserRole') == "daManager" || 
      localStorage.getItem('UserRole') == "superAdmin" || 
      localStorage.getItem('UserRole') == "admin"){
        this.editCrewMember = true;
      } else {
        this.editCrewMember = false;
      }
      this.settings = {
        mode: 'external',
        actions: {
          position:  'right',
          edit: this.editCrewMember,
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
          editButtonContent: '<i title="View Details" class="fa fa-eye"></i>',
          saveButtonContent: '<i class="nb-checkmark"></i>',
          cancelButtonContent: '<i class="nb-close"></i>',
          confirmSave: true,
        },
        delete: {
          deleteButtonContent: '<i title="Block user" class="fas fa-user-lock" ></i>',
          confirmDelete: true,
        },
        columns: {
          name: {
            title: 'Name',
            type: 'string',
          }, 
          email: {
            title: 'Email',
            type: 'string',
          },
          status: {
            title: 'Status',
            type: 'custom',
            class:'statusclass',
            renderComponent: ButtonViewComponent2,
            onComponentInitFunction: (instance: any) =>  {
              instance.save.subscribe(row => {
                this.activateButton(row);
              });
            }
          },    
        },
      };
    this.getDeliveryAgents()
    
  }

  getDeliveryAgents(){
    this.spinner.show();
    this.apiService.getDeliveryAgents().subscribe((res)=>{
      this.spinner.hide();
      const data = res.body.users;
      this.source.load(data);  
    });
  }

  addButton(): void {
    localStorage.setItem('userRole', "deliveryAgent");
    this.dialogService.open(DialogNamePromptComponent).onClose.subscribe(data => {
      if(data != null){
        this.source.load(data); 
      }
     });     
  }
  
  activateButton(event): void {
    this.spinner.show();
    this.apiService.updateUserStatus(event).subscribe((res)=>{
      this.spinner.hide();
      if(res.status == true){
        this.showToast('success', '', 'Succesfully updated');    
      } else {
          this.showToast('danger', '', res.error);
      }
      this.getDeliveryAgents(); 
   });    
  }

  editButton(event): void {
    if(localStorage.getItem('UserRole') == "daManager" || 
    localStorage.getItem('UserRole') == "superAdmin" || 
    localStorage.getItem('UserRole') == "admin"){
      localStorage.setItem('deliveryAgentId', event.data._id);
      this.router.navigate(['/pages/users/view-delivery-agent']);
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
