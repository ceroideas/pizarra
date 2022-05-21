import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewSessionPage } from './new-session.page';

describe('NewSessionPage', () => {
  let component: NewSessionPage;
  let fixture: ComponentFixture<NewSessionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSessionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewSessionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
