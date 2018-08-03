import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, App, LoadingController } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';

/**
 * Generated class for the HomestaydetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-homestaydetail',
  templateUrl: 'homestaydetail.html',
})
export class HomestaydetailPage {
  BASE_URL = 'http://setapakbogor.site/';
  userLoggedIn: any;
  loading:any;
  idhomestay: any;
  currentUserId: any;  
  idAlamatCategory :any;
  dataAlamatCategory: any;
  dataPictures:any;
  dataFasilitas:any;
  dataPemandu:any;
  namaProvinsi:any;
  namaKabupaten:any;
  namaKecamatan:any;
  newDataHomestay:any;
  tipeProduk:any = 'Homestay'
  averageReview :any;
  jumlahReview:any;
  jumlahDiskusi:any;
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public http: Http,    
    public userData: UserData,
    public toastCtrl : ToastController,
    public app:App,
    public loadCtrl: LoadingController) {
    this.idhomestay = this.navParams.data;
    
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
  ionViewDidLoad() {
    console.log('ionViewDidLoad HomestaydetailPage');
  }
  coba(){
     //this.app.getRootNav().pop();
     this.app.getRootNav().push('HomestaydetailPage');
    }
  getReadyData(){
    return new Promise((resolve) => {        
          //this.idAlamatCategory = this.datahomestay.alamatcategory_id; 
          this.getDataHomestay(this.idhomestay);
          this.getHomestayPhoto(this.idhomestay);
          this.getAverageReview(this.idhomestay);
          this.getCountDiskusi(this.idhomestay);
          this.userData.hasLoggedIn().then((value)=>{
            this.userLoggedIn = value;
            if(this.userLoggedIn == true)  {
              this.userData.getId().then((value) => {
                this.currentUserId = value;
              });
            }   
          });  
          resolve(true);
    });
  }

  getDataHomestay(idHomestay){    
    this.http.get(this.userData.BASE_URL+"api/homestay/"+idHomestay,this.options).subscribe(data => {
      let response = data.json();
      if(response.status==200) {         
         this.newDataHomestay = response.datahomestay 
         this.dataAlamatCategory = response.dataAlamatCategory
         this.dataFasilitas = response.dataFasilitas
         this.dataPemandu = response.dataPemandu
         console.log("dataalamatcategory",this.dataAlamatCategory)   
      }
   }, err => { 
      this.showError(err);
   });
  }

  

  getHomestayPhoto(idHomestay){
    this.http.get(this.userData.BASE_URL+"api/picture/homestay/"+idHomestay,this.options).subscribe(data => {
      let response = data.json();
      if(response.status==200) {
         this.dataPictures = response.data         
      }
   }, err => { 
      this.showError(err);
   });
  }  

  getAverageReview(idHomestay){
    let input = JSON.stringify({     
      produk_id: idHomestay,
      tipe_produk: this.tipeProduk
    });    
    this.http.post(this.userData.BASE_URL+"api/review/average",input,this.options).subscribe(data => {
      let response = data.json();
      console.log(data.json());
      if(response.status==200) {
         this.averageReview = response.average
         this.jumlahReview = response.jumlah
      }else if(response.status==204) {
        this.averageReview = 0;
        this.jumlahReview = 0
     }
   }, err => { 
      this.showError(err);
   });
  }

  getCountDiskusi(idHomestay){
    let input = JSON.stringify({     
      produk_id: idHomestay,
      tipe_produk: this.tipeProduk
    });    
    this.http.post(this.userData.BASE_URL+"api/diskusi/count",input,this.options).subscribe(data => {
      let response = data.json();
      console.log(data.json());
      if(response.status==200) {
         this.jumlahDiskusi = response.jumlah
      }else if(response.status==204) {
        this.jumlahDiskusi = 0
     }
   }, err => { 
      this.showError(err);
   });
  }
  

  pesanHomestay(idHomestay){    
    if(this.userLoggedIn == true ){    
      if(this.dataPemandu.user_id == this.currentUserId) {
        this.showAlert("Tidak bisa memesan layanan Homestay milik sendiri");          
      }else{
        this.app.getRootNav().push('HomestaypesanPage',{datahomestay: this.newDataHomestay}); 
      }       
    }else{     
      this.showAlert("Harus Login Terlebih Dahulu");       
    }         
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
  navDiskusiprodukPage(){
    this.app.getRootNav().push('DiskusiprodukPage',{id: this.newDataHomestay.homestay_id ,tipeproduk: this.tipeProduk, userPemanduId:this.dataPemandu.user_id}); 
  }
  navReviewPage(){
    this.app.getRootNav().push('ReviewprodukPage',{id: this.newDataHomestay.homestay_id,tipeproduk: this.tipeProduk, average :this.averageReview, jumlahreview:this.jumlahReview, nama: this.newDataHomestay.nama_homestay}); 
  }
  navProfileCompany(){
    //urusan emiel bikin profile company
    //this.app.getRootNav().push('PemanduPage');
  }

  // getAlamatCategory(idAlamat){    
  //   this.http.get(this.userData.BASE_URL+"api/alamat/category/"+idAlamat,this.options).subscribe(data => {
  //     let response = data.json();
  //     if(response.status==200) {
  //        this.dataAlamatCategory = response.data         
  //        //console.log('alamatcategorydata',this.dataAlamatCategory);
  //     }
  //  }, err => { 
  //     this.showError(err);
  //  });
  // }
  // getFasilitas(idFasilitas){
  //   this.http.get(this.userData.BASE_URL+"api/homestay/fasilitas/"+idFasilitas,this.options).subscribe(data => {
  //     let response = data.json();
  //     if(response.status==200) {
  //        this.dataFasilitas = response.data         
  //        //console.log('datafasilitas',this.dataFasilitas);
  //     }
  //  }, err => { 
  //     this.showError(err);
  //  });
  // }

  // getPemandu(idPemandu){
  //   this.http.get(this.userData.BASE_URL+"api/user/profilepemandu/"+idPemandu,this.options).subscribe(data => {
  //     let response = data.json();
  //     if(response.status==200) {
  //        this.dataPemandu = response.data         
  //        console.log('datapemandu',this.dataPemandu);         
  //     }
  //  }, err => { 
  //     this.showError(err);
  //  });
  // }

}
