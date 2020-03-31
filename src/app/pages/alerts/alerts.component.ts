import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ngx-alert',
  template: `
  <nb-card style="padding:1rem 1.25rem">
    <nb-card-header>
      Manage Alerts
    </nb-card-header>
   
      <nav mat-tab-nav-bar>
        <a mat-tab-link *ngFor="let link of navLinks" [routerLink]="link.link"
          routerLinkActive #rla="routerLinkActive" [active]="rla.isActive"> {{link.label}}
        </a>
      </nav>
     
   
  <router-outlet></router-outlet><ngx-spinner></ngx-spinner> </nb-card>`,
  styleUrls: ['./alerts.component.scss']
})
export class AlertComponent {
  navLinks: any[];
  activeLinkIndex = -1; 
  constructor(private router: Router,public translate: TranslateService) {
    if(localStorage.getItem('localize_language')){
      this.translate.use(localStorage.getItem('localize_language'));
    } else {
      localStorage.setItem('localize_language', 'en');
      translate.setDefaultLang('en');
    }
    
    this.navLinks = [
      {
        label: 'Crew Issues',
        link: 'crew-issues',
        index: 0
      },
      {
          label: 'Recipient Cancellations',
          link: 'recipient-cancellations',
          index: 1
      }, {
          label: 'Delivery Agent Issues',
          link: 'delivery-agent-issues',
          index: 2
      }, {
          label: 'Delivery Agent Breaks',
          link: 'delivery-agent-breaks',
          index: 3
      }, 
      {
        label: 'Delivery Agent unavailable',
        link: 'delivery-agent-da-unavailable',
        index: 4
    }, 
  ];
  }
  ngOnInit(): void {
    this.router.events.subscribe((res) => {
        this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
    });
  } 

}
