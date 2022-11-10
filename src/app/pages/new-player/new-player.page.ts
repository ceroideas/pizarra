import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { EventsService } from '../../services/events.service';

declare var moment:any;

@Component({
  selector: 'app-new-player',
  templateUrl: './new-player.page.html',
  styleUrls: ['./new-player.page.scss'],
})
export class NewPlayerPage implements OnInit {

  terreno;

  step = 1;

  team = JSON.parse(localStorage.getItem('actualTeam'));
  project = JSON.parse(localStorage.getItem('actualProject'));

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
  player_bday;
  player_sex;
  player_weight;
  player_height;
  player_titular;
  player_position;
  player_position_2;

  player_phone;
  player_email;
  player_side;

  player_notes;

  selectTN;
  selectTM;
  selectTB;

  styles = this.project.styles['team'+localStorage.getItem('team_number')];
  colors = [ '#000000', '#ffffff', '#9e2956', '#c2281d', '#de722f', '#edbf4c', '#5db37e', '#459cde', '#4250ad', '#802fa3' ];

  name;

  query;

  players_selected = [];

  constructor(public api: ApiService, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public modal: ModalController, public events: EventsService) { }

  ngOnInit() {
  }

  selectToggle(i)
  {
    if (this[i]) {
      this[i] = false;
    }else{
      this[i] = true;
    }
  }

  prePlayers()
  {
    this.getPlayers();
  }
  preRosters()
  {
    this.rosters = [];
    this.getRosters(this.team.id);
  }

  getPlayers()
  {
  	this.api.getPlayers(this.team.id).subscribe((data:any)=>{
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

  addRoster(data)
  {
    data.team_id = this.team.id;
    this.api.upRoster(data).subscribe((data:any)=>{
      this.rosters = data;
    })
  }

  savePlayer()
  {
    this.player_age = moment().diff(this.player_bday,'years');

    this.loadingCtrl.create().then(a=>{

      a.present();
      this.api.upPlayer(
        {
          user_id:this.user.id,
          team_id:this.team.id,
          image:this.player_image,
          name:this.player_name,
          number:this.player_number,
          age:this.player_age,

          sex: this.player_sex,
          bday: this.player_bday,

          weight:this.player_weight,
          height:this.player_height,

          position:this.player_position,
          position_2:this.player_position_2,

          titular:this.player_titular,

          phone: this.player_phone,
          email: this.player_email,

          side: this.player_side,

          notes:this.player_notes

        }).subscribe((data:any)=>{
        a.dismiss();
        this.step = 3;
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

        this.player_sex = null;
        this.player_bday = null;
        this.player_position_2 = null;
        this.player_phone = null;
        this.player_email = null;
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
    let data = {
    	id:localStorage.getItem('project_id'),
        styles:this.styles,
        team:this.team.id,
        team_number:localStorage.getItem('team_number'),
      };

    console.log(data);
    //
    this.loadingCtrl.create().then(l=>{
      l.present()
      this.api.upProjectTeam(data).subscribe(data=>{
        l.dismiss();
        localStorage.setItem('actualProject',JSON.stringify(data));
        this.events.publish('loadProject');
        this.modal.dismiss();
      })
    })
    
  }

  updateRoster(r,e,type)
  {
    if (type == 'player') {
      let p = this.players.find(x=>x.id == e.srcElement.value);

      let elem = e.srcElement.parentNode.parentNode.parentNode;

      elem.children.item(3).children.item(0).children.item(0).value = p.number;
      elem.children.item(4).children.item(0).children.item(0).value = p.position;
      elem.children.item(5).children.item(0).children.item(0).value = p.position_2;

      this.api.upRosterPlayer({
        id:r.id,
        player_id:p.id,
        number:p.number,
        position:p.position,
        position_2:p.position_2,
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

}
