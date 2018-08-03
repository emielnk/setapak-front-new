import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonicPage, NavController, NavParams,App, LoadingController, ToastController} from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';


/**
 * Generated class for the HomestaysearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-homestaysearch',
  templateUrl: 'homestaysearch.html',
})
export class HomestaysearchPage {
  submitted = false;
  loading: any;
  provinsi: any;
  kabupaten: any 
  kecamatan: any;
  pilihProvinsi:string;
  pilihKabupaten: string;
  pilihKecamatan: string;
  namaProvinsi:string  = 'Jawa Barat';
  namaKabupaten: string = 'Kab. Bogor';
  namaKecamatan: string;
  knobValues: any = {
    upper:3000000,
    lower:0
  }
  dataambil:any;
  dataWisata:any;
  pilihWisata: string;
  idWisata:any;
  idAlamatCategory:any;
  namaWisata:any;

  headers = new Headers({ 
                'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});
  
  constructor(public toastCtrl: ToastController,
    public navCtrl: NavController, 
    public http: Http,
    public navParams: NavParams,
    public loadCtrl: LoadingController,
    public app : App,
    public userData: UserData) {
  }
  ionViewDidLoad() {
    //this.getKecamatan();    
    this.getWisata();
    console.log('ionViewDidLoad HomestaysearchPage');
  }

  ionViewWillEnter() {    
    //this.getProvinsi();
    
  }
  

  getProvinsi(){    
    this.http.get(this.userData.BASE_URL+"api/alamat/provinsi",this.options).subscribe(data => {
      let response = data.json();
      if(response.status==200) {
        this.provinsi = response.data;
      }
   }, err => { 
      this.showError(err);
   });
  }

  changeProvinsi(prov){
    this.getKabupaten();
    for(let data of this.provinsi){
      if(data.provinsi == prov) {
        this.namaProvinsi = data.provinsi;
        break;
      }
    }
  }

  getKabupaten(){   
    this.http.get(this.userData.BASE_URL+"api/alamat/kabupaten",this.options).subscribe(data => {
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
    this.getKecamatan();
    for(let data of this.kabupaten){
      if(data.kabupaten == kabupaten) {
        this.namaKabupaten = data.kabupaten;
        break;
      }
    }
  }

  getKecamatan(){   
    this.http.get(this.userData.BASE_URL+"api/alamat/kecamatan",this.options).subscribe(data => {
         let response = data.json();
         console.log(response.data)
	       if(response.status==200) {
           this.kecamatan = response.data;           
	       }
	    }, err => { 
	       this.showError(err);
	    });
  }

  changeKecamatan(kecamatan){
    for(let data of this.kecamatan){
      if(data.kecamatan == kecamatan) {
        this.namaKecamatan = data.kecamatan;
        break;
      }
    }
  }

  getWisata(){
    this.http.get(this.userData.BASE_URL+"api/wisata/category/all",this.options).subscribe(data => {
      let response = data.json();
      console.log(response.data)
      if(response.status==200) {
        this.dataWisata = response.data;           
      }
   }, err => { 
      this.showError(err);
   });
  }
  changeWisata(wisata){
    for(let data of this.dataWisata){
      if(data.wisatacategory_id == wisata) {
        this.idWisata = data.wisatacategory_id;
        this.idAlamatCategory = data.alamatcategory_id;
        this.namaWisata = data.nama_wisata        
        break;
      }
    }
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

  
  // Search clicked
  homestayResult(form: NgForm) {   
    this.submitted = true;
    this.loading = this.loadCtrl.create({
        content: 'Tunggu sebentar...'
    });
    if (form.valid) {
      this.loading.present();
      let input = JSON.stringify({
        wisatacategory_id:this.idWisata,
        alamatcategory_id:this.idAlamatCategory,
        upper: this.knobValues.upper,
        lower: this.knobValues.lower
      });
      //console.log(input)
      this.http.post(this.userData.BASE_URL+"api/homestay/search",input,this.options).subscribe(data => {
        this.loading.dismiss();
        let response = data.json();            
         if(response.status==200) {
           if(response.alamatCategory){
            this.app.getRootNav().push('HomestayresultPage',{datahomestay: response.data,namawisata: this.namaWisata, provinsi :response.alamatCategory.provinsi, kabupaten :response.alamatCategory.kabupaten, kecamatan :response.alamatCategory.kecamatan});      
           }else{
            this.app.getRootNav().push('HomestayresultPage',{datahomestay: response.data, provinsi :null, kabupaten :null, kecamatan :null});      
           }               
        }
        this.showAlert(response.message);
     }, err => { 
        this.loading.dismiss();
        this.showError(err);
     });     
    }
  }
  
}
