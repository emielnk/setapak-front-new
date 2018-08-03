import { Component,ViewChild } from '@angular/core';
import { Platform,Nav, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

import { UserData } from '../providers/user-data';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // rootPage:any = TabsPage;
  rootPage:any
  @ViewChild(Nav) navChild:Nav;
  constructor(platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    public app: App,
    public userData: UserData) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.userData.hasLoggedIn().then((hasLoggedIn) => {
      if(hasLoggedIn) {
        console.log('status',hasLoggedIn)
        this.navChild.setRoot(TabsPage)
      } else {
        console.log('status',hasLoggedIn)
        this.navChild.setRoot(TabsPage)
      }
    });
  }
}
