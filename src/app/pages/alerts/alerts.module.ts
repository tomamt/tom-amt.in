import { NgModule } from '@angular/core';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule, NbAccordionModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import {MatDialogModule} from '@angular/material/dialog';
import { ThemeModule } from '../../@theme/theme.module';
import { AlertsRoutingModule, routedComponents } from './alerts-routing.module';
import {MatExpansionModule, MatInputModule} from '@angular/material'
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatTabsModule} from '@angular/material/tabs';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxSpinnerModule } from 'ngx-spinner';
import { UiSwitchModule } from 'ngx-ui-switch';
import {NgbModule,NgbTimepickerModule,NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { RecipientCancellationsComponent } from './recipient-cancellations/recipient-cancellations.component';
import { DeliveryAgentIssuesComponent } from './delivery-agent-issues/delivery-agent-issues.component';
import { DeliveryAgentBreaksComponent } from './delivery-agent-breaks/delivery-agent-breaks.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter'; 
import { Ng2OrderModule } from 'ng2-order-pipe';
import { NgxPaginateModule } from 'ngx-paginate';
import { DeliveryAgentUnavailableComponent } from './delivery-agent-da-unavailable/delivery-agent-da-unavailable.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
const COMPONENTS = [
  
];

@NgModule({
  imports: [
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    MatDialogModule,
    NbInputModule,
    ThemeModule,
    AlertsRoutingModule,
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
    MatCheckboxModule,
    Ng2SearchPipeModule, 
    Ng2OrderModule, 
    NgxPaginateModule,
    UiSwitchModule.forRoot({
      size: 'small',
      color: 'rgb(0, 189, 99)',
      switchColor: '#80FFA2',
      defaultBgColor: '#00ACFF',
      defaultBoColor : '#476EFF',
      checkedLabel: 'on',
      uncheckedLabel: 'off'
      }),
      TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
      })
  ],
  declarations: [
    ...routedComponents,
    ...COMPONENTS,
    RecipientCancellationsComponent,
    DeliveryAgentIssuesComponent,
    DeliveryAgentBreaksComponent,
    DeliveryAgentUnavailableComponent,
   
   
  ],
  entryComponents: [
    
  ],
  
})
export class AlertsModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
