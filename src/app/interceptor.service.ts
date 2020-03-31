import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpClient, HttpErrorResponse, HttpHeaders
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { EnvironmentService } from '../environments/environment.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private auth: AuthService,public envService: EnvironmentService) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.auth.getTokenSilently$().pipe(
      mergeMap(token => {
        let tokenReq;
        let S3Url = "https://"+this.envService.read('S3bucket')+".s3.amazonaws.com/";
        if(req.url == S3Url){
          tokenReq = req.clone({
          setHeaders: {}
          });
        }
        else{
          tokenReq = req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
          });
        }
        localStorage.setItem('header-token', token);
        return next.handle(tokenReq);
      }),
      catchError(err => throwError(err))
    );
  }
}