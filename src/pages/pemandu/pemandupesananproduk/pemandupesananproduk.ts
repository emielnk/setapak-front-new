import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserData } from '../../../providers/user-data';
import { Http,Headers,RequestOptions } from '@angular/http';

/**
 * Generated class for the PemandupesananprodukPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pemandupesananproduk',
  templateUrl: 'pemandupesananproduk.html',
})
export class PemandupesananprodukPage {
  BASE_URL = 'http://setapakbogor.site/';
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});
  detail_trans: any;
  trans_id: any;
  detail_produk: any;
  detail_pemesan: any;
  no_hp_wa: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public userData: UserData) {
    this.trans_id = navParams.data.transaction_id
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PemandupesananprodukPage');
  }

  ionViewWillEnter() {
    this.getDetailTransProduk();
  }

  doRefresh(refresher){
    setTimeout(() => {
      refresher.complete();
      this.ionViewWillEnter();     
    }, 1000);
  
  }

  getDetailTransProduk() {
    this.http.get(this.userData.BASE_URL+"api/pemandu/detail/transaksi/produk/"+this.trans_id,this.options).subscribe(data => {
      let response = data.json();
      this.detail_trans = response.data[0];
      console.log("detail trans produk saya = ", this.detail_trans)
      this.getDetailProduk(this.detail_trans.barang_id);
      this.getDetailPemesan(this.detail_trans.user_id);
    })
  }

  getDetailProduk(id: number) {
    this.http.get(this.userData.BASE_URL+"api/produk/detail/"+id, this.options).subscribe(data => {
      let response = data.json();
      if(response.status == true){
        this.detail_produk = response.data[0];
      }
      console.log("detail produk", this.detail_produk)
    })
  }

  getDetailPemesan(id: number) {
    this.http.get(this.userData.BASE_URL+'api/wisatawan/detail/'+id, this.options).subscribe(data => {
      let response = data.json();
      this.detail_pemesan = response.data[0];
      this.no_hp_wa = this.detail_pemesan.no_hp;
      this.no_hp_wa = this.no_hp_wa.toString();
      if(this.no_hp_wa.charAt(0) == "0") {
        this.no_hp_wa = this.no_hp_wa.substr(1);
      }
      console.log("no hp wa", this.detail_pemesan)
    })
  }
}
