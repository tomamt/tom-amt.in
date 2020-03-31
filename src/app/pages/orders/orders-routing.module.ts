import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrdersComponent } from './orders.component';

import { LiveOrdersComponent } from './live-orders/live-orders.component';
import { PastOrdersComponent } from './past-orders/past-orders.component';
import { CouponsComponent } from './coupons/coupons.component';
import { EditCouponComponent } from './edit-coupon/edit-coupon.component';

import { AuthGuard } from '../../auth.guard';
import { ManageQueueComponent } from './manage-queue/manage-queue.component';
import { ViewOrdersComponent } from './view-orders/view-orders.component';
import { PaymentsComponent } from './payments/payments.component';
import { ViewPaymentComponent } from './view-payment/view-payment.component';
import { RatingsComponent } from './ratings/ratings.component';
import { ViewRatingComponent } from './view-rating/view-rating.component';
const routes: Routes = [{
  path: '',
  component: OrdersComponent,
  children: [
    
    {
      path: 'live-orders',
      component: LiveOrdersComponent,
      canActivate: [AuthGuard],
      data: {role: 'vendor', role2: 'daManager', role3: 'admin', role4: 'superAdmin'},
    },
    {
      path: 'past-orders',
      component: PastOrdersComponent,
      canActivate: [AuthGuard],
      data: {role: 'vendor', role2: 'daManager', role3: 'admin', role4: 'superAdmin'},
    },  
    {
      path: 'coupons',
      component: CouponsComponent,
      canActivate: [AuthGuard],
      data: {role: 'superAdmin', role2: 'admin', role3: '', role4: ''},
    },  
    {
      path: 'edit-coupon',
      component: EditCouponComponent,
      canActivate: [AuthGuard],
      data: {role: 'superAdmin', role2: 'admin', role3: '', role4: ''},
    }, 
    {
      path: 'manage-queue/:id',
      component: ManageQueueComponent,
      canActivate: [AuthGuard],
      data: {role: 'daManager', role2: 'admin', role3: 'superAdmin', role4: ''},
    },
    {
      path: 'view-orders',
      component: ViewOrdersComponent,
      canActivate: [AuthGuard],
      data: {role: 'vendor', role2: 'daManager', role3: 'admin', role4: 'superAdmin'},
    },
    {
      path: 'view-rating',
      component: ViewRatingComponent,
      canActivate: [AuthGuard],
      data: {role: 'vendor', role2: 'daManager', role3: 'admin', role4: 'superAdmin'},
    },
    {
      path: 'payments',
      component: PaymentsComponent,
      canActivate: [AuthGuard],
      data: {role: 'daManager', role2: 'superAdmin', role3: 'admin', role4: ''},
    },
    {
      path: 'view-payments',
      component: ViewPaymentComponent,
      canActivate: [AuthGuard],
      data: {role: 'daManager', role2: 'superAdmin', role3: 'admin', role4: ''},
    },
    {
      path: 'ratings',
      component: RatingsComponent,
      canActivate: [AuthGuard],
      data: {role: 'daManager', role2: 'superAdmin', role3: 'admin', role4: ''},
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrdersRoutingModule { }

export const routedComponents = [
  OrdersComponent,
  LiveOrdersComponent,
  PastOrdersComponent,
  CouponsComponent,
  EditCouponComponent,
  ManageQueueComponent,
  ViewOrdersComponent,
  ViewRatingComponent,
  PaymentsComponent,
  ViewPaymentComponent,
  RatingsComponent,
 

];
