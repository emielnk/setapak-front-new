import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, ActionSheetController } from 'ionic-angular';
import { PemanduDataProvider } from '../../../providers/pemandu-data/pemandu-data'
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import { NgForm } from '../../../../node_modules/@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera';
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
  public new_profile: {nama_company?: string, alamat?: string, deskripsi?: string, nomor_telepon?: string, userphoto?: any} = {}
  pemandu_id: any;
  pemandu_profile: any;
  nama_company: any;
  alamat: any;
  deskripsi: any;
  since: any;
  status: any;
  base64Image: string;
  no_telp: any;
  tempProfPict:any;
  loading: any;
  BASE_URL = 'http://setapakbogor.site';

  base64String:any;
  photo_pemandu: any;
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

  masks: any;
  phoneNumber: any;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public pemanduData: PemanduDataProvider,
    public Camera: Camera,
    public http: Http,
    public userData: UserData,
    public alertCtrl: AlertController,
    public loadCtrl: LoadingController,
    public toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController) {

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
      this.photo_pemandu = profile.photo
      console.log(profile)
      console.log(this.status)
      console.log("fottttoooo", this.photo_pemandu)
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

  profpict() {
    this.userData.getProfilePict().then((profpict) => {
      this.tempProfPict = profpict
      this.new_profile.userphoto = this.BASE_URL + profpict;    
    });
  }

  takePicture(){
    console.log('masuk')
    this.Camera.getPicture(this.optionsTake).then((imageData) => {
      this.base64String = "data:image/jpeg;base64," + imageData;
      this.base64Image = imageData;      
      //console.log(this.base64Image)      
      this.loadingPhoto();
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
      this.loadingPhoto();
      this.profpict();
     }, (err) => {
      // Handle error
     });
  }

  loadingPhoto() {
    // let loading = this.loadCtrl.create({
    //   content: 'Mengunggah foto...'
    // });
    // loading.present();
    this.loading = this.loadCtrl.create({
      content: 'Uploading image...'
    });
    this.loading.present();
    let param = JSON.stringify({
      pemandu_id: this.pemandu_id,
      picture: this.base64String,      
    });  
    this.http.post(this.userData.BASE_URL+'api/pemandu/upload/pemanduphoto',param,this.options).subscribe(res => {
      this.loading.dismiss();
      let response = res.json();
      if(response.status==200) {        
        // this.userData.updateProfilePict(response.photo);
        // this.profpict()       
        this.showAlert(response.message); 
      }
      console.log(response.data)         
    }, err => { 
        this.loading.dismiss();
        this.showError(err);
    });
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

  showError(err: any){  
    err.status==0? 
    this.showAlert("Tidak ada koneksi. Cek kembali sambungan Internet perangkat Anda"):
    this.showAlert("Tidak dapat menyambungkan ke server. Mohon muat kembali halaman ini");
  }

  // updatePicture() {
  //   let alert = this.alertCtrl.create({
  //     title: "Perhatian",
  //     message: "Foto masih dalam tahap pengembangan",
  //     buttons: [
  //       {
  //         text: 'Batal',
  //         role: 'cancel',
  //         handler: () => {
  //           console.log('Cancel clicked');
  //         }
  //       }
  //     ]
  //   })
  //   alert.present()
  // }

}
