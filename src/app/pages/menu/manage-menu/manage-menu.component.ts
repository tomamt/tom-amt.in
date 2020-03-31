import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';


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
import { NgxSpinnerService } from "ngx-spinner";
import { Observable } from 'rxjs';
 
@Component({
  selector: 'button-view',
  template: `
  <ui-switch checkedLabel="Inactive" style="margin-left: 32px;" [(ngModel)]="renderValue" [beforeChange]="OnBeforeChange" size="small" uncheckedLabel="Active" (change)="onChange($event)" ></ui-switch>`,
})

export class ButtonViewComponent implements ViewCell, OnInit {
  renderValue: boolean;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();
  
  constructor( private toastrService: NbToastrService ){

  }

  ngOnInit() {
    if(this.value == 'inactive'){
      this.renderValue = true;
    }else{
      this.renderValue = false;
    }
  }

  onChange(event) {
    if(event == true){
      this.rowData.status= 'inactive';
      this.save.emit(this.rowData);
    }else{
      this.rowData.status =  'active';
      this.save.emit(this.rowData);
    } 
  }
  OnBeforeChange: Observable<boolean> = Observable.create((observer) => {
    if(this.renderValue==true){
      if(this.rowData.mediaId && this.rowData.mediaId.rectangle && this.rowData.mediaId.square){
      observer.next(true);
      }else{
        this.showToast('danger', '', 'Please complete the mandatory items in the menu and try again');
      }
    }else{
      observer.next(true);
    }
    return () => clearTimeout();
  });

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
  
@Component({
  selector: 'ngx-smart-table',
  templateUrl: './manage-menu.component.html',
  styleUrls: ['./manage-menu.component.scss'],
})
export class ManageMenuComponent {

  settings = {
    mode: 'external',
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
        title: 'Name',
        type: 'string',
      }, 
      price: {
        title: 'Price',
        type: 'string',
        valuePrepareFunction: (value) => { return value === 'Price'? value : this.currency + value }
      },
      status: {
        title: 'Status',
        type: 'custom',
        class:'statusclass',
        renderComponent: ButtonViewComponent,
        onComponentInitFunction: (instance: any) =>  {
          instance.save.subscribe(row => {
            this.activateButton(row);
          });
        }
      },
    },
  };
  
  source: LocalDataSource = new LocalDataSource();
  userid: any;
  currency: any;
  constructor(private service: SmartTableData, 
    private apiService: ApiService,
    private auth: AuthService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private router: Router,
    private spinner: NgxSpinnerService) {
      this.currency =localStorage.getItem('CurrencySymbol');
      this.getMenus(localStorage.getItem('VendorID')); 
  }

  public getMenus(id){
    this.spinner.show();
    this.apiService.getMenus(id).subscribe((res)=>{
      this.spinner.hide();
      const data = res&&res.body&&res.body.menuItem?res.body.menuItem:[];
      this.source.load(data);  
    });
  }

  addButton(event): void {
    this.apiService.getVendorDetails(localStorage.getItem('UserId')).subscribe((res)=>{
      if(!res.body.vendors[0].deliveryAreaId || !res.body.vendors[0].deliveryLocationId ||  
        !res.body.vendors[0].name || !res.body.vendors[0].phoneNumber || !res.body.vendors[0].cuisineType
        || !res.body.vendors[0].license || !res.body.vendors[0].taxId || !res.body.vendors[0].mediaId ){
          this.showToast('danger', '', 'Please complete Profile settings to add menu');
          this.router.navigate(['/pages/users/profile']);  
      } else {
        this.apiService.getVendorSection(localStorage.getItem('VendorID')).subscribe((res)=>{
          if(res.body.totalCount == 0){
            this.showToast('danger', '', 'Please complete Profile settings to add menu');
            this.router.navigate(['/pages/users/profile']);  
          } else {
            localStorage.removeItem('MenuId');
            this.router.navigate(['/pages/menu/edit-menu']);  
          }
        });
      }
    }); 
  }

  activateButton(event): void {
    this.spinner.show();
    this.apiService.editMenuStatus(event).subscribe((res)=>{
      this.spinner.hide();
      this.showToast('success', '', 'Succesfully Updated');
      this.getMenus(localStorage.getItem('VendorID')); 
    });    
  }
  
  deleteButton(event): void { 
    if (window.confirm('Are you sure you want to delete?')) {
      this.spinner.show();
      this.apiService.deleteMenu(event.data._id).subscribe((res)=>{
        this.spinner.hide();
        this.showToast('success', '', 'Succesfully Deleted');
        this.getMenus(localStorage.getItem('VendorID')); 
    });  
    }
  }

  editButton(event): void {
    localStorage.setItem('MenuId', event.data._id);
    this.router.navigate(['/pages/menu/edit-menu']);
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
