import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NavController, LoadingController, AlertController, ToastController } from '@ionic/angular';

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.page.html',
  styleUrls: ['./recovery.page.scss'],
})
export class RecoveryPage implements OnInit {

  id;
  email;
  code;
  password;
  repeat_password;

  errorMessage;

  step = 1;

  constructor(
    public navCtrl: NavController, public platform: Platform,
    public loadingCtrl: LoadingController, public alertCtrl: AlertController, public toast: ToastController, public api: ApiService) {
    function makeid() {
      var text = "";
      var possible = "0123456789";

      for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
    }

    localStorage.setItem('AFECcode', makeid());
  }

  ngOnInit() {
  }

  sendCode()
  {    
    this.loadingCtrl.create().then((a)=>{
      a.present();

      this.api.sendCode({email:this.email,code:localStorage.getItem('AFECcode')}).subscribe((data:any)=>{

          this.id = data.id
          this.step = 2;

          this.toast.create({message:'Código enviado al correo',duration: 3000}).then(t=>t.present());
        a.dismiss();
      },err=>{
        console.log(err);
        this.alertCtrl.create({message:'Usuario no encontrado'}).then(al=>{al.present()});
        a.dismiss();
      })
    })
  }

  checkCode(){
    if (this.code == localStorage.getItem('AFECcode')) {
      this.step = 3;
    }else{
      this.alertCtrl.create({message:"El código ingresado no es igual al código enviado, por favor, verifique!"}).then(a=>a.present());
    }
  }

  changePassword()
  {
    this.loadingCtrl.create().then((a)=>{
      a.present();

      this.api.changePassword({id:this.id,password:this.password,password_confirmation:this.repeat_password}).subscribe(data=>{

          this.toast.create({message:'Contraseña modificada satisfactoriamente',duration: 3000}).then(t=>t.present());

          this.navCtrl.navigateRoot('login');
        a.dismiss();
      },err=>{
        console.log(err);
        var arr = Object.keys(err.error.errors).map(function(k) { return err.error.errors[k] });
        this.errorMessage = arr[0][0];
        this.alertCtrl.create({message:this.errorMessage}).then(al=>{al.present()});
        a.dismiss();
      })
    })
  }



  /*

  login()
  {
    
  }

  */

}
