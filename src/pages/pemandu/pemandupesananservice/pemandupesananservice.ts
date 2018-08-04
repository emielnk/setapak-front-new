import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import { relativeTimeThreshold } from '../../../../node_modules/moment';


/**
 * Generated class for the PemandupesananservicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pemandupesananservice',
  templateUrl: 'pemandupesananservice.html',
})
export class PemandupesananservicePage {
  trans_id: any;
  detail_jasa: any;
  detail_pemesan: any;
  no_hp_wa: any;
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});
  detail_trans: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public userData: UserData) {
    this.trans_id = navParams.data.transaction_id
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PemandupesananservicePage');
  }

  ionViewWillEnter() {
    this.getDetailTransJasa();
  }

  doRefresh(refresher){
    setTimeout(() => {
      refresher.complete();
      this.ionViewWillEnter();     
    }, 1000);
  
  }

  getDetailTransJasa() {
    this.http.get(this.userData.BASE_URL+"api/pemandu/detail/transaksi/jasa/"+this.trans_id,this.options).subscribe(data => {
      let response = data.json();
      this.detail_trans = response.data[0];
      console.log("detail trans jasa saya = ", this.detail_trans)
      this.getDetailJasa(this.detail_trans.jasa_id);
      this.getDetailPemesan(this.detail_trans.user_id);
    })
  }

  getDetailJasa(id: number) {
    this.http.get(this.userData.BASE_URL+"api/jasa/detail/"+id, this.options).subscribe(data => {
      let response = data.json();
      if(response.status == true){
        this.detail_jasa = response.data[0];
      }
      console.log("detail jasa", this.detail_jasa)
    })
  }

  getDetailPemesan(id: number) {
    this.http.get(this.userData.BASE_URL+'api/wisatawan/detail/'+id, this.options).subscribe(data => {
      let response = data.json();
      this.detail_pemesan = response.data[0];
      this.no_hp_wa = this.detail_pemesan.no_hp;
      this.no_hp_wa = this.no_hp_wa.toString();
      if(this.no_hp_wa.charAt(0) == "0") {
        this.no_hp_wa = this.no_hp_wa.substr(1);
      }
      console.log("no hp wa", this.detail_pemesan)
    })
  }

}
