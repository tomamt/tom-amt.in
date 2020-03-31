import {
	Component,
	OnInit,
	ElementRef,
	ViewChild
} from '@angular/core';
import {
	ApiService
} from '../../../services/api.service';
import {
	ToasterConfig
} from 'angular2-toaster';
import {
	Router,
	ActivatedRoute
} from '@angular/router';

import {
	NbComponentStatus,
	NbGlobalPhysicalPosition,
	NbToastrService
} from '@nebular/theme';
import {
	AuthService
} from '../../../services/auth.service';
import {
	IDropdownSettings
} from 'ng-multiselect-dropdown';
import {
	ImageCroppedEvent
} from 'ngx-image-cropper';
import {
	UploadFileService
} from '../../../services/upload-file.service';
import {
	EnvironmentService
} from '../../../../environments/environment.service';
import {
	NgxSpinnerService
} from "ngx-spinner";
import {
	NgbModal,
	ModalDismissReasons,
	NgbModalConfig
} from '@ng-bootstrap/ng-bootstrap';
import {
	FormBuilder,
	FormGroup,
	FormArray,
	AbstractControl
} from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import {
	SelectItem
} from 'primeng/api';

interface City {
	name: string;
	code: string;
}

export interface Item {

	teaType: string;
	noOfContainers: number;
	weightPerContainerinKgs: number;
	totalItemWeight: number

}
export interface Car {
	vin ? ;
	year ? ;
	brand ? ;
	color ? ;
	price ? ;
	saleDate ? ;
}
@Component({
	selector: 'ngx-edit-menu',
	templateUrl: './manage-queue.component.html',
	styleUrls: ['./manage-queue.component.scss']
})

export class ManageQueueComponent implements OnInit {
	assigneeList: any = [];
	selectedassigneeList: any;
	assigneeList2: any = [];
	selectedassigneeList2: any;
	selectedCity2: City;
	CouponDetails: any;
	assigneeOrderList: any[] = [];
	targetCars: Car[];
	sub: any;
	daID: any;
	deliveryAgentValid: boolean;

	constructor(private apiService: ApiService,
		private auth: AuthService,
		private toastrService: NbToastrService,
		private router: Router,
		private uploadService: UploadFileService,
		public envService: EnvironmentService,
		private spinner: NgxSpinnerService,
		private modalService: NgbModal,
		private fb: FormBuilder,
		private route: ActivatedRoute) {
		this.deliveryAgentValid = true;
		this.sub = this.route.params.subscribe(params => {
			this.daID = params['id'];
			if (this.daID == 'null') {
				this.daID = null;
				this.deliveryAgentValid = false;
			}
		});
	}

	issueDeatilsId: any;
	issueType: any;
	ngOnInit() {
		this.getDeliveryAgentDetails();
		this.DAList();
		this.orderQueList()
		this.targetCars = [];
		if (this.daID) {
			this.getDeliveryAgentWorkingHours(this.daID);
			this.issueDeatilsId = localStorage.getItem('issueDeatilsId');
			this.issueType = localStorage.getItem('issueType');
		} else {
      localStorage.removeItem('issueDeatilsId');
      localStorage.removeItem('issueType'); 
    }
	}

	previousPage() {
		window.history.back();
	}

	agentDetails: any;
	getDeliveryAgentDetails() {
		if (this.daID) {
			this.spinner.show();
			this.apiService.getDeliveryAgentDetails(this.daID).subscribe((res) => {
				this.spinner.hide();
				this.agentDetails = res.body.users.users;
			});
		}
	}

	DAList() {
		if (this.daID) {
			this.spinner.show();
			this.apiService.getDAList(this.daID).subscribe((res) => {
				this.assigneeList = [];
				res.users.map(data => {
					this.assigneeList.push({
						label: data.name+" ("+data.orderCount+")",
						value: {
							id: data._id,
							name: data.name
						}
					})
				})
				this.spinner.hide();
			});
		} else {
			if (this.agentDetails && this.agentDetails._id) {
				this.spinner.show();
				this.apiService.getDAList(this.agentDetails._id).subscribe((res) => {
					this.assigneeList2 = [];
					res.users.map(data => {
						this.assigneeList2.push({
							label: data.name+" ("+data.orderCount+")",
							value: {
								id: data._id,
								name: data.name
							}
						})
					})
					this.spinner.hide();
				});
			} else {
				this.spinner.show();
				this.apiService.getAllDA().subscribe((res) => {
					this.assigneeList2 = [];
					res.users.map(data => {
						this.assigneeList2.push({
							label: data.name+" ("+data.orderCount+")",
							value: {
								id: data._id,
								name: data.name
							}
						})
					})
					this.spinner.hide();
				});
			}
		}
	}

	orderQueList() {
		if (this.daID) {
			this.spinner.show();
			this.apiService.orderQueList(this.daID).subscribe((res) => {
				this.spinner.hide();
				this.assigneeOrderList = res.orders;
			});
		}
	}

	orderListAssinee(value) {
		this.spinner.show();
		this.apiService.assigneeOrderList(value.id).subscribe((res) => {
			this.spinner.hide();
			this.targetCars = res.orders;
		});
	}

