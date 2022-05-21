import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OpenProjectPageRoutingModule } from './open-project-routing.module';

import { OpenProjectPage } from './open-project.page';

import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PipesModule,
    OpenProjectPageRoutingModule
  ],
  declarations: [OpenProjectPage]
})
export class OpenProjectPageModule {}
