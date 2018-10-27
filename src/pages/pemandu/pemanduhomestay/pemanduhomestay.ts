import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import { PemanduDataProvider } from '../../../providers/pemandu-data/pemandu-data';
import { NgForm } from '../../../../node_modules/@angular/forms';

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
  wisatas: any = [];
  pemandu_id: number;
  public homestay: {nama_hs?: string, alamat_id?: number, wisata_id?: number, harga_perhari?: number, deskripsi?: any, alamat_lengkap?: any, status_avail?: any}  = {};
  public fasilitas: {ac?: any, wifi?: any, parkir_count?: any, mandi?: any, tidur?: any} = {};

  constructor(public toastCtrl: ToastController, public loadCtrl: LoadingController, public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public http: Http, private userData: UserData, private pemanduData: PemanduDataProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PemanduhomestayPage');
  }

  ionViewWillEnter() {
    this.getKecamatan();
    this.getWisataTerdekat();
    this.homestay.nama_hs = null;
    this.fasilitas = {};
  }

  touchButtonCreate(form: NgForm) {
    let loading = this.loadCtrl.create({
      content: 'Tunggu sebentar...'
    });
    this.pemanduData.getPemanduId().then((id) => {
      this.pemandu_id = id
      loading.present();
      let inpuths = JSON.stringify({
        nama_hs: this.homestay.nama_hs,
        pemandu_id: this.pemandu_id,
        alamat_id: this.homestay.alamat_id,
        wisata_id: this.homestay.wisata_id,
        harga_perhari: this.homestay.harga_perhari,
        deskripsi: this.homestay.deskripsi,
        alamat_lengkap: this.homestay.alamat_lengkap,
        status_avail: this.homestay.status_avail = 1
      });
      console.log("ini homestay dari depan", inpuths)
      this.http.post(this.userData.BASE_URL+"api/pemandu/homestay/create",inpuths,this.options).subscribe(data => {
        let response = data.json();
        if(response.success == false){
          loading.dismiss();
          this.showAlert("Data belum lengkap")
        }
        else{
          loading.dismiss();
          this.navCtrl.pop();
          this.showAlertFasilitas();
          this.showAlert(response.message);
        }
      })
    })
  
  }

  getKecamatan() {
    this.http.get(this.userData.BASE_URL+'api/alamat/kecamatan', this.options).subscribe( data=> {
      let response = data.json();
      this.kecamatans = response.data;
      console.log("kecamatans",this.kecamatans);
    })
  }

  getWisataTerdekat() {
    this.http.get(this.userData.BASE_URL+'api/wisata/category/all', this.options).subscribe(data => {
      let response = data.json();
      this.wisatas = response.data;
      console.log("ini data wisata terdekat", this.wisatas)
    })
  }

  showAlert(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
  
  showError(err: any){  
    err.status==0? 
    this.showAlert("Tidak ada koneksi. Cek kembali sambungan Internet perangkat Anda"):
    this.showAlert("Tidak dapat menyambungkan ke server. Mohon muat kembali halaman ini");
  }

  showAlertFasilitas() {
    let alert = this.alertCtrl.create({
      title: "Perhatian",
      message: 'Tambahkan Fasilitas Homestay anda pada Detail Homestay ',
      buttons: ['Oke']
    });
    alert.present();
  }
}
