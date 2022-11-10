import { Component, OnInit } from '@angular/core';
import { ModalController,LoadingController, AlertController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { EventsService } from '../../services/events.service';

declare var moment:any;

@Component({
  selector: 'app-players',
  templateUrl: './players.page.html',
  styleUrls: ['./players.page.scss'],
})
export class PlayersPage implements OnInit {

  selectedDoc = null;
  touchtime = 0;

  players;

  query;
  query1;
  equipo;

  user = JSON.parse(localStorage.getItem('AFECuser'));

  step = 1;

  player;

  player_image;
  player_name;
  player_number;
  player_position;
  player_age;
  player_weight;
  player_height;
  player_titular;
  player_notes;
  player_sex;
  player_bday;
  player_position_2;
  player_phone;
  player_email;
  player_side;

  report_type;
  report_name;
  report_date;
  // report_skills;
  // report_technical;
  report_psychological;
  report_tec_ind_off;
  report_tec_ind_def;
  report_tac_asp_off;
  report_tac_asp_def;
  report_condition;
  report_speed;
  report_conclusion;

  reports:any = [];

  teams:any = [];

  constructor(public modal: ModalController, public api: ApiService, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public events: EventsService) { }

  ngOnInit() {
    this.getAllPlayers();

    this.api.getTeams(this.user.id).subscribe((data:any)=>{
      this.teams = data;
    })
  }

  getAllPlayers()
  {
    this.api.getAllPlayers(this.user.id).subscribe(data=>{
      this.players = data;
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
              // this.modal.dismiss();
              this.touchtime = 0;
              this.step = 2;

              this.player = p;

              this.player_image = p.image;
              this.player_name = p.name;
              this.player_number = p.number;
              this.player_position = p.position;
              this.player_age = p.age;
              this.player_weight = p.weight;
              this.player_height = p.height;
              this.player_titular = p.titular;
              this.player_notes = p.notes;

              this.player_sex = p.sex;
              this.player_bday = p.bday;
              this.player_position_2 = p.position_2;
              this.player_phone = p.phone;
              this.player_email = p.email;
              this.player_side = p.side;

              this.api.getReports(p.id).subscribe(data=>{
                this.reports = data;
              })

              // localStorage.setItem('actualProject',JSON.stringify(p));
              // this.events.publish('loadProject');
          } else {
              // not a double click so set as a new first click
              this.touchtime = new Date().getTime();
          }
      }
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

  savePlayer()
  {
    this.player_age = moment().diff(this.player_bday,'years');

    this.loadingCtrl.create().then(a=>{

      a.present();
      this.api.upPlayer(
        {
          id:this.player.id,
          user_id:this.user.id,
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
        this.step = 1;

        let i = this.players.findIndex(x=>x.id == this.player.id);
        this.players[i] = data;
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

  saveReport()
  {
    this.loadingCtrl.create().then(a=>{

      // this.report_skills = (document.querySelector('[name="skills"]:checked') as any).value;
      // this.report_technical = (document.querySelector('[name="technical"]:checked') as any).value;

      this.report_psychological = (document.querySelector('[name="psychological"]:checked') as any).value;
      this.report_tec_ind_off = (document.querySelector('[name="tec_ind_off"]:checked') as any).value;
      this.report_tec_ind_def = (document.querySelector('[name="tec_ind_def"]:checked') as any).value;
      this.report_tac_asp_off = (document.querySelector('[name="tac_asp_off"]:checked') as any).value;
      this.report_tac_asp_def = (document.querySelector('[name="tac_asp_def"]:checked') as any).value;
      this.report_condition = (document.querySelector('[name="condition"]:checked') as any).value;
      // this.report_speed = (document.querySelector('[name="speed"]:checked') as any).value;


      a.present();
      this.api.saveReport(
        {
          player_id:this.player.id,
          type:this.report_type,
          name:this.report_name,
          date:this.report_date,
          psychological:this.report_psychological,
          tec_ind_off:this.report_tec_ind_off,
          tec_ind_def:this.report_tec_ind_def,
          tac_asp_off:this.report_tac_asp_off,
          tac_asp_def:this.report_tac_asp_def,
          condition:this.report_condition,
          // speed:this.report_speed,
          conclusion:this.report_conclusion,

        }).subscribe((data:any)=>{
        a.dismiss();
        this.reports = data;
        this.step = 3;
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

  delete(id)
  {
    this.alertCtrl.create({message:"¿Desea borrar el elemento seleccionado?", buttons: [
    {
      text:"Si",
      handler:()=>{
        this.api.deletePlayer(id).subscribe(data=>{
          this.getAllPlayers();
        });
      }
    },{
      text:"No"
    }
    ]}).then(a=>a.present());
  }

  pdfPlayer()
  {
    this.api.pdfPlayer(this.player.id).subscribe((data:any)=>{
      this.api.downloadFile(data.url)
    });
  }

  delete1(id)
  {
    this.alertCtrl.create({message:"¿Desea borrar el elemento seleccionado?", buttons: [
    {
      text:"Si",
      handler:()=>{
        this.api.deleteReport(id).subscribe(data=>{
          this.api.getReports(this.player.id).subscribe(data=>{
            this.reports = data;
          })
        });
      }
    },{
      text:"No"
    }
    ]}).then(a=>a.present());
  }

}
