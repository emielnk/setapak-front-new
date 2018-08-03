import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PemandudiskusiallPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pemandudiskusiall',
  templateUrl: 'pemandudiskusiall.html',
})
export class PemandudiskusiallPage {
  tab1: any = "PemandudiskusihomestayPage";
  tab2: any = "PemandudiskusiservicePage";
  tab3: any = "PemandudiskusiprodukPage";
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PemandudiskusiallPage');
  }

}
