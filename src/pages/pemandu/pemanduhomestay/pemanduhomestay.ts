import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import { PemanduDataProvider } from '../../../providers/pemandu-data/pemandu-data';

/**
 * Generated class for the PemanduhomestayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pemanduhomestay',
  templateUrl: 'pemanduhomestay.html',
})
export class PemanduhomestayPage {
  BASE_URL = 'http://setapakbogor.site/';
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});
  kecamatans: any = [];
  homestay: {nama_hs?: string, alamat_id?: any, harga_perhari?: any, deskripsi?: any, alamat_lengkap?: any, status_avail?: any};
  fasilitas: {ac?: any, wifi?: any, parkir_count?: any, mandi?: any, tidur?: any};

  constructor(public loadCtrl: LoadingController, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public http: Http, private userData: UserData, private pemanduData: PemanduDataProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PemanduhomestayPage');
  }

  ionViewWillEnter() {
    this.getKecamatan();
  }

  touchButtonCreate() {
    let loading = this.loadCtrl.create({
      content: 'Tunggu sebentar...'
    });
    loading.present();
    let homestay = JSON.stringify({
      hama_hs: this.homestay.nama_hs,
      alamat_id: this.homestay.alamat_id,
      harga_perhari: this.homestay.harga_perhari,
      deskripsi: this.homestay.deskripsi,
      alamat_lengkap: this.homestay.alamat_lengkap,
      status_avail: this.homestay.status_avail = 1
    })
    console.log("ini homestay dari depan", homestay)
  }

  getKecamatan() {
    this.http.get(this.userData.BASE_URL+'api/alamat/kecamatan', this.options).subscribe( data=> {
      let response = data.json();
      this.kecamatans = response.data;
      console.log("kecamatans",this.kecamatans);
    })
  }
}
