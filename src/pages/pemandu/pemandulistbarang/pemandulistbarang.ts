import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController, LoadingController, ToastController, Toast } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import { PemanduDataProvider } from '../../../providers/pemandu-data/pemandu-data';
import { Camera, CameraOptions} from '@ionic-native/camera';

/**
 * Generated class for the PemandulistbarangPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pemandulistbarang',
  templateUrl: 'pemandulistbarang.html',
})
export class PemandulistbarangPage {
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});

  BASE_URL = "http://setapakbogor.site"
  user_id: any;
  pemandu_id: any;
  my_barangs: any = [];
  currentbarang_id: number;
  alamat_id: any;
  fasilitas_id: any;
  fasilitas: any;
  currentbarang: any;
  edited: any;

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

  constructor(
    public alertCtrl: AlertController, 
    public Camera: Camera,
     public navCtrl: NavController, 
     public navParams: NavParams, 
     public http: Http, 
     public userData: UserData, 
     public pemanduData: PemanduDataProvider,
     public loadCtrl: LoadingController,
     public actionSheetCtrl: ActionSheetController,
     public toastCtrl: ToastController ) {
    this.currentbarang_id = navParams.data.barang_id
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PemandulistbarangPage');
  }

  ionViewWillEnter() {
    // this.getPemanduId();
    // this.getAllMyHomestay();
    this.getDetailBarang();
  }

  doRefresh(refresher){
    setTimeout(() => {
      refresher.complete();
      this.ionViewWillEnter();
      //     
    }, 1000);
  }

  getDetailBarang() {
    this.http.get(this.userData.BASE_URL+'api/produk/detail/'+this.currentbarang_id, this.options).subscribe(data => {
      let response = data.json();
      if(response.status == true) {
        this.currentbarang = response.data[0];
        console.log("niiiiiiiiiiiiiiih", this.currentbarang);
      }
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
      barang_id: this.currentbarang_id,
      picture: this.base64String,      
    });  
    this.http.post(this.userData.BASE_URL+'api/barang/upload/barangphoto',param,this.options).subscribe(res => {
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

  editIdentitasB(id: number) {
    this.edited = "identitas";
    this.navCtrl.push("PemandueditproductPage", {barang_id: id, edit: this.edited});
  }

  editJumlahB(id: number) {
    this.edited = "jumlah"
    this.navCtrl.push("PemandueditproductPage", {barang_id: id, edit: this.edited})
  }

}
