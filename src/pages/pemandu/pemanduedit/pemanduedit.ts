import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PemanduDataProvider } from '../../../providers/pemandu-data/pemandu-data'
import { Http,Headers,RequestOptions } from '@angular/http';

/**
 * Generated class for the PemandueditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pemanduedit',
  templateUrl: 'pemanduedit.html',
})
export class PemandueditPage {
  pemandu_id: any;
  pemandu_profile: any;
  nama_company: any;
  alamat: any;
  deskripsi: any;
  since: any;
  status: any;

  masks: any;
  phoneNumber: any;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public pemanduData: PemanduDataProvider,
    public http: Http) {

      this.masks = {
        phoneNumber: ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
        cardNumber: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
        cardExpiry: [/[0-1]/, /\d/, '/', /[1-2]/, /\d/],
        orderCode: [/[a-zA-z]/, ':', /\d/, /\d/, /\d/, /\d/]
    };
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PemandueditPage');
  }

  ionViewWillEnter() {
    this.getPemanduId();
    this.getSetPemanduProfile();
  }
  
  getPemanduId() {
    this.pemanduData.getPemanduId().then(id => {
      this.pemandu_id = id;
    })
  }

  getSetPemanduProfile() {
    this.pemanduData.getPemanduProfile().then(profile => {
      this.nama_company = profile.nama_company
      this.alamat = profile.alamat
      this.deskripsi = profile.deskripsi
      this.since = profile.created_at
      this.status = profile.pemandu_status
      console.log(profile)
      console.log(this.status)
    })
  }

}
