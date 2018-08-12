import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http'
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { ImagePicker } from '@ionic-native/image-picker';
import { Base64 } from '@ionic-native/base64';
import { UserData } from '../../../providers/user-data';
import { NgForm } from '../../../../node_modules/@angular/forms';
/**
 * Generated class for the PemanduregisPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pemanduregis',
  templateUrl: 'pemanduregis.html',
})


export class PemanduregisPage {
  headers = new Headers({ 
    'Content-Type': 'application/json'
  });
  options = new RequestOptions({ headers: this.headers});
  submitted = false;
  regData = { avatar:'', email: '', password: '', fullname: '' };
  imgPreview = 'assets/imgs/blank-avatar.jpg';
  kecamatans: any;
  pemandu: {
    // user_id?: number,
    alamat_id?: any,
    namacompany?: number,
    user_id?: number,
    no_telp?: any,
    alamat?: string,
    deskripsi?: string,
    pemandu_status?: number,
    pemandu_verivikasi?: number,
    photo?: any,
  } = {}
  constructor(public navCtrl: NavController, 
    public toastCtrl: ToastController,
    public http: Http,
    public navParams: NavParams,
    public userData : UserData,
    public loadCtrl: LoadingController,
    private transfer: FileTransfer,
    private camera: Camera,
    public alertCtrl: AlertController,
    private imagePicker: ImagePicker,
    private base64: Base64) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PemanduregisPage');
    this.regisAlert()
    this.cekIsVerified();
  }

  regisAlert() {
    let alert = this.alertCtrl.create({
      title: "Belum Mendaftar",
      message: "Anda belum pernah mendaftar sebagai Pemandu Wisata. Halaman ini bisa di akses bila anda sudah terdaftar sebagai pemandu wisata",
      buttons: ['OK']
    })
    alert.present();
  }

  ionViewWillEnter() {
    this.getKecamatan();
  }

  getKecamatan() {
    this.http.get(this.userData.BASE_URL+'api/alamat/kecamatan', this.options).subscribe( data=> {
      let response = data.json();
      this.kecamatans = response.data;
      console.log("kecamatans",this.kecamatans);
    })
  }

  getImage() {
    let options = {
      maximumImagesCount: 1
    };
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
          this.imgPreview = results[i];
          this.base64.encodeFile(results[i]).then((base64File: string) => {
            this.regData.avatar = base64File;
          }, (err) => {
            console.log(err);
          });
      }
    }, (err) => { });
  }

  cekIsVerified() {
    this.userData.getId().then((id) => {
      this.http.get(this.userData.BASE_URL+"api/pemandu/registrasi/"+id, this.options).subscribe(data => {
        let response = data.json();
        console.log("ir verified", response);
      })
    })

  }

  touchRegister(form) {
    const confirm = this.alertCtrl.create({
      title: 'Anda Yakin Dengan Data Anda?',
      buttons: [
        {
          text: 'Batal',
          role: 'cancel',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Yakin',
          handler: () => {
            this.registPemandu(form);
          }
        }
      ]
    });
    confirm.present();
  }

  registPemandu(form: NgForm) {
    this.submitted = true;
    this.userData.getId().then((id) => {
      // this.pemandu.user_id = id;
      let loading = this.loadCtrl.create({
        content: 'Tunggu sebentar...'
      });
      
      loading.present();
      let input = JSON.stringify({ 
        user_id: id,
        alamat_id: this.pemandu.alamat_id, 
        nama_company: this.pemandu.namacompany,
        no_telp: this.pemandu.no_telp,
        alamat: this.pemandu.alamat,
        deskripsi: this.pemandu.deskripsi,
        pemandu_status: 0,
        pemandu_verifikasi: 0
      });
      console.log(input);
      this.http.post(this.userData.BASE_URL+"api/pemandu/registrasi/", input, this.options).subscribe(data => {
        loading.dismiss();
        let response = data.json();
        this.navCtrl.push('ProfileAccountPage');           
        this.showAlert(response.message);
      },err => { 
          loading.dismiss();
          this.showError(err);
          console.log(err);
      });
    })

  }

  showError(err: any){  
    err.status==0? 
    this.showAlert("Tidak ada koneksi. Cek kembali sambungan Internet perangkat Anda"):
    this.showAlert("Tidak dapat menyambungkan ke server. Mohon muat kembali halaman ini");
  }
  showAlert(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
}
