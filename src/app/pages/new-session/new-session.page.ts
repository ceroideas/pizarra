import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { EventsService } from '../../services/events.service';

declare var $: any;

@Component({
  selector: 'app-new-session',
  templateUrl: './new-session.page.html',
  styleUrls: ['./new-session.page.scss'],
})
export class NewSessionPage implements OnInit {

  terreno;

  step = 1;

  user = JSON.parse(localStorage.getItem('AFECuser'));

  id;
  name;
  duration;
  difficult = 1;
  description;
  objectives;

  query1;

  sessions;
  session;

  ids = [];
  others = [];

  constructor(public api: ApiService, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public modal: ModalController, public events: EventsService) { }

  ngOnInit() {
    this.getSessions();
  }

  ionViewDidEnter()
  {
    
  }

  goCreate()
  {
    if(!this.api.vPro)
    {
      if (this.sessions.length >= 1) {
        return this.api.goPro();
      }
      this.step = 2;
    }else{
      this.step = 2;
    }
  }

  getSessions()
  {
    this.api.getSessions(this.user.id).subscribe(data=>{
      this.sessions = data;
    })
  }

  initSort()
  {
    this.ids = [];

    for (let i of this.session.pr) {
      this.ids.push(i.project.id);
    }

    this.others = [];
    this.loadOthers();

    setTimeout(()=>{
      $( "#actual" ).sortable({
        connectWith: "#other",
        placeholder: "ui-state-highlight",
        update: ( event, ui )=> {
          this.ids = [];
          for (let i of Array.from(document.querySelectorAll('#actual li'))) {
            this.ids.push((i as any).dataset['id'])
          }
        }
      });
      $( "#actual" ).disableSelection();

      $( "#other" ).sortable({
        connectWith: "#actual",
        placeholder: "ui-state-highlight"
      });
      $( "#other" ).disableSelection();
    },100)
  }

  loadOthers()
  {
    this.api.loadOthers({ids:this.ids,id:this.user.id}).subscribe((data:any)=>{
      this.others = data;
    })
  }

  saveExercises(){
    this.api.saveExercises({ids:this.ids,id:this.session.id}).subscribe(data=>{
      this.ids = [];
      this.session = data;
      console.log(data);
    });
  }

  edit(s)
  {
    this.step = 2;
    this.id = s.id;
    this.name = s.name;
    this.duration = s.duration;
    this.difficult = s.difficult;
    this.description = s.description;
    this.objectives = s.objetives;
  }

  open()
  {
    if (!this.session.pr) {
      return this.alertCtrl.create({message:"Ésta sesión no posée ningún ejercicio!", buttons: [{text:"Ok"}]}).then(a=>a.present());
    }
    localStorage.setItem('session',JSON.stringify(this.session));
    localStorage.setItem('actualProject',JSON.stringify(this.session.pr[0].project));
    this.events.publish('loadProject');
    this.modal.dismiss();
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
      user_id: this.user.id,
      category_id: null,
      duration: this.duration,
      difficult: this.difficult,
      description: this.description,
      objetives: this.objectives
    };

    console.log(data);
    //
    this.loadingCtrl.create().then(l=>{
      l.present();

      this.api.upSession(data).subscribe(data=>{
        l.dismiss();
        this.getSessions();
        this.alertCtrl.create({message:"Sesion de entrenamiento guardada"}).then(a=>a.present());
        // localStorage.setItem('actualProject',JSON.stringify(data));
        // this.events.publish('loadProject');
        // this.modal.dismiss();
        this.id = null;
        this.name = null;
        this.duration = null;
        this.difficult = null;
        this.description = null;
        this.objectives = null;
        this.step = 1;
      })
    })
  }

  delete(id)
  {
    this.alertCtrl.create({message:"¿Desea borrar el elemento seleccionado?", buttons: [
    {
      text:"Si",
      handler:()=>{
        this.api.deleteSession(id).subscribe(data=>{
          this.session = null;
          this.getSessions();
        });
      }
    },{
      text:"No"
    }
    ]}).then(a=>a.present());
  }

  pdfSession()
  {
    this.api.pdfSession(this.session.id).subscribe((data:any)=>{
      this.api.downloadFile(data.url)
    });
  }

}
