import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) { 
    
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const UserRole = localStorage.getItem('UserRole');
    if (this.auth.isAuthenticated) {
      if(next.data.role){
          if (UserRole == next.data.role || UserRole == next.data.role2 || UserRole == next.data.role3 || UserRole == next.data.role4) {
            return true;
          } else {
          this.router.navigateByUrl("/pages/miscellaneous/404");
          return false;
        }
      } else {
        return true;
      }
      
    } else {
      setTimeout(()=>{
        this.router.navigate([this.auth.onAuthFailureUrl]);
        return false;
      },100)
      
    }
    
   
  }

}