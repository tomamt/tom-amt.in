import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ECommerceComponent } from './e-commerce.component';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
 function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
describe('ECommerceComponent', () => {
  let component: ECommerceComponent;
  let fixture: ComponentFixture<ECommerceComponent>;
  

let de: DebugElement;
let el: HTMLElement;
function setup() {
  
const fixture = TestBed.createComponent(ECommerceComponent);
const component = fixture.componentInstance;
//const authService = fixture.debugElement.injector.get(AuthService);

return { fixture, component };
}

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ECommerceComponent ],
      imports: [TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        }
    }),HttpClientTestingModule],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ECommerceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('ECommerceComponent', () => {
    expect(component).toBeTruthy();
  });

  it(`user role check`, () => {
    component.dasboardCheck();
    component.enableDashbaord = true;
    expect(component.enableDashbaord).toBeTruthy();
    });
    
});
