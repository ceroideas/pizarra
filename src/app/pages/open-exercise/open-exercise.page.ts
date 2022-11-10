import { Component, OnInit } from '@angular/core';
import { ModalController,LoadingController, AlertController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-open-exercise',
  templateUrl: './open-exercise.page.html',
  styleUrls: ['./open-exercise.page.scss'],
})
export class OpenExercisePage implements OnInit {

  selectedDoc = null;
  touchtime = 0;

  projects;

  query;

  user = JSON.parse(localStorage.getItem('AFECuser'));

  constructor(public modal: ModalController, public api: ApiService, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public events: EventsService) { }

  ngOnInit() {
    this.api.getExercises(this.user.id).subscribe(data=>{
      this.projects = data;
    })
  }

  openDoc(p)
  {
    if (this.touchtime == 0) {
          // set first click
          this.touchtime = new Date().getTime();
      } else {
          // compare first click to this click and see if they occurred within double click threshold
          if (((new Date().getTime()) - this.touchtime) < 800) {
              // double click occurred

              this.modal.dismiss();

              this.touchtime = 0;

              localStorage.removeItem('session');

              this.loadingCtrl.create().then(l=>{
                l.present();

                this.api.loadScenes(p.id).subscribe(data=>{

                  l.dismiss();
                  
                  p.scenes = data;

                  localStorage.setItem('actualProject',JSON.stringify(p));
                  this.events.publish('loadProject');

                });
              });

          } else {
              // not a double click so set as a new first click
              this.touchtime = new Date().getTime();
          }
      }
  }

  delete(id)
  {
    this.alertCtrl.create({message:"¿Desea borrar el elemento seleccionado?", buttons: [
    {
      text:"Si",
      handler:()=>{
        this.api.deleteProyect(id).subscribe(data=>{
          this.api.getExercises(this.user.id).subscribe(data=>{
            this.projects = data;
          })
        });
      }
    },{
      text:"No"
    }
    ]}).then(a=>a.present());
  }

}
