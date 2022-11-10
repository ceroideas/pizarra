import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ModalController, AlertController, ActionSheetController, LoadingController, NavController, ToastController, Platform } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { InformationPage } from '../pages/information/information.page';
import { NewProjectPage } from '../pages/new-project/new-project.page';
import { NewExercisePage } from '../pages/new-exercise/new-exercise.page';
import { NewPlayerPage } from '../pages/new-player/new-player.page';
import { NewSessionPage } from '../pages/new-session/new-session.page';
import { OpenProjectPage } from '../pages/open-project/open-project.page';
import { OpenExercisePage } from '../pages/open-exercise/open-exercise.page';
import { EditProyectPage } from '../pages/edit-proyect/edit-proyect.page';
import { TerrainPage } from '../pages/terrain/terrain.page';
import { TeamsPage } from '../pages/teams/teams.page';
import { PlayersPage } from '../pages/players/players.page';

import { PrEventsPage } from '../pages/pr-events/pr-events.page';
import { ReportsPage } from '../pages/reports/reports.page';
import { CalendarPage } from '../pages/calendar/calendar.page';

import { EventsService } from '../services/events.service';
import { ApiService } from '../services/api.service';
import { Html2canvasService } from '../services/html2canvas.service';

const interact = require('interactjs')

declare var RecordRTC:any;

declare var $:any;
declare var window:any;

// declare var html2canvas;

import domtoimage from 'dom-to-image-improved';

const worker = new Worker('assets/ffmpeg-worker-mp4.js');

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
  providers: [Html2canvasService]
})
export class FolderPage implements OnInit {
  // public folder: string;
  @ViewChild('campo', { static: false }) campo: ElementRef;
  @ViewChild('imageCanvas', { static: false }) canvas: any;
  @ViewChild('elementtocopy', { static: false }) mainDiv: ElementRef;

  user = JSON.parse(localStorage.getItem('AFECuser'));

  capturing = false;

  expanded = null;
  expanded1 = null;

  canvasElement: any;
  auxCanvasElement:any;
  ctx:any;
  auxCtx:any;

  saveX: number;
  saveY: number;

  selectedColor = '#000000';
  colors = [ '#000000', '#ffffff', '#9e2956', '#c2281d', '#de722f', '#edbf4c', '#5db37e', '#459cde', '#4250ad', '#802fa3' ];

  drawing = false;
  lineWidth = 5;

  h;
  w;

  selector = 'pen';

  dashed:any = "[]";

  selectColor = false;

  addArrow = false;

  makeCurve = false;

  curveX: number;
  curveY: number;

  isCanvas = false;
  isAnim = false;
  isEdit = false;
  isRoster = false;
  isMainMenu = true;

  selectColorText = false;
  actualTextId;

  roster = [];

  terrain = localStorage.getItem('terrain') || 1;

  project = JSON.parse(localStorage.getItem('actualProject'));

  styles;

  preImage;

  scene = 0;

  to = 500;

  realizeAction = 'move';

  showSession = false;

  articles = [
  {image:'/assets/assets/icono-balon-baloncesto.svg', class: 'w25'},
  {image:'/assets/assets/icono-balon-futbol.svg', class: 'w25'},
  {image:'/assets/assets/icono-balon-rugbi.svg', class: 'w25'},
  {image:'/assets/assets/icono-balon-tenis.svg', class: 'w25'},
  {image:'/assets/assets/icono-banderin-01.svg', class: 'w60'},
  {image:'/assets/assets/icono-banderin-02.svg', class: 'w60'},
  {image:'/assets/assets/icono-cama-elastica-01.svg', class: ''},
  {image:'/assets/assets/icono-cama-elastica-02.svg', class: 'w80'},
  {image:'/assets/assets/icono-cono-grande.svg', class: 'w30'},
  {image:'/assets/assets/icono-cono-mini.svg', class: 'w40'},
  {image:'/assets/assets/icono-escalera-horizontal.svg', class: 'w80'},
  {image:'/assets/assets/icono-escalera-vertical.svg', class: 'w80'},
  {image:'/assets/assets/icono-maniqui.svg', class: 'w90'},
  {image:'/assets/assets/icono-porteria-01.svg', class: 'w110'},
  {image:'/assets/assets/icono-porteria-02.svg', class: 'w110'},
  {image:'/assets/assets/icono-porteria-03.svg', class: 'w110'},
  {image:'/assets/assets/icono-porteria-04.svg', class: 'w110'},
  {image:'/assets/assets/icono-porteria-05.svg', class: 'w110'},
  {image:'/assets/assets/icono-porteria-06.svg', class: 'w110'},
  {image:'/assets/assets/icono-porteria-09.svg', class: 'w110'},
  {image:'/assets/assets/icono-porteria-10.svg', class: 'w110'},
  ];

  module = 1;

  brush = 7;

  img;

  exercises = [];

  bg;
  session = localStorage.getItem('session') ? JSON.parse(localStorage.getItem('session')) : null;

  dpr = window.devicePixelRatio;

  constructor(public html2canvas: Html2canvasService, public api: ApiService, private loading: LoadingController, public platform: Platform,
    private toastCtrl: ToastController,
    private activatedRoute: ActivatedRoute,
    public modal: ModalController, public alert: AlertController, public action: ActionSheetController, public events: EventsService, public nav: NavController) {

    this.bg = new Image();
    this.bg.src = 'assets/cesped.jpg';

    // setInterval(()=>{
    //   console.log('autosaving');
    //   this.saveProject(true, false, null, null, null, false);
    // },1000*120);


    this.events.destroy('changeTerrain');
    this.events.subscribe('changeTerrain',()=>{
      this.terrain = localStorage.getItem('terrain');
    });

    this.events.destroy('loadProject');
    this.events.subscribe('loadProject',()=>{
      this.project = JSON.parse(localStorage.getItem('actualProject'));
      this.terrain = this.project.terrain;

      document.getElementById('drop-element').innerHTML = this.project.scenes[0].schene;
      this.preImage = this.project.scenes[0].image;

      this.loadRest();

      this.scene = 0;

      this.exercises = [];

      let ex = localStorage.getItem('session');

      if (ex) {
        this.session = JSON.parse(localStorage.getItem('session'));
        for (let i of JSON.parse(ex).pr){
          this.exercises.push(i.project);
        }
      }

      console.log(this.exercises);
    });

    let ex = localStorage.getItem('session');

    if (ex) {
      for (let i of JSON.parse(ex).pr){
        this.exercises.push(i.project);
      }
    }

    this.session = JSON.parse(localStorage.getItem('session'));

    console.log(this.session);
  }

  async editProject(project)
  {
    const modal = await this.modal.create({
      component: EditProyectPage,
      componentProps: {project: project},
      cssClass: 'modalAF'
    })

    modal.present();
  }

  recorder;

  recordScreen() {

    return new Promise(async resolve=>{

      var displayMediaOptions:any = {
        video: {
          cursor: "none"
        },
        audio: false
      };

      // @ts-ignore
      return await navigator.mediaDevices.getDisplayMedia(displayMediaOptions).then(async (stream) => {

          this.recorder = RecordRTC(stream, {
              type: 'video',
              mimeType: 'video/mp4',
              disableLogs: true,

          });
          this.recorder.startRecording();

          resolve(true);
      });

    })
  }

  logout()
  {
    this.alert.create({message:"¿Desea cerrar la sesión?", buttons: [

    {
      text:"Si",
      handler:()=>{
        localStorage.clear();
        this.nav.navigateRoot('splash');
      }
    },{
      text:"No"
    }
    ]}).then(a=>a.present());
  }

  selectSchene(i,save = false,animate = false)
  {
    if (save) {
      this.saveProject(true, false, this.scene, null, null, false);
    }
    this.to = 1;
    this.scene = i;

    document.getElementById('drop-element').innerHTML = this.project.scenes[i].schene;
    this.preImage = this.project.scenes[i].image;

    if (animate) {
      for (let h in this.project.scenes[i-1].elements) {
        let e = document.getElementById(this.project.scenes[i-1].elements[h].element_id);
        let style = this.project.scenes[i-1].elements[h].styles;
        let classRotate = this.project.scenes[i-1].elements[h].classR;

        let classes:any = Array.from(e.classList);
        let indexes = classes.map((elm, idx) => elm.indexOf('rotate') != -1 ? elm : '').filter(String);
        for (let x in indexes) {
          e.classList.remove(indexes[x]);
        }
        e.classList.add(classRotate);

        e.style.transform = style;
        e.style.transition = 'all '+this.sceneInterval+'ms linear';
      }

      let elem = Array.from(document.getElementsByClassName('rotable'));

      console.log(elem)

      for (let e in elem) {
        (elem[e] as HTMLElement).style.transition = 'all '+this.sceneInterval+'ms linear';
      }

      setTimeout(()=>{
        for (let h in this.project.scenes[i].elements) {
          let e = document.getElementById(this.project.scenes[i].elements[h].element_id);
          let style = this.project.scenes[i].elements[h].styles;

          let classRotate = this.project.scenes[i].elements[h].classR;

          let classes:any = Array.from(e.classList);
          let indexes = classes.map((elm, idx) => elm.indexOf('rotate') != -1 ? elm : '').filter(String);
          for (let x in indexes) {
            e.classList.remove(indexes[x]);
          }
          e.classList.add(classRotate);

          e.style.transform = style;
          // e.style.transition = 'unset';
        }
      },5)
    }else{
      for (let h in this.project.scenes[i].elements) {
        let e = document.getElementById(this.project.scenes[i].elements[h].element_id);
        e.style.transition = 'all 0ms linear';
      }
    }

    this.loadRest();
  }

  addFrame()
  {
    this.saveProject(true, true, null, null, null, false);
  }

