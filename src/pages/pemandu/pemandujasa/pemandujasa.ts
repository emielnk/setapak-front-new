import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import { PemanduDataProvider } from '../../../providers/pemandu-data/pemandu-data';
import { NgForm } from '../../../../node_modules/@angular/forms';
/**
 * Generated class for the PemandujasaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pemandujasa',
  templateUrl: 'pemandujasa.html',
})
export class PemandujasaPage {
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});
  segment: String = 'homestay';
  kecamatans: any = [];
  jenisjasas: any = [];
  jasa: {
    pemandu_id?: number,
    alamatcategory_id?: number, 
    jeniscategory_id?: number, 
    nama_jasa?: any, 
    harga_jasa?: any, 
    deskripsi?: any, 
    lokasi_wisata?: any,
    status_avail?: any,
    photo?: any
  } = {};
  constructor(public toastCtrl: ToastController, public alertCtrl: AlertController, public loadCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, private http: Http, private userData: UserData, private pemanduData: PemanduDataProvider) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PemandujasaPage');
  }

  ionViewWillEnter() {
    this.getKecamatan();
    this.getJenisJasa();
    // this.jasa.nama_jasa = null;
  }

  touchButtonCreate(form: NgForm) {
    let alert = this.alertCtrl.create({
      title: 'Perhatian',
      message: 'Apakah Anda sudah yakin dengan data yang dimasukkan',
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
            this.createJasa(form);
          }
        }
      ]
    });
    alert.present();
  }

  createJasa(form: NgForm) {
    this.pemanduData.getPemanduId().then((id) => {
      let loading = this.loadCtrl.create({
        content: "Tunggu sebentar..."
      });
      loading.present();
      let input = JSON.stringify({
        pemandu_id: id,
        alamat_id: this.jasa.alamatcategory_id,
        jeniscategory_id: this.jasa.jeniscategory_id,
        nama_jasa: this.jasa.nama_jasa,
        harga_jasa: this.jasa.harga_jasa,
        deskripsi: this.jasa.deskripsi,
        lokasi_wisata: this.jasa.lokasi_wisata,
        status_avail: 1,
        photo: "this.jasa.photo"
      });
      console.log("ini inputan", input);
      this.http.post(this.userData.BASE_URL+"api/pemandu/jasa/create",input,this.options).subscribe(data => {
        let response = data.json();
        console.log("reponse", response)
        if(response.success == false){
          loading.dismiss();
          this.showAlert("Mungkin data anda belum lengkap")
        }
        else{
          loading.dismiss();
          this.navCtrl.pop();
          // this.showAlertFasilitas();
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

  getJenisJasa() {
    this.http.get(this.userData.BASE_URL+'api/jenisjasa/category/all', this.options).subscribe( data=> {
      let response = data.json();
      this.jenisjasas = response.data;
      console.log("kecamatans",this.kecamatans);
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
}
