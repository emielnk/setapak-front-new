import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, App, LoadingController } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import { NgForm } from '@angular/forms';


@IonicPage()
@Component({
  selector: 'page-jasapesan',
  templateUrl: 'jasapesan.html',
})
export class JasapesanPage {

  token: string;
  BASE_URL = 'http://setapakbogor.site/';
  userLoggedIn: any;
  loading:any;
  submitted = false;

  dataAlamatCategory: any;
  datajasa:any;
  idAlamatCategory:any; 
  today:any = new Date();
  formpesan: {notes?: string} = {}; 

  tommorrow:any = new Date(Date.now() + (1 * 24 * 60 * 60 * 1000));
  minDateCI: string = this.tommorrow.toISOString();
  maxDateCI: string = '2020-12-31'
  selectedDateCheckIn: any;
  
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
      this.datajasa = this.navParams.data.dataJasa;
  }
  
  ionViewWillEnter(){
    this.loading = this.loadCtrl.create({
      content: 'Tunggu sebentar...'
      });
      this.loading.present()
      this.getReadyData().then((x) => {
        if (x) this.loading.dismiss();
    });    
  } 
  ionViewDidLoad() {
   
    console.log('ionViewDidLoad JasapesanPage');
  }
  getReadyData(){
    return new Promise((resolve) => {        
          this.idAlamatCategory = this.datajasa.alamatcategory_id; 
          this.getDataJasa(this.datajasa.jasa_id);         
          resolve(true);
    });
  }

  getDataJasa(idHomestay){    
    this.http.get(this.userData.BASE_URL+"api/jasa/"+idHomestay,this.options).subscribe(data => {
      let response = data.json();
      if(response.status==200) {
         this.dataAlamatCategory = response.dataAlamatCategory        
      }
   }, err => { 
      this.showError(err);
   });
  }


  continuePesan(form: NgForm) {
  this.submitted = true;
  if (form.valid) {
    if(this.selectedDateCheckIn == null){
      this.showAlert("Pilih Jadwal Pemesanan");   
    }else{
      this.app.getRootNav().push('JasareviewpesananPage',{tanggalbooking: this.selectedDateCheckIn, token: this.token, datajasa:this.datajasa,noteswisatawan:this.formpesan.notes});
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
