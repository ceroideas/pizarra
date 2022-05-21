import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewPlayerPage } from './new-player.page';

const routes: Routes = [
  {
    path: '',
    component: NewPlayerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewPlayerPageRoutingModule {}
