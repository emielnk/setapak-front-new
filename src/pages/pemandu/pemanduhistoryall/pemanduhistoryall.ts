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
  tab1: any = "PemandutransmenunggubayarPage";
  tab2: any = "PemandutransberjalanPage";
  tab3: any = "PemandutransmenungguselesaiPage";
  tab4: any = "PemandutransselesaiPage"

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PemanduhistoryallPage');
  }

}
