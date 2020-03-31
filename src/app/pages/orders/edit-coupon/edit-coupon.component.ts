import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from '../../../../app/services/api.service';
import { ToasterConfig } from 'angular2-toaster';
import { Router, ActivatedRoute } from '@angular/router';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService} from '@nebular/theme';
import { AuthService } from '../../../services/auth.service';
import { UploadFileService } from '../../../services/upload-file.service';
import { EnvironmentService } from '../../../../environments/environment.service';
import { NgxSpinnerService } from "ngx-spinner";
import { NgbModal,ModalDismissReasons, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormArray, AbstractControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';

export interface Item{

  teaType:string;
  noOfContainers:number;
  weightPerContainerinKgs:number;
  totalItemWeight:number
      
}
@Component({
  selector: 'ngx-edit-menu',
  templateUrl: './edit-coupon.component.html',
  styleUrls: ['./edit-coupon.component.scss']
})

export class EditCouponComponent implements OnInit {  
  minDate: any;
  minDate2: any;
  CouponDetails: any;
  currency:any;
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
      if(localStorage.getItem('CouponId')){
        this.getCouponById(localStorage.getItem('CouponId'));
      } else {
        this.getCoupon();
      }
          
        
  }
 
  ngOnInit() {      
    this.getStatus(); 
    this.minDate = new Date();
    this.currency =localStorage.getItem('CurrencySymbol');
  }

  changeMaxDate(date){
    this.minDate2 = date;
    if(this.CouponDetails.endDate){
      if(new Date(this.CouponDetails.endDate) < new Date(this.minDate2)){
        this.CouponDetails.endDate = null;
        this.showToast('danger', '', 'Please Select Expiry Date');
      }
      
    }

  }

  getCoupon() {
    this.CouponDetails = { 
      name: "", 
      description:"", 
      code: "", 
      status: "", 
      startDate: "", 
      endDate: "", 
      offerPercentage: "", 
      usageLimit: "", 
      minimumOrderAmount: "",
      maximumLimit : "",
    }; 
    this.minDate2 = new Date();
  }

  getCouponById(CouponId){
    this.apiService.getCouponById(CouponId).subscribe((res)=>{
      const data = res.body.discountCodes;
      this.CouponDetails = data;
      this.minDate2 = data.startDate;
    });
  }

  status: any;
  public getStatus(){
    this.status = [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ];
  }

  public savedetails(){
    if(!this.CouponDetails.name || !this.CouponDetails.code || !this.CouponDetails.status 
      || !this.CouponDetails.startDate || !this.CouponDetails.endDate || !this.CouponDetails.usageLimit
      || !this.CouponDetails.offerPercentage || !this.CouponDetails.minimumOrderAmount 
      || !this.CouponDetails.maximumLimit){
        this.showToast('danger', '', 'Please fill the mandatory fields.');
        return;
    }
    if(this.CouponDetails.offerPercentage > 99){
      this.showToast('danger', '', 'Offer percentage should not be greater than 99%.');
        return;
    }
    if(this.CouponDetails.minimumOrderAmount < this.CouponDetails.maximumLimit){
      this.showToast('danger', '', 'Maximum discount amount should not be greater than Minimum order amount.');
        return;
    }
    this.spinner.show();
    this.CouponDetails.venueId = localStorage.getItem('venuesID');
    if(this.CouponDetails._id){
      this.apiService.editCoupon(this.CouponDetails).subscribe((res)=>{
        this.spinner.hide();
        if(res.status == true){
         this.router.navigate(['/pages/orders/coupons']);   
          this.showToast('success', '', 'Succesfully updated');
        } else {
            this.showToast('danger', '', 'Error');
        } 
      });
    } else {
      this.apiService.saveCoupon(this.CouponDetails).subscribe((res)=>{
        this.spinner.hide();
        if(res.status == true){
          this.router.navigate(['/pages/orders/coupons']);   
          this.showToast('success', '', 'Succesfully added');
        } else {
            this.showToast('danger', '', 'Error');
        } 
      });
    }
  }
  
  cancel(){
    this.router.navigate(['/pages/orders/coupons']);   
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    if(this.CouponDetails.offerPercentage>99){
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

  onKeydown(event) {
    if (event.keyCode === 32 ) {
      return false;
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