import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ToastController, LoadingController } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';


/**
 * Generated class for the ProduksearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-produksearch',
  templateUrl: 'produksearch.html',
})
export class ProduksearchPage {
  token: string;
  BASE_URL = 'http://setapakbogor.site/';
  userLoggedIn: any;
  loading:any;
  submitted = false;

  dataProduk:any;
  searchkey:any;
  isSearchbarOpened = false;
  newparametersearchkey:any;
  tipeProduk:any = 'Produk'

  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public app:App,
    public http: Http,    
    public userData: UserData,
    public toastCtrl : ToastController,
    public loadCtrl: LoadingController,) {
      this.newparametersearchkey = this.navParams.data.searchkey;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProduksearchPage');
    this.loading = this.loadCtrl.create({
      content: 'Tunggu sebentar...'
      });
      this.loading.present()
      this.getReadyData().then((x) => {
        if (x) this.loading.dismiss();
    }); 
  }
  
  ionViewWillEnter() {     
   this.isSearchbarOpened = false;
  }
  
  getReadyData(){
    return new Promise((resolve) => {       
          this.getSearchProduk(this.newparametersearchkey)
         
          resolve(true);
    });
  }

  getSearchProduk(keyword){
    let input = JSON.stringify({
      keyword: keyword
    });
    this.http.post(this.userData.BASE_URL+"api/barang/search",input,this.options).subscribe(data => {
      let response = data.json();       
      if(response.status==200) {          
        this.dataProduk = response.data;        
        for(var i = 0;i<this.dataProduk.length;i++){           
          this.getDataProduk(this.dataProduk[i].barang_id,i)
          this.getAverageReview(this.dataProduk[i].barang_id,i)        
        }        
      }
      this.showAlert(response.message);
   }, err => { 
      this.showError(err);
   });       
   
  }

  getDataProduk(idBarang,i){   

    console.log('id barang', idBarang)
    console.log('nomor i', i)
    this.http.get(this.userData.BASE_URL+"api/barang/"+idBarang,this.options).subscribe(data => {
      let response = data.json();
      //console.log(data.json());
      if(response.status==200) {                   
         this.dataProduk[i].pemandu = response.dataPemandu
         this.getAlamatCategory(this.dataProduk[i].pemandu.alamatcategory_id,i);         
      }
   }, err => { 
      this.showError(err);
   });
  }

  getAverageReview(idBarang,i){
    let input = JSON.stringify({     
      produk_id: idBarang,
      tipe_produk: this.tipeProduk
    });    
    this.http.post(this.userData.BASE_URL+"api/review/average",input,this.options).subscribe(data => {
      let response = data.json();
      console.log(data.json());
      if(response.status==200) {
         this.dataProduk[i].averageReview = response.average
         this.dataProduk[i].jumlahReview = response.jumlah
      }else if(response.status==204) {
        this.dataProduk[i].averageReview = 0;
        this.dataProduk[i].jumlahReview = 0
     }
   }, err => { 
      this.showError(err);
   });
  }

  getAlamatCategory(idAlamat,i){    
    this.http.get(this.userData.BASE_URL+"api/alamat/category/"+idAlamat,this.options).subscribe(data => {
      let response = data.json();
      if(response.status==200) {
        this.dataProduk[i].dataAlamatCategory = response.data
         //console.log('alamatcategorydata',this.dataAlamatCategory);
      }
   }, err => { 
      this.showError(err);
   });
  }

onSearch(event){
  this.searchkey = event.target.value
  //console.log("isi dari serachkey", this.searchkey)
  if(this.searchkey != null && this.searchkey != ''){
    this.app.getRootNav().push('ProduksearchPage',{searchkey: this.searchkey}).then(()=>{
      //let index = 1;
      const index = this.navCtrl.getActive().index;
      const indexbefore = this.navCtrl.getActive().index-1;      
      console.log('index',index)  
      console.log('indexbefore',indexbefore) 
      if(indexbefore >= 2){
        this.navCtrl.remove(indexbefore); 
      }   
      //this.navCtrl.remove(index); 
      //remove page sebelumnya,
      //bisabuat fungsi filter juga
    });
  }
}

produkDetail(data){
  this.app.getRootNav().push('ProdukdetailPage', data)
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
