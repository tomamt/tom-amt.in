import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlertComponent } from './alerts.component';

import { ManageAlertsComponent } from './manage-alerts/manage-alerts.component';

import { AuthGuard } from '../../auth.guard';
import { RecipientCancellationsComponent } from './recipient-cancellations/recipient-cancellations.component';
import { DeliveryAgentIssuesComponent } from './delivery-agent-issues/delivery-agent-issues.component';
import { DeliveryAgentBreaksComponent } from './delivery-agent-breaks/delivery-agent-breaks.component';
import { DeliveryAgentUnavailableComponent } from './delivery-agent-da-unavailable/delivery-agent-da-unavailable.component';

const routes: Routes = [{
  path: '',
  component: AlertComponent,
  children: [
  { 
    path: '', 
    redirectTo: 'crew-issues', 
    pathMatch: 'full',
    canActivate: [AuthGuard],
    data: {role: 'daManager', role2: 'admin', role3: 'superAdmin', role4: ''},
  },
  { path: 'crew-issues', 
  component:  ManageAlertsComponent,
  canActivate: [AuthGuard],
  data: {role: 'daManager', role2: 'admin', role3: 'superAdmin', role4: ''},
  },
  { 
    path: 'recipient-cancellations', 
    component:  RecipientCancellationsComponent,
    data: {role: 'daManager', role2: 'admin', role3: 'superAdmin', role4: ''},
  },
  { 
    path: 'delivery-agent-issues', 
    component:  DeliveryAgentIssuesComponent,
    data: {role: 'daManager', role2: 'admin', role3: 'superAdmin', role4: ''},
  },
  { 
    path: 'delivery-agent-breaks', 
    component:  DeliveryAgentBreaksComponent,
    data: {role: 'daManager', role2: 'admin', role3: 'superAdmin', role4: ''},
  },
  { 
    path: 'delivery-agent-da-unavailable', 
    component:  DeliveryAgentUnavailableComponent,
    data: {role: 'daManager', role2: 'admin', role3: 'superAdmin', role4: ''},
  }
]
  
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlertsRoutingModule { }

export const routedComponents = [
  AlertComponent,
  ManageAlertsComponent,
 

];
