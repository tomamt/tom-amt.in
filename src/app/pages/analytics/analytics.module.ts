import { NgModule } from '@angular/core';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule, NbAccordionModule, NbDatepickerModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { AnalyticsRoutingModule, routedComponents } from './analytics-routing.module';
import {MatExpansionModule, MatInputModule} from '@angular/material'
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxSpinnerModule } from 'ngx-spinner';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import { UiSwitchModule } from 'ngx-ui-switch';
import {NgbModule,NgbTimepickerModule,NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { AirportAnalyticsBarchartComponent } from './airport-analytics/airport-analytics-barchart/airport-analytics-barchart.component';
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import {DropdownModule} from 'primeng/dropdown';
import { BarChartVIAComponent } from './vendor-information-analytics/bar-chart-via/bar-chart-via.component';
import { GroupedBarChartVIAComponent } from './vendor-information-analytics/grouped-bar-chart-via/grouped-bar-chart-via.component';
import { AveragebarChartVEAComponent } from './vendor-efficiency-analytics/averagebar-chart-vea/averagebar-chart-vea.component';
import { GroupedbarChartOEAComponent } from './operational-efficiency-analytics/groupedbar-chart-oea/groupedbar-chart-oea.component';
import { LinechartChartOEAComponent } from './operational-efficiency-analytics/linechart-chart-oea/linechart-chart-oea.component';
import { PiechartOeaComponent } from './operational-efficiency-analytics/piechart-oea/piechart-oea.component';
import { AveragebarChartGPAComponent } from './grammi-productivity-analytics/averagebar-chart-gpa/averagebar-chart-gpa.component';
const COMPONENTS = [
  
];

@NgModule({
  imports: [
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    AnalyticsRoutingModule,
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
    MatDatepickerModule,
    MatNativeDateModule, 
    MatRippleModule,
    MatCheckboxModule,
    UiSwitchModule.forRoot({
      size: 'small',
      color: 'rgb(0, 189, 99)',
      switchColor: '#80FFA2',
      defaultBgColor: '#00ACFF',
      defaultBoColor : '#476EFF',
      checkedLabel: 'on',
      uncheckedLabel: 'off'
      }),
      NgxDaterangepickerMd.forRoot(),
      DropdownModule,
      NbDatepickerModule,
     
  ],
  declarations: [
    ...routedComponents,
    ...COMPONENTS,
    AirportAnalyticsBarchartComponent,
    BarChartVIAComponent,
    GroupedBarChartVIAComponent,
    AveragebarChartVEAComponent,
    AveragebarChartGPAComponent,
    GroupedbarChartOEAComponent,
    LinechartChartOEAComponent,
    PiechartOeaComponent,
   
  ],
  entryComponents: [
   
   
  ],
  
})
export class AnalyticsModule { }
