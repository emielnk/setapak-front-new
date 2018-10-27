import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import { PemanduDataProvider } from '../../../providers/pemandu-data/pemandu-data';

/**
 * Generated class for the PemandulistservicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pemandulistservice',
  templateUrl: 'pemandulistservice.html',
})
export class PemandulistservicePage {
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});
  
  user_id: number;
  pemandu_id: number;
  currentjasa_id: number;
  fasilitas: number;
  currentjasa: any;
  alamat_id: number;
  fasilitas_id: number;
  alamatcategory: any;

  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public http: Http, public userData: UserData, public pemanduData: PemanduDataProvider) {
    this.currentjasa_id = navParams.data.jasa_id
  }

  ionViewWillEnter() {
    // this.getPemanduId();
    // this.getAllMyHomestay();
    this.getServiceById();
  }

  doRefresh(refresher){
    setTimeout(() => {
      refresher.complete();
      this.ionViewWillEnter();
      //     
    }, 1000);
  }
  navEditServiceyById() {
    this.navCtrl.push("PemandueditservicePage")
  }

  getServiceById() {
    this.http.get(this.userData.BASE_URL+'api/jasa/detail/'+this.currentjasa_id, this.options).subscribe(data => {
      let response = data.json();
      if(response.status == true){
        this.currentjasa = response.data[0];
        this.alamat_id = this.currentjasa.alamatcategory_id;
        this.fasilitas_id = this.currentjasa.fasilitas_id;
        this.getAlamatDetail(this.alamat_id);
        this.getFasilitasDetail(this.currentjasa_id);
        // console.log("ini data detailnya", this.currenthomestay);
      }
    })
  }

  getAlamatDetail(id: number) {
    this.http.get(this.userData.BASE_URL+'api/alamat/category/'+id, this.options).subscribe(data => {
      let response = data.json();
      this.alamatcategory = response.data[0];
      // console.log(response);
      // console.log(this.alamatcategory);
    })
  }

  getFasilitasDetail(id: number) {
    this.http.get(this.userData.BASE_URL+'api/jasa/fasilitas/'+id, this.options).subscribe(data => {
      let response = data.json();
      this.fasilitas = response.data[0];
      // console.log(response);
      console.log("fasilitassssss",this.fasilitas);
    })
  }

}
