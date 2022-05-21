import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OpenExercisePageRoutingModule } from './open-exercise-routing.module';

import { OpenExercisePage } from './open-exercise.page';

import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    OpenExercisePageRoutingModule
  ],
  declarations: [OpenExercisePage]
})
export class OpenExercisePageModule {}
