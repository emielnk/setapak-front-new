import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, App, LoadingController } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import { NgForm } from '@angular/forms';
import { AlertService } from '../../../providers/util/alert.service';

@IonicPage()
@Component({
  selector: 'page-produkreviewpesanan',
  templateUrl: 'produkreviewpesanan.html',
})
export class ProdukreviewpesananPage {
  token: string;
  BASE_URL = 'http://setapakbogor.site/';
  userLoggedIn: any;
  loading:any;
  submitted = false;
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});
  user: {user_id?: string, nama?: string, email?: string, alamat?: string, nohp?: string, userphoto?:string} = {};

  dataBarang:any;
  dataPemandu:any;
  dataTarif:any;
  jumlahBarang:any;
  alamatpengiriman:any;
  notes:any;
  idAlamatCategory:any; 
  dataAlamatCategory:any;
  totalberat:any;
  totalHargaOngkir:any;
  hargaOngkir:any;
  totalHargaAkhir:any;
  totalHargaProduk:any;
  tarifKode:any; 
  constructor(public navCtrl: NavController,
    public alertService: AlertService, 
    public navParams: NavParams,
    public http: Http,    
    public userData: UserData,
    public toastCtrl : ToastController,
    public app:App,
    public loadCtrl: LoadingController) {

      this.dataBarang = this.navParams.data.databarang;
      this.dataPemandu = this.navParams.data.datapemandu; 
      this.dataTarif = this.navParams.data.datatarif; 
      this.jumlahBarang = this.navParams.data.jumlah;
      this.alamatpengiriman = this.navParams.data.alamatpengiriman;
      this.notes = this.navParams.data.notes;
      if(this.notes==null){
        this.notes="";
      }
      this.tarifKode  = this.navParams.data.tarifkode;
  } 

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProdukreviewpesananPage');
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
          this.idAlamatCategory = this.dataPemandu.alamatcategory_id; 
          this.getAlamatCategory(this.idAlamatCategory);
          this.userData.getData().then((value)=>{
            this.user.nama = value.nama;
            this.user.email = value.email;
            this.user.nohp = value.no_hp;
            this.user.user_id = value.user_id
          });    
          this.userData.getToken().then((token) => {
            this.token = token;
          });
          this.hitungTotalPrice();
          //this.getDataProduk(this.datahomestay.homestay_id);    
          resolve(true);
    });
  }
  getAlamatCategory(idAlamat){    
    this.http.get(this.userData.BASE_URL+"api/alamat/category/"+idAlamat,this.options).subscribe(data => {
      let response = data.json();
      if(response.status==200) {
         this.dataAlamatCategory = response.data
      }
   }, err => { 
      this.showError(err);
   });
  }

  hitungTotalPrice(){
    this.totalHargaProduk = this.jumlahBarang * this.dataBarang.harga
    this.totalberat = Math.ceil(this.jumlahBarang * this.dataBarang.berat_gram/1000)
    if(this.tarifKode == 'OKE'){
      this.hargaOngkir = this.dataTarif.oke
    }else if(this.tarifKode == 'YES'){
        this.hargaOngkir = this.dataTarif.yes
    }else if(this.tarifKode == 'REG'){
      this.hargaOngkir = this.dataTarif.reg
    }
    this.totalHargaOngkir = this.hargaOngkir * this.totalberat
    this.totalHargaAkhir = this.totalHargaProduk + this.totalHargaOngkir
    // this.totalHargaAkhir =  this.totalHargaProduk +  this.totalHargaOngkir
    //console.log('totalhargaongkir',this.totalHargaOngkir)
  }

  orderBarang(){
    this.loading = this.loadCtrl.create({
      content: 'Tunggu sebentar...'
    });
    this.loading.present();
    let input = JSON.stringify({     
      tarif_id: this.dataTarif.tarif_id,
      jumlah_barang:this.jumlahBarang,
      alamatpengiriman : this.alamatpengiriman,
      paket_pengiriman: this.tarifKode,
      noteswisatawan :this.notes,
      token: this.token
    });
    console.log(input);         
    this.http.post(this.userData.BASE_URL+"api/transaksiBarang/user/pesanBarang/"+this.dataBarang.barang_id,input,this.options).subscribe(data => {
      this.loading.dismiss();
      let response = data.json();       
      if(response.status == 200) {
        this.alertService.presentAlertOnlyConfirm('Order Selesai',
        'Informasi Order ada di menu My Booking').then((yes) => {
          if (yes) {    
            this.navCtrl.popToRoot()       
            //this.app.getRootNav().setRoot(TabsPage);                  
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

  coba(){
    this.navCtrl.popToRoot() 
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
