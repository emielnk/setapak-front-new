import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, ActionSheetController, App } from 'ionic-angular';
import { UserData } from '../../../providers/user-data';
import { AuthHttp } from 'angular2-jwt';
import { Storage } from '@ionic/storage';
import { Http,Headers, RequestOptions } from '@angular/http';
import { Camera, CameraOptions } from '@ionic-native/camera';


/**
 * Generated class for the EditprofilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editprofile',
  templateUrl: 'editprofile.html',
})
export class EditprofilePage {
  
  user: {user_id?: string, nama?: string, email?: string, alamat?: string, nohp?: string, userphoto?:string} = {};
  token: string;
  base64Image: string;
  submitted = false;
  BASE_URL = 'http://setapakbogor.site/';     
  tempProfPict:any;
  temp: any;
  loading: any;
  base64String:any;
  optionsTake: CameraOptions = {    
    destinationType: this.Camera.DestinationType.DATA_URL,    
    targetWidth: 600,
    targetHeight: 600
  }
  optionsGalery: CameraOptions = {    
    destinationType: this.Camera.DestinationType.DATA_URL,
    sourceType     : this.Camera.PictureSourceType.PHOTOLIBRARY,
    targetWidth: 600,
    targetHeight: 600
  }

  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});

  image = document.getElementById('myImage');


  constructor(
    public navCtrl: NavController, 
  	public navParams: NavParams,
  	public userData: UserData,
  	public toastCtrl: ToastController,
  	public loadCtrl: LoadingController,
    public authHttp: AuthHttp,
    public actionSheetCtrl: ActionSheetController,
    public Camera: Camera,
    public http: Http,
    public app: App
    ) {
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad EditprofilePage');
    
  }

  ionViewWillEnter(){
  	this.userData.getData().then((value)=>{
      this.user.nama = value.nama;
      this.user.email = value.email;
      this.user.nohp = value.no_hp;
      this.user.alamat = value.alamat;
      this.user.user_id = value.user_id
    });
    this.userData.getToken().then((token) => {
      this.token = token;
    });
    this.profpict();

  }
  
  takePicture(){
    console.log('masuk')
    this.Camera.getPicture(this.optionsTake).then((imageData) => {
      this.base64String = "data:image/jpeg;base64," + imageData;
      this.base64Image = imageData;      
      //console.log(this.base64Image)      
      this.postUpdatePicture();
      this.profpict();
      
     }, (err) => {
      // Handle error
     });    
  }
  getPhotoFromGallery(){
    console.log('masuk')
    this.Camera.getPicture(this.optionsGalery).then((imageData) => {
      this.base64String = "data:image/jpeg;base64," + imageData;
      this.base64Image = imageData;       
      //console.log(this.base64Image)     
      this.postUpdatePicture();
      this.profpict();
     }, (err) => {
      // Handle error
     });
  }

  updatePicture() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Pilihan',
      buttons: [
        {
          text: 'Ambil Gambar',
          role: 'ambilGambar',
          handler: () => {
            this.takePicture();
          }
        },
        {
          text: 'Pilih Dari Galleri',
          role: 'gallery',
          handler: () => {
            this.getPhotoFromGallery();
          }
        }
      ]
    });
    actionSheet.present();
  }

  postUpdatePicture(){
    this.loading = this.loadCtrl.create({
        content: 'Uploading image...'
    });
    this.loading.present();
    let param = JSON.stringify({
       picture: this.base64String,
       token :this.token       
    });  
    this.http.post(this.userData.BASE_URL+'api/user/upload/userphoto',param,this.options).subscribe(res => {
      this.loading.dismiss();
      let response = res.json();
      if(response.status==200) {        
        this.userData.updateProfilePict(response.photo);
        this.profpict()       
        this.showAlert(response.message); 
      }
      console.log(response.data)         
    }, err => { 
        this.loading.dismiss();
        this.showError(err);
    });
  }

  onUpdate(form: NgForm) {
    this.submitted = true;
    let loading = this.loadCtrl.create({
        content: 'Tunggu sebentar...'
    });
    if (form.valid) {
    	loading.present();
      let param = JSON.stringify({
        user_id : this.user.user_id,
        nama : this.user.nama,
        email : this.user.email,
        alamat: this.user.alamat,
        no_hp: this.user.nohp,
        token : this.token
      });
      this.authHttp.post(this.userData.BASE_URL+'api/user/updateprofile',param).subscribe(res => {
      	loading.dismiss();
        let response = res.json();
        if(response.status == 200) {
          this.userData.login(response.data);
          this.showAlert(response.message);
          this.navCtrl.popToRoot();
        } else if(response.status == 400) {
          this.showAlert(response.message);
        }
      }, err => { 
      	loading.dismiss();
         this.showError(err);
      });

    }
  }
  doRefresh(refresher){
    setTimeout(() => {
      refresher.complete();      
      this.profpict(); 
      //     
    }, 1000);
  }
  showError(err: any){  
    err.status==0? 
    this.showAlert("Tidak ada koneksi. Cek kembali sambungan Internet perangkat Anda"):
    this.showAlert("Tidak dapat menyambungkan ke server. Mohon muat kembali halaman ini");
  }
  showAlert(message: string){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  profpict() {
    this.userData.getProfilePict().then((profpict) => {
      this.tempProfPict = profpict
      this.user.userphoto = this.BASE_URL + profpict;    
    });
  }
}
