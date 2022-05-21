import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.page.html',
  styleUrls: ['./new-project.page.scss'],
})
export class NewProjectPage implements OnInit {

  terreno = 1;

  step = 2;

  team1 = null;
  team2 = null;

  teams = [];
  players = [];
  rosters = [];

  user = JSON.parse(localStorage.getItem('AFECuser'));

  //
  team_image;
  team_name;


  player_image;
  player_name;
  player_number;
  player_age;
  player_weight;
  player_height;
  player_titular;
  player_position;
  player_notes;

  selectedTeam = null;

  team = null;

  selectT1N;
  selectT1M;
  selectT1B;

  selectT2N;
  selectT2M;
  selectT2B;

  query1;
  query2;


  styles = {
    "team1":{number:'#ffffff',main:'#000000',back:'#9e2956',style:1},
    "team2":{number:'#ffffff',main:'#000000',back:'#9e2956',style:1}
  };
  colors = [ '#000000', '#ffffff', '#9e2956', '#c2281d', '#de722f', '#edbf4c', '#5db37e', '#459cde', '#4250ad', '#802fa3' ];

  name;
  
  home_score;
  away_score;
  date;
  hour;
  location;
  attendances;
  periods;
  minutes = 45;

  players_selected = [];

  constructor(public api: ApiService, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public modal: ModalController, public events: EventsService) { }

  ngOnInit() {
  	this.getTeams();
  }

  selectToggle(i)
  {
    if (this[i]) {
      this[i] = false;
    }else{
      this[i] = true;
    }
  }

  getTeams()
  {
  	this.api.getTeams(this.user.id).subscribe((data:any)=>{
  		this.teams = data;
  	})
  }

  getPlayers()
  {
  	this.api.getPlayers(this['team'+this.selectedTeam]['id']).subscribe((data:any)=>{
  		this.players = data;
  	})
  }

  getRosters(id) // id del equipo
  {
  	this.api.getRosters(id).subscribe((data:any)=>{
  		this.rosters = data;
      this.players_selected = [];
      for(let i of data)
      {
        if(i.player_id) this.players_selected.push(i.player_id);
      }
  	})
  }

  saveTeam()
  {
  	this.loadingCtrl.create().then(a=>{

      a.present();
	  	this.api.upTeam({user_id:this.user.id,name:this.team_name,image:this.team_image}).subscribe((data:any)=>{
	  		a.dismiss();
	  		this.step = 3;
	  		this.teams = data;
	  	},err=>{
	  		a.dismiss();
	        console.log(err);
	        var arr = Object.keys(err.error.errors).map(function(k) { return err.error.errors[k] });
	        let errorMessage = arr[0][0];
	        this.alertCtrl.create({message:errorMessage}).then(al=>{al.present();setTimeout(()=>{al.dismiss()},3000)});
	  	})
	  });

  }

  upload(event,where)
  {
    let file = event.target.files[0];

    let formData = new FormData();

    formData.append("file", file);

    console.log(formData);

    this.api.uploadImage(formData).subscribe((data:any)=>{
      this[where] = data.url
    });
  }

  prePlayers()
  {
    this.getPlayers();
  }
  preRosters()
  {
    this.rosters = [];
    this.getRosters(this['team'+this.selectedTeam]['id']);
  }

  selectTeam()
  {
  	this['team'+this.selectedTeam] = this.teams[this.team];
  	this.step = 2;
  }

  addRoster(data)
  {
    data.team_id = this['team'+this.selectedTeam]['id'];
    this.api.upRoster(data).subscribe((data:any)=>{
      this.rosters = data;
    })
  }

