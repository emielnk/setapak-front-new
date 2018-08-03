import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, App, LoadingController, ActionSheetController } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import moment from 'moment'

@IonicPage()
@Component({
  selector: 'page-transaksipembayaran',
  templateUrl: 'transaksipembayaran.html',
})
export class TransaksipembayaranPage {

  dataTransaksi:any;
  datetimeDeadline:any;
  nomorRekeningMandiri:any = "900 826 4465826";
  nomorRekeningBNI:any = "448 123 4424552";
  nomorRekeningBRI:any = "225 223 4445212";
  constructor(public navCtrl: NavController,    
    public navParams: NavParams,
    public http: Http,    
    public userData: UserData,
    public toastCtrl : ToastController,
    public app:App,
    public loadCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController
    ) {
      this.dataTransaksi = this.navParams.data.datatransaksi
      this.datetimeDeadline = moment(this.dataTransaksi.transaction_date).add(24, 'hours') //tambah24hours
     console.log(this.dataTransaksi)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransaksipembayaranPage');
  }

}
