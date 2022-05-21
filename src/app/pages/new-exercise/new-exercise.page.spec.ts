import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewExercisePage } from './new-exercise.page';

describe('NewExercisePage', () => {
  let component: NewExercisePage;
  let fixture: ComponentFixture<NewExercisePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewExercisePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewExercisePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
