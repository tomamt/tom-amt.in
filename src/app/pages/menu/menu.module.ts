import { NgModule } from '@angular/core';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule, NbAccordionModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { MenuRoutingModule, routedComponents } from './menu-routing.module';
import {MatExpansionModule, MatInputModule} from '@angular/material'
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ButtonViewComponent } from './manage-menu/manage-menu.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import {NgbModule,NgbTimepickerModule,NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import {MatCheckboxModule} from '@angular/material/checkbox';
const COMPONENTS = [
  
];

@NgModule({
  imports: [
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    MenuRoutingModule,
    Ng2SmartTableModule,
    FormsModule,
    MatExpansionModule, 
    MatInputModule,
    FormsModule, 
    ReactiveFormsModule,
    MatTabsModule,
    ImageCropperModule,
    NgMultiSelectDropDownModule.forRoot(),
    AngularMultiSelectModule,
    ColorPickerModule,
    NgxSpinnerModule,
    NgbTimepickerModule,NgbAlertModule,
    NbAccordionModule,
    MatCheckboxModule,
    UiSwitchModule.forRoot({
      size: 'small',
      color: 'rgb(0, 189, 99)',
      switchColor: '#80FFA2',
      defaultBgColor: '#00ACFF',
      defaultBoColor : '#476EFF',
      checkedLabel: 'on',
      uncheckedLabel: 'off'
      })
  ],
  declarations: [
    ...routedComponents,
    ...COMPONENTS,
    ButtonViewComponent
   
  ],
  entryComponents: [
   
    ButtonViewComponent,
  ],
  
})
export class MenuModule { }
