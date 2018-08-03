import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, App, LoadingController } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import { NgForm } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-tambahdiskusi',
  templateUrl: 'tambahdiskusi.html',
})
export class TambahdiskusiPage {
  BASE_URL = 'http://setapakbogor.site/';
  loading:any;
  submitted = false;

  idproduk:any;
  tipeproduk:any;
  currentUserId :any;
  namaUser:any;
  namaProduk:any;
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});
  isiDiskusi: any;
  
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public http: Http,    
    public userData: UserData,
    public toastCtrl : ToastController,
    public app:App,
    public loadCtrl: LoadingController ) {
    this.idproduk = this.navParams.data.idproduk
    this.tipeproduk = this.navParams.data.tipeproduk
    this.currentUserId = this.navParams.data.userid  

   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TambahdiskusiPage');
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
          if(this.tipeproduk == 'Produk'){
          this.getDataProduk(this.idproduk);
          }else if(this.tipeproduk == 'Homestay'){
            this.getDataHomestay(this.idproduk);
          }else if(this.tipeproduk == 'Jasa'){
            this.getDataJasa(this.idproduk);
          }          
          
          console.log(this.namaProduk)
          resolve(true);
    });
  }
  
  getDataProduk(idBarang){    
    this.http.get(this.userData.BASE_URL+"api/barang/"+idBarang,this.options).subscribe(data => {
      let response = data.json();
      console.log(data.json());
      if(response.status==200) {
         this.namaProduk = response.dataBarang.nama_barang
         console.log(this.namaProduk)
      }
   }, err => { 
      this.showError(err);
   });
  }

  getDataHomestay(idHomestay){    
    this.http.get(this.userData.BASE_URL+"api/homestay/"+idHomestay,this.options).subscribe(data => {
      let response = data.json();
      if(response.status==200) {
         this.namaProduk = response.datahomestay.nama_homestay   
         console.log(this.namaProduk)
      }
   }, err => { 
      this.showError(err);
   });
  }

  
  getDataJasa(idJasa){    
    this.http.get(this.userData.BASE_URL+"api/jasa/"+idJasa,this.options).subscribe(data => {
      let response = data.json();
      if(response.status==200) {
         this.namaProduk = response.dataJasa.nama_jasa  
         console.log(this.namaProduk)
      }
   }, err => { 
      this.showError(err);
   });
  }

 
  tambahDiskusi(form :NgForm){
    this.submitted = true;
    let loading = this.loadCtrl.create({
        content: 'Tunggu sebentar...'
    });
    
    if (form.valid) {
          	
      let input = JSON.stringify({
        user_id : this.currentUserId,
        produk_id : this.idproduk,
        tipe_produk : this.tipeproduk,
        isi_diskusi: this.isiDiskusi
      });      
      console.log(input);
      this.http.post(this.userData.BASE_URL+"api/diskusi/create",input,this.options).subscribe(data => {
        let response = data.json();       
        if(response.status == 200) {
            this.navCtrl.pop();
            this.showAlert(response.message); 
        }else{
            this.showAlert(response.message); 
        }
      }, err => { 
          this.loading.dismiss();
          this.showError(err);
      });  
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
}
