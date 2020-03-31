import { Component, OnInit, Inject } from '@angular/core';
import { NbDialogRef, NB_WINDOW_CONTEXT } from '@nebular/theme';
import { ApiService } from '../../../../../app/services/api.service';
import { SmartTableData } from '../../../../@core/data/smart-table';
import { NbDialogService } from '@nebular/theme';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService } from '@nebular/theme';
import { ToasterConfig } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';
import { AuthService } from '../../../../services/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { DialogData } from '../../manage-alerts/manage-alerts.component';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'ngx-manage-problems',
  templateUrl: './manage-problems.component.html',
  styleUrls: ['./manage-problems.component.scss']
})
export class ManageProblemsComponent  implements OnInit {
  title: String;
  myObject: any;
  VendorsComponentobject: any;
  CrewMembersComponentobject: any;
  crewMembers:any = [];
  vendorMembers:any = [];
  DeliveryAgentMembers:any = [];
  DeliveryAgentManagerMembers:any = [];
  AdminMembers:any = [];
  partialRefundStatus:any;
  partialAmount:any;
  issueData: any;
  constructor(public dialogRef: MatDialogRef<ManageProblemsComponent>,
  @Inject(MAT_DIALOG_DATA) public data: DialogData, 
  private apiService: ApiService,
  private spinner: NgxSpinnerService,
  private toastrService: NbToastrService,
  public router: Router
    ) {
      this.issueData = data;
      //console.log('data',data)
      this.partialRefundStatus = false;
  }

  currency:any;
  ngOnInit(){
    this.currency =localStorage.getItem('CurrencySymbol');
    localStorage.removeItem('issueDeatilsId');
    localStorage.removeItem('issueType'); 
  }

  manageQueue(): void {
    this.router.navigate(['/pages/orders/manage-queue',this.issueData.reporter._id])
    this.dialogRef.close();
    localStorage.setItem('issueDeatilsId',this.issueData._id)
    localStorage.setItem('issueType',this.issueData.type)
  }

  close(): void {
    this.dialogRef.close();
  }
  
  cancelandrefund(): void {
    const data = {
      orderId: this.issueData.orderId._id,
      amount: this.issueData.orderId.totalAmount
    }
    this.spinner.show();
    this.apiService.cancelandrefund(data).subscribe((res)=>{
      if(res.status == true){
        const data2 = {
          status: "closed",
          actions: "refund-initiated",
          _id : this.issueData._id
        }
        this.apiService.changeIssueStatus(data2).subscribe((res)=>{
          if(res.status == true){
            if(this.issueData.orderId && this.issueData.orderId._id){
              const data3 = {
                status: "cancelled",
                orderID : this.issueData.orderId._id
              }
              this.apiService.cancelOrder(data3).subscribe((res)=>{
                this.dialogRef.close('success');
                this.spinner.hide();
                if(res.status == true){
                  this.showToast('success', '', 'Issue has been resolved successfully');
                } else {
                    this.showToast('danger', '', 'Error');
                } 
              });
            } else {
              this.dialogRef.close('success');
              this.spinner.hide();
              this.showToast('success', '', 'Issue has been resolved successfully');
            }
          } else {
            this.dialogRef.close('success');
            this.spinner.hide();
            this.showToast('danger', '', 'Error');
          } 
        });
      } else {
        this.dialogRef.close();
        this.spinner.hide();
        this.showToast('danger', '', res.error);
      } 
    });
   
  }

  partialRefund(){
    this.partialRefundStatus = true;
    this.partialAmount = null;
  }

  partialRefundAmount(): void {
    if(!this.partialAmount || this.partialAmount<0){
      this.showToast('danger', '', 'Please enter a valid amount');
      return;
    }
    if(this.partialAmount>this.issueData.orderId.totalAmount){
      this.showToast('danger', '', 'Entered amount is greater than order amount');
      return;
    }
    const data = {
      orderId: this.issueData.orderId._id,
      amount: this.partialAmount
    }
    this.spinner.show();
    this.apiService.cancelandrefund(data).subscribe((res)=>{
      if(res.status == true){
        const data2 = {
          status: "closed",
          actions: "refund-initiated",
          _id : this.issueData._id
        }
        this.apiService.changeIssueStatus(data2).subscribe((res)=>{
          if(res.status == true){
            if(this.issueData.orderId && this.issueData.orderId._id){
              const data3 = {
                status: "cancelled",
                orderID : this.issueData.orderId._id
              }
              this.apiService.cancelOrder(data3).subscribe((res)=>{
                this.dialogRef.close('success');
                this.spinner.hide();
                if(res.status == true){
                  this.showToast('success', '', 'Issue has been resolved successfully');
                } else {
                    this.showToast('danger', '', 'Error');
                } 
              });
            } else {
              this.dialogRef.close('success');
              this.spinner.hide();
              this.showToast('success', '', 'Issue has been resolved successfully');
            }
          } else {
            this.dialogRef.close('success');
            this.spinner.hide();
            this.showToast('danger', '', 'Error');
          } 
        });
      } else {
        this.dialogRef.close();
        this.spinner.hide();
        this.showToast('danger', '', res.error);
      } 
      this.partialRefundStatus = false;
      this.partialAmount = null;
    });
   
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

  cancelissue(): void {
    
    this.spinner.show();
    const data2 = {
      status: "closed",
      actions: "resolved",
      _id : this.issueData._id
    }
   
    this.apiService.changeIssueStatus(data2).subscribe((res)=>{
      if(res.status == true){
        if(this.issueData.orderId && this.issueData.orderId._id){
          const data3 = {
            status: "cancelled",
            orderID : this.issueData.orderId._id
          }
          this.apiService.cancelOrder(data3).subscribe((res)=>{
            this.dialogRef.close('success');
            this.spinner.hide();
            if(res.status == true){
              this.showToast('success', '', 'Issue has been resolved successfully');
            } else {
                this.showToast('danger', '', 'Error');
            } 
          });
        } else {
          this.dialogRef.close('success');
          this.spinner.hide();
          this.showToast('success', '', 'Issue has been resolved successfully');
        }
      } else {
        this.dialogRef.close('success');
        this.spinner.hide();
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
