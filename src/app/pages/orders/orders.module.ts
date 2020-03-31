import { NgModule } from '@angular/core';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule, NbAccordionModule,NbSelectModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { OrdersRoutingModule, routedComponents } from './orders-routing.module';
import {MatExpansionModule, MatInputModule} from '@angular/material'
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxSpinnerModule } from 'ngx-spinner';

import {NgbModule,NgbTimepickerModule,NgbAlertModule,} from '@ng-bootstrap/ng-bootstrap';

import { Ng2SearchPipeModule } from 'ng2-search-filter'; 
import { Ng2OrderModule } from 'ng2-order-pipe';
import { NgxPaginateModule } from 'ngx-paginate';
import { UiSwitchModule } from 'ngx-toggle-switch';
import { ButtonViewComponent } from './coupons/coupons.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {DropdownModule} from 'primeng/dropdown';
import {PickListModule} from 'primeng/picklist';
import {TabViewModule} from 'primeng/tabview';
import {CodeHighlighterModule} from 'primeng/codehighlighter';

const COMPONENTS = [
  
];

@NgModule({
  imports: [
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    OrdersRoutingModule,
    Ng2SmartTableModule,
    FormsModule,
    MatExpansionModule, 
    MatInputModule,
    FormsModule, 
    ReactiveFormsModule,
    MatTabsModule,
    ImageCropperModule,
    NgMultiSelectDropDownModule.forRoot(),
    ColorPickerModule,
    NgxSpinnerModule,
    NgbTimepickerModule,NgbAlertModule,
    NbAccordionModule,
    Ng2SearchPipeModule, //including into imports
    Ng2OrderModule, // importing the sorting package here
    NgxPaginateModule,
    UiSwitchModule,
    MatDatepickerModule,
    MatNativeDateModule, 
    MatRippleModule,
    PickListModule,
    TabViewModule,
    CodeHighlighterModule,
    NbSelectModule,
    DropdownModule
  ],
  declarations: [
    ...routedComponents,
    ...COMPONENTS,
    ButtonViewComponent,
   
  ],
  entryComponents: [ 
    ButtonViewComponent,
  ],
  
})
export class OrdersModule { }
