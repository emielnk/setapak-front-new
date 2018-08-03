import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, App, LoadingController } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';


@IonicPage()
@Component({
  selector: 'page-reviewproduk',
  templateUrl: 'reviewproduk.html',
})
export class ReviewprodukPage {
  BASE_URL = 'http://setapakbogor.site/';
  userLoggedIn: any;
  loading:any;
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});
  
  idProduk:any;
  tipeProduk:any;
  averageReview:any;
  jumlahReview:any;
  nama:any;
  dataReview:any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public http: Http,    
    public userData: UserData,
    public toastCtrl : ToastController,
    public app:App,
    public loadCtrl: LoadingController) {
    this.idProduk = this.navParams.data.id
    this.tipeProduk = this.navParams.data.tipeproduk
    this.averageReview = this.navParams.data.average
    this.jumlahReview = this.navParams.data.jumlahreview
    this.nama = this.navParams.data.nama
    console.log(this.idProduk,this.tipeProduk,this.averageReview,this.jumlahReview,this.navParams.data.nama)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReviewprodukPage');
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
        this.getDataReview();         
        resolve(true);
    });
  }

  getDataReview(){
    let params = JSON.stringify({
      produk_id : this.idProduk,
      tipe_produk : this.tipeProduk
    });
    //console.log(params)
    this.http.post(this.userData.BASE_URL+"api/review/all",params,this.options).subscribe(data => {
      let response = data.json();       
      if(response.status == 200) {
          this.dataReview = response.data;
          console.log(this.dataReview)
      }else{
          this.showAlert(response.message); 
      }
    }, err => { 
        this.loading.dismiss();
        this.showError(err);
    });     
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
