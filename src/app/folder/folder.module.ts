import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FolderPageRoutingModule } from './folder-routing.module';

import { FolderPage } from './folder.page';

import { IonicContextMenuModule } from 'ionic-context-menu';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FolderPageRoutingModule,
    IonicContextMenuModule
  ],
  declarations: [FolderPage]
})
export class FolderPageModule {}
