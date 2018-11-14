import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController, LoadingController, ToastController, Toast } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import { PemanduDataProvider } from '../../../providers/pemandu-data/pemandu-data';
import { Camera, CameraOptions} from '@ionic-native/camera';

/**
 * Generated class for the PemandulistservicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pemandulistservice',
  templateUrl: 'pemandulistservice.html',
})
export class PemandulistservicePage {
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});
  BASE_URL: 'http://setapakbogor.site/'
  
  user_id: number;
  pemandu_id: number;
  currentjasa_id: number;
  fasilitas: number;
  currentjasa: any;
  alamat_id: number;
  fasilitas_id: number;
  alamatcategory: any;

  base64Image: string;
  loading: any;

  base64String:any;
  photo_homestay: any;
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

  constructor(public alertCtrl: AlertController, 
    public Camera: Camera,
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public http: Http, 
    public userData: UserData, 
    public pemanduData: PemanduDataProvider,
    public loadCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController) {
    this.currentjasa_id = navParams.data.jasa_id
  }

  ionViewWillEnter() {
    // this.getPemanduId();
    // this.getAllMyHomestay();
    this.getServiceById();
  }

  doRefresh(refresher){
    setTimeout(() => {
      refresher.complete();
      this.ionViewWillEnter();
      //     
    }, 1000);
  }
  navEditServiceyById() {
    this.navCtrl.push("PemandueditservicePage")
  }

  getServiceById() {
    this.http.get(this.userData.BASE_URL+'api/jasa/detail/'+this.currentjasa_id, this.options).subscribe(data => {
      let response = data.json();
      if(response.status == true){
        this.currentjasa = response.data[0];
        this.alamat_id = this.currentjasa.alamatcategory_id;
        this.fasilitas_id = this.currentjasa.fasilitas_id;
        this.getAlamatDetail(this.alamat_id);
        this.getFasilitasDetail(this.currentjasa_id);
        console.log("ini data detailnya", this.currentjasa);
      }
    })
  }

  getAlamatDetail(id: number) {
    this.http.get(this.userData.BASE_URL+'api/alamat/category/'+id, this.options).subscribe(data => {
      let response = data.json();
      this.alamatcategory = response.data[0];
      // console.log(response);
      // console.log(this.alamatcategory);
    })
  }

  getFasilitasDetail(id: number) {
    this.http.get(this.userData.BASE_URL+'api/jasa/fasilitas/'+id, this.options).subscribe(data => {
      let response = data.json();
      this.fasilitas = response.data;
      // console.log(response);
      console.log("fasilitassssss",this.fasilitas);
    })
  }

  editFasilitasJasa(id: number) {
    let alert = this.alertCtrl.create({
      title: "Perhatian",
      message: "Fitur ini masih dalam pengembangan",
      buttons: [
        {
          text: 'Oke',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    })
    alert.present()
  }

  editIdentitasJasa(id: number) {
    this.navCtrl.push('PemandueditservicePage', {id: id});
  }

  editMeetPoint() {
    let alert = this.alertCtrl.create({
      title: "Perhatian",
      message: "Fitur ini masih dalam pengembangan",
      buttons: [
        {
          text: 'Oke',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    })
    alert.present()
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
          text: 'Pilih Dari Galeri',
          role: 'gallery',
          handler: () => {
            this.getPhotoFromGallery();
          }
        }
      ]
    });
    actionSheet.present();
  }

  takePicture(){
    console.log('masuk')
    this.Camera.getPicture(this.optionsTake).then((imageData) => {
      this.base64String = "data:image/jpeg;base64," + imageData;
      this.base64Image = imageData;      
      //console.log(this.base64Image)      
      this.loadingPhoto();
      // this.profpict();
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
      // this.profpict();
     }, (err) => {
      // Handle error
     });
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
      jasa_id: this.currentjasa_id,
      picture: this.base64String,      
    });  
    this.http.post(this.userData.BASE_URL+'api/jasa/upload/jasaphoto',param,this.options).subscribe(res => {
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

}
