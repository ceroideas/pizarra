import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PrEventsPage } from './pr-events.page';

describe('PrEventsPage', () => {
  let component: PrEventsPage;
  let fixture: ComponentFixture<PrEventsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrEventsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PrEventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
