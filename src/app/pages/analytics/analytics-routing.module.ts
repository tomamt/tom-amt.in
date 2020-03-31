import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnalyticsComponent } from './analytics.component';

import { AirportAnalyticsComponent } from './airport-analytics/airport-analytics.component';
import { OperationalEfficiencyAnalyticsComponent } from './operational-efficiency-analytics/operational-efficiency-analytics.component';
import { VendorEfficiencyAnalyticsComponent } from './vendor-efficiency-analytics/vendor-efficiency-analytics.component';
import { VendorInformationAnalyticsComponent } from './vendor-information-analytics/vendor-information-analytics.component';

import { AuthGuard } from '../../auth.guard';
import { GrammiProductivityAnalyticsComponent } from './grammi-productivity-analytics/grammi-productivity-analytics.component';

const routes: Routes = [{
  path: '',
  component: AnalyticsComponent,
  children: [
    
    {
      path: 'airport-analytics',
      component: AirportAnalyticsComponent,
      canActivate: [AuthGuard],
      data: {role: 'daManager', role2: 'superAdmin', role3: 'admin', role4: ''},
    },
    {
      path: 'operational-efficiency-analytics',
      component: OperationalEfficiencyAnalyticsComponent,
      canActivate: [AuthGuard],
      data: {role: 'daManager', role2: 'superAdmin', role3: 'admin', role4: ''},
    },  
    {
      path: 'vendor-efficiency-analytics',
      component: VendorEfficiencyAnalyticsComponent,
      canActivate: [AuthGuard],
      data: {role: 'daManager', role2: 'superAdmin', role3: 'admin', role4: ''},
    },
    {
      path: 'vendor-information-analytics',
      component: VendorInformationAnalyticsComponent,
      canActivate: [AuthGuard],
      data: {role: 'daManager', role2: 'superAdmin', role3: 'admin', role4: ''},
    },
    {
      path: 'grammi-productivity-analytics',
      component: GrammiProductivityAnalyticsComponent,
      canActivate: [AuthGuard],
      data: {role: 'daManager', role2: 'superAdmin', role3: 'admin', role4: ''},
    },
    
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnalyticsRoutingModule { }

export const routedComponents = [
  AnalyticsComponent,
  AirportAnalyticsComponent,
  OperationalEfficiencyAnalyticsComponent,
  VendorEfficiencyAnalyticsComponent,
  VendorInformationAnalyticsComponent,
  GrammiProductivityAnalyticsComponent
 

];
