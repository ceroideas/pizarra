import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController, ActionSheetController, LoadingController, NavController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.page.html',
  styleUrls: ['./buy.page.scss'],
})
export class BuyPage implements OnInit {

  constructor(public navCtrl: NavController, public api: ApiService, public loadingController: LoadingController, public alertCtrl: AlertController) { }

  ngOnInit() {
  }

  restaurar(){

    this.api.restauraCompra();

    // if (this.api.isIOS){
    //   this.restaurarIOS();
    // } else {
    //   this.restaurarAndroid();
    // }

  }

  // async restaurarIOS(){

  //   let loader = await this.loadingController.create({
  //     spinner: 'bubbles'
  //   });

  //   loader.present();

  //   this.api.restauraSuscripcion().then(res => {

  //     if (res){
  //       let alert = this.alertCtrl.create({
  //         header: "Compra restaurada",
  //         message: "Ha restaurado la suscripción",
  //         buttons: [{
  //           text: "Aceptar",
  //           handler: () => {
  //             this.navCtrl.navigateRoot('folder');
  //           }
  //         }]
  //       }).then(alert=>alert.present());
  //     } else {
  //       let alert = this.alertCtrl.create({
  //         header: "Error al restaurar",
  //         subHeader: "Ha ocurrido un error al restaurar la suscripción",
  //         buttons: [{text:"Aceptar"}]
  //       }).then(alert=>alert.present());
  //     }

  //     loader.dismiss();

  //   });

  // }

  // async restaurarAndroid(){

  //   let loader = await this.loadingController.create({
  //     spinner: 'bubbles'
  //   });

  //   loader.present();

  //   this.api.restauraCompra().then(res => {

  //     if (res){
  //       let alert = this.alertCtrl.create({
  //         header: "Compra restaurada",
  //         message: "Ha restaurado la suscripción",
  //         buttons: [{
  //           text: "Aceptar",
  //           handler: () => {
  //             this.navCtrl.navigateRoot('folder');
  //           }
  //         }]
  //       }).then(alert=>alert.present());
  //     } else {
  //       let alert = this.alertCtrl.create({
  //         header: "Error al restaurar",
  //         subHeader: "Ha ocurrido un error al restaurar la suscripción",
  //         buttons: [{text:"Aceptar"}]
  //       }).then(alert=>alert.present());
  //     }

  //     loader.dismiss();

  //   });

  // }



  /**/


  comprar() {

    this.api.compraAndroid();

    // if (this.api.isIOS) {
    //   this.suscribeIOS();
    // } else {
    //   this.comprarAndroid();
    // }

  }

  // async suscribeIOS() {

  //   let loader = await this.loadingController.create({
  //     spinner: 'bubbles'
  //   });

  //   loader.present();

  //   this.api.suscribe().then(res => {

  //     if (res){
  //       let alert = this.alertCtrl.create({
  //         header: "Compra realizada",
  //         message: "Gracias por realizar la suscripción en nuestra aplicación, está listo para disfrutar de las ventajas de la versión PRO",
  //         buttons: [{
  //           text: "Aceptar",
  //           handler: () => {
  //             this.navCtrl.navigateRoot('folder');
  //           }
  //         }]
  //       }).then(alert=>alert.present());
  //     } else {
  //       let alert = this.alertCtrl.create({
  //         header: "Error al restaurar",
  //         subHeader: "Ha ocurrido un error al realizar la suscripción",
  //         buttons: [{text:"Aceptar"}]
  //       }).then(alert=>alert.present());
  //     }

  //     loader.dismiss();

  //   });
  // }

  // async comprarAndroid() {
    
  //   let loader = await this.loadingController.create({
  //     spinner: 'bubbles'
  //   });

  //   loader.present();

  //   this.api.compraAndroid().then(res => {

  //     if (res){
  //       let alert = this.alertCtrl.create({
  //         header: "Compra realizada",
  //         message: "Gracias por realizar la suscripción en nuestra aplicación, está listo para disfrutar de las ventajas de la versión PRO",
  //         buttons: [{
  //           text: "Aceptar",
  //           handler: () => {
  //             this.navCtrl.navigateRoot('folder');
  //           }
  //         }]
  //       }).then(alert=>alert.present());
  //     } else {
  //       let alert = this.alertCtrl.create({
  //         header: "Error al restaurar",
  //         subHeader: "Ha ocurrido un error al realizar la suscripción",
  //         buttons: [{text:"Aceptar"}]
  //       }).then(alert=>alert.present());
  //     }

  //     loader.dismiss();

  //   });
  // }

}
