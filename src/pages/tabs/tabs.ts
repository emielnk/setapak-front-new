import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MybookingPage } from '../mybooking/mybooking';
import { NotificationPage } from '../notification/notification';
import { HomePage } from '../home/home';
import { MyaccountPage } from '../myaccount/myaccount';
import { PemanduhomePage } from '../pemandu/pemanduhome/pemanduhome';
import { ProfileAccountPage } from '../profile/profileaccount/profileaccount';
import { UserData } from '../../providers/user-data';

import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  HAS_LOGGED_IN = 'hasLoggedIn';  
  userLoggedIn : any ;
  numberTab :any;
  // tab1Root = HomePage;
  // tab2Root = MybookingPage;
  // tab3Root = NotificationPage;
  // tab4Root = MyaccountPage;
  // tab5Root = TestPage;
  tab1Root : any = HomePage
  tab2Root : any = MybookingPage
  tab3Root : any = NotificationPage
  tab4Root : any = MyaccountPage
  tab5Root : any = ProfileAccountPage
  tab6Root : any = PemanduhomePage  

  constructor(public navParams: NavParams,
    public storage: Storage,
    public userData : UserData,
    public navCtrl: NavController) {
    // check logged in to select the ion tabs
    this.userData.hasLoggedIn().then((value)=>{
      this.userLoggedIn = value;
      console.log('sudah login ', this.userLoggedIn)
    }); 
    // let data = this.navParams.get('opentab');
    // if (data != null) {
    //   this.numberTab = data;             
    // }    
  }

  
  
}
