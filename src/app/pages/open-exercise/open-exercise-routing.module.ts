import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OpenExercisePage } from './open-exercise.page';

const routes: Routes = [
  {
    path: '',
    component: OpenExercisePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpenExercisePageRoutingModule {}
