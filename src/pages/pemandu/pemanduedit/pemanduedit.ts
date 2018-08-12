import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { PemanduDataProvider } from '../../../providers/pemandu-data/pemandu-data'
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
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
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});
  pemandu_id: any;
  pemandu_profile: any;
  nama_company: any;
  alamat: any;
  deskripsi: any;
  since: any;
  status: any;
  no_telp: any;

  masks: any;
  phoneNumber: any;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public pemanduData: PemanduDataProvider,
    public http: Http,
    public userData: UserData,
    public alertCtrl: AlertController,
    public loadCtrl: LoadingController) {

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
      this.no_telp = profile.nomor_telepon
      this.status = profile.pemandu_status
      console.log(profile)
      console.log(this.status)
    })
  }

  touchAktifkan(){
    let alert = this.alertCtrl.create({
      title: "Perhatian",
      message: "Apakah Anda Yakin Ingin Mengaktifkan Perusahaan Anda?",
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
            this.aktifkanPerusahaan();
          }
        }
      ]
    })
    alert.present()
  }

  aktifkanPerusahaan() {
    this.pemanduData.getPemanduId().then(id => {
      this.pemandu_id = id;
      let loading = this.loadCtrl.create({
        content: "Tunggu sebentar.."
      });
      loading.present();
      this.http.get(this.userData.BASE_URL+'api/pemandu/aktif/'+this.pemandu_id, this.options).subscribe(data => {
        loading.dismiss();
        this.navCtrl.pop();
      })
    })
  }

  touchNonAktif() {
    let alert = this.alertCtrl.create({
      title: "Perhatian",
      message: "Apakah Anda Yakin Ingin Non Aktifkan Perusahaan Anda?",
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
            this.nonAktifkanPerusahaan();
          }
        }
      ]
    })
    alert.present()
  }

  nonAktifkanPerusahaan() {
    this.pemanduData.getPemanduId().then(id => {
      this.pemandu_id = id;
      let loading = this.loadCtrl.create({
        content: "Tunggu sebentar.."
      })
      loading.present();
      this.http.get(this.userData.BASE_URL+'api/pemandu/nonaktif/'+this.pemandu_id, this.options).subscribe(data => {
        // let response = data.json();
        loading.dismiss();
        this.navCtrl.pop();
      })
    })
  }

}
