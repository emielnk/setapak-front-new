import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, App, LoadingController } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import { NgForm } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-addreview',
  templateUrl: 'addreview.html',
})
export class AddreviewPage {
  BASE_URL = 'http://setapakbogor.site/';
  userLoggedIn: any;
  loading:any;
  submitted:any = false;
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});
  
  token:any;  
  tipeProduk:any;
  idProduk:any;
  jumlah_star:any = 0;
  idTransaction :any;
  namaProduk:any;
  photoProduk:any;
  isiReview:any;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public http: Http,    
    public userData: UserData,
    public toastCtrl : ToastController,
    public app:App,
    public loadCtrl: LoadingController) {
    this.idProduk = this.navParams.data.id
    this.tipeProduk = this.navParams.data.tipeproduk
    this.idTransaction = this.navParams.data.idTransaction
    console.log(this.idProduk,this.tipeProduk,this.idTransaction)
      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddreviewPage');
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
        if(this.tipeProduk =='Homestay'){         
          this.getDataHomestay(this.idProduk)
        }else if(this.tipeProduk =='Jasa'){
          this.getDataJasa(this.idProduk)
        }else if(this.tipeProduk =='Produk'){
          this.getDataProduk(this.idProduk)
        }       
        this.userData.getToken().then((token) => {
          this.token = token;
        });   
        resolve(true);
    });
  }

  getDataHomestay(idHomestay){    
    this.http.get(this.userData.BASE_URL+"api/homestay/"+idHomestay,this.options).subscribe(data => {
      let response = data.json();
      if(response.status==200) {       
         this.namaProduk = response.datahomestay.nama_homestay 
         this.photoProduk = response.datahomestay.mainphoto 
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
         this.photoProduk = response.dataJasa.mainphoto 


         console.log(response)        
      }
   }, err => { 
      this.showError(err);
   });
  }

  getDataProduk(idBarang){    
    this.http.get(this.userData.BASE_URL+"api/barang/"+idBarang,this.options).subscribe(data => {
      let response = data.json();
      console.log(data.json());
      if(response.status==200) {
         this.namaProduk = response.dataBarang.nama_barang
         this.photoProduk = response.dataBarang.mainphoto                 
      }
   }, err => { 
      this.showError(err);
   });
  }

  hitungJumlahStar(jumlah){
    this.jumlah_star = jumlah;
    console.log(this.jumlah_star)
  }

  tambahReview(form :NgForm){
    this.submitted = true;
    let loading = this.loadCtrl.create({
        content: 'Tunggu sebentar...'
    });
    if (form.valid) {
      if(this.jumlah_star == 0){
        this.showAlert("Isi Jumlah Star Kualitas Transaksi");
       }else{
        let input = JSON.stringify({
          transaction_id : this.idTransaction,
          isi_review: this.isiReview,
          produk_id: this.idProduk,
          tipe_produk:this.tipeProduk,
          jumlah_star:this.jumlah_star,          
          token: this.token
        });  
        console.log(input)   
          this.http.post(this.userData.BASE_URL+"api/review/addreview",input,this.options).subscribe(data => {
          this.loading.dismiss();
          let response = data.json();       
          if(response.status == 200) {
            this.navCtrl.remove(2,1); // This will remove the 'ResultPage' from stack.
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
