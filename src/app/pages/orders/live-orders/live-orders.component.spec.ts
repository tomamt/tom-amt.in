import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveOrdersComponent } from './live-orders.component';
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
 function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
let service: AuthService;
let SmartTable: SmartTableData;
let ToastrService: NbToastrService;
describe('LiveOrdersComponent', () => {
  let component: LiveOrdersComponent;
  let fixture: ComponentFixture<LiveOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LiveOrdersComponent ],
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
      providers: [AuthService,SmartTableData,{ provide: NbToastrService, useValue: {} }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  beforeEach(() => {
    service = TestBed.get(AuthService);
    ToastrService = TestBed.get(NbToastrService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
