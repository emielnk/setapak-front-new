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

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public userData: UserData, public pemanduData: PemanduDataProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PemandulisthomestayPage');
  }

  doRefresh(refresher){
    setTimeout(() => {
      refresher.complete();
      this.ionViewWillEnter();
      //     
    }, 1000);
  }

  ionViewWillEnter() {
    this.getPemanduId();
    // this.getAllMyHomestay();
  }

  navEditHomestayById() {
    this.navCtrl.push("PemanduedithomestayPage")
  }

  getPemanduId() {
    this.pemanduData.getPemanduId().then((id) =>{
      this.pemandu_id = id
      this.http.get(this.userData.BASE_URL+'api/pemandu/homestay/'+this.pemandu_id, this.options).subscribe(data => {
        let response = data.json();
        console.log("data dr list HS", response);
        this.my_homestays = response.data;
        console.log(this.my_homestays);
      })
    })
  }

  navAddHomestay() {
    this.navCtrl.push('PemanduhomestayPage');
  }
}
