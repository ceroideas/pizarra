import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController, ToastController } from '@ionic/angular';

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  email;
  name;
  password;
  password_confirmation;

  terms;

  constructor(
  	public navCtrl: NavController,
  	public loadingCtrl: LoadingController, public alertCtrl: AlertController, public toast: ToastController, public api: ApiService) { }

  ngOnInit() {
  }

  register()
  {
  	if (!this.terms) {
  		this.alertCtrl.create({message:"Debe aceptar los términos y condiciones!"}).then(a=>{a.present();})
  		return false;
  	}
  	this.loadingCtrl.create().then(a=>{

      a.present();

      this.api.registerWoo({email:this.email,name:this.name,password:this.password,password_confirmation:this.password_confirmation})
      	.subscribe((data:any)=>{

        a.dismiss();

        // localStorage.setItem('AFECuser',JSON.stringify(data[0]));

        // if (localStorage.getItem('onesignal_id')) {
          
        //   let user = data[0];
        //   let onesignal_id = localStorage.getItem('onesignal_id');

        //   this.api.saveOneSignalId({id:user.id,onesignal_id:onesignal_id})
        //   .subscribe(
        //     data => {console.log('ok');},
        //     err => {console.log(err);}
        //   );
        // }
        this.navCtrl.navigateRoot('login');
        this.alertCtrl.create({message:"Usuario registrado correctamente, inicie sesión"}).then(a=>{a.present();})

      },err=>{
        a.dismiss();
        console.log(err);
        var arr = Object.keys(err.error.errors).map(function(k) { return err.error.errors[k] });
        let errorMessage = arr[0][0];
        this.alertCtrl.create({message:errorMessage}).then(al=>{al.present();/*setTimeout(()=>{al.dismiss()},3000)*/});
      })

    })
  }

}
