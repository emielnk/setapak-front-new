import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import { PemanduDataProvider } from '../../../providers/pemandu-data/pemandu-data';

/**
 * Generated class for the PemandulistbarangPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pemandulistbarang',
  templateUrl: 'pemandulistbarang.html',
})
export class PemandulistbarangPage {
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});

  BASE_URL = "http://setapakbogor.site"
  user_id: any;
  pemandu_id: any;
  my_barangs: any = [];
  currentbarang_id: number;
  alamat_id: any;
  fasilitas_id: any;
  fasilitas: any;
  currentbarang: any;

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public http: Http, public userData: UserData, public pemanduData: PemanduDataProvider) {
    this.currentbarang_id = navParams.data.barang_id
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PemandulistbarangPage');
  }

  ionViewWillEnter() {
    // this.getPemanduId();
    // this.getAllMyHomestay();
    this.getDetailBarang();
  }

  doRefresh(refresher){
    setTimeout(() => {
      refresher.complete();
      this.ionViewWillEnter();
      //     
    }, 1000);
  }

  getDetailBarang() {
    this.http.get(this.userData.BASE_URL+'api/produk/detail/'+this.currentbarang_id, this.options).subscribe(data => {
      let response = data.json();
      if(response.status == true) {
        this.currentbarang = response.data[0];
        console.log("niiiiiiiiiiiiiiih", this.currentbarang);
      }
    })
  }

}
