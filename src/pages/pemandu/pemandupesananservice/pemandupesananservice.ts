import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import { relativeTimeThreshold } from '../../../../node_modules/moment';


/**
 * Generated class for the PemandupesananservicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pemandupesananservice',
  templateUrl: 'pemandupesananservice.html',
})
export class PemandupesananservicePage {
  BASE_URL = 'http://setapakbogor.site/';
  trans_id: any;
  detail_jasa: any;
  detail_pemesan: any;
  no_hp_wa: any;
  isAvalible: any;
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});
  detail_trans: any;

  constructor(public loadCtrl: LoadingController, public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams, public http: Http, public userData: UserData) {
    this.trans_id = navParams.data.transaction_id
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PemandupesananservicePage');
  }

  ionViewWillEnter() {
    this.getDetailTransJasa();
  }

  doRefresh(refresher){
    setTimeout(() => {
      refresher.complete();
      this.ionViewWillEnter();     
    }, 1000);
  
  }

  getDetailTransJasa() {
    this.http.get(this.userData.BASE_URL+"api/pemandu/detail/transaksi/jasa/"+this.trans_id,this.options).subscribe(data => {
      let response = data.json();
      this.detail_trans = response.data[0];
      console.log("detail trans jasa saya = ", this.detail_trans)
      this.getDetailJasa(this.detail_trans.jasa_id);
      this.getDetailPemesan(this.detail_trans.user_id);
    })
  }

  getDetailJasa(id: number) {
    this.http.get(this.userData.BASE_URL+"api/jasa/detail/"+id, this.options).subscribe(data => {
      let response = data.json();
      if(response.status == true){
        this.detail_jasa = response.data[0];
      }
      console.log("detail jasa", this.detail_jasa)
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

  touchTerimaPesanan(id: number, status: number) {
    let alert = this.alertCtrl.create({
      title: 'Konfitmasi Terima Pesanan',
      message: 'Apakah Anda yakin ingin menerima pesanan ini?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ya',
          handler: () => {
            this.terimaPesananJasa(id, status);
          }
        }
      ]
    });
    alert.present();
  }

  touchTolakPesanan(id: number, status: number) {
    let alert = this.alertCtrl.create({
      title: 'Konfirmasi Menolak Pesanan',
      message: 'Apakah Anda yakin ingin menolak pesanan ini?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Ya',
          handler: () => {
            this.tolakPesananJasa(id, status);
          }
        }
      ]
    });
    alert.present();
  }

  cekIsHsAvalible() {
    let jasa_id = this.detail_trans.jasa_id;
    let id =  this.detail_trans.transaction_id
    this.http.get(this.userData.BASE_URL+"api/jasa/check/avalible/"+id+'/'+jasa_id, this.options).subscribe(data => {
      let response = data.json();
      console.log("cek tanggal berhasil", response)
      if(response.length == 0){
        this.isAvalible = "empty"
      }
      else {
        this.isAvalible = "notempty"
      }
      console.log("isAvalible = ", this.isAvalible)
    })
  }

  terimaPesananJasa(id: number, status: number) {
    let loading = this.loadCtrl.create({
      content: 'Tunggu sebentar'
    });
    this.cekIsHsAvalible();
    if(this.isAvalible == "empty"){
      if(status == 2) {
        loading.present();
        let param = JSON.stringify({
          transaction_status: status,
          transaction_id: id,
          new_status: 3
        });
        this.http.post(this.userData.BASE_URL+'api/transaksi/jasa/update/'+id, param, this.options).subscribe(data => {
          loading.dismiss();
          let response = data.json();
          this.navCtrl.popTo('PemanduhomePage');
          const alert = this.alertCtrl.create({
            title: 'Pesanan Diterima',
            subTitle: 'Pesanan ini bisa dilihat pada menu semua transaksi',
            buttons: ['OK']
          });
          alert.present();
          console.log("updated gak?", response)
        })
      }
    }
    else {
      const alert = this.alertCtrl.create({
        title: 'Jasa ini sedang aktif',
        subTitle: 'batalkan pesanan ini atau hubungi pemesan',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  tolakPesananJasa(id: number, status: number) {
    let loading = this.loadCtrl.create({
      content: 'Tunggu sebentar'
    });
    loading.present();
    let param = JSON.stringify({
      transaction_status: status,
      transaction_id: id,
      new_status: 7
    });
    this.http.post(this.userData.BASE_URL+'api/transaksi/jasa/update/'+id, param, this.options).subscribe(data => {
      loading.dismiss();
      let response = data.json();
      this.navCtrl.popTo('PemanduhomePage');
      const alert = this.alertCtrl.create({
        title: 'Pesanan Ditolak',
        subTitle: 'riwayat pesanan ini bisa dilihat pada menu semua transaksi',
        buttons: ['OK']
      });
      alert.present();
      console.log("updated gak?", response)
    })
  }

}
