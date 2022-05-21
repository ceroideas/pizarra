import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewExercisePage } from './new-exercise.page';

const routes: Routes = [
  {
    path: '',
    component: NewExercisePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewExercisePageRoutingModule {}
