import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewExercisePageRoutingModule } from './new-exercise-routing.module';

import { NewExercisePage } from './new-exercise.page';

import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    NewExercisePageRoutingModule
  ],
  declarations: [NewExercisePage]
})
export class NewExercisePageModule {}
