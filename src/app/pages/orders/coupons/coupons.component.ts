import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { LocalDataSource, ViewCell } from 'ng2-smart-table';

import { SmartTableData } from '../../../@core/data/smart-table';
import { ApiService } from '../../../../app/services/api.service';
import { NbDialogService } from '@nebular/theme';
import { Router } from '@angular/router';

import { ToasterConfig } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { AuthService } from '../../../services/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
 
@Component({
  selector: 'button-view',
  template: `
  <ui-switch labelOn="Inactive" style="margin-left: 32px;" size="small" [checked]="renderValue" labelOff="Active" (change)="onChange($event)" ></ui-switch>`,
})

export class ButtonViewComponent implements ViewCell, OnInit {
  renderValue: boolean;

  @Input() value: string | number;
  @Input() rowData: any;

  @Output() save: EventEmitter<any> = new EventEmitter();

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
}
  
@Component({
  selector: 'ngx-smart-table',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss'],
})
export class CouponsComponent {

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
        title: 'Coupon Name',
        type: 'string',
      }, 
      code: {
        title: 'Coupon Code',
        type: 'string',
      },
      offerPercentage: {
        title: 'Discount Percentage',
        type: 'string',
        valuePrepareFunction: (value) => { return value === 'Price'? value : value + "%" }
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

  constructor(private service: SmartTableData, 
    private apiService: ApiService,
    private auth: AuthService,
    private dialogService: NbDialogService,
    private toastrService: NbToastrService,
    private router: Router,
    private spinner: NgxSpinnerService) {
      
      this.getCouponCodes(localStorage.getItem('venuesID'));
  }
  data: any;
  public getCouponCodes(venuesID){
    this.spinner.show();
    this.apiService.getCouponCodes(venuesID).subscribe((res)=>{
      this.spinner.hide();
      this.data = res.body.discountCodes;
      this.source.load(this.data);  
    }); 
  }

  public addButton(event){
    localStorage.removeItem('CouponId');
    this.router.navigate(['/pages/orders/edit-coupon']);  
  }

  public deleteButton(event){
    this.spinner.show();
    if (window.confirm('Are you sure you want to delete?')) {
      this.apiService.deleteCouponCode(event.data._id).subscribe((res)=>{
        this.spinner.hide();
        this.showToast('success', '', 'Succesfully Deleted');
        this.getCouponCodes(localStorage.getItem('venuesID'));
    });  
    } else {
      event.confirm.reject();
    } 
  }

  public editButton(event){
    localStorage.setItem('CouponId', event.data._id);
    this.router.navigate(['/pages/orders/edit-coupon']);
  }

  statuschange: any;
  activateButton(event): void {
    this.statuschange = {
      _id : event._id,
      status : event.status
    }
    this.spinner.show();
    this.apiService.editCoupon(this.statuschange).subscribe((res)=>{
      this.spinner.hide();
      this.showToast('success', '', 'Succesfully Updated');
      this.getCouponCodes(localStorage.getItem('venuesID'));
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
