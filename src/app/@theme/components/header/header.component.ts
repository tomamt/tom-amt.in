import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';

import { ApiService } from '../../../../app/services/api.service';
import { AuthService } from '../../../services/auth.service';
import { ToasterConfig } from 'angular2-toaster';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService} from '@nebular/theme';
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  UserRole:any;
  userMenu:any;         
  tag = 'my-context-menu';
  selected:any;
  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private userService: UserData,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              public auth: AuthService,
              private router: Router,
              private apiService: ApiService,
              private toastrService: NbToastrService,
              private translate: TranslateService) {
    this.UserRole = localStorage.getItem('UserRole');
    if(localStorage.getItem('localize_language')){
      this.translate.use(localStorage.getItem('localize_language'));
    } else {
      localStorage.setItem('localize_language', 'en');
      translate.setDefaultLang('en');
    }
    this.selected = localStorage.getItem('localize_language');
  }

  
  useLanguage(language: string) {
    localStorage.setItem('localize_language', language);
    this.translate.use(language);
  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;
    this.menuService.onItemClick().subscribe(( event ) => {
      this.onItemSelection(event.item.title);
    })

    if(this.UserRole == 'vendor'){ 
      this.getVendorDetails(localStorage.getItem('UserId'));
    }
    
    this.userMenu = [ 
      { title: 'Log out',link: '',icon: 'lock-outline' } 
    ];  

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }

  renderValue:Boolean =false;
  status:any;
  getVendorDetails(id){   
    this.apiService.getVendorDetails(id).subscribe((res)=>{
      localStorage.setItem('VendorID', res.body.vendors[0]._id);
      this.status=res.body.vendors[0].status;
      if(this.status=='inactive'){
        this.renderValue=true;
      }
      else{
      this.renderValue=false;
      }
    });
  }

  onItemSelection( title ) {
    if ( title === 'Log out' ) {
      this.auth.logout();
    } else if ( title === 'Profile' ) {
      this.router.navigateByUrl('/pages/users/profile');
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();
    return false;
  }

  navigateHome() {
    this.router.navigateByUrl('/pages/dashboard');
  }

  userDetails: any;
  onChange(event) {
    this.userDetails={}
    this.userDetails.id =localStorage.getItem('VendorID');
    if(event == true){
      this.userDetails.status= 'inactive';
    }else{
      this.userDetails.status = 'active';
    } 
    this.apiService.editvendorstatus(this.userDetails).subscribe((res)=>{
      this.showToast('success', '', 'Succesfully Updated');
    }); 
  }

  OnBeforeChange: Observable<boolean> = Observable.create((observer) => {
    if(this.renderValue==false){
    var r = confirm("Disabling this button will make your restaurant offline and you will not be able to receive any orders. \n \nAre you sure?");
    if (r == true) {
    observer.next(true);
    } else {
    
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
