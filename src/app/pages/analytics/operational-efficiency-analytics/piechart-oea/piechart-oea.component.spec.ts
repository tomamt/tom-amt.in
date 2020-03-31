import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PiechartOeaComponent } from './piechart-oea.component';

describe('PiechartOeaComponent', () => {
  let component: PiechartOeaComponent;
  let fixture: ComponentFixture<PiechartOeaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PiechartOeaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PiechartOeaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
