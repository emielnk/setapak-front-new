import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import { AuthHttp } from 'angular2-jwt';
/**
 * Generated class for the PemandupesananhomestayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pemandupesananhomestay',
  templateUrl: 'pemandupesananhomestay.html',
})
export class PemandupesananhomestayPage {
  BASE_URL = 'http://setapakbogor.site/';
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});
  trans_id: any;
  detail_trans: any;
  detail_homestay: any;
  detail_pemesan: any;
  id_homestay: any;
  id_user: any;
  no_hp_wa: any;
  isAvalible: any;
  transaksi: {new_status?: number, trans_id?: number} = {}

  constructor(public alertCtrl: AlertController, public loadCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, public http: Http, public userData: UserData) {
    this.trans_id = navParams.data.transaction_id
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PemandupesananhomestayPage');
    // console.log(this.trans_id)
    this.getDetailTransHomestay();
  }

  ionViewWillEnter() {
    this.getDetailTransHomestay();
    // this.cekIsHsAvalible
    // this.getDetailHomestay();
  }

  doRefresh(refresher){
    setTimeout(() => {
      refresher.complete();
      this.ionViewWillEnter();
      //     
    }, 1000);
  }

  getDetailTransHomestay() {
    this.http.get(this.userData.BASE_URL+"api/pemandu/detail/transaksi/homestay/"+this.trans_id, this.options).subscribe(data => {
      let response = data.json();
      // console.log(response)
      if(response.status == true) {
        this.detail_trans = response.data[0];
        console.log("ini detailnya pak", this.detail_trans.homestay_id);
        this.id_homestay = this.detail_trans.homestay_id;
        this.id_user  = this.detail_trans.user_id;
        // console.log(this.id_user)
        this.getDetailHomestay(this.id_homestay);
        this.getDetailPemesan(this.id_user);
      }
    })
  }

  getDetailHomestay(id: number) {
    // console.log("masuk dah",id)
    this.http.get(this.userData.BASE_URL+"api/homestay/detail/"+id, this.options).subscribe(data => {
      let response = data.json();
      // console.log("ini HS nya", response);
      if(response.status == true){
        this.detail_homestay = response.data[0];
        // console.log("detail_homestay", this.detail_homestay)
        // console.log("detail_homestay photo", this.detail_homestay.mainphoto)
      }
    })
  }

  getDetailPemesan(id: number) {
    this.http.get(this.userData.BASE_URL+'api/wisatawan/detail/'+id, this.options).subscribe(data => {
      let response = data.json();
      console.log("ini HS bro", response.data[0]);
      this.detail_pemesan = response.data[0];
      console.log("detail_pemesan = ", this.detail_pemesan)
      this.no_hp_wa = this.detail_pemesan.no_hp;
      this.no_hp_wa = this.no_hp_wa.toString();
      if(this.no_hp_wa.charAt(0) == "0") {
        this.no_hp_wa = this.no_hp_wa.substr(1);
      }
      console.log("no udah jadi = ", this.no_hp_wa);
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
            this.terimaPesananHomestay(id, status);
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
            this.tolakPesananHomestay(id, status);
          }
        }
      ]
    });
    alert.present();
  }
  
  cekIsHsAvalible() {
    let homestay_id = this.detail_trans.homestay_id;
    let id =  this.detail_trans.transaction_id
    this.http.get(this.userData.BASE_URL+"api/homestay/check/avalible/"+id+'/'+homestay_id, this.options).subscribe(data => {
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

  terimaPesananHomestay(id: number, status: number) {
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
        this.http.post(this.userData.BASE_URL+'api/transaksi/homestay/update/'+id, param, this.options).subscribe(data => {
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
        title: 'Homestay ini sedang aktif',
        subTitle: 'batalkan pesanan ini atau hubungi pemesan',
        buttons: ['OK']
      });
      alert.present();
    }
  }

  tolakPesananHomestay(id: number, status: number) {
    let loading = this.loadCtrl.create({
      content: 'Tunggu sebentar'
    });
    loading.present();
    let param = JSON.stringify({
      transaction_status: status,
      transaction_id: id,
      new_status: 7
    });
    this.http.post(this.userData.BASE_URL+'api/transaksi/homestay/update/'+id, param, this.options).subscribe(data => {
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
