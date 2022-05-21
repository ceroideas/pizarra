import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OpenProjectPage } from './open-project.page';

describe('OpenProjectPage', () => {
  let component: OpenProjectPage;
  let fixture: ComponentFixture<OpenProjectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenProjectPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OpenProjectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
