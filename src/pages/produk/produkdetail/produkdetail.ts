import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, App, LoadingController } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';

/**
 * Generated class for the ProdukdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-produkdetail',
  templateUrl: 'produkdetail.html',
})
export class ProdukdetailPage {

  BASE_URL = 'http://setapakbogor.site/';
  userLoggedIn: any;
  loading:any;
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});

  idProduk: any;
  currentUserId: any;  
  idAlamatCategory :any;
  dataAlamatCategory: any;
  dataPictures:any;
  dataPemandu:any;
  namaProvinsi:any;
  namaKabupaten:any;
  namaKecamatan:any;
  newDataProduk:any;
  tipeProduk:any = 'Produk'
  averageReview :any;
  jumlahReview:any;
  jumlahDiskusi:any;
 
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public http: Http,    
    public userData: UserData,
    public toastCtrl : ToastController,
    public app:App,
    public loadCtrl: LoadingController) {
      this.idProduk = this.navParams.data;
      
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
    console.log('ionViewDidLoad ProdukdetailPage');
  }
  getReadyData(){
    return new Promise((resolve) => {        
          this.getDataProduk(this.idProduk);
          this.getHomestayPhoto(this.idProduk);
          this.getAverageReview(this.idProduk);
          this.getCountDiskusi(this.idProduk);

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

  
  getDataProduk(idBarang){    
    this.http.get(this.userData.BASE_URL+"api/barang/"+idBarang,this.options).subscribe(data => {
      let response = data.json();
      console.log(data.json());
      if(response.status==200) {
         this.newDataProduk = response.dataBarang          
         this.dataPemandu = response.dataPemandu
         this.idAlamatCategory = this.dataPemandu.alamatcategory_id; 
         this.getAlamatCategory(this.idAlamatCategory);
      }
   }, err => { 
      this.showError(err);
   });
  }

  getAlamatCategory(idAlamat){    
    this.http.get(this.userData.BASE_URL+"api/alamat/category/"+idAlamat,this.options).subscribe(data => {
      let response = data.json();
      if(response.status==200) {
         this.dataAlamatCategory = response.data
         //console.log('alamatcategorydata',this.dataAlamatCategory);
      }
   }, err => { 
      this.showError(err);
   });
  }

  getHomestayPhoto(idBarang){
    this.http.get(this.userData.BASE_URL+"api/picture/barang/"+idBarang,this.options).subscribe(data => {
      let response = data.json();
      if(response.status==200) {
         this.dataPictures = response.data         
      }
   }, err => { 
      this.showError(err);
   });
  }

  getAverageReview(idBarang){
    let input = JSON.stringify({     
      produk_id: idBarang,
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

  getCountDiskusi(idBarang){
    let input = JSON.stringify({     
      produk_id: idBarang,
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

  pesanBarang(idBarang){    
    if(this.userLoggedIn == true ){    
      if(this.dataPemandu.user_id == this.currentUserId) {
        this.showAlert("Tidak bisa memesan layanan Homestay milik sendiri");          
      }else{
        this.app.getRootNav().push('ProdukpesanPage',{dataproduk: this.newDataProduk,datapemandu:this.dataPemandu}); 
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

  navProfileCompany(){
    
  }

  navDiskusiprodukPage(){
    this.app.getRootNav().push('DiskusiprodukPage',{id: this.newDataProduk.barang_id,tipeproduk: this.tipeProduk, userPemanduId:this.dataPemandu.user_id}); 
  }
  navReviewPage(){
    this.app.getRootNav().push('ReviewprodukPage',{id: this.newDataProduk.barang_id, tipeproduk: this.tipeProduk, average :this.averageReview, jumlahreview:this.jumlahReview,nama: this.newDataProduk.nama_barang}); 
  }
}
