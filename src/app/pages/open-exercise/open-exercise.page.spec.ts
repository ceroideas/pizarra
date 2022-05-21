import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OpenExercisePage } from './open-exercise.page';

describe('OpenExercisePage', () => {
  let component: OpenExercisePage;
  let fixture: ComponentFixture<OpenExercisePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenExercisePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OpenExercisePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
