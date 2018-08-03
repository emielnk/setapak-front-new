import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, App, LoadingController, ActionSheetController } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import { NgForm } from '@angular/forms';
import { AlertService } from '../../../providers/util/alert.service';
import { Camera, CameraOptions } from '@ionic-native/camera';



/**
 * Generated class for the TransaksihomestayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-transaksihomestay',
  templateUrl: 'transaksihomestay.html',
})
export class TransaksihomestayPage {
  token: string;
  BASE_URL = 'http://setapakbogor.site/';
  userLoggedIn: any;
  loading:any;
  submitted = false;
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});
  user: {user_id?: string, nama?: string, email?: string, alamat?: string, nohp?: string, userphoto?:string} = {};

  transaction_id :any;
  dataTransaksi:any;
  dataHomestay :any;          
  dataPemandu :any;
  idAlamatCategory :any;
  dataAlamatCategory :any;
  reviewExist:any;
  base64Image: string;
  base64String:any;
  optionsTake: CameraOptions = {    
    destinationType: this.Camera.DestinationType.DATA_URL,    
    targetWidth: 1080,
    targetHeight: 1080
  }
  optionsGalery: CameraOptions = {    
    destinationType: this.Camera.DestinationType.DATA_URL,
    sourceType     : this.Camera.PictureSourceType.PHOTOLIBRARY,
    targetWidth: 1080,
    targetHeight: 1080
  }
  
  constructor(public navCtrl: NavController,
    public alertService: AlertService, 
    public navParams: NavParams,
    public http: Http,    
    public userData: UserData,
    public toastCtrl : ToastController,
    public actionSheetCtrl: ActionSheetController,
    public app:App,
    public loadCtrl: LoadingController,
    public Camera: Camera,) {
    this.transaction_id = this.navParams.data.transactionId
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransaksihomestayPage');
  }

  ionViewWillEnter() { 
    this.loading = this.loadCtrl.create({
      content: 'Tunggu sebentar...'
      });
      this.loading.present()
      this.getReadyData().then((x) => {
        if (x) this.loading.dismiss();
    });      
  }

  getReadyData(){
    return new Promise((resolve) => {        
            this.getTransaksiHomestay(this.transaction_id)            
            //this.getAlamatCategory(this.idAlamatCategory);
            this.userData.getData().then((value)=>{
            this.user.nama = value.nama;
            this.user.email = value.email;
            this.user.nohp = value.no_hp;
            this.user.user_id = value.user_id
          });    
          this.userData.getToken().then((token) => {
            this.token = token;
          });
          
          //this.hitungTotalPrice();
          //this.getDataProduk(this.datahomestay.homestay_id);    
          resolve(true);
    });
  }

  getTransaksiHomestay(transaction_id){
    this.http.get(this.userData.BASE_URL+"api/transaksiHomestay/user/transaksibyid/"+transaction_id,this.options).subscribe(data => {
      let response = data.json();
      if(response.status==200) {
        this.dataTransaksi = response.data
        console.log(this.dataTransaksi)
        this.getDataHomestay(this.dataTransaksi.homestay_id)
        this.checkReviewExist(this.dataTransaksi.homestay_id,this.dataTransaksi.transaction_id)       
      }
   }, err => { 
      this.showError(err);
   });    
  }

  getDataHomestay(idHomestay){    
    this.http.get(this.userData.BASE_URL+"api/homestay/"+idHomestay,this.options).subscribe(data => {
      let response = data.json();
      if(response.status==200) {       
         this.dataHomestay = response.datahomestay 
         this.dataAlamatCategory = response.dataAlamatCategory        
         this.dataPemandu = response.dataPemandu
         //console.log("dataalamatcategory",this.dataAlamatCategory)   
      }
   }, err => { 
      this.showError(err);
   });
  }

  caraPembayaran(){
    this.app.getRootNav().push('TransaksipembayaranPage',{datatransaksi :this.dataTransaksi,})
  }

  uploadBuktiPembayaran(){    
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

takePicture(){
  console.log('masuk')
  this.Camera.getPicture(this.optionsTake).then((imageData) => {
    this.base64String = "data:image/jpeg;base64," + imageData;
    this.base64Image = imageData;      
    //console.log(this.base64Image)      
    this.postUpdatePicture(this.transaction_id);
    
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
    this.postUpdatePicture(this.transaction_id);
   }, (err) => {
    // Handle error
   });
}

postUpdatePicture(transactionid){
  this.loading = this.loadCtrl.create({
      content: 'Uploading image...'
  });
  this.loading.present();
  let param = JSON.stringify({
     transaction_id: transactionid,
     picture: this.base64String,
     token :this.token       
  });  
  this.http.post(this.userData.BASE_URL+'api/user/upload/buktipembayaran/homestay',param,this.options).subscribe(res => {
    this.loading.dismiss();
    let response = res.json();
    if(response.status==200) {        
      this.navCtrl.popToRoot()          
      this.showAlert(response.message); 
    }
    console.log(response.data)         
  }, err => { 
      this.loading.dismiss();
      this.showError(err);
  });
}

checkReviewExist(id,transaction_id){ 
  let param = JSON.stringify({
     produk_id: id,
     tipe_produk: 'Homestay', 
     transaction_id: transaction_id   
  });  
  this.http.post(this.userData.BASE_URL+'api/review/getreview',param,this.options).subscribe(res => {
   
    let response = res.json();
    if(response.status==200) {        
      this.reviewExist = true
      //console.log(this.reviewExist) 
    }else{
      this.reviewExist = false 
      //console.log(this.reviewExist) 
    }
  }, err => { 
      this.showError(err);
  });
}
 
  konfirmasiTransaksi(transaction_id){
    this.loading = this.loadCtrl.create({
      content: 'Tunggu sebentar...'
    });   
    this.alertService.presentAlertWithCallback('Konfirmasi Transaksi Selesai',
        'Anda yakin transaksi sudah selesai?').then((yes) => {
          if (yes) {
            this.loading.present();
            let input = JSON.stringify({      
              token: this.token
            }); 
            this.http.post(this.userData.BASE_URL+"api/transaksiHomestay/user/konfirmasi/"+transaction_id,input,this.options).subscribe(data => {
              this.loading.dismiss();
              let response = data.json();       
              if(response.status == 200) {
                this.navCtrl.popToRoot()
                this.showAlert(response.message); 
              }else{
                this.showAlert(response.message); 
              }
            }, err => { 
                this.loading.dismiss();
                this.showError(err);
            });                                        
          }
        });           
  }
  
  cancelTransaksi(transaction_status,transaction_id){
    if(transaction_status > 0){
      this.showAlert("Transaksi telah berjalan atau telah diproses");
    }else{
      this.loading = this.loadCtrl.create({
        content: 'Tunggu sebentar...'
      });
      console.log(transaction_id)  
      this.alertService.presentAlertWithCallback('Cancel Transaksi',
          'Anda yakin ingin cancel transaksi ini?').then((yes) => {
            if (yes) {
              this.loading.present();
              let input = JSON.stringify({      
                token: this.token
              }); 
              this.http.post(this.userData.BASE_URL+"api/transaksiHomestay/user/cancel/"+transaction_id,input,this.options).subscribe(data => {
                this.loading.dismiss();
                let response = data.json();       
                if(response.status == 200) {
                  this.navCtrl.popToRoot()
                  this.showAlert(response.message); 
                }else{
                  this.showAlert(response.message); 
                }
              }, err => { 
                  this.loading.dismiss();
                  this.showError(err);
              });                                        
            }
          }); 
    }
  }
  addReview(transaction_id){
    this.app.getRootNav().push('AddreviewPage',{id:this.dataTransaksi.homestay_id, tipeproduk: 'Homestay', idTransaction:this.dataTransaksi.transaction_id })
  }
  homestaydetail(data) {   
    this.app.getRootNav().push('HomestaydetailPage',data);
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
}
