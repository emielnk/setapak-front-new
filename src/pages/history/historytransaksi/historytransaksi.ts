import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, App, LoadingController } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';

@IonicPage()
@Component({
  selector: 'page-historytransaksi',
  templateUrl: 'historytransaksi.html',
})
export class HistorytransaksiPage {

//deklarasi umum
BASE_URL = 'http://setapakbogor.site/';
userLoggedIn: any;
loading:any;
headers = new Headers({ 
  'Content-Type': 'application/json'});
options = new RequestOptions({ headers: this.headers});

myBooking: string ;
currentUserId:any;
token:any;
segment: String='homestay';
dataTransaksiHomestay: any = [];
dataTransaksiProduk: any = [];
dataTransaksiJasa: any = [];
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public http: Http,    
    public userData: UserData,
    public toastCtrl : ToastController,
    public app:App,
    public loadCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HistorytransaksiPage');
    this.loading = this.loadCtrl.create({
      content: 'Tunggu sebentar...'
      });
      this.loading.present()
      this.getReadyData().then((x) => {
        if (x) this.loading.dismiss();
    });
  }

  ionViewWillEnter() {    
    
  }

  getReadyData(){
    return new Promise((resolve) => {      
            //this.myBooking = "homestaynotloggin";
            this.myBooking = "homestay";
            this.userData.hasLoggedIn().then((value)=>{
            this.userLoggedIn = value;
            if(this.userLoggedIn == true){
              this.userData.getId().then((value) => {
                this.currentUserId = value;
              });
              this.userData.getToken().then((value)=>{
                this.token = value;
                console.log(this.token)
                this.getTransaksiHomestay(this.token); //starter get data transaksi awal                
              })              
              this.myBooking = "homestay";
            }
          });         
          resolve(true);
    });
  }

  selectedSegment(value){
    //console.log('segment yang dipilih ', value);
    this.segment = value;
    //req api

    if(this.segment == 'homestay'){
      this.getTransaksiHomestay(this.token);
    }else if(this.segment == 'produk'){
      this.getTransaksiProduk(this.token);
    }else if(this.segment =='jasa'){
      this.getTransaksiJasa(this.token);
    }  
    // if(this.segment == 'homestay' && this.dataTransaksiHomestay.length == 0){
    //   this.getTransaksiHomestay(this.token);
    // }else if(this.segment == 'produk' && this.dataTransaksiProduk.length == 0){
    //   this.getTransaksiProduk(this.token);
    // }else if(this.segment =='jasa' && this.dataTransaksiJasa.length == 0){
    //   this.getTransaksiJasa(this.token);
    // }  
  }
  
  doRefresh(refresher){
    setTimeout(() => {
      refresher.complete();
      if(this.segment == 'homestay'){
        //reset lazy load atribut            
        this.getTransaksiHomestay(this.token);
      }
      else if(this.segment == 'produk'){
        //reset lazy load atribut
        this.getTransaksiProduk(this.token);
      }
      else if(this.segment == 'jasa'){
        //reset lazy load atribut
        this.getTransaksiJasa(this.token);
      }      
    }, 1000);
  }

  getTransaksiHomestay(token){
    //console.log(token)
    let input = JSON.stringify({     
      token: token,
    });    
    this.http.post(this.userData.BASE_URL+"api/transaksiHomestay/user/history",input,this.options).subscribe(data => {
      let response = data.json();
      //console.log(data.json());
      if(response.status==200) {
         this.dataTransaksiHomestay = response.data
         for(var i = 0 ; i<this.dataTransaksiHomestay.length; i++){
            this.getDataHomestay(this.dataTransaksiHomestay[i].homestay_id,i)            
         }
         //console.log(this.dataTransaksiHomestay)
      }else if(response.status==204) {
        console.log('data kosong');
     }
   }, err => { 
      this.showError(err);
   });
  } 

  getDataHomestay(idHomestay,i){    
    this.http.get(this.userData.BASE_URL+"api/homestay/"+idHomestay,this.options).subscribe(data => {
      let response = data.json();
      if(response.status==200) {
        this.dataTransaksiHomestay[i].datahomestay = response.datahomestay        
        this.dataTransaksiHomestay[i].dataAlamatCategory = response.dataAlamatCategory
        this.dataTransaksiHomestay[i].dataPemandu = response.dataPemandu            
      }
   }, err => { 
      this.showError(err);
   });
  }

  getTransaksiProduk(token){
    //console.log(token)
    let input = JSON.stringify({     
      token: token,
    });    
    this.http.post(this.userData.BASE_URL+"api/transaksiBarang/user/history",input,this.options).subscribe(data => {
      let response = data.json();
      //console.log(data.json());
      if(response.status==200) {
         this.dataTransaksiProduk = response.data
         for(var i = 0 ; i<this.dataTransaksiProduk.length; i++){
            this.getDataProduk(this.dataTransaksiProduk[i].barang_id,i)            
         }
         console.log(this.dataTransaksiProduk)
      }else if(response.status==204) {
        console.log('data kosong');
     }
   }, err => { 
      this.showError(err);
   });
  } 

  getDataProduk(idBarang,i){    
    this.http.get(this.userData.BASE_URL+"api/barang/"+idBarang,this.options).subscribe(data => {
      let response = data.json();
      if(response.status==200) {
        this.dataTransaksiProduk[i].databarang = response.dataBarang        
        this.dataTransaksiProduk[i].dataPemandu = response.dataPemandu            
      }
   }, err => { 
      this.showError(err);
   });
  }

  getTransaksiJasa(token){
    //console.log(token)
    let input = JSON.stringify({     
      token: token,
    });    
    this.http.post(this.userData.BASE_URL+"api/transaksiJasa/user/history",input,this.options).subscribe(data => {
      let response = data.json();
      //console.log(data.json());
      if(response.status==200) {
         this.dataTransaksiJasa = response.data
         for(var i = 0 ; i<this.dataTransaksiJasa.length; i++){
            this.getDatajasa(this.dataTransaksiJasa[i].jasa_id,i)            
         }
         console.log(this.dataTransaksiJasa)
      }else if(response.status==204) {
        console.log('data kosong');
     }
   }, err => { 
      this.showError(err);
   });
  } 

  getDatajasa(idJasa,i){    
    this.http.get(this.userData.BASE_URL+"api/jasa/"+idJasa,this.options).subscribe(data => {
      let response = data.json();
      if(response.status==200) {
        this.dataTransaksiJasa[i].datajasa = response.dataJasa        
        this.dataTransaksiJasa[i].dataPemandu = response.dataPemandu            
      }
   }, err => { 
      this.showError(err);
   });
  }
  
  historyTransaksi(){
    if(this.userLoggedIn == true ){    
      this.app.getRootNav().push('HistorytransaksiPage'); 
    }else{     
      this.showAlert("Harus Login Terlebih Dahulu");       
    }
  }
  transaksiHomestay(id){
    this.app.getRootNav().push('TransaksihomestayPage',{transactionId: id}); 
  }
  transaksiProduk(id){
    this.app.getRootNav().push('TransaksiprodukPage',{transactionId: id}); 
  }
  transaksiJasa(id){
    this.app.getRootNav().push('TransaksijasaPage',{transactionId: id}); 
  }
  navigateToLoginPage(): void {
    //this.navCtrl.push('LoginPage')
    this.app.getRootNav().push('LoginPage')
  }
  navigateToSignupPage(): void {
    //this.navCtrl.push('SignupPage') // tab keliatan
    this.app.getRootNav().push('SignupPage') // tab gak keliatan
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
