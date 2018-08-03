import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, App, LoadingController } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import { NgForm } from '@angular/forms';

/**
 * Generated class for the ProdukpesanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-produkpesan',
  templateUrl: 'produkpesan.html',
})
export class ProdukpesanPage {
  token: string;
  BASE_URL = 'http://setapakbogor.site/';
  userLoggedIn: any;
  loading:any;
  submitted = false;
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});

  databarang :any;
  datapemandu :any;
  idAlamatCategory:any;
  dataAlamatCategory:any;
  jumlahBarang = 1;
  formpesan: {notes?: string,alamat?:string} = {};
  provinsi: any;
  kabupaten: any 
  kecamatan: any;
  pilihProvinsi:string;
  pilihKabupaten: string;
  pilihKecamatan: string;
  pilihTarif:string;
  namaProvinsi:string  ; 
  namaKabupaten: string ;
  namaKecamatan: string;
  dataTarif :any;
  tarifKode :any;
  hargaOngkir:any;
  totalHargaOngkir:any;
  totalberat:any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public http: Http,    
    public userData: UserData,
    public toastCtrl : ToastController,
    public app:App,
    public loadCtrl: LoadingController) {
      this.databarang = this.navParams.data.dataproduk;
      this.datapemandu = this.navParams.data.datapemandu;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad ProdukpesanPage');
    this.getProvinsi(); 
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
          this.idAlamatCategory = this.datapemandu.alamatcategory_id; 
          this.getAlamatCategory(this.idAlamatCategory);
          
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

  getProvinsi(){    
    this.http.get(this.userData.BASE_URL+"api/alamat/provinsitarif",this.options).subscribe(data => {
      let response = data.json();
      if(response.status==200) {
        this.provinsi = response.data;
      }
   }, err => { 
      this.showError(err);
   });
  }

  changeProvinsi(prov){
    this.submitted = false;
    console.log('thissubmit',this.submitted)
    this.dataTarif = null;
    this.kabupaten = null;
    this.kecamatan = null;   
    this.namaProvinsi = prov
    this.getKabupaten();
    //console.log(this.namaProvinsi)
  }

  getKabupaten(){    
      let input = JSON.stringify({
        provinsi: this.namaProvinsi
      }); 

    this.http.post(this.userData.BASE_URL+"api/alamat/kabupatentarif",input,this.options).subscribe(data => {
         let response = data.json();
         console.log(response.data)
	       if(response.status==200) {
           this.kabupaten = response.data;
           
	       }
	    }, err => { 
	       this.showError(err);
	    });
  }

  changeKabupaten(kabupaten){ 
    this.submitted = false;
    console.log('thissubmit',this.submitted)
    this.dataTarif = null;   
    this.kecamatan = null;   
    this.namaKabupaten = kabupaten
    this.getKecamatan();
    //console.log(this.namaProvinsi)
  }

  getKecamatan(){  
    let input = JSON.stringify({
      provinsi: this.namaProvinsi,
      kabupaten :this.namaKabupaten
    });  
    this.http.post(this.userData.BASE_URL+"api/alamat/kecamatantarif",input,this.options).subscribe(data => {
         let response = data.json();
         console.log(response.data)
	       if(response.status==200) {
           this.kecamatan = response.data; 
           //console.log('kecamatan',this.kecamatan)          
	       }
	    }, err => { 
	       this.showError(err);
	    });
  }

  changeKecamatan(kecamatan){
    this.submitted = false;
    console.log('thissubmit',this.submitted)
    this.dataTarif = null;
    this.namaKecamatan = kecamatan
    this.getTarif()
  }

  getTarif(){
    let input = JSON.stringify({
      provinsi: this.namaProvinsi,
      kabupaten :this.namaKabupaten,
      kecamatan : this.namaKecamatan
    });  
    this.http.post(this.userData.BASE_URL+"api/alamat/tarif",input,this.options).subscribe(data => {
         let response = data.json();
         console.log(response.data)
	       if(response.status==200) {
           this.dataTarif = response.data; 
           //console.log('dataTarif',this.dataTarif)          
	       }
	    }, err => { 
	       this.showError(err);
	    });
  }

  changeHargaTarif(tarifkode){
    this.hargaOngkir = null
    this.tarifKode = tarifkode
    if(this.tarifKode == 'OKE'){
        this.hargaOngkir = this.dataTarif.oke
    }else if(this.tarifKode == 'YES'){
        this.hargaOngkir = this.dataTarif.yes
    }else if(this.tarifKode == 'REG'){
      this.hargaOngkir = this.dataTarif.reg
    }
    this.hitungOngkirTotal();
  }

  // minus adult when click minus button
  minusJumlah() {
    this.totalHargaOngkir = null;
    if(this.jumlahBarang != 1){
        this.jumlahBarang--;
        this.hitungOngkirTotal();
    }
    
  }

  // plus adult when click plus button
  plusJumlah() {
    this.totalHargaOngkir = null;
    this.jumlahBarang++;
    this.hitungOngkirTotal();
  }

  hitungOngkirTotal(){
    this.totalberat = Math.ceil(this.jumlahBarang * this.databarang.berat_gram/1000)
    console.log('totalberat',this.totalberat);
    this.totalHargaOngkir = this.hargaOngkir * this.totalberat
    //console.log('totalhargaongkir',this.totalHargaOngkir)
  }


  
 pesanBarang(form :NgForm){
  this.submitted = true;

  if (form.valid) {
    if(this.dataTarif == null || this.provinsi == null || this.kabupaten == null ||this.kecamatan == null ||this.hargaOngkir == null){
      this.showAlert("Lengkapi data pemesanan produk terlebih dahulu");   
    }else{
      this.app.getRootNav().push('ProdukreviewpesananPage',{datapemandu: this.datapemandu, databarang: this.databarang, datatarif : this.dataTarif, jumlah:this.jumlahBarang, alamatpengiriman : this.formpesan.alamat, notes : this.formpesan.notes, tarifkode: this.tarifKode  });

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
