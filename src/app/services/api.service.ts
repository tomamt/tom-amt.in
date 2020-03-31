import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Admin } from '../models/admin';
import { Vendors, Vendor,InviteUser,UserDetails, postFile, vendorOperatingHours  } from '../models/vendors';
import { venues, venue } from '../models/venue';

import { Menu, MenuListing, MenuDetails, Menus, MenuMedia, menuOperatingHours } from '../models/menu';
import { EnvironmentService } from '../../environments/environment.service';
import { ManageTags, Tags, discountCodes, Codes } from '../models/manage-tags';
import { Users, User, PolicySignature, Media } from '../models/users';
import { ManageSection, Sections } from '../models/manage-section';
import { deliveryAreas, deliveryLocations, agentWorkingHours, deliveryAgents } from '../models/delivery-location';
import { Observable } from 'rxjs';
import * as socketIo from 'socket.io-client';
import { Observer } from 'rxjs/Observer';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  apiURL:any ='';

  public firstPage: string = "";
  public prevPage: string = "";
  public nextPage: string = "";
  public lastPage: string = "";
  observer: Observer<any>;
 
  constructor(private httpClient: HttpClient,private envService: EnvironmentService) {
   this.apiURL = this.envService.read('apiUrl');
   //this.apiURL = "http://192.168.2.2:3001/api/v1";
  }

  public getMenu(userid: string){
    return this.httpClient.get<Menu>(`${this.apiURL}/users/${userid}`, {
     observe: 'response' }).pipe(tap(res => {
      return res;
    })); 
  }

  public createUser(users: InviteUser){
    return this.httpClient.post<UserDetails>(`${this.apiURL}/users/`,users);
  }

  public getVendors(url?: string){
    return this.httpClient.get<Vendors>(`${this.apiURL}/vendors?pageSize=&pageNo=1`, {
     observe: 'response' }).pipe(tap(res => {
    })); 
  }

  public getVenue(id: string){
    return this.httpClient.get<venue>(`${this.apiURL}/venues/${id}`, {
     observe: 'response' }).pipe(tap(res => {
    })); 
  }

  public updateStatus(Users: Vendor){
    const data = {
      status: Users.userId.status
    };
    return this.httpClient.patch<UserDetails>(`${this.apiURL}/users/${Users.userId._id}`,data);
  }

  public getVendorDetails(id: string):Observable<any>{
    return this.httpClient.get<Vendors>(`${this.apiURL}/vendors?pageSize=&pageNo=1&filterValue=${id}&filterColumn=userId`, {
      observe: 'response' }); 
  }

  public editvendors(vendor: Vendor){
    const data = {
      id: vendor._id,
      name: vendor.name,
      address: vendor.address,
      category: vendor.category,
      phoneNumber: vendor.phoneNumber,
      cuisineType: vendor.cuisineType,
      license: vendor.license,
      taxId: vendor.taxId,
      status: vendor.status,
      deliveryAreaId: vendor.deliveryAreaId,
      bgColor: vendor.bgColor,
      deliveryLocationId: vendor.deliveryLocationId,
    }
    return this.httpClient.patch<UserDetails>(`${this.apiURL}/vendors/${vendor._id}`,data);
  }
  MediaData: any;
  public editvendorMedia(vendor: Vendor){
    if(vendor.mediaId){
      this.MediaData = {
        mediaId: vendor.mediaId,
        bgColor: vendor.bgColor,
      }
    } else if(vendor.profilePicture){
      this.MediaData = {
        profilePicture: vendor.profilePicture,
        bgColor: vendor.bgColor,
      }
    }
    return this.httpClient.patch<UserDetails>(`${this.apiURL}/vendors/${vendor.id}`,this.MediaData);
  }

  public editMenuMedia(menu: MenuMedia){   
    if(menu.mediaId.square){
      this.MediaData = {  
        mediaId : {  
          square : menu.mediaId.square,
          rectangle : menu.mediaId.rectangle,
          bgColor : menu.mediaId.bgColor,
        }
      }
    } else if(menu.mediaId.rectangle){
      this.MediaData = {  
        mediaId : {  
          square : menu.mediaId.square,
          rectangle : menu.mediaId.rectangle,
          bgColor : menu.mediaId.bgColor,
        }
      } 
    }
    if(menu.status) {
      this.MediaData.status = menu.status;
    }
    return this.httpClient.patch<MenuDetails>(`${this.apiURL}/menu-items/${menu.id}`,this.MediaData);
  }

  public getMenus(id: string,url?: string){
    return this.httpClient.get<Menu>(`${this.apiURL}/menu-items/vendors/${id}?pageSize=&pageNo=1`, {
     observe: 'response' }).pipe(tap(res => {
    })); 
  }

  public deleteMenu(id: number){
    return this.httpClient.delete(`${this.apiURL}/menu-items/${id}`);
  }

  public getMenuDetails(id: string){
    return this.httpClient.get<MenuDetails>(`${this.apiURL}/menu-items/${id}`, {
      observe: 'response' }).pipe(tap(res => {
    })); 
  }

  public editMenu(menu: Menus){
    const data = {
      name: menu.name,
      description: menu.description,
      price: menu.price,
      status: menu.status,
      preparationTime: menu.preparationTime,
    }
    return this.httpClient.patch<MenuDetails>(`${this.apiURL}/menu-items/${menu._id}`,data);
  }

  public editMenuStatus(menu: Menus){
    const data = {
      status: menu.status,
    }
    return this.httpClient.patch<MenuDetails>(`${this.apiURL}/menu-items/${menu._id}`,data);
  }

  public addMenu(menu: Menus){
    const data = {
      name: menu.name,
      description: menu.description,
      price: menu.price,
      status: menu.status,
      vendorId: localStorage.getItem('VendorID'),
      preparationTime: menu.preparationTime,
    }
    return this.httpClient.post<MenuDetails>(`${this.apiURL}/menu-items/`,data);
  }

  public UpdateMenuTag(menu: Menus){
    const data = {
      vendorTag: menu.vendorTagId,
    }
    return this.httpClient.patch<MenuDetails>(`${this.apiURL}/menu-items/${menu._id}`,data);
  }
  
  public getVendorTags(id: string,url?: string){
    return this.httpClient.get<ManageTags>(`${this.apiURL}/vendor-tags/vendors/${id}?pageSize=&pageNo=1`, {
     observe: 'response' }).pipe(tap(res => {
    })); 
  }

  public defaultTags(url?: string){
    return this.httpClient.get<any>(`${this.apiURL}/default-tags`, {
     observe: 'response' }).pipe(tap(res => {
    })); 
  }

  public createVendorTags(tags: Tags){
    return this.httpClient.post<UserDetails>(`${this.apiURL}/vendor-tags/`,tags);
  }

  public editVendorTags(tags: Tags){
    return this.httpClient.patch<UserDetails>(`${this.apiURL}/vendor-tags/${tags._id}`,tags);
  }

  public deleteVendorTags(id: number){
    return this.httpClient.delete<UserDetails>(`${this.apiURL}/vendor-tags/${id}`);
  }

  public getVendorSection(id: string,url?: string){
    return this.httpClient.get<ManageSection>(`${this.apiURL}/vendor-menu-sections/vendors/${id}`, {
     observe: 'response' }).pipe(tap(res => {
    })); 
  }
 
  public getTerminals(id: string,url?: string){
    return this.httpClient.get<deliveryAreas>(`${this.apiURL}/delivery-areas?filterValue=${id}&filterColumn=venueId`, {
     observe: 'response' }).pipe(tap(res => {
    })); 
  }

  public getGates(id: string,url?: string){
    return this.httpClient.get<deliveryLocations>(`${this.apiURL}/delivery-locations?filterValue=${id}&filterColumn=deliveryAreaId`, {
     observe: 'response' }).pipe(tap(res => {
    })); 
  }

  public createVendorSection(sections: Tags){
    return this.httpClient.post<UserDetails>(`${this.apiURL}/vendor-menu-sections/`,sections);
  }

  public editVendorSection(sections: Tags){
    const newvalue = {name : sections.name}
    return this.httpClient.put<UserDetails>(`${this.apiURL}/vendor-menu-sections/${sections._id}`,newvalue);
  }

  public deleteVendorSection(id: number){
    return this.httpClient.delete<UserDetails>(`${this.apiURL}/vendor-menu-sections/${id}`);
  }

  public getAdmins(url?: string){
    return this.httpClient.get<Users>(`${this.apiURL}/users?pageSize=&pageNo=1&filterValue=admin&filterColumn=userRole`, {
     observe: 'response' }).pipe(tap(res => {
    })); 
  }

  public getVendorList(url?: string){
    return this.httpClient.get<Users>(`${this.apiURL}/users?pageSize=&pageNo=1&filterValue=vendor&filterColumn=userRole`, {
     observe: 'response' }).pipe(tap(res => {
    })); 
  }

  public getCrewMembers(id: string,url?: string){
    return this.httpClient.get<Users>(`${this.apiURL}/users?pageSize=&pageNo=1&filterValue=crew&filterColumn=userRole&vendorId=${id}`, {
     observe: 'response' }).pipe(tap(res => {
    })); 
  }

  public getDeliveryAgents(url?: string){
    return this.httpClient.get<Users>(`${this.apiURL}/users?pageSize=&pageNo=1&filterValue=deliveryAgent&filterColumn=userRole&list=all`, {
     observe: 'response' }).pipe(tap(res => {
    })); 
  }

  public getDeliveryAgentManagers(url?: string){
    return this.httpClient.get<Users>(`${this.apiURL}/users?pageSize=&pageNo=1&filterValue=daManager&filterColumn=userRole`, {
     observe: 'response' }).pipe(tap(res => {
    })); 
  }

  public updateUserStatus(Users: User){
    const data = {
      status: Users.status
    };
    return this.httpClient.patch<UserDetails>(`${this.apiURL}/users/${Users._id}`,data);
  }

  public postFile(users: postFile){
    return this.httpClient.post<PolicySignature>(`${this.apiURL}/medias/signature/`,users);
  }

  public saveMedia(media: Media){
    const data = {
      url: media
    }; 
    return this.httpClient.post<UserDetails>(`${this.apiURL}/medias/`,data);
  }
  public orderList(id:any,page:any,status:any):Observable<any>{
    const requestOptions = {
      params: new HttpParams().set('pageSize', page.pageSize.toString()).append("pageNo", page.currentPage).append("search", page.search)
    };
    return this.httpClient.get<any>(`${this.apiURL}/orders?filterValue=${id}&filterColumn=vendorId&status=${status}`,requestOptions);
  }

  
  public ratings(page:any):Observable<any>{
    const requestOptions = {
      params: new HttpParams().set('pageSize', page.pageSize.toString()).append("pageNo", page.currentPage)
    };
    return this.httpClient.get<any>(`${this.apiURL}/ratings`,requestOptions);
  }

  public getDeliveryAgentDetails(id: string){
    return this.httpClient.get<Menu>(`${this.apiURL}/users/${id}`, {
      observe: 'response' }).pipe(tap(res => {
    })); 
  }

  public UpdateDeliveyAgent(Users: User){
    const data = {
      status: Users.status,
      name: Users.name
    };
    return this.httpClient.patch<UserDetails>(`${this.apiURL}/users/${Users._id}`,data);
  }

  public UpdateDeliveyAgentByID(Users: User){
    const data = {
      empId: Users.empId,
      phoneNumber: Users.phoneNumber,
      deliveryAreaId: Users.deliveryAreaId
    };
    return this.httpClient.patch<UserDetails>(`${this.apiURL}/delivery-agents/${Users._id}`,data);
  }

  public UpdateMenuSection(tags: Tags,id: string){
    return this.httpClient.patch<UserDetails>(`${this.apiURL}/vendor-menu-sections/${id}`,tags);
  }

  public DeleteMenuSection(tags: Tags,id: string){
    return this.httpClient.patch<UserDetails>(`${this.apiURL}/vendor-menu-sections/delete/${id}`,tags);
  }

  public saveMenuAvailableHours(Users: User){
    if(Users._id){
      return this.httpClient.patch<UserDetails>(`${this.apiURL}/menu-item-available-hours/${Users._id}`,Users);
    } else {
      return this.httpClient.post<UserDetails>(`${this.apiURL}/menu-item-available-hours`,Users);
    }
    
  }

  public saveCoupon(users: postFile){
    return this.httpClient.post<MenuDetails>(`${this.apiURL}/discount-codes/`,users);
  }

  public editCoupon(Users: User){
    return this.httpClient.patch<UserDetails>(`${this.apiURL}/discount-codes/${Users._id}`,Users);
  }

  public getCouponCodes(url?: string){
    return this.httpClient.get<discountCodes>(`${this.apiURL}/discount-codes?pageSize=&pageNo=1`, {
      observe: 'response' }).pipe(tap(res => {
    }));  
  }

  public deleteCouponCode(id: number){
    return this.httpClient.delete(`${this.apiURL}/discount-codes/${id}`);
  }

  public getCouponById(id: string){
    return this.httpClient.get<Codes>(`${this.apiURL}/discount-codes/${id}`, {
      observe: 'response' }).pipe(tap(res => {
    })); 
  }

  public getSectionByMenu(id: string){
    return this.httpClient.get<ManageSection>(`${this.apiURL}/vendor-menu-sections/menu/${id}`, {
     observe: 'response' }).pipe(tap(res => {
    })); 
  }

  public getOrderdetails(id: string){
    return this.httpClient.get<ManageSection>(`${this.apiURL}/orders/${id}`, {
    observe: 'response' }).pipe(tap(res => {
    })); 
  }

  public saveVendorableHours(Users: User){
    if(Users._id){
      return this.httpClient.patch<UserDetails>(`${this.apiURL}/vendor-operating-hours/${Users._id}`,Users);
    } else {
      return this.httpClient.post<UserDetails>(`${this.apiURL}/vendor-operating-hours/`,Users);
    }  
  }

  public getOperatingHours(id: string,url?: string){
    return this.httpClient.get<vendorOperatingHours>(`${this.apiURL}/vendor-operating-hours?pageSize=&pageNo=1&&filterValue=${id}&filterColumn=vendorId`, {
     observe: 'response' }).pipe(tap(res => {
    })); 
  }

  public editvendorstatus(vendor: Vendor){
    const data = {
      status: vendor.status
    }
    return this.httpClient.patch<UserDetails>(`${this.apiURL}/vendors/${vendor.id}`,data);
  }

  public getMenuOperatingHours(id: string,url?: string){
    return this.httpClient.get<menuOperatingHours>(`${this.apiURL}/menu-item-available-hours?filterValue=${id}&filterColumn=menuItemId`, {
     observe: 'response' }).pipe(tap(res => {
    })); 
  }

  public getDeliveryAgentWorkingHours(id: string,startDate: string,endDate: string){
    return this.httpClient.get<agentWorkingHours>(`${this.apiURL}/delivery-agents-working-hours/${id}?startDate=${startDate}&endDate=${endDate}`, {
      observe: 'response' }).pipe(tap(res => {
    })); 
  }

  public getDeliveryAgentByid(id: string){
    return this.httpClient.get<deliveryAgents>(`${this.apiURL}/delivery-agents/${id}`, {
      observe: 'response' }).pipe(tap(res => {
    })); 
  }
  public orderQueList(id: string):Observable<any>{
    const requestOptions = {
      params: new HttpParams().set('pageSize', '').append("pageNo", '1').append("filterValue", id).append("filterColumn", 'assignee').append("status", 'now')
    };
    return this.httpClient.get<deliveryAgents>(`${this.apiURL}/orders`,requestOptions )
  }
  public orderQueListAssign(asID: any,orderID:any){
    const data = {
      assignee: asID
    };
    return this.httpClient.patch<UserDetails>(`${this.apiURL}/orders/${orderID._id}?action=${orderID.status}`,data);
  }

  public deleteMenuHours(id: any){
    return this.httpClient.delete<any>(`${this.apiURL}/menu-item-available-hours/menuItem/${id}`);
  }

  public deleteMenuAvailableHours(id: number){
    return this.httpClient.delete<MenuDetails>(`${this.apiURL}/menu-item-available-hours/${id}`);
  }

  public Issueslist(filterValue:any,page:any):Observable<any>{
    const requestOptions = {
      params: new HttpParams().set('pageSize', page.pageSize.toString()).append("pageNo", page.currentPage).append("filterValue",filterValue).append('filterColumn','type')
    };
    return this.httpClient.get<any>(`${this.apiURL}/issues`,requestOptions);
  }

  public forceClockOut(Users: User){
    return this.httpClient.patch<UserDetails>(`${this.apiURL}/delivery-agents-working-hours/${Users._id}`,Users);
  }

  public getDeliveryAgentCueentQueue(id: string){
    return this.httpClient.get<agentWorkingHours>(`${this.apiURL}/orders?pageSize=&pageNo=1&filterValue=${id}&filterColumn=assignee&status=now`, {
      observe: 'response' }).pipe(tap(res => {
    })); 
  }

  public getDAList(id):Observable<any>{
    return this.httpClient.get<any>(`${this.apiURL}/users?filterColumn=userRole&filterValue=deliveryAgent&id=${id}`);
  }

  public getAllDA():Observable<any>{
    return this.httpClient.get<any>(`${this.apiURL}/users?filterColumn=userRole&filterValue=deliveryAgent`);
  }

  public assigneeOrderList(asID):Observable<any>{
    return this.httpClient.get<any>(`${this.apiURL}/orders?pageSize=&pageNo=1&filterValue=${asID}&filterColumn=assignee&status=now`);
   
  }

  public payments(id:any,page:any,status:any):Observable<any>{
    const requestOptions = {
      params: new HttpParams().set('pageSize', page.pageSize.toString()).append("pageNo", page.currentPage)
    };
    return this.httpClient.get<any>(`${this.apiURL}/transactions`,requestOptions);
  }

  public getPaymentDetails(id: string){
    return this.httpClient.get<any>(`${this.apiURL}/transactions/${id}`, {
    observe: 'response' }).pipe(tap(res => {
    })); 
  }

  public registerNoShow(users: any){
    return this.httpClient.post<any>(`${this.apiURL}/noshow/`,users);
  }

  public cancelandrefund(data: any){
    return this.httpClient.post<any>(`${this.apiURL}/orders/${data.orderId}?amount=${data.amount}`,data);
  }

  public changeIssueStatus(data: any){
    return this.httpClient.patch<UserDetails>(`${this.apiURL}/issues/${data._id}`,data);
  }
  public getTerminalList():Observable<any>{
    return this.httpClient.get<any>(`${this.apiURL}/delivery-areas`) 
  }

  public airportAnalytics(arg:any):Observable<any>{
    const requestOptions = {
      params: new HttpParams().set('startDate', arg.startDate).append("endDate", arg.endDate).append("timezone", arg.timezone)
    };
    return this.httpClient.get<any>(`${this.apiURL}/analytics/terminal/${arg.terminalid}`,requestOptions) 
  }
  public getvendorList():Observable<any>{
    return this.httpClient.get<any>(`${this.apiURL}/vendors?list=all`) 
  }
  public VIAAnalytics(arg:any):Observable<any>{
    const requestOptions = {
      params: new HttpParams().set('startDate', arg.startDate).append("endDate", arg.endDate).append("timezone", arg.timezone)
    };
    return this.httpClient.get<any>(`${this.apiURL}/analytics/${arg.type}/${arg.vendorid}`,requestOptions) 
  }
  public VEAAnalytics(arg:any):Observable<any>{
    const requestOptions = {
      params: new HttpParams().set('startDate', arg.startDate).append("endDate", arg.endDate).append("timezone", arg.timezone)
    };
    return this.httpClient.get<any>(`${this.apiURL}/analytics/orders-efficiency`,requestOptions) 
  }
  public ratingAnalytics(arg:any):Observable<any>{
    const requestOptions = {
      params: new HttpParams().set('startDate', arg.startDate).append("endDate", arg.endDate).append("timezone", arg.timezone)
    };
    return this.httpClient.get<any>(`${this.apiURL}/analytics/rating-efficiency`,requestOptions) 
  }
  public deliverydurationAnalytics(arg:any):Observable<any>{
    const requestOptions = {
      params: new HttpParams().set('startDate', arg.startDate).append("endDate", arg.endDate).append("timezone", arg.timezone)
    };
    return this.httpClient.get<any>(`${this.apiURL}/analytics/avgordertime-efficiency`,requestOptions) 
  };
  public cancellationAnalytics(arg:any):Observable<any>{
    const requestOptions = {
      params: new HttpParams().set('startDate', arg.startDate).append("endDate", arg.endDate).append("timezone", arg.timezone)
    };
    return this.httpClient.get<any>(`${this.apiURL}/analytics/cancellation-efficiency`,requestOptions) 
  };

  public sucessfulldeliveries(arg:any):Observable<any>{
    const requestOptions = {
      params: new HttpParams().set('startDate', arg.startDate).append("endDate", arg.endDate).append("timezone", arg.timezone)
    };
    return this.httpClient.get<any>(`${this.apiURL}/analytics/deliveries-efficiency`,requestOptions) 
  };
  public UpdateUserName(Users: any){
    const data = {
      name: Users.name
    };
    return this.httpClient.patch<UserDetails>(`${this.apiURL}/users/${Users.userId._id}`,data);
  }

  public cancelOrder(data:any){
    return this.httpClient.patch<UserDetails>(`${this.apiURL}/orders/${data.orderID}`,data);
  }

  public VEAAavgOrderTime(arg:any):Observable<any>{
    const requestOptions = {
      params: new HttpParams().set('startDate', arg.startDate).append("endDate", arg.endDate).append("timezone", arg.timezone)
    };
    return this.httpClient.get<any>(`${this.apiURL}/analytics/vendors-avgordertime/${arg.vendorID}`,requestOptions) 
  }

  public VEAAavgfullFillementTime(arg:any):Observable<any>{
    const requestOptions = {
      params: new HttpParams().set('startDate', arg.startDate).append("endDate", arg.endDate).append("timezone", arg.timezone)
    };
    return this.httpClient.get<any>(`${this.apiURL}/analytics/vendors-avgcookingtime/${arg.vendorID}`,requestOptions) 
  }

  public averageDeliveryTime(arg:any):Observable<any>{
    const requestOptions = {
      params: new HttpParams().set('startDate', arg.startDate).append("endDate", arg.endDate).append("timezone", arg.timezone)
    };
    return this.httpClient.get<any>(`${this.apiURL}/analytics/vendors-avgdeliverytime/${arg.terminalID}`,requestOptions) 
  }

  public averageTimeBetweenDeliveries(arg:any):Observable<any>{
    const requestOptions = {
      params: new HttpParams().set('startDate', arg.startDate).append("endDate", arg.endDate).append("timezone", arg.timezone)
    };
    return this.httpClient.get<any>(`${this.apiURL}/analytics/terminal-avgtime-deliveries/${arg.terminalID}`,requestOptions) 
  }
  
}
