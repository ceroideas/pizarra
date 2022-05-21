import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {

  constructor(public nav: NavController) { }

  ngOnInit() {
  	setTimeout(()=>{
  		if (localStorage.getItem('AFECuser')) {
  			this.nav.navigateRoot('folder');
  		}else{
  			this.nav.navigateRoot('login');
  		}
  	},3000)
  }

}
