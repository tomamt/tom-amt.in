import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DeliveryAgentBreaksComponent } from './delivery-agent-breaks.component';
import { Ng2OrderModule } from 'ng2-order-pipe';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { SmartTableData } from '../../../@core/data/smart-table';
import { AuthService } from '../../../services/auth.service';
import { NbDialogService} from '@nebular/theme';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatDialogModule} from '@angular/material/dialog';
 function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
let service: AuthService;
let dialogService: NbDialogService;
let dialog: MatDialog

describe('DeliveryAgentBreaksComponent', () => {
  let component: DeliveryAgentBreaksComponent;
  let fixture: ComponentFixture<DeliveryAgentBreaksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryAgentBreaksComponent ],
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
        Ng2OrderModule,
        MatDialogModule
        
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [AuthService,SmartTableData,,MatDialog,NbDialogService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryAgentBreaksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    service = TestBed.get(AuthService);
    dialogService = TestBed.get(NbDialogService);
    dialog = TestBed.get(MatDialog);
  });

 /* it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
