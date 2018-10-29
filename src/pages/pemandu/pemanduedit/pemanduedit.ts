import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { PemanduDataProvider } from '../../../providers/pemandu-data/pemandu-data'
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import { NgForm } from '../../../../node_modules/@angular/forms';
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
  public new_profile: {nama_company?: string, alamat?: string, deskripsi?: string, nomor_telepon?: string} = {}
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
    public loadCtrl: LoadingController,
    public toastCtrl: ToastController) {

      this.masks = {
        phoneNumber: ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
        cardNumber: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/],
        cardExpiry: [/[0-1]/, /\d/, '/', /[1-2]/, /\d/],
        orderCode: [/[a-zA-z]/, ':', /\d/, /\d/, /\d/, /\d/]
    };
  }

  firsSet() {
    this.new_profile.nama_company = this.nama_company;
    this.new_profile.alamat = this.alamat;
    this.new_profile.deskripsi = this.deskripsi;
    this.new_profile.nomor_telepon = this.no_telp;
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
      this.firsSet()
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

  saveEditProfile(form: NgForm) {
    let loading = this.loadCtrl.create({
      content: 'Tunggu sebentar...'
    });
    loading.present();
    let newValue = JSON.stringify({
      id: this.pemandu_id,
      nama_company: this.new_profile.nama_company,
      deskripsi: this.new_profile.deskripsi,
      alamat: this.new_profile.alamat,
      telepon: this.new_profile.nomor_telepon
    })
    console.log("nih gaaaan", newValue);
    this.http.post(this.userData.BASE_URL+'api/pemandu/profile/update',newValue,this.options).subscribe(data => {
      let response = data.json();
      if(response.success == true){
        loading.dismiss();
        this.showAlert("Sukses Update Informasi")
        console.log("resnponse update f hs", response);
      }
    })
    this.navCtrl.pop();
  }

  showAlert(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  updatePicture() {
    let alert = this.alertCtrl.create({
      title: "Perhatian",
      message: "Foto masih dalam tahap pengembangan",
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    })
    alert.present()
  }

}
