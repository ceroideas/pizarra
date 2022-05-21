import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrEventsPage } from './pr-events.page';

const routes: Routes = [
  {
    path: '',
    component: PrEventsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrEventsPageRoutingModule {}
