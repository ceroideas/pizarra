import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Platform, ModalController, LoadingController } from '@ionic/angular';
import { BuyPage } from '../pages/buy/buy.page';
import { EventsService } from './events.service';

// import { InAppPurchase } from '@ionic-native/in-app-purchase/ngx';
import { InAppPurchase2, IAPProduct } from '@awesome-cordova-plugins/in-app-purchase-2/ngx';

declare var moment:any

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // url = 'http://127.0.0.1:8000/api';
  url = 'https://afecfa.es/backend/public/api';
  baseUrl = 'https://afecfa.es/backend/public';
  basePath = '/var/www/vhosts/afecfa.es/httpdocs/backend/public';
  vPro = false;
  isIOS;
  desktop;
  user;

  type;

  constructor(public http: HttpClient, private store: InAppPurchase2, private plt: Platform, public modal: ModalController, public loadingCtrl: LoadingController, public events: EventsService) {
    this.isIOS = this.plt.is('ios');
    this.desktop = this.plt.is('desktop');

    if (this.plt.is('desktop')) {
      this.vPro = true;
    }else{
      this.vPro = false;
    }

  }

  calculateSubscription()
  {

    this.user = JSON.parse(localStorage.getItem('AFECuser'));

    if (!this.user.mobile_end) {

      console.log(false);

      return false;
    }else{
      let endline = moment(this.user.mobile_end).format('Y-MM-DD');
      let today = moment().format('Y-MM-DD');

      console.log(endline,today,(endline > today));

      // if (localStorage.getItem('AFECuser')) {
        this.vPro = true;
      // }

      return (endline > today);
    }

  }

  login(data)
  {
  	return this.http.post(this.url+'/login',data);
  }

  register(data)
  {
  	return this.http.post(this.url+'/register',data);
  }

  loginWoo(data)
  {
    return this.http.post(this.url+'/loginWoo',data);
  }

  registerWoo(data)
  {
    return this.http.post(this.url+'/registerWoo',data);
  }

  sendCode(data)
  {
    return this.http.post(this.url+'/sendCode',data);
  }
  changePassword(data)
  {
    return this.http.post(this.url+'/changePassword',data);
  }

  getProjects(id)
  {
  	return this.http.get(this.url+'/getProjects/'+id);
  }
  getExercises(id)
  {
    return this.http.get(this.url+'/getExercises/'+id);
  }

  getTeams(id)
  {
  	return this.http.get(this.url+'/getTeams/'+id);
  }

  getPlayers(id)
  {
  	return this.http.get(this.url+'/getPlayers/'+id);
  }

  getRosters(id)
  {
  	return this.http.get(this.url+'/getRosters/'+id);
  }
  getSessions(id)
  {
    return this.http.get(this.url+'/getSessions/'+id);
  }

  upProject(data)
  {
  	return this.http.post(this.url+'/upProject',data);
  }

  upScene(data)
  {
  	return this.http.post(this.url+'/upScene',data);
  }
  upSession(data)
  {
    return this.http.post(this.url+'/upSession',data);
  }
  deleteScene(id)
  {
    return this.http.get(this.url+'/deleteScene/'+id);
  }

  upTeam(data)
  {
  	return this.http.post(this.url+'/upTeam',data);
  }
  updateTeam(data)
  {
    return this.http.post(this.url+'/updateTeam',data);
  }
  upProjectTeam(data)
  {
    return this.http.post(this.url+'/upProjectTeam',data);
  }

  upPlayer(data)
  {
  	return this.http.post(this.url+'/upPlayer',data);
  }

  upRoster(data)
  {
  	return this.http.post(this.url+'/upRoster',data);
  }
  getRoster(id)
  {
    return this.http.get(this.url+'/getRoster/'+id);
  }
  upRosterPlayer(data)
  {
    return this.http.post(this.url+'/upRosterPlayer',data);
  }

  /**/

  uploadImage(data)
  {
    return this.http.post(this.url+'/uploadImage',data);
  }

  /**/

  loadOthers(data)
  {
    return this.http.post(this.url+'/loadOthers',data);
  }

  saveExercises(data){
    return this.http.post(this.url+'/saveExercises',data);
  }
  saveReport(data){
    return this.http.post(this.url+'/saveReport',data);
  }

  getAllPlayers(id){
    return this.http.get(this.url+'/getAllPlayers/'+id);
  }

  getReports(id){
    return this.http.get(this.url+'/getReports/'+id);
  }

  getEvents(id){
    return this.http.get(this.url+'/getEvents/'+id);
  }

  saveEvent(data){
    return this.http.post(this.url+'/saveEvent',data);
  }
  getMatchReport(id){
    return this.http.get(this.url+'/getMatchReport/'+id);
  }

  savePrReport(data){
    return this.http.post(this.url+'/savePrReport',data);
  }

  upEvent(data){
    return this.http.post(this.url+'/upEvent',data);
  }








  /**/
  deleteSession(id){
    return this.http.get(this.url+'/deleteSession/'+id);
  }
  deleteTeam(id){
    return this.http.get(this.url+'/deleteTeam/'+id);
  }
  deleteRoster(id){
    return this.http.get(this.url+'/deleteRoster/'+id);
  }
  deletePlayer(id){
    return this.http.get(this.url+'/deletePlayer/'+id);
  }
  deleteEvent(id){
    return this.http.get(this.url+'/deleteEvent/'+id);
  }
  deleteProyect(id){
    return this.http.get(this.url+'/deleteProyect/'+id);
  }
  deleteReport(id){
    return this.http.get(this.url+'/deleteReport/'+id);
  }




  /**/
  pdfSession(id){
    return this.http.get(this.url+'/pdfSession/'+id);
  }
  pdfEvents(id){
    return this.http.get(this.url+'/pdfEvents/'+id);
  }
  pdfMatch(id){
    return this.http.get(this.url+'/pdfMatch/'+id);
  }
  pdfExercise(id){
    return this.http.get(this.url+'/pdfExercise/'+id);
  }
  pdfReport(id){
    return this.http.get(this.url+'/pdfReport/'+id);
  }
  pdfPlayer(id){
    return this.http.get(this.url+'/pdfPlayer/'+id);
  }
  saveLog(data){
    return this.http.post(this.url+'/saveLog',data);
  }

  downloadFile(url, name = 'pdf-name')
  {
    var link = document.createElement('a');
        link.download = name+'.pdf';
        link.href = url;
        link.target = '_blank';
        link.click();
  }

  downloadVideo(url, name = 'mp4-name')
  {
    var link = document.createElement('a');
        link.download = name+'.mp4';
        link.href = url;
        link.target = '_blank';
        link.click();
  }

  addYearSubscription(){
    let id = JSON.parse(localStorage.getItem('AFECuser'))['id'];
    return this.http.get(this.url+'/addYearSubscription/'+id);
  }
  removeYearSubscription(){
    let id = JSON.parse(localStorage.getItem('AFECuser'))['id'];
    return this.http.get(this.url+'/removeYearSubscription/'+id);
  }

  showApproved()
  {
    this.loadingCtrl.dismiss();
    console.log(this.type);
    if (this.type == 'restore') {
      this.events.publish('restoreApprover');
    } else if (this.type == 'purchase') {
      this.events.publish('purchaseApprover');
    }else{
      console.log('se ha restaurado la compra');
    }
  }

  showError()
  {
    this.loadingCtrl.dismiss();
    console.log(this.type);
    if (this.type == 'restore') {
      this.events.publish('restoreRejected');
    } else if (this.type == 'purchase') {
      this.events.publish('purchaseRejected');
    } else {
      console.log('no se encuentra la compra');
    }
  }

  async startStore()
  {
    return await new Promise(resolve => {
      console.log('iniciando');

      if (this.desktop) {
         return resolve(true);
      }

      this.store.verbosity = this.store.DEBUG;
      this.store.register({
        id: "afecpro",
        type: this.store.PAID_SUBSCRIPTION,
      });

      this.store.when("afecpro").owned((product: IAPProduct) => {
        // download the feature
        console.error('Purchase was Approved');
        localStorage.setItem('afec_suscripcion', new Date().toString());
        
        // if (localStorage.getItem('AFECuser')) {
          this.vPro = true;
          this.addYearSubscription().subscribe(data=>{
            this.buyModal.dismiss();
            localStorage.setItem('AFECuser',JSON.stringify(data));
            if (!localStorage.getItem('aprovado')) {
              localStorage.setItem('aprovado','1');
              this.showApproved();
            }
          });
          // product.finish();
        // }

      });

      this.store.when("afecpro").approved((product: IAPProduct) => {
        console.log('approved')
        // if (localStorage.getItem('AFECuser')) {
          this.vPro = true;
          this.addYearSubscription().subscribe(data=>{
            this.buyModal.dismiss();
            console.log('comprado');
            localStorage.setItem('AFECuser',JSON.stringify(data));
            if (!localStorage.getItem('aprovado')) {
              localStorage.setItem('aprovado','1');
              this.showApproved();
            }
          });
          // product.finish();
        // }
      });

      /**/

      this.store.when("afecpro").updated((product: IAPProduct) => {
        let email = JSON.parse(localStorage.getItem('AFECuser'))['email'];
        this.saveLog({message: JSON.stringify({email:email,product:product,loaded:product.loaded,valid:product.valid,state:(product.state === this.store.OWNED || product.state === this.store.APPROVED)})})
        .subscribe(data=>{console.log('saved to log');});
        console.log(product, product.loaded, product.valid, (product.state === this.store.OWNED || product.state === this.store.APPROVED));

        if (product.loaded && product.valid && (product.state === this.store.OWNED || product.state === this.store.APPROVED)) {
        //   // product.finish();
        //   // download the feature
        //   console.error('Purchase was Approved');
        //   localStorage.setItem('afec_suscripcion', new Date().toString());
          
        //   this.vPro = true;
        //   this.addYearSubscription().subscribe(data=>{
        //     this.buyModal.dismiss();
        //     console.log('comprado');
        //     localStorage.setItem('AFECuser',JSON.stringify(data));
        //     if (!localStorage.getItem('aprovado')) {
        //       localStorage.setItem('aprovado','1');
        //       this.showApproved();
        //     }
        //   });
        //   product.finish();

        }else{
          console.error('Product not owned');
          this.vPro = false;
          localStorage.removeItem('afec_suscripcion');
          this.removeYearSubscription().subscribe(data=>{
            this.buyModal.dismiss();
            localStorage.setItem('AFECuser',JSON.stringify(data));
          });
        }
      });

      this.store.when("afecpro").cancelled( (product) => {
        console.error('Purchase was Cancelled');
        this.showError();
        // product.finish();
      });

      this.store.when('afecpro').error( (err) => {
        console.error('Error del producto ' + JSON.stringify(err));
        this.buyModal.dismiss();
        this.showError();
      });

      // Track all store errors
      this.store.error( (err) => {
        console.error('Store Error ' + JSON.stringify(err));
        this.showError();      
      });

      this.store.autoFinishTransactions = true;

      this.store.refresh();

      // this.restauraCompra();

      /**///////////////**/

    });
  }

  /*************/

  async checkSuscripcion(){

     return await new Promise(resolve => {
       let suscripcion = localStorage.getItem('afec_suscripcion');

       if (suscripcion){
          let fechaSuscripcion = new Date(suscripcion);

          let auxFecha = new Date();
          auxFecha.setFullYear(auxFecha.getFullYear() - 1);

          if (fechaSuscripcion >= auxFecha){
            this.vPro = true;
            resolve(true);
          } else {
            this.consumeAndroid();
            resolve(true);
          }
        }
     });
  }

  consumeAndroid(){
    this.type = 'default';

    let r = this.store.refresh();

    r.finished(()=>{
      console.log('finished');
      this.loadingCtrl.dismiss();
    });
    r.failed(()=>{
      console.log('error');
    });
    r.completed(()=>{
      console.log('completed')
    });
  }

  compraAndroid(){

    this.store.refresh();
    // this.store.update();

    // const p0 = this.store.get('afecpro');

    // console.log(p0);

    this.type = 'purchase';
    this.store.order("afecpro");
  }

  restauraCompra(){
    this.type = 'restore';

    let r = this.store.refresh();

    r.finished(()=>{
      console.log('finished');
      this.loadingCtrl.dismiss();
    });
    r.failed(()=>{
      console.log('error');
    });
    r.completed(()=>{
      console.log('completed')
    });
  }

  buyModal;

  async goPro()
  {
    this.buyModal = await this.modal.create({
      component: BuyPage,
      cssClass: 'modalAF'
    })

    this.buyModal.present();
  }


}
