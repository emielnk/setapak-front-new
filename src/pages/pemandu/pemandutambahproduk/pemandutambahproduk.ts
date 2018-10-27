import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { UserData } from '../../../providers/user-data';
import { PemanduDataProvider } from '../../../providers/pemandu-data/pemandu-data';
import { Http,Headers,RequestOptions } from '@angular/http';
/**
 * Generated class for the PemandutambahprodukPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pemandutambahproduk',
  templateUrl: 'pemandutambahproduk.html',
})
export class PemandutambahprodukPage {
  BASE_URL = 'http://setapakbogor.site/';
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});
  segment: String = 'homestay';
  start_tabs: any;
  loading: any;
  pemandu_id: any;
  homestays: any = [];
  services: any = [];
  products: any = [];

  constructor(public alertCtrl: AlertController, public userData: UserData, public http: Http, public navCtrl: NavController, public navParams: NavParams, public loadCtrl: LoadingController, public pemanduData: PemanduDataProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PemandutambahprodukPage');
  }

  doRefresh(refresher){
    setTimeout(() => {
      refresher.complete();
      this.ionViewWillEnter();
      //     
    }, 1000);
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
      this.getHomestays();
      this.getServices();
      this.getProducts();
      this.start_tabs = "homestay";   
      resolve(true);
    });
  }

  selectedSegment(value){
    //console.log('segment yang dipilih ', value);
    this.segment = value;
    if(this.segment == 'homestay'){
      this.getHomestays();
    }else if(this.segment == 'produk'){
      this.getProducts();
    }else if(this.segment =='jasa'){
      this.getServices();
    }  
  }

  getHomestays() {
    this.pemanduData.getPemanduId().then((id) => {
      this.pemandu_id = id
      this.http.get(this.userData.BASE_URL+'api/pemandu/allhomestay/'+this.pemandu_id, this.options).subscribe(data => {
        let response = data.json();
        let check = response.data;
        console.log("ASiiiiiiiiiiiiiiik", response.data);
        if(check = undefined) {
          console.log("sukuriin")
          this.homestays = 0;
        }
        else{
          this.homestays = response.data;
          for(let i=0; i<response.length; i++) {
            this.getReviewHs(this.homestays[i].homestay_id, i);
          }
          console.log(this.homestays)
        }
      });
    });
  }

  getServices() {
    this.pemanduData.getPemanduId().then((id) => {
      this.pemandu_id = id;
      this.http.get(this.userData.BASE_URL+'api/pemandu/allservice/'+this.pemandu_id, this.options).subscribe(data => {
        let response = data.json();
        console.log("responsenya",response)
        let check = response.data;
        if(check == undefined){
          console.log("sukuriin");
          this.services = 0;
        }
        else{
          this.services = response.data;
          for(let i=0; i<response.length; i++) {
            this.getReviewJ(this.services[i].jasa_id, i);
          }
          console.log(this.services)
        }
      });
    });
  }

  getProducts() {
    this.pemanduData.getPemanduId().then((id) => {
      this.pemandu_id = id;
      this.http.get(this.userData.BASE_URL+'api/pemandu/allproduct/'+this.pemandu_id, this.options).subscribe(data => {
        let response = data.json();
        let check = response.data;
        if(check == undefined){
          console.log("sukuriin");
          this.products = 0;
        }
        else{ 
          this.products = response.data;
          for(let i=0; i<response.length; i++) {
            this.getReviewB(this.products[i].barang_id, i);
          }
          console.log(this.products);
        }
      });
    });
  }

  getReviewHs(id_hs: number, i: number) {
    let jenis_p = 'Homestay'
    this.http.get(this.userData.BASE_URL+'api/layanan/review/'+id_hs+'/'+jenis_p, this.options).subscribe(data => {
      let response = data.json();
      if(response.status == 200) {
        this.homestays[i].bintang = response.average;
        console.log("response masseeeee", response)
      }
      else
        this.homestays[i].bintang = 0;
    });
  }

  getReviewB(id_b: number, i: number) {
    let jenis_p: any = 'Barang'
    this.http.get(this.userData.BASE_URL+'api/layanan/review/'+id_b+'/'+jenis_p, this.options).subscribe(data => {
      let response = data.json();
      if(response.status == 200) {
        this.products[i].bintang = response.average;
        console.log("niiih bintang produk", this.products[i].bintang)
      }
      else
      this.products[i].bintang = 0;
    })
  }

  getReviewJ(id_j: number, i: number) {
    let jenis_p: any = 'Jasa'
    this.http.get(this.userData.BASE_URL+'api/layanan/review/'+id_j+'/'+jenis_p, this.options).subscribe(data => {
      let response = data.json();
      if(response.status == 200) {
        this.services[i].bintang = response.average;
      }
      else
      this.services[i].bintang = 0;
    })
  }

  navTambahHomestay() {
    this.navCtrl.push("PemanduhomestayPage");
  }

  navTambahJasa(){
    this.navCtrl.push("PemandujasaPage");
  }

  navTambahProduk(){
    // this.navCtrl.push("PemandulistservicePage");
    this.navCtrl.push("PemanduprodukPage")
  }

  navDetailHomestay(id) {
    this.navCtrl.push("PemandulisthomestayPage", {homestay_id: id})
  }

  navDetailJasa(id) {
    this.navCtrl.push("PemandulistservicePage", {jasa_id: id})
  }

  navDetailBarang(id) {
    this.navCtrl.push("PemandulistbarangPage", {barang_id: id})
  }
}
