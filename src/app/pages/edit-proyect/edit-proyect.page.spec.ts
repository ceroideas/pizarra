import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditProyectPage } from './edit-proyect.page';

describe('EditProyectPage', () => {
  let component: EditProyectPage;
  let fixture: ComponentFixture<EditProyectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditProyectPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditProyectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
