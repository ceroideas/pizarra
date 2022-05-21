import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-terrain',
  templateUrl: './terrain.page.html',
  styleUrls: ['./terrain.page.scss'],
})
export class TerrainPage implements OnInit {

  terrain:any = localStorage.getItem('terrain') || 1;

  constructor(public events: EventsService, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public modal: ModalController) { }

  ngOnInit() {
  }

  selectTerrain()
  {
  	localStorage.setItem('terrain',this.terrain);
  	this.events.publish('changeTerrain');
  	this.modal.dismiss();
  }

}
