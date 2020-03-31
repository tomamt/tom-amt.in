import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuComponent } from './menu.component';

import { ManageMenuComponent } from './manage-menu/manage-menu.component';
import { EditMenuComponent } from './edit-menu/edit-menu.component';

import { AuthGuard } from '../../auth.guard';

const routes: Routes = [{
  path: '',
  component: MenuComponent,
  children: [
    
    {
      path: 'manage-menu',
      component: ManageMenuComponent,
      canActivate: [AuthGuard],
      data: {role: 'vendor', role2: '', role3: '', role4: ''},
    },
    {
      path: 'edit-menu',
      component: EditMenuComponent,
      canActivate: [AuthGuard],
      data: {role: 'vendor', role2: '', role3: '', role4: ''},
    },  
    
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuRoutingModule { }

export const routedComponents = [
    MenuComponent,
  ManageMenuComponent,
  EditMenuComponent,
 
];