  savePlayer()
  {
    this.loadingCtrl.create().then(a=>{

      a.present();
      this.api.upPlayer(
        {
          user_id:this.user.id,
          team_id:this['team'+this.selectedTeam]['id'],
          image:this.player_image,
          name:this.player_name,
          number:this.player_number,
          age:this.player_age,
          weight:this.player_weight,
          height:this.player_height,
          position:this.player_position,
          titular:this.player_titular,
          notes:this.player_notes

        }).subscribe((data:any)=>{
        a.dismiss();
        this.step = 5;
        this.players = data;
        //**//
        this.player_image = null;
        this.player_name = null;
        this.player_number = null;
        this.player_age = null;
        this.player_weight = null;
        this.player_height = null;
        this.player_titular = null;
        this.player_position = null;
        this.player_notes = null;
        //**//
      },err=>{
        a.dismiss();
          console.log(err);
          var arr = Object.keys(err.error.errors).map(function(k) { return err.error.errors[k] });
          let errorMessage = arr[0][0];
          this.alertCtrl.create({message:errorMessage}).then(al=>{al.present();setTimeout(()=>{al.dismiss()},3000)});
      })
    });
  }

  upProject()
  {
    if (!this.team1 || !this.team2) {
      this.alertCtrl.create({message:"Por favor, seleccione los equipos para el partido!"}).then(a=>a.present());
      return false;
    }
    this.alertCtrl.create({message:"Escriba un nombre para el partido", inputs: [
        {
          label:'Nombre del partido',
          name:'name',
          type:'text'
        }
      ], buttons: [
        {
          text:"Aceptar",
          handler: (a)=> {
            if (!a.name) {
              return false;
            }
            this.name = a.name;

            this.periods = (document.querySelector('[name="periods"]:checked') as any).value;

            let data = {

                home_score:this.home_score,
                away_score:this.away_score,
                date:this.date,
                hour:this.hour,
                location:this.location,
                attendances:this.attendances,
                periods:this.periods,
                minutes:this.minutes,

                styles:this.styles,
                team1:this.team1.id,
                team2:this.team2.id,
                terrain:this.terreno,
                user_id:this.user.id,
                name:this.name
              };

            console.log(data);
            //
            this.loadingCtrl.create().then(l=>{
              l.present()
              this.api.upProject(data).subscribe(data=>{
                l.dismiss();
                localStorage.setItem('actualProject',JSON.stringify(data));
                this.events.publish('loadProject');
                this.modal.dismiss();
              })
            })
          }
        },{
          text:"Cancelar"
        }
      ]
    }).then(a=>a.present());
  }

  updateRoster(r,e,type)
  {
    if (type == 'player') {
      let p = this.players.find(x=>x.id == e.srcElement.value);

      let elem = e.srcElement.parentNode.parentNode.parentNode;

      elem.children.item(1).children.item(0).children.item(0).value = p.number;
      elem.children.item(2).children.item(0).children.item(0).value = p.position;
      elem.children.item(3).children.item(0).children.item(0).checked = p.titular == 1;

      this.api.upRosterPlayer({
        id:r.id,
        player_id:p.id,
        number:p.number,
        position:p.position,
        titular:p.titular
      }).subscribe((data:any)=>{
        this.rosters = data;
        this.players_selected = [];
        for(let i of data)
        {
          if(i.player_id) this.players_selected.push(i.player_id);
        }
      });

    }else{
      // console.log(r.id,e.srcElement.value,type);
    }
  }

  /**/

  delete(id)
  {
    this.alertCtrl.create({message:"¿Desea borrar el elemento seleccionado?", buttons: [
    {
      text:"Si",
      handler:()=>{
        this.api.deleteTeam(id).subscribe(data=>{
          this.getTeams();
        });
      }
    },{
      text:"No"
    }
    ]}).then(a=>a.present());
  }

  delete2(id,t)
  {
    this.alertCtrl.create({message:"¿Desea borrar el elemento seleccionado?", buttons: [
    {
      text:"Si",
      handler:()=>{
        this.api.deleteRoster(id).subscribe(data=>{
          this.getRosters(t);
        });
      }
    },{
      text:"No"
    }
    ]}).then(a=>a.present());
  }

}
