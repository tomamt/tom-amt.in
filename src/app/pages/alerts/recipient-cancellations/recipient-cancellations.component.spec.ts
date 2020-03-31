import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipientCancellationsComponent } from './recipient-cancellations.component';

describe('RecipientCancellationsComponent', () => {
  let component: RecipientCancellationsComponent;
  let fixture: ComponentFixture<RecipientCancellationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecipientCancellationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipientCancellationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /*it('should create', () => {
    expect(component).toBeTruthy();
  });*/
});
