import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
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

  constructor(public userData: UserData, public http: Http, public navCtrl: NavController, public navParams: NavParams, public loadCtrl: LoadingController, public pemanduData: PemanduDataProvider) {
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
        if(check = undefined) {
          console.log("sukuriin")
          this.homestays = 0;
        }
        else{
          this.homestays = response.data;
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
          console.log(this.products);
        }
      });
    });
  }

  navTambahHomestay() {
    this.navCtrl.push("PemanduhomestayPage");
  }
}
