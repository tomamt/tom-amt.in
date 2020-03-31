import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { NbAuthComponent } from '@nebular/auth';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './interceptor.service';
import { WelcomeComponent } from './welcome/welcome.component';

const routes: Routes = [
  
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
  },
  {
    path: 'login',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
      }
      
    ],
  },
  {
    path: 'welcome',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: WelcomeComponent,
      }
      
    ],
  },
  { path: '', redirectTo: 'pages', pathMatch: 'full' },
  { path: '**', redirectTo: 'pages' },
];

const config: ExtraOptions = {
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ]
  
})
export class AppRoutingModule {
}
