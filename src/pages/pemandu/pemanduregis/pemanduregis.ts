import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, DateTime } from 'ionic-angular';
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
  pemandu: {
    // user_id?: number,
    namacompany?: string,
    alamat?: string,
    deskripsi?: string
  } = {}
  constructor(public navCtrl: NavController, 
    public toastCtrl: ToastController,
    public http: Http,
    public navParams: NavParams,
    public userData : UserData,
    public loadCtrl: LoadingController,
    private transfer: FileTransfer,
    private camera: Camera,
    private imagePicker: ImagePicker,
    private base64: Base64) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PemanduregisPage');
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

  registPemandu(form: NgForm) {
    this.submitted = true;
    let loading = this.loadCtrl.create({
        content: 'Tunggu sebentar...'
    });

    if(form.valid){
      let input = JSON.stringify({ 
        // user_id: this.pemandu.user_id, 
        nama_company:this.pemandu.namacompany,
        alamat: this.pemandu.alamat,
        deskripsi: this.pemandu.deskripsi,
      });
      console.log(input)
      this.http.post(this.userData.BASE_URL + "api/regispemandu/create/post", input, this.options).subscribe(data => {
        loading.dismiss();
        let response = data.json();           
        this.showAlert(response.message);
     }, err => { 
        loading.dismiss();
        this.showError(err);
        console.log(err);
     });

    }
    else {
      console.log("ga bisa gan")
    }
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