	orderListAssinee2(value) {
		if (value && value.id) {
			this.daID = value.id;
			this.ngOnInit();
			this.selectedassigneeList = null;
		}
	}

	isError:any;
	assignOrder(event) {
	this.isError = true;
    if (!this.selectedassigneeList) {
      this.showToast('danger', '', 'Please select any Delivery agent');
      this.ngOnInit();
      return;
	}
	
    const assignOrders = async () => {
      event.items.forEach(async values => {
		  if(values.status){
			this.isError = true;
			const result = await orderQueAssign(values);
		  } else {
			this.isError = false;
			return;
		  }
      });
    }
    
    const orderQueAssign = obj => { 
      this.spinner.show();
        this.apiService.orderQueListAssign(this.selectedassigneeList.id, obj).subscribe((res) => {
		  if(this.deliveryAgentValid && obj.issues && obj.issues[0] && res.status == true){
            const data2 = {
              status: "closed",
              actions: "resolved",
              _id: obj.issues[0]._id
            }
            this.apiService.changeIssueStatus(data2).subscribe((res) => {
              return res;
            });
          } else {
            return res;
          }
        });
    }
     
    assignOrders().then(() =>{
		this.spinner.hide();
		if(this.isError){
			if(this.deliveryAgentValid){  
				this.showToast('success', 'Issue has been resolved successfully', 'Order reassigned successfully');
			} else {
				this.showToast('success', '', 'Order reassigned successfully');
			}
		} else {
			this.showToast('danger', '', 'Order reassign unsuccessful');
		}
		
		/*if (this.daID) {
			this.apiService.orderQueList(this.daID).subscribe((res) => {
				this.assigneeOrderList = res.orders;
			});
		} */
    })
		/*if (event.items[0] && this.selectedassigneeList) {
			this.apiService.orderQueListAssign(this.selectedassigneeList.id, event.items[0]).subscribe((res) => {
				if (res.status == true) {
          this.showToast('success', '', 'Order reassigned successfully');
          if (this.daID) {
            this.apiService.orderQueList(this.daID).subscribe((res) => {
              this.assigneeOrderList = res.orders;
            });
          }
				}
			});
		} else {
			this.showToast('danger', '', 'Please select any Delivery agent');
			this.ngOnInit();
		}*/
  }
  
  closeIssue() {

  }

	reassignOrder(event) {
    
    if(this.agentDetails && this.agentDetails.userRole == 'daManager'){
      this.showToast('danger', '', 'Invalid Delivery Agent');
      this.selectedassigneeList =null
      this.ngOnInit();
      return;
    }
    const reassignOrders = async () => {
      event.items.forEach(async values => {
       const result = await orderQueAssign(values);
      });
    }
     
    const orderQueAssign = obj => {
      this.apiService.orderQueListAssign(this.daID, obj).subscribe((res) => {
        return res; 
      })
    }
     
    reassignOrders().then(() =>{
      this.showToast('success', '', 'Order reassigned successfully');
    });

		/*this.apiService.orderQueListAssign(this.daID, event.items[0]).subscribe((res) => {
			if (res.status == true) {
				this.showToast('success', '', 'Order reassigned successfully');
			}
		});*/
	}

	save() {
		this.router.navigate(['/pages/alerts/delivery-agent-breaks']);
	}

	agentWorkingHours: any;

	getDeliveryAgentWorkingHours(id) {
		this.spinner.show();
		this.apiService.getDeliveryAgentWorkingHours(id, '', '').subscribe((res) => {
			this.spinner.hide();
			const data = res.body.daWorkingHours.agentWorkingRes;
			this.agentWorkingHours = data;
		});
	}

	forceClockOut() {
		if (this.assigneeOrderList.length > 0) {
			this.showToast('danger', '', 'The DA has orders in their queue, please re-assign the queue and try again.');
			return;
		}

		if (this.agentWorkingHours && this.agentWorkingHours[0] && this.agentWorkingHours[0]._id) {
			if (this.agentWorkingHours[0].clockOut) {
				this.showToast('danger', '', 'User is already clocked out');
			} else {
				this.spinner.show();
				this.agentWorkingHours[0].clockOut = new Date();
				this.apiService.forceClockOut(this.agentWorkingHours[0]).subscribe((res) => {
					if (res.status == true) {
						const data2 = {
							status: "closed",
							actions: "resolved",
							_id: this.issueDeatilsId
						}
						this.apiService.changeIssueStatus(data2).subscribe((res) => {
							this.spinner.hide();
							if (res.status == true) {
                localStorage.removeItem('issueDeatilsId');
                localStorage.removeItem('issueType');  
								window.history.back();
								this.showToast('success', '', 'Issue has been resolved successfully');
							} else {
								this.showToast('danger', '', 'Error');
							}
						});
					} else {
						this.spinner.hide();
						this.showToast('danger', '', 'Error');
					}
				});
			}
		} else {
			this.showToast('danger', '', 'User is not Clocked In');
		}
  }
  
  ok() {
    this.router.navigate(['/pages/alerts/delivery-agent-da-unavailable']);
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