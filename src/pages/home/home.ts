import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Slides,App, ToastController, LoadingController } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { UserData } from '../../providers/user-data';
import { Http, Headers, RequestOptions } from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {
  @ViewChild('slider') slider: Slides;
  nama: string;
  loading:any;
  dataArtikel: any;
  jumlahArtikel :any;
  dataEvent: any;
  jumlahEvent :any;
  done:any;
  BASE_URL = 'http://setapakbogor.site/'; 
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});


  slides = [
    {
      title: 'Dream\'s Adventure',
      imageUrl: 'assets/imgs/lists/wishlist-1.jpg',
      songs: 2,
      private: false
    },
    {
      title: 'For the Weekend',
      imageUrl: 'assets/imgs/lists/wishlist-2.jpg',
      songs: 4,
      private: false
    },
    {
      title: 'Family Time',
      imageUrl: 'assets/imgs/lists/wishlist-3.jpg',
      songs: 5,
      private: true
    },
    {
      title: 'My Trip',
      imageUrl: 'assets/imgs/lists/wishlist-4.jpg',
      songs: 12,
      private: true
    }
  ];
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public app :App,
    public userData : UserData,    
    public http : Http,
    public toastCtrl: ToastController,
    public loadCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    // this.navCtrl.setRoot('HomePage');
  }
  ionViewWillEnter(){
    this.loading = this.loadCtrl.create({
      content: 'Tunggu sebentar...'
      });
      //this.loading.present()
      this.getReadyData().then((x) => {
        // if (x) this.loading.dismiss();
          if (x) this.done = true;
    });    
  }

  getReadyData(){
    return new Promise((resolve) => {        
        this.checkLoggin();  
        this.getArtikel(); 
        this.getEvent();          
         resolve(true);
    });
  }

  checkLoggin() {
    this.userData.hasLoggedIn().then((value) => {
      if(value == true){
        this.userData.getName().then((nama) => {
          this.nama = nama;
        })
      }else{
        this.nama = null;
      }
    });
  }

  getArtikel(){   
    this.http.get(this.userData.BASE_URL+"api/artikel/newest",this.options).subscribe(data => {
         let response = data.json();
         //  console.log(response.data)
	       if(response.status==200) {
           this.dataArtikel = response.data;
           this.jumlahArtikel = response.jumlah           
	       }else if (response.status == 204){
          this.jumlahArtikel = response.jumlah           
         }
	    }, err => { 
	       this.showError(err);
	    });
  }

  getEvent(){   
    this.http.get(this.userData.BASE_URL+"api/event/newest",this.options).subscribe(data => {
         let response = data.json();
         console.log('event',response)
         //  console.log(response.data)
	       if(response.status==200) {
           this.dataEvent = response.data;
           this.jumlahEvent = response.jumlah           
	       }else if (response.status == 204){
          this.jumlahEvent = response.jumlah           
         }
	    }, err => { 
	       this.showError(err);
	    });
  }

  navigateToLoginPage2(): void {  
    this.app.getRootNav().push('LoginPage')
  }
  navigateToSearchHomestay(): void {    
    this.app.getRootNav().push('HomestaysearchPage')
  }
  navigateToSearchJasa(): void {   
    this.app.getRootNav().push('JasasearchPage')
  }
  navigateToSearchProduk():void{
    this.app.getRootNav().push('ProduksearchPage')
  }
  openmyaccount(): void {
    //this.navCtrl.push('LoginPage')
    this.navCtrl.parent.select(2)
  }
  
  viewArtikel(id){
    this.app.getRootNav().push('ViewartikelPage',{artikelid:id})
    //this.app.getRootNav().push('ArtikelPage',{artikelid:id})
  }

  viewAllArtikel(){
    this.app.getRootNav().push('AllartikelPage')
  }

  viewEvent(id){
    this.app.getRootNav().push('VieweventPage',{eventid:id})
    //this.app.getRootNav().push('ArtikelPage',{artikelid:id})
  }

  viewAllEvent(){
    this.app.getRootNav().push('AlleventPage')
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
