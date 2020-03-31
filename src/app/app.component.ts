
import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { EnvironmentService } from '../../src/environments/environment.service';
import { MessagingService } from "./services/messaging.service";
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  message:any;
  constructor( private envServiceProvider: EnvironmentService,
    private auth: AuthService,
    private messagingService: MessagingService,
    public translate: TranslateService) {
      if(localStorage.getItem('localize_language')){
        this.translate.use(localStorage.getItem('localize_language'));
      } else {
        localStorage.setItem('localize_language', 'en');
        translate.setDefaultLang('en');
      }
      
      console.log('555',localStorage.getItem('localize_language'));
   
  }
  useLanguage(language: string) {
    this.translate.use(language);
  }
  ngOnInit(): void { 
    this.auth.handleLoginCallback();
    const userId = 'user001';
    this.messagingService.requestPermission(userId)
    this.messagingService.receiveMessage()
    this.message = this.messagingService.currentMessage
   // console.log("message",this.message)
    //this.auth.localAuthSetup();
    //this.auth.handleAuthCallback();
  }
  
}
