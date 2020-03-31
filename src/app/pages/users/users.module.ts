import { NgModule } from '@angular/core';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule, NbAccordionModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { UsersRoutingModule, routedComponents } from './users-routing.module';


import { ShowcaseDialogComponent } from './dialog/showcase-dialog/showcase-dialog.component';

import { DialogComponent } from './dialog/dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import {MatExpansionModule, MatInputModule} from '@angular/material'
import {MatTabsModule} from '@angular/material/tabs';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ButtonViewComponent } from './crew-members/crew-members.component';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { ColorPickerModule } from 'ngx-color-picker';
import { ButtonViewComponent2 } from './delivery-agents/delivery-agents.component';
import { ButtonViewComponent3 } from './delivery-agent-managers/delivery-agent-managers.component';
import { ButtonViewComponent4 } from './admins/admins.component';
import { ButtonViewComponent5 } from './vendors/vendors.component';
import {NgbModule,NgbTimepickerModule,NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';

const COMPONENTS = [
  DialogComponent,
  ShowcaseDialogComponent,
  
];

@NgModule({
  imports: [
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    UsersRoutingModule,
    Ng2SmartTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule, 
    MatInputModule,
    MatTabsModule,
    ImageCropperModule,
    NgMultiSelectDropDownModule.forRoot(),
    AngularMultiSelectModule,
    ColorPickerModule,
    UiSwitchModule,
    NgxSpinnerModule,
    NbAccordionModule,
    NgbTimepickerModule,
    NgbAlertModule,
    NgxDaterangepickerMd.forRoot(),
  ],
  declarations: [
    ...routedComponents,
    ButtonViewComponent,
    ButtonViewComponent2,
    ButtonViewComponent3,
    ButtonViewComponent4,
    ButtonViewComponent5,
    ...COMPONENTS,
  ],
  entryComponents: [
   
    ButtonViewComponent,
    ButtonViewComponent2,
    ButtonViewComponent3,
    ButtonViewComponent4,
    ButtonViewComponent5,
  ],
  
})
export class UsersModule { }
