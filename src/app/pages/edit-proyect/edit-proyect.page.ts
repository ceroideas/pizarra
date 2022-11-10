import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-edit-proyect',
  templateUrl: './edit-proyect.page.html',
  styleUrls: ['./edit-proyect.page.scss'],
})
export class EditProyectPage implements OnInit {

  id;
  name;
  
  home_score;
  away_score;
  date;
  hour;
  location;
  attendances;
  periods;
  minutes;
  competition;
  jornada;

  participants;
  difficult;
  min_age;
  max_age;
  description;
  objectives;
  objectives_secondary;
  conditions;
  variants;

  show_all;

  isExercise;

  step = 1;

  user = JSON.parse(localStorage.getItem('AFECuser'));

  @Input() project;

  constructor(public api: ApiService, public alertCtrl: AlertController,
    public loadingCtrl: LoadingController, public modal: ModalController,
    public events: EventsService) { }

  ngOnInit() {
    console.log(this.project);

    this.id = this.project.id;
    this.name = this.project.name;
  
    this.home_score = this.project.home_score;
    this.away_score = this.project.away_score;
    this.date = this.project.date;
    this.hour = this.project.hour;
    this.location = this.project.location;
    this.attendances = this.project.attendances;
    this.periods = this.project.periods;
    this.minutes = this.project.minutes;
    this.competition = this.project.competition;
    this.jornada = this.project.jornada;

    this.participants = this.project.participants;
    this.difficult = this.project.difficult;
    this.min_age = this.project.min_age;
    this.max_age = this.project.max_age;
    this.description = this.project.description;
    this.objectives = this.project.objetives;
    this.objectives_secondary = this.project.objetives_sec;
    this.conditions = this.project.conditions;
    this.variants = this.project.variants;
    this.show_all = this.project.show_all;

    this.isExercise = this.project.isExercise;
  }


  upProject()
  {
    if (!this.name) {
      this.alertCtrl.create({message:"Por favor, escriba el nombre del ejercicio!"}).then(a=>a.present());
      return false;
    }
    if (!this.difficult) {
      this.alertCtrl.create({message:"Por favor, Seleccione la dificultad del ejercicio!"}).then(a=>a.present());
      return false;
    }
    
    let data = {
      id: this.id,
      name: this.name,
    
      home_score: this.home_score,
      away_score: this.away_score,
      date: this.date,
      hour: this.hour,
      location: this.location,
      attendances: this.attendances,
      periods: this.periods,
      minutes: this.minutes,
      competition: this.competition,
      jornada: this.jornada,

      participants: this.participants,
      difficult: this.difficult,
      min_age: this.min_age,
      max_age: this.max_age,
      description: this.description,
      objectives: this.objectives,
      objectives_secondary: this.objectives_secondary,
      conditions: this.conditions,
      variants: this.variants,
      show_all: this.show_all,

      isExercise: this.isExercise,
    };

    console.log(data);
    //
    this.loadingCtrl.create().then(l=>{
      l.present()
      this.api.upProject1(data).subscribe(data=>{
        l.dismiss();
        // localStorage.removeItem('session');
        localStorage.setItem('actualProject',JSON.stringify(data));
        this.events.publish('loadProject');
        this.modal.dismiss();
      })
    })
  }

}
