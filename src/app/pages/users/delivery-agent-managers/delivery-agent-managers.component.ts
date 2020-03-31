import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';

import { SmartTableData } from '../../../@core/data/smart-table';
import { ApiService } from '../../../../app/services/api.service';

import { NbDialogService } from '@nebular/theme';

import { DialogNamePromptComponent } from '../dialog/dialog-name-prompt/dialog-name-prompt.component';
import { ToasterConfig } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { AuthService } from '../../../services/auth.service';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'button-view',
  template: `
  <ui-switch labelOn="Locked" style="margin-left: 32px;" size="small" [checked]="renderValue" labelOff="Active" (change)="onChange($event)" ></ui-switch>`,
})
export class ButtonViewComponent3 implements ViewCell, OnInit {
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
  templateUrl: './delivery-agent-managers.component.html',
  styleUrls: ['./delivery-agent-managers.component.scss'],
})
export class DeliveryAgentManagersComponent {

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
        renderComponent: ButtonViewComponent3,
        onComponentInitFunction: (instance: any) =>  {
          instance.save.subscribe(row => {
            this.activateButton(row);
          });
        }
      },    
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: SmartTableData, 
    private apiService: ApiService,
    private auth: AuthService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private spinner: NgxSpinnerService) {
   
    this.getDeliveryAgentManagers()
    
  }

  getDeliveryAgentManagers(){
    this.spinner.show();
    this.apiService.getDeliveryAgentManagers().subscribe((res)=>{
      this.spinner.hide();
      const data = res.body.users;
      this.source.load(data);  
    });
  }

  addButton(): void {
    localStorage.setItem('userRole', "daManager");
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
        this.getDeliveryAgentManagers(); 
      } else {
          this.showToast('danger', '', 'Error');
      }
   });    
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
