import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersComponent } from './users.component';
import { AdminsComponent } from './admins/admins.component';
import { CrewMembersComponent } from './crew-members/crew-members.component';
import { DeliveryAgentManagersComponent } from './delivery-agent-managers/delivery-agent-managers.component';
import { DeliveryAgentsComponent } from './delivery-agents/delivery-agents.component';
import { VendorsComponent } from './vendors/vendors.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from '../../auth.guard';
import { ViewDeliveryAgentComponent } from './view-delivery-agent/view-delivery-agent.component';


import { DialogComponent } from './dialog/dialog.component';
const routes: Routes = [{
  path: '',
  component: UsersComponent,
  children: [
    {
      path: 'admins',
      component: AdminsComponent,
      canActivate: [AuthGuard],
      data: {role: 'superAdmin', role2: '', role3: '', role4: ''},
    },
    {
      path: 'crew-members',
      component: CrewMembersComponent,
      canActivate: [AuthGuard],
      data: {role: 'vendor', role2: '', role3: '', role4: ''},
    },
    {
      path: 'profile',
      component: ProfileComponent,
      canActivate: [AuthGuard],
      data: {role: 'vendor', role2: '', role3: '', role4: ''},
      },
    {
    path: 'delivery-agent-managers',
    component: DeliveryAgentManagersComponent,
    canActivate: [AuthGuard],
    data: {role: 'superAdmin', role2: 'admin', role3: '', role4: ''},
    },
    {
    path: 'delivery-agents',
    component: DeliveryAgentsComponent,
    canActivate: [AuthGuard],
    data: {role: 'superAdmin', role2: 'admin', role3: 'daManager', role4: ''},
    },
    {
    path: 'vendors',
    component: VendorsComponent,
    canActivate: [AuthGuard],
    data: {role: 'superAdmin', role2: 'admin', role3: '', role4: ''},
    },
    {
      path: 'dialog',
      component: DialogComponent,
    },
    {
      path: 'view-delivery-agent',
      component: ViewDeliveryAgentComponent,
      canActivate: [AuthGuard],
      data: {role: 'superAdmin', role2: 'admin', role3: 'daManager', role4: ''},
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule { }

export const routedComponents = [
  UsersComponent,
  AdminsComponent,
  CrewMembersComponent,
  DeliveryAgentManagersComponent,
  DeliveryAgentsComponent,
  VendorsComponent,
  ProfileComponent,
  ViewDeliveryAgentComponent,

];
