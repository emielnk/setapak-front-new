import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, App, LoadingController } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-allevent',
  templateUrl: 'allevent.html',
})
export class AlleventPage {
  dataEvent: any;
  jumlahEvent :any;
  loading:any;
  today :any =  new Date().toISOString();
  BASE_URL = 'http://setapakbogor.site/'; 
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
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AlleventPage');
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

  getReadyData(){
    return new Promise((resolve) => {        
        this.getEvent(); 
         resolve(true);
    });
  }

  getEvent(){   
    this.http.get(this.userData.BASE_URL+"api/event/newest",this.options).subscribe(data => {
         let response = data.json();
         //  console.log(response.data)
	       if(response.status==200) {
           this.dataEvent = response.data;
           this.jumlahEvent = response.jumlah
           
	       }else if (response.status == 204){
          this.jumlahEvent = response.jumlah           
         }
         console.log(response)
	    }, err => { 
	       this.showError(err);
	    });
  }
  checkDate(created_at){
    let jumlah_hari = moment.duration(moment(this.today, "YYYY-MM-DD").diff(moment(created_at, "YYYY-MM-DD"))).asDays()
    console.log(jumlah_hari)
    if(jumlah_hari < 0 && jumlah_hari >= -8){
      return true;
    }else{
      return false;
    }
  }

  viewEvent(id){
    this.app.getRootNav().push('VieweventPage',{eventid:id})
    //this.app.getRootNav().push('ArtikelPage',{artikelid:id})
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
