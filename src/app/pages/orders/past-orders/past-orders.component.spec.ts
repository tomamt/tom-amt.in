import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastOrdersComponent } from './past-orders.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../../services/auth.service';
import { Ng2OrderModule } from 'ng2-order-pipe';
import { SmartTableData } from '../../../@core/data/smart-table';
import { NbToastrService } from '@nebular/theme';
import { NbDialogService } from '@nebular/theme';
 function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
let service: AuthService;
let SmartTable: SmartTableData;
let ToastrService: NbToastrService;
describe('PastOrdersComponent', () => {
  let component: PastOrdersComponent;
  let fixture: ComponentFixture<PastOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PastOrdersComponent ],
      imports: [
        TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
          }
        }),
        HttpClientTestingModule,
        HttpClientModule,
        RouterTestingModule,
        FormsModule,
        Ng2OrderModule
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [AuthService,SmartTableData,{ provide: NbToastrService, useValue: {} },{ provide: NbDialogService, useValue: {} },]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PastOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

 it('should create', () => {
    expect(component).toBeTruthy();
  });
});
