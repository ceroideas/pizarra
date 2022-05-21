import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.page.html',
  styleUrls: ['./teams.page.scss'],
})
export class TeamsPage implements OnInit {

  step = 3;

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

  goCreate()
  {
    if(!this.api.vPro)
    {
      if (this.teams.length >= 1) {
        return this.api.goPro();
      }
      this.step = 4;
    }else{
      this.step = 4;
    }
  }

  getTeams()
  {
    this.api.getTeams(this.user.id).subscribe((data:any)=>{
      this.teams = data;
    })
  }

  prePlayers()
  {
    this.getPlayers();
  }
  preRosters()
  {
    this.rosters = [];
    this.getRosters(this.team);
  }

  getPlayers()
  {
    this.api.getPlayers(this.team).subscribe((data:any)=>{
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
      console.log(this.players_selected,data,this.players)
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

  // prePlayers()
  // {
  //   this.getPlayers();
  // }
  // preRosters()
  // {
  //   this.rosters = [];
  //   this.getRosters(this.team);
  // }

  selectTeam()
  {
    this['team'+this.selectedTeam] = this.teams[this.team];
    this.step = 2;
  }

  addRoster(data)
  {
    data.team_id = this.team;
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
          team_id:this.team,
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
        console.log(this.players_selected,data,this.players)
      });

    }else{
      let p = this.players.find(x=>x.id == r.player_id);
      p.number = (document.querySelector('.numbers[data-id="'+r.id+'"]') as any).value ;
      p.position = (document.querySelector('.positions[data-id="'+r.id+'"]') as any).value;
      p.titular = (document.querySelector('.positions[data-id="'+r.id+'"]') as any).checked;

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
        console.log(this.players_selected,data,this.players)
      });
    }
  }

  update_team_name
  update_team_image

  edit()
  {
    this.update_team_name = this.teams.find(x=>x.id ==this.team).name;
    this.update_team_image = this.teams.find(x=>x.id ==this.team).image;
  }

  updateTeam()
  {
    this.loadingCtrl.create().then(a=>{

      a.present();
      this.api.updateTeam({id:this.team, user_id:this.user.id,name:this.update_team_name,image:this.update_team_image}).subscribe((data:any)=>{
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
