import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, App, LoadingController } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import { AlertService } from '../../../providers/util/alert.service';
import { TabsPage } from '../../tabs/tabs'


@IonicPage()
@Component({
  selector: 'page-jasareviewpesanan',
  templateUrl: 'jasareviewpesanan.html',
})
export class JasareviewpesananPage {
  user: {user_id?: string, nama?: string, email?: string, alamat?: string, nohp?: string, userphoto?:string} = {};
  token: string;
  BASE_URL = 'http://setapakbogor.site/';
  userLoggedIn: any;
  loading:any;
  submitted = false;
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});
  
  tanggalbooking:any;  
  idAlamatCategory:any;
  dataAlamatCategory:any;
  datajasa:any;
  diffdays:any;
  totalharga:any;
  notes:any;

  constructor(public navCtrl: NavController,
    public alertService: AlertService, 
    public navParams: NavParams,
    public http: Http,    
    public userData: UserData,
    public toastCtrl : ToastController,
    public app:App,
    public loadCtrl: LoadingController) {
      this.tanggalbooking = this.navParams.data.tanggalbooking;      
      this.datajasa = this.navParams.data.datajasa
      this.notes = this.navParams.data.noteswisatawan
      if(this.notes==null){
        this.notes="";
      }
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
    console.log('ionViewDidLoad JasareviewpesananPage');
  }

  getReadyData(){
    return new Promise((resolve) => {        
          this.getDataJasa(this.datajasa.jasa_id);
          this.userData.getData().then((value)=>{
            this.user.nama = value.nama;
            this.user.email = value.email;
            this.user.nohp = value.no_hp;
            this.user.user_id = value.user_id
          });    
          this.userData.getToken().then((token) => {
            this.token = token;
          });
          this.totalharga = this.datajasa.harga_jasa         
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

  orderJasa(){
    this.loading = this.loadCtrl.create({
      content: 'Tunggu sebentar...'
    });
    this.loading.present();
    let input = JSON.stringify({
      tanggal_booking: this.tanggalbooking,
      total_harga :this.totalharga,
      noteswisatawan:this.notes,
      token: this.token
    });          
    console.log(input)
    this.http.post(this.userData.BASE_URL+"api/transaksiJasa/user/pesanJasa/"+this.datajasa.jasa_id,input,this.options).subscribe(data => {
      this.loading.dismiss();
      let response = data.json();       
      if(response.status == 200) {
        this.alertService.presentAlertOnlyConfirm('Order Selesai',
        'Informasi Order ada di menu My Booking').then((yes) => {
          if (yes) {          
            this.app.getRootNav().setRoot(TabsPage);                  
          }
        });        
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
