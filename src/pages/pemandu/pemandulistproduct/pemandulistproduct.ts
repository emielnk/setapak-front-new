import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PemandulistproductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pemandulistproduct',
  templateUrl: 'pemandulistproduct.html',
})
export class PemandulistproductPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PemandulistproductPage');
  }
  navEditProductById() {
    this.navCtrl.push("PemandueditproductPage")
  }

}
