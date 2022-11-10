import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, LoadingController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { EventsService } from '../../services/events.service';
import { CalendarOptions } from '@fullcalendar/angular';

declare var moment:any;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage implements OnInit {

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    dateClick: this.handleDateClick.bind(this), // bind is important!
    eventClick: this.handleEventClick.bind(this),
  };

  user = JSON.parse(localStorage.getItem('AFECuser'));

  data:any;

  constructor(public api: ApiService, public alert: AlertController, public modal: ModalController,
    public loadingCtrl: LoadingController, public events: EventsService) {

    this.api.getDates(this.user.id).subscribe((data:any)=>{
      let dates = [];

      this.data = data;

      for(let i of data[0]) {
        if (i.date && i.date != "") {
          dates.push({title: 'Sesion de entrenamiento: '+i.name, date: i.date, instanceId: i.id, type: 'training'});
        }
      }

      for(let i of data[1]) {
        if (i.date && i.date != "") {
          dates.push({title: 'Proyecto: '+i.name, date: i.date, instanceId: i.id, type: 'project'});
        }
      }

      for(let i of data[2]) {
        if (i.date && i.date != "") {
          dates.push({title: 'Reporte: '+i.name, date: i.date, instanceId: i.id, type: 'report'});
        }
      }

      this.calendarOptions.events = dates;
    });

  }

  ngOnInit() {
  }

  handleDateClick(arg) {
    // alert('date click! ' + arg.dateStr)
  }

  handleEventClick(arg) {
    console.log(arg.event.extendedProps,arg.event.title,arg.event.start);

    let buttons:any = [{text:"Aceptar"}];

    if (arg.event.extendedProps.type == 'training') {
      buttons = [{text:"Cerrar"},{text:"Abrir Sesión", handler:()=>{

        this.modal.dismiss();

        this.loadingCtrl.create().then(l=>{
          l.present();

          this.api.loadSessionScenes(arg.event.extendedProps.instanceId).subscribe((data:any)=>{

            l.dismiss();
            localStorage.setItem('session',JSON.stringify(data));
            localStorage.setItem('actualProject',JSON.stringify(data.pr[0].project));
            this.events.publish('loadProject');
          })
        })

      }}];

    }

    if (arg.event.extendedProps.type == 'project') {

      buttons = [{text:"Cerrar"},{text:"Abrir Partido", handler:()=>{

        this.modal.dismiss();

        localStorage.removeItem('session');

        this.loadingCtrl.create().then(l=>{
          l.present();

          let p = this.data[1].find(x=>x.id == arg.event.extendedProps.instanceId);

          this.api.loadScenes(p.id).subscribe(data=>{

            l.dismiss();
            
            p.scenes = data;

            localStorage.setItem('actualProject',JSON.stringify(p));
            this.events.publish('loadProject');

          });
        });

      }}];

    }

    this.alert.create({message:arg.event.title+', el día '+moment(arg.event.start).format('DD-MM-Y [a las] HH:mm'), buttons: buttons}).then(a=>a.present());
  }

}
