import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import { PemanduDataProvider } from '../../../providers/pemandu-data/pemandu-data';

/**
 * Generated class for the PemandutranskirimbarangPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pemandutranskirimbarang',
  templateUrl: 'pemandutranskirimbarang.html',
})
export class PemandutranskirimbarangPage {
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});

  user_id: any;
  BASE_URL = 'http://setapakbogor.site/';
  pemandu_id: any;
  status: any = 4;
  dataTransStatusBarang: any = [];
  start_tabs: any;

  constructor(public http: Http, public app: App, public userData: UserData, public pemanduData: PemanduDataProvider,public navCtrl: NavController, public navParams: NavParams) {
  }

  doRefresh(refresher) {
    setTimeout(() => {
      refresher.complete();
      this.ionViewWillEnter();
      //     
    }, 1000);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PemandutransmenunggubayarPage');
  }

  ionViewWillEnter() {
    this.getTransProdukTungguBayar(this.status);
  }

  getTransProdukTungguBayar(status: number) {
    this.pemanduData.getPemanduId().then(id => {
      this.pemandu_id = id
      this.status = status
      this.http.get(this.userData.BASE_URL+'api/transaksi/produk/'+this.pemandu_id+'/'+status, this.options).subscribe(data => {
        let response = data.json();
        if(response.status == true) {
          this.dataTransStatusBarang = response.data;
          // console.log(this.dataTransStatus);
          for(let i = 0; i < this.dataTransStatusBarang.length; i++){
            this.getDetailTransBarang(this.dataTransStatusBarang[i].barang_id, i)
            this.getDetailTransPemesanBarang(this.dataTransStatusBarang[i].user_id, i)
          }
          console.log("Barang nih = ", this.dataTransStatusBarang)
        }
      })
    })
  }

  getDetailTransBarang(id: number, i: number) {
    this.http.get(this.userData.BASE_URL+'api/produk/detail/'+id, this.options).subscribe(data => {
      let response = data.json();
      console.log("Barang nih response nya", response);
      this.dataTransStatusBarang[i].namaBarang = response.data[0].nama_barang
      // console.log("this.dataTransStatus[i] = ", this.dataTransStatus[i].namaHS)
    })
  }

  getDetailTransPemesanBarang(id: number, i: number) {
    this.http.get(this.userData.BASE_URL+'api/wisatawan/detail/'+id, this.options).subscribe(data => {
      let response = data.json();
      // console.log("Pemesan dari data trans status ", response.data[0])
      this.dataTransStatusBarang[i].namaPemesan = response.data[0].nama;
      this.dataTransStatusBarang[i].noPemesan = response.data[0].no_hp;
      this.dataTransStatusBarang[i].photoPemesan = response.data[0].photo;
    })
  }

  navDetailTransProduk(id: number) {
    this.app.getRootNav().push('PemandupesananprodukPage', {transaction_id: id});
  }

}
