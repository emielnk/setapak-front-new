import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import { PemanduDataProvider } from '../../../providers/pemandu-data/pemandu-data';
/**
 * Generated class for the PemandulisthomestayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pemandulisthomestay',
  templateUrl: 'pemandulisthomestay.html',
})
export class PemandulisthomestayPage {
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});
  
  user_id: any;
  pemandu_id: any;
  my_homestays: any = [];
  currenthomestay_id: number;
  currenthomestay: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public userData: UserData, public pemanduData: PemanduDataProvider) {
    this.currenthomestay_id = navParams.data.homestay_id
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PemandulisthomestayPage');
  }

  ionViewWillEnter() {
    // this.getPemanduId();
    // this.getAllMyHomestay();
    this.getHomestayById(this.currenthomestay_id)
  }

  doRefresh(refresher){
    setTimeout(() => {
      refresher.complete();
      this.ionViewWillEnter();
      //     
    }, 1000);
  }

  getHomestayById(id: number) {
    this.http.get(this.userData.BASE_URL+'api/homestay/detail/'+id, this.options).subscribe(data => {
      let response = data.json();
      this.currenthomestay = response.data;
      console.log("ini data detailnya", response)
    })
  }
}
