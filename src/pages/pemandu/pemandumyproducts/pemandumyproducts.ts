import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PemandumyproductsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pemandumyproducts',
  templateUrl: 'pemandumyproducts.html',
})
export class PemandumyproductsPage {

  tab1: any = "PemandulisthomestayPage";
  tab2: any = "PemandulistproductPage";
  tab3: any = "PemandulistservicePage";

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PemandumyproductsPage');
  }

}
