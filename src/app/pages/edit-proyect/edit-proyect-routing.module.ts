import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditProyectPage } from './edit-proyect.page';

const routes: Routes = [
  {
    path: '',
    component: EditProyectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditProyectPageRoutingModule {}
