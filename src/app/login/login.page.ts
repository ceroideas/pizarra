import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { NavController, LoadingController, AlertController, ToastController } from '@ionic/angular';

import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email;
  password;

  constructor(
  	public navCtrl: NavController, public platform: Platform,
  	public loadingCtrl: LoadingController, public alertCtrl: AlertController, public toast: ToastController, public api: ApiService) { }

  ngOnInit() {
  }

  login()
  {
    if (this.platform.is('cordova')) {
    	this.loadingCtrl.create().then(a=>{

        a.present();

        this.api.login({email:this.email,password:this.password})
        	.subscribe((data:any)=>{

          a.dismiss();

          localStorage.setItem('AFECuser',JSON.stringify(data));
          this.navCtrl.navigateRoot('folder');

        },err=>{
          a.dismiss();
          console.log(err);
          var arr = Object.keys(err.error.errors).map(function(k) { return err.error.errors[k] });
          let errorMessage = arr[0][0];
          this.alertCtrl.create({message:errorMessage}).then(al=>{al.present();/*setTimeout(()=>{al.dismiss()},3000)*/});
        })

      })
    }else{
      this.loadingCtrl.create().then(a=>{

        a.present();

        this.api.loginWoo({email:this.email,password:this.password})
          .subscribe((data:any)=>{

          a.dismiss();

          localStorage.setItem('AFECuser',JSON.stringify(data));

          this.api.calculateSubscription();

          this.navCtrl.navigateRoot('folder');

        },err=>{
          a.dismiss();
          console.log(err);
          var arr = Object.keys(err.error.errors).map(function(k) { return err.error.errors[k] });
          let errorMessage = arr[0][0];
          this.alertCtrl.create({message:errorMessage}).then(al=>{al.present();});
        })

      })
    }
  }

  /*

  login()
  {
    
  }

  */

}
