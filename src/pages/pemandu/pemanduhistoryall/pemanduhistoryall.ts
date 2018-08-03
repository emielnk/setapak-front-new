import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PemanduhistoryallPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pemanduhistoryall',
  templateUrl: 'pemanduhistoryall.html',
})
export class PemanduhistoryallPage {
  tab1: any = "PemanadusuksesPage";
  tab2: any = "PemanadufailedPage";
  tab3: any = "PemanaduprogressPage";

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PemanduhistoryallPage');
  }

}
