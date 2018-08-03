import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController, ToastController } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';



@IonicPage()
@Component({
  selector: 'page-jasaresult',
  templateUrl: 'jasaresult.html',
})
export class JasaresultPage {
  datajasa: any;
  input:any;
  loading:any;
  mainphoto:any;
  BASE_URL = 'http://setapakbogor.site/'; 
  namaprovinsi:any;
  namakabupaten:any;
  namakecamatan:any;
  tipeProduk:any = 'Jasa'
  namaJenis:any;

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
    this.datajasa = this.navParams.data.datajasa;
    if(this.navParams.data.namajenis){
      this.namaJenis = this.navParams.data.namajenis;
    }    
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad JasaresultPage');
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
      for(var i = 0;i<this.datajasa.length;i++){           
        this.getDataJasa(this.datajasa[i].jasa_id,i)
        this.getAverageReview(this.datajasa[i].jasa_id,i);
        //console.log('datahomestay',this.datahomestay)
      } 
      //console.log('datahomestay',this.datahomestay)     
      resolve(true);
    });
  }

  getDataJasa(idJasa,i){    
    this.http.get(this.userData.BASE_URL+"api/jasa/"+idJasa,this.options).subscribe(data => {
      let response = data.json();
      if(response.status==200) {
          this.datajasa[i].dataAlamatCategory = response.dataAlamatCategory
          this.datajasa[i].dataPemandu = response.dataPemandu
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
        this.datajasa[i].averageReview = response.average
        this.datajasa[i].jumlahReview = response.jumlah
      }else if(response.status==204) {
        this.datajasa[i].averageReview = 0;
        this.datajasa[i].jumlahReview = 0
     }
   }, err => { 
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
 
  jasadetail(idJasa) {   
    this.app.getRootNav().push('JasadetailPage',idJasa);
  }
}
