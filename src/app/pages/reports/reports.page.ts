import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  terreno;

  step = 1;

  user = JSON.parse(localStorage.getItem('AFECuser'));

  defensive_1;
  ofensive_1;
  strengths_1;
  weakness_1;
  other_1;

  defensive_2;
  ofensive_2;
  strengths_2;
  weakness_2;
  other_2;

  referee;
  conclusion;

  proyect = JSON.parse(localStorage.getItem('actualProject'));

  players = [];
  players_1 = [];
  players_2 = [];

  report;

  constructor(public api: ApiService, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public modal: ModalController, public events: EventsService) { }

  ngOnInit() {

    this.api.getMatchReport(this.proyect.id).subscribe((data:any)=>{

      this.report = data;
      if (data){
        this.defensive_1 = data.defensive_1;
        this.ofensive_1 = data.ofensive_1;
        this.strengths_1 = data.strengths_1;
        this.weakness_1 = data.weakness_1;
        this.other_1 = data.other_1;

        this.defensive_2 = data.defensive_2;
        this.ofensive_2 = data.ofensive_2;
        this.strengths_2 = data.strengths_2;
        this.weakness_2 = data.weakness_2;
        this.other_2 = data.other_2;

        this.referee = data.referee;
        this.conclusion = data.conclusion;
      }
    });


    let arr = Array.from(document.querySelectorAll('#drop-element .image-holder-draggable'));

    for (let i of arr) {
      let elem = (i.querySelector('.rotable') as any);
      if (typeof elem.dataset['player'] != 'undefined') {
        let j = JSON.parse(elem.dataset['player'])
        j.number = elem.dataset['number']
      this.players.push(j);
      }
    }

    this.players_1 = this.players.filter(x=>x.team_id == this.proyect.team1.id);
    this.players_2 = this.players.filter(x=>x.team_id == this.proyect.team2.id);

    console.log(this.players_1,this.players_2);
  }

  saveReport()
  {
    this.loadingCtrl.create().then(a=>{

      let players_1 = [];
      let players_2 = [];

      for (let i of this.players_1)
      {
        players_1.push({ id:i.id, value: (document.querySelector('[name="pl-'+i.id+'"]:checked') as any).value });
      }
      for (let i of this.players_2)
      {
        players_2.push({ id:i.id, value: (document.querySelector('[name="pl-'+i.id+'"]:checked') as any).value });
      }

      a.present();
      this.api.savePrReport(
        {
          proyect_id:this.proyect.id,
          defensive_1:this.defensive_1,
          ofensive_1:this.ofensive_1,
          strengths_1:this.strengths_1,
          weakness_1:this.weakness_1,
          other_1:this.other_1,

          defensive_2:this.defensive_2,
          ofensive_2:this.ofensive_2,
          strengths_2:this.strengths_2,
          weakness_2:this.weakness_2,
          other_2:this.other_2,

          referee:this.referee,
          conclusion:this.conclusion,

          players_1:players_1,
          players_2:players_2,

        }).subscribe((data:any)=>{
        a.dismiss();

        this.alertCtrl.create({message:"Reporte guardado!"}).then(a=>a.present());

        this.modal.dismiss();
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

  pdfReport()
  {
    this.api.pdfReport(this.proyect.id).subscribe((data:any)=>{
      this.api.downloadFile(data.url)
    })
  }

}
