import { Injectable } from '@angular/core';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import { from, of, Observable, BehaviorSubject, combineLatest, throwError, bindNodeCallback } from 'rxjs';
import { tap, catchError, concatMap, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { EnvironmentService } from '../../environments/environment.service';
import * as auth0 from 'auth0-js';

@Injectable()
export class AuthService {
  
  private Auth0 = new auth0.WebAuth({
    clientID: this.envService.read('Auth0ClientId'),
    domain: this.envService.read('Auth0Domain'),
    responseType: 'id_token token',
    redirectUri: `${window.location.origin}/pages/dashboard`,
    audience: this.envService.read('Auth0audience'),
    scope: 'openid profile email',
    leeway: 40,
  });

  private authFlag = 'isLoggedIn';
  token$ = new BehaviorSubject<string>(null);
  userProfile$ = new BehaviorSubject<any>(null);
  onAuthSuccessUrl = '/pages/dashboard';
  onAuthFailureUrl = '/login';
  logoutUrl = `${window.location.origin}/login`;
  parseHash$ = bindNodeCallback(this.Auth0.parseHash.bind(this.Auth0));
  checkSession$ = bindNodeCallback(this.Auth0.checkSession.bind(this.Auth0));

  constructor(private router: Router,
    public envService: EnvironmentService) { 

  }

  login() {
    this.Auth0.authorize();
  }

  handleLoginCallback() {
    if (window.location.hash && !this.isAuthenticated) {
      this.parseHash$().subscribe(
        authResult => {
          localStorage.setItem('authResult', JSON.stringify(authResult));
          this.localLogin(authResult);
          this.router.navigate([this.onAuthSuccessUrl]);
        },
        err => this.handleError(err)
      )
    }
    if(this.isAuthenticated){
      let authResult = JSON.parse(localStorage.getItem('authResult'));
     // this.token$.next(authResult.accessToken);
      this.token$.next(authResult.idToken);
      this.userProfile$.next(authResult.idTokenPayload);
    }
  }

  private localLogin(authResult) {
    localStorage.setItem('UserId', authResult.idTokenPayload[this.envService.read('Auth0audience')+`/userId`]);
    localStorage.setItem('UserRole', authResult.idTokenPayload[this.envService.read('Auth0audience')+`/roles`][0]);
    //this.token$.next(authResult.accessToken);
    this.token$.next(authResult.idToken);
    this.userProfile$.next(authResult.idTokenPayload);
    localStorage.setItem(this.authFlag, JSON.stringify(true));
  }

  get isAuthenticated(): boolean {
    return JSON.parse(localStorage.getItem(this.authFlag));
  }

  renewAuth() {
    if (this.isAuthenticated) {
      this.checkSession$({}).subscribe(
        authResult => this.localLogin(authResult),
        err => {
          localStorage.removeItem(this.authFlag);
          this.router.navigate([this.onAuthFailureUrl]);
        }
      );
    }
  }

  private localLogout() {
    localStorage.setItem(this.authFlag, JSON.stringify(false));
    this.token$.next(null);
    this.userProfile$.next(null);
    localStorage.setItem('authResult', JSON.stringify(null));
    localStorage.setItem('UserId', null);
    localStorage.setItem('UserRole', null);
  }

  logout() {
    this.localLogout();
    this.Auth0.logout({
      returnTo: this.logoutUrl,
      clientID: this.envService.read('Auth0ClientId')
    });
  }

  private handleError(err) {
    if (err.error_description) {
      console.error(`Error: ${err.error_description}`);
    } else {
      console.error(`Error: ${JSON.stringify(err)}`);
      if(err && err.errorDescription){
        alert(err.errorDescription+' please contact Admin');
      }
    }
  }

  getTokenSilently$(options?): Observable<string> {
    return this.token$;
  }

}