  saveProject(prompt = false, frame = false, i = null, returnToPlay = null, record = null,toast = true)
  {
    setTimeout(()=>{

      const b64toBlob = (b64Data, contentType='', sliceSize=512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);

          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, {type: contentType});
        return blob;
      }

      //

      if (prompt) {

        this.capturing = true;
        
        let contentType = "image/png";
        let base64 = this.canvasElement.toDataURL("image/png");
        let b64Data = base64.split(",")[1];

        const blob = b64toBlob(b64Data, contentType);
        const blobUrl = URL.createObjectURL(blob);

        let formData = new FormData();

        formData.append("id", this.project.id);
        formData.append("user_id", this.user.id);
        formData.append("file", blob);
        formData.append("order", this.project.scenes[this.scene].id);
        formData.append("frame", frame ? 'si' : 'no');
        formData.append("html", document.getElementById('drop-element').innerHTML);

        let elems = [];

        let arr = Array.from(document.getElementsByClassName('image-holder-draggable'));
        for (let h in arr) {
          let style = (arr[h] as HTMLImageElement).style.transform;
          let id = (arr[h] as HTMLImageElement).id;
          let classR = Array.from((arr[h] as HTMLImageElement).classList).find((x:any)=>x.indexOf('rotate') != -1);
          elems.push({style:style,id:id,classR:classR});
        }

        var node = document.getElementById('element-to-copy');

        formData.append("elements", JSON.stringify(elems));

        if (returnToPlay) {
          this.loading.create({message:"Sincronizando medios"}).then(l=>l.present());
        }


        domtoimage.toBlob(node)
        .then((blob) => {
            formData.append("pdf", blob);

            this.api.upScene(formData).subscribe(data=>{
              this.capturing = false;
              if (toast) {this.presentToast("Se ha guardado la escena correctamente!");}
              // console.log(data);
              localStorage.setItem('actualProject',JSON.stringify(data));
              this.project = data;

              if (this.exercises.length) {

                let id = this.project.id;

                let idx = this.exercises.findIndex(x=>x.id == id);

                console.log(this.exercises[idx],this.project);

                this.exercises[idx] = this.project;

                // console.log(this.exercises);

                for (let i in this.exercises)
                {
                  this.session.pr[i].project = this.exercises[i];
                }

                localStorage.setItem('session',JSON.stringify(this.session));

              }

              if (frame) {
                this.scene = this.project.scenes.length -1;
                this.selectSchene(this.scene);
              }

              if (returnToPlay == 'play') {
                this.loading.dismiss();
                this.play(record);
              }

              if (returnToPlay == 'proyect') {
                this.loading.dismiss();
                this.pdfProyect();
              }

              if (returnToPlay == 'exercise') {
                this.loading.dismiss();
                this.pdfExercise();
              }

            },err=>{
              this.capturing = false;
            })
        });

    }else{
      //
      this.alert.create({message:"Desea guardar el ejercicio?", buttons: [
      {
        text:"Si, guardar",
        handler: ()=>{
          this.loading.create().then(l=>{
            l.present();

            let contentType = "image/png";
            let base64 = this.canvasElement.toDataURL("image/png");
            let b64Data = base64.split(",")[1];

            const blob = b64toBlob(b64Data, contentType);
            const blobUrl = URL.createObjectURL(blob);

            let formData = new FormData();

            formData.append("id", this.project.id);
            formData.append("user_id", this.user.id);
            formData.append("file", blob);
            formData.append("order", this.project.scenes[this.scene].id);
            formData.append("frame", frame ? 'si' : 'no');
            formData.append("html", document.getElementById('drop-element').innerHTML);

            let elems = [];

            let arr = Array.from(document.getElementsByClassName('image-holder-draggable'));
            for (let h in arr) {
              let style = (arr[h] as HTMLImageElement).style.transform;
              let id = (arr[h] as HTMLImageElement).id;
              elems.push({style:style,id:id});
            }

            // return console.log(elems);

            formData.append("elements", JSON.stringify(elems));

            this.api.upScene(formData).subscribe(data=>{
              if (toast) {this.presentToast("Se ha guardado la escena correctamente!");}
              // console.log(data);
              localStorage.setItem('actualProject',JSON.stringify(data));
              this.project = data;

              if (frame) {
                this.scene = this.project.scenes.length -1;
                this.selectSchene(this.scene);
              }

              if (returnToPlay) {
                this.play();
              }

              l.dismiss();
            })

          })
        }
      },{
        text:"Cancelar"
      }
      ]}).then(a=>{
        a.present();
      })
      //
    }
    },500)

  }

  selectExercise(o)
  {
    if (this.project.id == o.id) {
      return false;
    }
    localStorage.setItem('actualProject',JSON.stringify(o));
    this.events.publish('loadProject');
  }

  clone(e)
  {
    // Get the last <li> element ("Milk") of <ul> with id="myList2"
    var itm = e.srcElement;
    // var itm = e.srcElement.parentNode;
    // console.log(itm);
    
    // Copy the <li> element and its child nodes
    var cln = itm.cloneNode(true);
    cln.classList.add("image-holder-draggable");
    cln.style.height = itm.dataset['height'];
    cln.style.width = "auto";
    cln.style.bottom = "100px";
    cln.style.left = "calc(50% - 25px)";
    cln.id = "element"+(new Date().getTime());
    cln.style.position = "absolute";

    var touchtime = 0;

    let _this = this;

    cln.addEventListener('click',function(a){
      //
      if (touchtime == 0) {
          // set first click
          touchtime = new Date().getTime();
      } else {
          // compare first click to this click and see if they occurred within double click threshold
          if (((new Date().getTime()) - touchtime) < 800) {
              // double click occurred
              let acButtons = [];
              if (_this.realizeAction == 'rotate') {
                acButtons = [
                    {text:"Borrar",icon:"trash",handler:()=>{
                      this.remove();
                    }},
                    {text:"Mover elementos",icon:"move-outline",handler:()=>{
                      _this.realizeAction = 'move';
                      _this.startToDrag();
                    }},]

                    if (this.classList.contains('increment')) {
                      acButtons.push({text:"Aumentar tamaño",icon:"caret-up-outline",handler:()=>{
                        let w = this.children[0].style.width;
                        w = parseInt(w)+5;
                        console.log(w);
                        this.children[0].style.width = w+'px';
                        return false;
                      }},
                      {text:"Disminuir tamaño",icon:"caret-down-outline",handler:()=>{
                        let w = this.children[0].style.width;
                        w = parseInt(w)-5;
                        if (w <= 0) {
                          return false;
                        }
                        this.children[0].style.width = w+'px';
                        return false;
                      }});
                    }

                    acButtons.push({text:"Cancelar",});
                  ;
              }else{
                acButtons = [
                    {text:"Borrar",icon:"trash",handler:()=>{
                      this.remove();
                    }},
                    {text:"Rotar elementos",icon:"refresh-outline",handler:()=>{
                      _this.realizeAction = 'rotate';
                      _this.startToDrag();
                    }}];

                    if (this.classList.contains('increment')) {
                      acButtons.push({text:"Aumentar tamaño",icon:"caret-up-outline",handler:()=>{
                        let w = this.children[0].style.width;
                        w = parseInt(w)+5;
                        console.log(w);
                        this.children[0].style.width = w+'px';
                        return false;
                      }},
                      {text:"Disminuir tamaño",icon:"caret-down-outline",handler:()=>{
                        let w = this.children[0].style.width;
                        w = parseInt(w)-5;
                        if (w <= 0) {
                          return false;
                        }
                        this.children[0].style.width = w+'px';
                        return false;
                      }});
                    }

                    acButtons.push({text:"Cancelar",});
              }
              _this.action.create({header:"Elemento seleccionado",buttons:acButtons}).then(a=>a.present());
              console.log(this)
              touchtime = 0;
          } else {
              // not a double click so set as a new first click
              touchtime = new Date().getTime();
          }
      }
    })

    if ($(cln).find('.team-color.number').length) {
      $(cln).find('span').remove();
      let player = $(cln).find('.team-color.number').data('player');
      let elem = '<span style="font-size: 10px; top: -6px; position: relative;">'+player.name+'</span>';
      $(cln).append(elem);
    }

    // Append the cloned <li> element to <ul> with id="myList1"
    document.getElementById("drop-element").appendChild(cln);

  }

  ngOnInit() {

    if (this.project) {
      this.project = JSON.parse(localStorage.getItem('actualProject'));
      this.terrain = this.project.terrain;

      document.getElementById('drop-element').innerHTML = this.project.scenes[0].schene;
      this.preImage = this.project.scenes[0].image;

      // this.loadRest();
    }
    this.startToDrag();
  }

  // canvas

  img_update () {
    this.ctx.drawImage(this.auxCanvasElement, 0, 0);
    this.auxCtx.clearRect(0, 0, this.auxCanvasElement.width, this.auxCanvasElement.height);
    this.makeCurve = false;
  }

  getCurrent(ev)
  {
    let currentX;
    let currentY;

    var canvasPosition = this.auxCanvasElement.getBoundingClientRect();

    if(ev.type == 'touchstart' || ev.type == 'touchmove' || ev.type == 'touchend' || ev.type == 'touchcancel'){
      var evt = (typeof ev.originalEvent === 'undefined') ? ev : ev.originalEvent;
      var touch = evt.touches[0] || evt.changedTouches[0];
      currentX = touch.pageX - canvasPosition.x;
      currentY = touch.pageY - canvasPosition.y;
    } else if (ev.type == 'mousedown' || ev.type == 'mouseup' || ev.type == 'mousemove' || ev.type == 'mouseover'|| ev.type=='mouseout' || ev.type=='mouseenter' || ev.type=='mouseleave') {
      currentX = ev.pageX - canvasPosition.x;
      currentY = ev.pageY - canvasPosition.y;
    }

    return [currentX,currentY];
  }

  moved(ev) {
    if (!this.drawing) return;

    let currentX = this.getCurrent(ev)[0];
    let currentY = this.getCurrent(ev)[1];

    this.auxCtx.lineJoin = 'round';
    this.auxCtx.strokeStyle = this.selectedColor;
    this.auxCtx.lineWidth = this.lineWidth;

    this.ctx.globalCompositeOperation = 'source-over';


    if (this.selector == 'pen') {

      this.ctx.lineJoin = 'round';
      this.ctx.strokeStyle = this.selectedColor;
      this.ctx.lineWidth = this.lineWidth;

      this.ctx.beginPath();
      this.ctx.moveTo(this.saveX, this.saveY);
      this.ctx.lineTo(currentX, currentY);
      this.ctx.closePath();
      this.ctx.stroke();
     

      this.saveX = currentX;
      this.saveY = currentY;

    }else if (this.selector == 'zigzag') {

      this.auxCtx.clearRect(0, 0, this.auxCanvasElement.width, this.auxCanvasElement.height);

      let lines = 12;

      var a = (this.saveX - currentX);
      var b = (this.saveY - currentY);

      let d = Math.sqrt( a*a + b*b );

      let zigs = d/lines;

      this.auxCtx.beginPath();

      this.auxCtx.moveTo(this.saveX, this.saveY);

      for (let i = 0; i < 12; i++) {
        
        let _x =  (this.saveX) + ((i+1) * zigs);
        let _y;

        if (i % 2 == 0) {
          _y = (this.saveY) + 20;
        }
        else {
          _y = this.saveY;
        }

        this.auxCtx.lineTo(_x, _y);
      }

      // if (this.addArrow) {
      //   var headlen = 10+this.lineWidth;
      //   var dx = currentX - this.saveX;
      //   var dy = currentY - this.saveY;
      //   var angle = Math.atan2(dy, dx);
      //   this.auxCtx.lineTo(currentX - headlen * Math.cos(angle - Math.PI / 6), currentY - headlen * Math.sin(angle - Math.PI / 6));
      //   this.auxCtx.moveTo(currentX, currentY);
      //   this.auxCtx.lineTo(currentX - headlen * Math.cos(angle + Math.PI / 6), currentY - headlen * Math.sin(angle + Math.PI / 6));
      // }


      this.auxCtx.stroke();
      this.auxCtx.closePath();

    }else if (this.selector == 'line') {

      this.auxCtx.clearRect(0, 0, this.auxCanvasElement.width, this.auxCanvasElement.height);

      this.auxCtx.beginPath();

      this.auxCtx.moveTo(this.saveX, this.saveY);
      this.auxCtx.lineTo(currentX, currentY);

      if (this.addArrow) {
        var headlen = 10+this.lineWidth;
        var dx = currentX - this.saveX;
        var dy = currentY - this.saveY;
        var angle = Math.atan2(dy, dx);
        this.auxCtx.lineTo(currentX - headlen * Math.cos(angle - Math.PI / 6), currentY - headlen * Math.sin(angle - Math.PI / 6));
        this.auxCtx.moveTo(currentX, currentY);
        this.auxCtx.lineTo(currentX - headlen * Math.cos(angle + Math.PI / 6), currentY - headlen * Math.sin(angle + Math.PI / 6));
      }

      this.auxCtx.stroke();
      this.auxCtx.closePath();
    }else if (this.selector == 'double') {

      this.auxCtx.lineWidth = this.lineWidth/2;

      this.auxCtx.clearRect(0, 0, this.auxCanvasElement.width, this.auxCanvasElement.height);

      this.auxCtx.beginPath();

      this.auxCtx.moveTo(this.saveX, this.saveY);
      this.auxCtx.lineTo(currentX, currentY);

      var L = Math.sqrt((this.saveX-currentX)*(this.saveX-currentX)+(this.saveY-currentY)*(this.saveY-currentY));

      var offsetPixels = this.lineWidth/1.5;

      var x1p = this.saveX + offsetPixels * (currentY-this.saveY) / L;
      var x2p = currentX + offsetPixels * (currentY-this.saveY) / L;
      var y1p = this.saveY + offsetPixels * (this.saveX-currentX) / L;
      var y2p = currentY + offsetPixels * (this.saveX-currentX) / L;

      this.auxCtx.moveTo(x1p,y1p) // I don't remember if this is the way
      this.auxCtx.lineTo(x2p,y2p) // to draw a line in GDI+ but you get the idea
      
      if (this.addArrow) {
        var headlen = 10+this.lineWidth;
        var dx = x2p - x1p;
        var dy = y2p - y1p;
        var angle = Math.atan2(dy, dx);
        this.auxCtx.moveTo(currentX, currentY);
        this.auxCtx.lineTo(currentX - headlen * Math.cos(angle - Math.PI / 6), currentY - headlen * Math.sin(angle - Math.PI / 6));
        this.auxCtx.moveTo(x2p, y2p);
        this.auxCtx.lineTo(x2p - headlen * Math.cos(angle + Math.PI / 6), y2p - headlen * Math.sin(angle + Math.PI / 6));
      }

      this.auxCtx.stroke();
      this.auxCtx.closePath();
    }else if(this.selector == 'square'){
      //
      let x = Math.min(currentX,  this.saveX),
      y = Math.min(currentY,  this.saveY),
      w = Math.abs(currentX - this.saveX),
      h = Math.abs(currentY - this.saveY);

      this.auxCtx.clearRect(0, 0, this.auxCanvasElement.width, this.auxCanvasElement.height);

      if (!w || !h) {
        return;
      }

      this.auxCtx.strokeRect(x, y, w, h);
    }else if(this.selector == 'circle'){

      this.auxCtx.clearRect(0, 0, this.auxCanvasElement.width, this.auxCanvasElement.height);

      var a = (this.saveX - Math.abs(this.getCurrent(ev)[0]));
      var b = (this.saveY - Math.abs(this.getCurrent(ev)[1]));

      let radius = Math.sqrt( a*a + b*b );

      this.auxCtx.beginPath();
      this.auxCtx.arc(
        this.saveX,
        this.saveY,
        radius,
        0,
        Math.PI*2
      );

      this.auxCtx.stroke();
      this.auxCtx.closePath();
    }else if(this.selector == 'curve') {

      this.auxCtx.clearRect(0, 0, this.auxCanvasElement.width, this.auxCanvasElement.height);

      if (this.makeCurve) {


        this.auxCtx.beginPath();
        
        this.auxCtx.moveTo(this.saveX, this.saveY);

        this.auxCtx.quadraticCurveTo(currentX, currentY, this.curveX, this.curveY);


        if (this.addArrow) {
          var headlen = 10+this.lineWidth;
          var dx = this.curveX - this.saveX;
          var dy = this.curveY - this.saveY;
          var angle = Math.atan2(dy, dx);
          this.auxCtx.lineTo(this.curveX - headlen * Math.cos(angle - Math.PI / 6), this.curveY - headlen * Math.sin(angle - Math.PI / 6));
          this.auxCtx.moveTo(this.curveX, this.curveY);
          this.auxCtx.lineTo(this.curveX - headlen * Math.cos(angle + Math.PI / 6), this.curveY - headlen * Math.sin(angle + Math.PI / 6));
        }
        // this.auxCtx.lineTo(currentX, currentY);

        this.auxCtx.stroke();
        this.auxCtx.closePath();


      }else{

        /**/

        this.auxCtx.beginPath();
        
        this.auxCtx.moveTo(this.saveX, this.saveY);

        this.auxCtx.lineTo(currentX, currentY);

        if (this.addArrow) {
          var headlen = 10+this.lineWidth;
          var dx = currentX - this.saveX;
          var dy = currentY - this.saveY;
          var angle = Math.atan2(dy, dx);
          this.auxCtx.lineTo(currentX - headlen * Math.cos(angle - Math.PI / 6), currentY - headlen * Math.sin(angle - Math.PI / 6));
          this.auxCtx.moveTo(currentX, currentY);
          this.auxCtx.lineTo(currentX - headlen * Math.cos(angle + Math.PI / 6), currentY - headlen * Math.sin(angle + Math.PI / 6));
        }

        this.auxCtx.stroke();
        this.auxCtx.closePath();
      }

    }else if(this.selector == 'eraser') {
      this.ctx.globalCompositeOperation = 'destination-out';

      this.ctx.lineJoin = 'round';
      this.ctx.lineWidth = this.lineWidth*2;

      this.ctx.beginPath();
      this.ctx.moveTo(this.saveX, this.saveY);
      this.ctx.lineTo(currentX, currentY);
      this.ctx.closePath();
      this.ctx.stroke();

      this.saveX = currentX;
      this.saveY = currentY;
    }
  }

  addText()
  {
    this.alert.create({message:"Escriba el texto que desea agregar",
    inputs: [
    {
      type: 'text',
      name: 'text'
    }
    ],
    buttons: [
    {
      text:"Aceptar",
      handler: (a) =>{
        var cln = document.createElement('div');
        var dv1 = document.createElement('div');
        var dv2 = document.createElement('div');
        var txt = document.createTextNode(a.text);

        dv1.classList.add("rotable");

        dv2.style.transform = 'scale(1)';

        cln.classList.add("image-holder-draggable");
        cln.style.height = "auto";
        cln.style.width = "auto";
        cln.style.bottom = "0";
        cln.style.left = "0";
        cln.id = "element"+(new Date().getTime());
        cln.style.position = "absolute";

        dv2.appendChild(txt);
        dv1.appendChild(dv2);
        cln.appendChild(dv1);

        var touchtime = 0;

        let _this = this;

        cln.addEventListener('click',function(a){
          //
          if (touchtime == 0) {
              // set first click
              touchtime = new Date().getTime();
          } else {
              // compare first click to this click and see if they occurred within double click threshold
              if (((new Date().getTime()) - touchtime) < 800) {
                  // double click occurred
                  let acButtons = [];
                  if (_this.realizeAction == 'rotate') {
                    acButtons = [
                        {text:"Borrar",icon:"trash",handler:()=>{
                          this.remove();
                        }},
                        {text:"Mover elementos",icon:"move-outline",handler:()=>{
                          _this.realizeAction = 'move';
                          _this.startToDrag();
                        }},]

                        // if (this.classList.contains('increment')) {
                          acButtons.push({text:"Aumentar tamaño",icon:"caret-up-outline",handler:()=>{
                            let w = (this.children[0].children[0] as any).style.transform.replace(/[^\d.-]/g,'');
                            console.log(w);
                            w = parseInt(w)+.1;
                            console.log(w);
                            (this.children[0].children[0] as any).style.transform = 'scale('+w+')';
                            return false;
                          }},
                          {text:"Disminuir tamaño",icon:"caret-down-outline",handler:()=>{
                            let w = (this.children[0].children[0] as any).style.transform.replace(/[^\d.-]/g,'');
                            console.log(w);
                            w = parseInt(w)-.1;
                            if (w <= 0) {
                              return false;
                            }
                            (this.children[0].children[0] as any).style.transform = 'scale('+w+')';
                            return false;
                          }},{
                            text:"Cambiar color", icon: "color-palette",handler:()=>{
                              _this.actualTextId = this['id'];
                              _this.selectColorText = true;
                            }
                          });
                        // }

                        acButtons.push({text:"Cancelar",});
                      ;
                  }else{
                    acButtons = [
                        {text:"Borrar",icon:"trash",handler:()=>{
                          this.remove();
                        }},
                        {text:"Rotar elementos",icon:"refresh-outline",handler:()=>{
                          _this.realizeAction = 'rotate';
                          _this.startToDrag();
                        }}];

                        // if (this.classList.contains('increment')) {
                          acButtons.push({text:"Aumentar tamaño",icon:"caret-up-outline",handler:()=>{
                            let w = (this.children[0].children[0] as any).style.transform.replace(/[^\d.-]/g,'');
                            console.log(w);
                            w = parseFloat(w)+.1;
                            console.log(w);
                            (this.children[0].children[0] as any).style.transform = 'scale('+w+')';
                            return false;
                          }},
                          {text:"Disminuir tamaño",icon:"caret-down-outline",handler:()=>{
                            let w = (this.children[0].children[0] as any).style.transform.replace(/[^\d.-]/g,'');
                            console.log(w);
                            w = parseFloat(w)-.1;
                            if (w <= 0) {
                              return false;
                            }
                            (this.children[0].children[0] as any).style.transform = 'scale('+w+')';
                            return false;
                          }},{
                            text:"Cambiar color", icon: "color-palette",handler:()=>{
                              _this.actualTextId = this['id'];
                              _this.selectColorText = true;
                            }
                          });
                        // }

                        acButtons.push({text:"Cancelar",});
                  }
                  _this.action.create({header:"Elemento seleccionado",buttons:acButtons}).then(a=>a.present());
                  console.log(this)
                  touchtime = 0;
              } else {
                  // not a double click so set as a new first click
                  touchtime = new Date().getTime();
              }
          }
        })

        // Append the cloned <li> element to <ul> with id="myList1"
        document.getElementById("drop-element").appendChild(cln);
      }
    },{
      text:"Cancelar"
    }]}).then(a=>a.present())
  }

  applyColorText(c)
  {
    var elem = document.getElementById(this.actualTextId) as any;

    elem.children[0].children[0].style.color = c;
  }

  clearCanvas()
  {
    this.alert.create({message:"Desea borrar toda la tinta?", buttons: [
    {
      text:"Si",
      handler: () =>{
        this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
      }
    },{
      text:"No"
    }]}).then(a=>a.present())
  }

  startDrawing(ev) {

    if (!this.isCanvas) {
      return false;
    }
    this.drawing = true;

    if ((this.selector == 'curve' && this.makeCurve == false) || this.selector != 'curve') {
      this.saveX = this.getCurrent(ev)[0];
      this.saveY = this.getCurrent(ev)[1];
    }
  }
 
  endDrawing(ev) {
    this.drawing = false;

    if (this.selector == 'curve' && this.makeCurve == false) {
      this.curveX = this.getCurrent(ev)[0];
      this.curveY = this.getCurrent(ev)[1];
      this.makeCurve = true;
    }else if(this.selector == 'curve' && this.makeCurve == true){
      this.img_update();
    }else{
      this.img_update();
    }
    // if (this.selector == 'square') {
    //   this.img_update();
    // }else if(this.selector == 'line'){
    //   this.img_update();
    // }else if(this.selector == 'circle'){
    // }
  }
 
  // selectColor(color) {
  //   this.selectedColor = color;
  // }

  setDash(option) {
    this.dashed = JSON.stringify(option);
    this.auxCtx.setLineDash(option);
    this.ctx.setLineDash(option);
  }

  // canvas

  prevClass = null;

  startToDrag()
  {
    let esto = this;

    interact('.image-holder-draggable').unset();
    // interact('.image-holder-draggable').draggable(false);

    interact('.image-holder-draggable')

    .draggable({
      restrict: {
        restriction: "#drop-element",
        endOnly: true,
        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
      },
      onmove: function (event) {

        if (esto.realizeAction == 'rotate') {

          let box = event.target;
          let boxBoundingRect = box.getBoundingClientRect();
          let boxCenter= {
              x: boxBoundingRect.left + boxBoundingRect.width/2,
              y: boxBoundingRect.top + boxBoundingRect.height/2
          };

          let angle = Math.atan2(event.pageX - boxCenter.x, - (event.pageY - boxCenter.y) )*(180 / Math.PI);
          let tx = event.target.dataset['x'];
          let ty = event.target.dataset['y'];

          let classes:any = Array.from(event.target.classList);

          let indexes = classes.map((elm, idx) => elm.indexOf('rotate') != -1 ? elm : '').filter(String);
          // console.log(indexes);
          for (let x in indexes) {
            event.target.classList.remove(indexes[x]);
          }
          event.target.classList.add("rotate"+(Math.floor(angle))+"deg");
          // console.log(event.target.style);

        }else{
          

          var target = event.target;
          var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
          var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

          target.style.webkitTransform =
          target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

          target.setAttribute('data-x', x);
          target.setAttribute('data-y', y);
        }

      },
    })
    /*.gesturable({
      listeners: {
        move (event) {
          var target = event.target;
          // document.body.appendChild(new Text(event.scale))
          var currentAngle = event.angle + angleScale.angle
          var currentScale = event.scale * angleScale.scale
          target.style.transform =
            'rotate(' + currentAngle + 'deg)' + 'scale(' + currentScale + ')'
          // uses the dragMoveListener from the draggable demo above
          // dragMoveListener(event)
        },
      }
    })*/;
  }
  loadRest()
  {
    setTimeout(()=>{
      if (this.mainDiv.nativeElement.offsetWidth < 1024) {
        console.log('aplicar clases')
      }
      console.log(this.mainDiv.nativeElement.offsetWidth);
      this.w = 960 //this.campo.nativeElement.offsetWidth;
      this.h = 768 //this.campo.nativeElement.offsetHeight;

      this.canvasElement = this.canvas.nativeElement;
      this.canvasElement.width = this.w;
      this.canvasElement.height = this.h;

      this.ctx = this.canvasElement.getContext('2d');

      if (this.preImage) {

        var img1 = new Image();

        img1.onload = ()=> {
            //draw background image
            this.ctx.drawImage(img1, 0, 0);
            //draw a box over the top
            // this.ctx.fillStyle = "rgba(200, 0, 0, 0.5)";
            // this.ctx.fillRect(0, 0, 500, 500);
        };

        img1.src = this.preImage;

      }

      // document.getElementById('campo').style.height = this.h+'px';
      document.getElementById('campo').style.width = this.w+'px';

      this.auxCanvasElement = document.createElement('canvas');
      if (!this.auxCanvasElement) {
        alert('Error: I cannot create a new <canvas> element!');
        return;
      }

      this.auxCanvasElement.id = 'imageTemp';
      this.auxCanvasElement.width = this.canvasElement.width;
      this.auxCanvasElement.height = this.canvasElement.height;

      var container = this.canvasElement.parentNode;

      container.appendChild(this.auxCanvasElement);

      this.auxCtx = this.auxCanvasElement.getContext('2d');

      var objetos = document.getElementsByClassName('image-holder-draggable');

      for (let i = 0; i < objetos.length;i++){

        var touchtime = 0;

        let _this = this;

        (objetos[i] as HTMLDivElement).addEventListener('click',function(a){
          if (touchtime == 0) {
              // set first click
              touchtime = new Date().getTime();
          } else {
              let acButtons = [];
              if (_this.realizeAction == 'rotate') {
                acButtons = [
                    {text:"Borrar",icon:"trash",handler:()=>{
                      this.remove();
                    }},
                    {text:"Mover elementos",icon:"move-outline",handler:()=>{
                      _this.realizeAction = 'move';
                      _this.startToDrag();
                    }},]

                    if (this.classList.contains('increment')) {
                      acButtons.push({text:"Aumentar tamaño",icon:"caret-up-outline",handler:()=>{
                        let w = (this.children[0] as any).style.width;
                        w = parseInt(w)+5;
                        console.log(w);
                        (this.children[0] as any).style.width = w+'px';
                        return false;
                      }},
                      {text:"Disminuir tamaño",icon:"caret-down-outline",handler:()=>{
                        let w = (this.children[0] as any).style.width;
                        w = parseInt(w)-5;
                        if (w <= 0) {
                          return false;
                        }
                        (this.children[0] as any).style.width = w+'px';
                        return false;
                      }});
                    }

                    acButtons.push({text:"Cancelar",});
                  ;
              }else{
                acButtons = [
                    {text:"Borrar",icon:"trash",handler:()=>{
                      this.remove();
                    }},
                    {text:"Rotar elementos",icon:"refresh-outline",handler:()=>{
                      _this.realizeAction = 'rotate';
                      _this.startToDrag();
                    }}];

                    if (this.classList.contains('increment')) {
                      acButtons.push({text:"Aumentar tamaño",icon:"caret-up-outline",handler:()=>{
                        let w = (this.children[0] as any).style.width;
                        w = parseInt(w)+5;
                        console.log(w);
                        (this.children[0] as any).style.width = w+'px';
                        return false;
                      }},
                      {text:"Disminuir tamaño",icon:"caret-down-outline",handler:()=>{
                        let w = (this.children[0] as any).style.width;
                        w = parseInt(w)-5;
                        if (w <= 0) {
                          return false;
                        }
                        (this.children[0] as any).style.width = w+'px';
                        return false;
                      }});
                    }

                    acButtons.push({text:"Cancelar",});
              }
              // compare first click to this click and see if they occurred within double click threshold
              if (((new Date().getTime()) - touchtime) < 800) {
                  // double click occurred
                  _this.action.create({header:"Elemento seleccionado",buttons:acButtons}).then(a=>a.present());
                  console.log(this)
                  touchtime = 0;
              } else {
                  // not a double click so set as a new first click
                  touchtime = new Date().getTime();
              }
          }
        })

        if ($(objetos[i]).find('.team-color.number').length) {
          $(objetos[i]).find('span').remove();
          let player = $(objetos[i]).find('.team-color.number').data('player');
          let elem = '<span style="font-size: 10px; top: -6px; position: relative;">'+player.name+'</span>';
          $(objetos[i]).append(elem);
        }

      }

    },this.to)
  }

  team;

  selectTeam(i)
  {
    this.roster = null;
    this.isCanvas = false;
    this.isRoster = true;
    this.team = i;

    if (i == 4) return false;

    this.styles = this.project.styles['team'+i];

    this.api.getRoster(this.project['team'+i].id).subscribe((data:any)=>{
      this.roster = data;
    })
    // this.roster = this.project['team'+i];

    // console.log(this.roster);
  }

  async configureTeam()
  {
    localStorage.setItem('actualTeam',JSON.stringify(this.project['team'+this.team]));
    localStorage.setItem('team_number',this.team);
    localStorage.setItem('project_id',this.project.id);
  	const modal = await this.modal.create({
  		component: NewPlayerPage,
  		cssClass: 'modalAF'
  	})

  	modal.present();
  }

  async openModal()
  {
    const modal = await this.modal.create({
      component: InformationPage,
      cssClass: 'modalAF'
    })

    modal.present();
  }

  async openNewProject()
  {
    const modal = await this.modal.create({
      component: NewProjectPage,
      cssClass: 'modalAF',
      backdropDismiss: false,
    })

    modal.present();
  }

  async openSessions()
  {
    const modal = await this.modal.create({
      component: NewSessionPage,
      cssClass: 'modalAF'
    })

    modal.present();
  }

  async openNewExerciseModal()
  {
    const modal = await this.modal.create({
      component: NewExercisePage,
      cssClass: 'modalAF',
      backdropDismiss: false,
    })

    modal.present();
  }
  openNewExercise()
  {
    if (!this.api.vPro) {
      
      this.api.getExercises(this.user.id).subscribe((data:any)=>{

        if (data.length >= 4) {
          return this.api.goPro();
        }

        this.openNewExerciseModal();

      })

    }else{
      this.openNewExerciseModal();
    }

  }

  async openProjects()
  {
    const modal = await this.modal.create({
      component: OpenProjectPage,
      cssClass: 'modalAF'
    })

    modal.present();
  }

  async openExercise()
  {
    const modal = await this.modal.create({
      component: OpenExercisePage,
      cssClass: 'modalAF'
    })

    modal.present();
  }

  async openTeams()
  {
    const modal = await this.modal.create({
      component: TeamsPage,
      cssClass: 'modalAF',
      backdropDismiss: false,
    })

    modal.present();
  }

  async openTerrains()
  {
    const modal = await this.modal.create({
      component: TerrainPage,
      cssClass: 'modalAF'
    })

    modal.present();
  }

  async openPlayers()
  {
    if (!this.api.vPro) {
      return this.api.goPro();
    }
    const modal = await this.modal.create({
      component: PlayersPage,
      cssClass: 'modalAF'
    })

    modal.present();
  }

  async openEvents()
  {
    const modal = await this.modal.create({
      component: PrEventsPage,
      cssClass: 'modalAF'
    })

    modal.present();
  }

  async openReports()
  {
    const modal = await this.modal.create({
      component: ReportsPage,
      cssClass: 'modalAF'
    })

    modal.present();
  }

  backward()
  {
    if (this.scene != 0) {
      this.scene--;
      this.selectSchene(this.scene,true);
    }
  }
  setIntervalScenes:any = null;
  setIntervalImages:any = null;
  sceneInterval = 2000;
  shownSpeed = 1;

  startPlay(i = null)
  {
    this.saveProject(true, false, null, 'play', i, false);
  }

  images = [];
  
  async play(i = null)
  {
    this.scene = 0;
    this.images = [];
    this.selectSchene(this.scene);
    this.stop();

    let idx = 0;

    if (i) {
      await this.recordScreen();
    }

    this.setIntervalScenes = setInterval(()=>{

      if (this.scene == this.project.scenes.length -1) {
        if(i){
          setTimeout(()=>{
            this.stop(true);
          },1000)
        }else{
          this.stop(false);
        }

        console.log(this.images);

      }else{
        this.scene++;
        this.selectSchene(this.scene,false,true);
      }

    },this.sceneInterval);
  }

  async stop(i = false)
  {
    if (this.recorder && i) {
      console.log('hay recorder');
      this.recorder.stopRecording(() => {

          let a = document.createElement("a");
          let blob = this.recorder.getBlob();

          let url = window.URL.createObjectURL(blob);
          a.href = url;
          a.download =
            'record' +
            new Date().getDate() +
            new Date().getMonth() +
            new Date().getFullYear() +
            new Date().getHours() +
            new Date().getMinutes() +
            new Date().getSeconds()+'.mp4';
          a.click();
          window.URL.revokeObjectURL(url);
          // invokeSaveAsDialog(blob);

          this.recorder = null;
      });
    }else{
      console.log('no hay recorder')
    }
    // setTimeout(()=>{
      // this.createVideo();
    // },2000)

    let elem = Array.from(document.getElementsByClassName('rotable'));

    for (let e in elem) {
      (elem[e] as HTMLElement).style.transition = 'all 0ms linear';
    }

    clearInterval(this.setIntervalScenes);
    // clearInterval(this.setIntervalImages);

    this.setIntervalScenes = null;
    // this.setIntervalImages = null;

    this.selectSchene(this.scene);
  }

  /*log;

  createVideo()
  {

    let c = document.getElementsByClassName('outCanvas').length;

    let pad = (n, width, z = '0') => {
      // z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }

    let convertDataURIToBinary = (dataURI) => {
      var base64 = dataURI.replace(/^data[^,]+,/,'');
      var raw = window.atob(base64);
      var rawLength = raw.length;

      var array = new Uint8Array(new ArrayBuffer(rawLength));
      for (let i = 0; i < rawLength; i++) {
          array[i] = raw.charCodeAt(i);
      }
      return array;
    };

    if (c > 0) {

      let images = Array.from(document.getElementsByClassName('outCanvas'));

      for (let o of images) {
        // console.log(o);
        let context = (o as any).getContext('2d');
        context.save();

        const img = new Image(), mimeType = 'image/jpeg';
        const imgString = (o as any).toDataURL(mimeType,1)
        const data = convertDataURIToBinary( imgString )

        this.images.push({
          name: `img${ pad( this.images.length, 3 ) }.jpeg`,
          data
        })
      }

      // if (this.images.length) {

        let messages = '';

        worker.onmessage = (e)=> {
          var msg = e.data;
          switch (msg.type) {
            case "stdout":
            case "stderr":
              messages += msg.data + "<br>";
              break;
            case "exit":
              clearInterval(this.setIntervalImages);
              this.setIntervalImages = null;
              console.log("Process exited with code " + msg.data);
              //worker.terminate();
              break;

            case 'done':
              const blob = new Blob([msg.data.MEMFS[0].data], {
                type: "video/mp4"
              });
              done( blob )

            break;
          }
          this.log = messages;
        };

        var node = document.getElementById('element-to-copy');

        // https://trac.ffmpeg.org/wiki/Slideshow
        // https://semisignal.com/tag/ffmpeg-js/
        worker.postMessage({
          type: 'run',
          TOTAL_MEMORY: 268435456,
          arguments: '-framerate 10/1 -i img%03d.jpeg -r 30 -s 420x420 -vf scale=-1:1080 -start_number 1 -vcodec libx264 -crf 1 -vf format=yuv420p -b 4M test.mp4'.split(' '),
          // arguments: ["-framerate", "1/5", "-i", "img%03d.jpeg", "-c:v", "libx264", "-crf", "1", "-vf", "scale=420:420","-pix_fmt", "yuv420p", "-vb", "20M", "out.mp4"],
          MEMFS: this.images
        });

        let done = (output) => {

          const url = webkitURL.createObjectURL(output);

          var end_time = +new Date;
          console.log("Compiled success, file size: " + Math.ceil(output.size / 1024) + "KB");

          clearInterval(this.setIntervalImages);
          this.setIntervalImages = null;

          this.api.downloadVideo(url);

          var elements = document.getElementsByClassName('outCanvas');
          while(elements.length > 0){
              elements[0].parentNode.removeChild(elements[0]);
          }

          // console.log(url);
        }

      // }
    }


  }*/

  // createVideo()
  // {
  //   if (this.images.length) {

  //       let messages = '';

  //       worker.onmessage = (e)=> {
  //         var msg = e.data;
  //         switch (msg.type) {
  //           case "stdout":
  //           case "stderr":
  //             messages += msg.data + "<br>";
  //             break;
  //           case "exit":
  //             clearInterval(this.setIntervalImages);
  //             this.setIntervalImages = null;
  //             console.log("Process exited with code " + msg.data);
  //             //worker.terminate();
  //             break;

  //           case 'done':
  //             const blob = new Blob([msg.data.MEMFS[0].data], {
  //               type: "video/mp4"
  //             });
  //             done( blob )

  //           break;
  //         }
  //         this.log = messages;
  //       };

  //       // https://trac.ffmpeg.org/wiki/Slideshow
  //       // https://semisignal.com/tag/ffmpeg-js/
  //       worker.postMessage({
  //         type: 'run',
  //         TOTAL_MEMORY: 268435456,
  //         //arguments: 'ffmpeg -framerate 24 -i img%03d.jpeg output.mp4'.split(' '),
  //         arguments: ["-r", "10", "-i", "img%03d.jpeg", "-c:v", "libx264", "-crf", "1", "-vf", "scale=420:420",
  //         "-pix_fmt", "yuv420p", "-vb", "20M", "out.mp4", "-threads","4", "-preset", "ultrafast"],
  //         MEMFS: this.images
  //       });

  //       let done = (output) => {

  //         const url = webkitURL.createObjectURL(output);

  //         var end_time = +new Date;
  //         console.log("Compiled success, file size: " + Math.ceil(output.size / 1024) + "KB");

  //         clearInterval(this.setIntervalImages);
  //         this.setIntervalImages = null;

  //         this.api.downloadVideo(url)

  //         // console.log(url);
  //       }

  //   }
  // }

  // nextFrame(){

  //   var context = clock(last_time += 1000);
  //   video.add(context);
  //   if(progress.value / progress.max < 1){
  //     requestAnimationFrame(nextFrame);
  //     document.getElementById('status').innerHTML = "Drawing Frames";
  //   }else{
  //     document.getElementById('status').innerHTML = "Compiling Video";
  //     requestAnimationFrame(finalizeVideo); // well, should probably use settimeout instead
  //   }
    
  // }

  forward()
  {
    if (this.scene != this.project.scenes.length -1) {
      this.scene++;
      this.selectSchene(this.scene,true);
    }
  }

  speed()
  {
    this.action.create({header:"Seleccione la velocidad",buttons:[
      {text:"1X",handler:()=>{
        this.sceneInterval = 2000;
        this.shownSpeed = 1;
      }},
      {text:"2X",handler:()=>{
        this.sceneInterval = 1000;
        this.shownSpeed = 2;
      }},
      {text:"3X",handler:()=>{
        this.sceneInterval = 667;
        this.shownSpeed = 3;
      }},
      {text:"4X",handler:()=>{
        this.sceneInterval = 500;
        this.shownSpeed = 4;
      }},
      {text:"Cancelar",}
    ]}).then(a=>a.present());
  }

  delete()
  {
    if (this.project.scenes.length <= 1) {
      return false;
    }
    this.alert.create({message:"¿Desea borrar la escena seleccionada?", buttons:[{text:"Si", handler:()=>{
      // this.project.scenes[this.scene].schene = null;
      // this.project.scenes[this.scene].image = null;

      // localStorage.setItem('actualProject',JSON.stringify(this.project));

      // this.selectSchene(this.scene);

      this.api.deleteScene(this.project.scenes[this.scene].id).subscribe(data=>{
        console.log(data);
        localStorage.setItem('actualProject',JSON.stringify(data));
        this.project = data;

        this.scene = this.project.scenes.length - 1;
        this.selectSchene(this.scene);
      })
    }},{
      text:"No"
    }]}).then(a=>a.present());
  }

  direccion()
  {
    this.module = 2; this.isCanvas = false; this.isMainMenu = true;
  }
  analisis()
  {
    if (!this.api.vPro) {
      return this.api.goPro();
    }
    this.module = 3; this.isCanvas = false; this.isMainMenu = true;
  }

  startpdf1()
  {
    this.saveProject(true, false, null, 'proyect', null, false);
  }

  startpdf2()
  {
    if (!this.api.vPro) {
      return this.api.goPro();
    }
    this.saveProject(true, false, null, 'exercise', null, false);
  }

  pdfProyect()
  {
    this.api.pdfMatch(this.project.id).subscribe((data:any)=>{
      // console.log(data);
      this.api.downloadFile(data.url)
    })
  }

  pdfExercise()
  {
    this.api.pdfExercise(this.project.id).subscribe((data:any)=>{
      // console.log(data);
      this.api.downloadFile(data.url)
    })
  }

  presentToast(t)
  {
    this.toastCtrl.create({message:t,duration:3000, color:'success',cssClass:'text-center'}).then(t=>t.present());
  }

  downloadFrame()
  {
    var el = this.project.scenes[this.scene].pdf_element.split('/');


    this.api.downloadScene({scene:el[el.length-1]}).subscribe(data=>{
      console.log(data);

      this.api.downloadImage(data[0],'Project Frame '+this.scene+1);
    })
  }

  async openCalendar()
  {
    const modal = await this.modal.create({
      component: CalendarPage,
      cssClass: 'modalAF'
    })

    modal.present();
  }

}
