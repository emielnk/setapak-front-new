import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, App, LoadingController } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import { NgForm } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-homestaypesan',
  templateUrl: 'homestaypesan.html',
})
export class HomestaypesanPage {
  token: string;
  BASE_URL = 'http://setapakbogor.site/';
  userLoggedIn: any;
  loading:any;
  submitted = false;

  dataAlamatCategory: any;
  datahomestay:any;
  idAlamatCategory:any;
  formpesan: {notes?: string} = {}; 
  today:any = new Date();
  tommorrow:any = new Date(Date.now() + (1 * 24 * 60 * 60 * 1000)).toISOString();
  minDateCI: string = this.today.toISOString();
  maxDateCI: string = '2020-12-31'
  minDateCO: string = this.tommorrow
  maxDateCO: string = '2020-12-31'
  selectedDateCheckIn: any;
  selectedDateCheckOut: any;

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
     
    console.log('ionViewDidLoad HomestaypesanPage');
  }
  getReadyData(){
    return new Promise((resolve) => {        
          this.idAlamatCategory = this.datahomestay.alamatcategory_id; 
          this.getDataHomestay(this.datahomestay.homestay_id);         
          resolve(true);
    });
  }

  getDataHomestay(idHomestay){    
    this.http.get(this.userData.BASE_URL+"api/homestay/"+idHomestay,this.options).subscribe(data => {
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
    if(this.selectedDateCheckIn == null || this.selectedDateCheckOut == null ){
      this.showAlert("Isi Check In dan Check Out");   
    }else if(this.selectedDateCheckIn == this.selectedDateCheckOut){
      this.showAlert("Tanggal Check In tidak boleh sama dengan Check Out");
    }else if (this.selectedDateCheckIn > this.selectedDateCheckOut){
      this.showAlert("Tanggal Check Out tidak boleh sebelum Check In");
    }else{
      this.app.getRootNav().push('HomestayreviewpesananPage',{checkin: this.selectedDateCheckIn, checkout:this.selectedDateCheckOut, token: this.token, datahomestay:this.datahomestay,notes : this.formpesan.notes});
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
