import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController, ToastController } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';



@IonicPage()
@Component({
  selector: 'page-homestayresult',
  templateUrl: 'homestayresult.html',
})
export class HomestayresultPage {
  datahomestay: any;
  input:any;
  loading:any;
  mainphoto:any;
  BASE_URL = 'http://setapakbogor.site/'; 
  namaprovinsi:any;
  namakabupaten:any;
  namakecamatan:any;
  tipeProduk:any = 'Homestay'
  namaWisata:any;
  
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
    this.datahomestay = this.navParams.data.datahomestay;
    if(this.navParams.data.provinsi){
      this.namaprovinsi = this.navParams.data.provinsi;
      this.namakabupaten = this.navParams.data.kabupaten;
      this.namakecamatan = this.navParams.data.kecamatan;
      this.namaWisata = this.navParams.data.namawisata
    }
    

    
    //console.log('thisnavparamdata',this.navParams);
   
  }
  ionViewDidLoad(){
    console.log('ionViewDidLoad HomestayresultPage');
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
      for(var i = 0;i<this.datahomestay.length;i++){           
        this.getHomestayData(this.datahomestay[i].homestay_id,i)
        this.getAverageReview(this.datahomestay[i].homestay_id,i);
        //console.log('datahomestay',this.datahomestay)
      } 
      console.log('datahomestay',this.datahomestay)     
      resolve(true);
    });
  }
  
  getHomestayData(idHomestay,i){    
    this.http.get(this.userData.BASE_URL+"api/homestay/"+idHomestay,this.options).subscribe(data => {
      let response = data.json();
      if(response.status==200) {        
         this.datahomestay[i].dataAlamatCategory = response.dataAlamatCategory
         this.datahomestay[i].dataPemandu = response.dataPemandu
         //console.log("dataalamatcategory",this.dataAlamatCategory)   
      }
   }, err => { 
      this.showError(err);
   });
  }

  getAverageReview(idHomestay,i){
    let input = JSON.stringify({     
      produk_id: idHomestay,
      tipe_produk: this.tipeProduk
    });    
    this.http.post(this.userData.BASE_URL+"api/review/average",input,this.options).subscribe(data => {
      let response = data.json();
      console.log(data.json());
      if(response.status==200) {
        this.datahomestay[i].averageReview = response.average
        this.datahomestay[i].jumlahReview = response.jumlah
      }else if(response.status==204) {
        this.datahomestay[i].averageReview = 0;
        this.datahomestay[i].jumlahReview = 0
     }
   }, err => { 
      this.showError(err);
   });
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
