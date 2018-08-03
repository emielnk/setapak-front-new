import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PemandupesananPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pemandupesanan',
  templateUrl: 'pemandupesanan.html',
})
export class PemandupesananPage {
  tab1: any = "PemandupesananhomestayPage";
  tab2: any = "PemandupesananservicePage";
  tab3: any = "PemandupesananprodukPage";

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PemandupesananPage');
  }

}
