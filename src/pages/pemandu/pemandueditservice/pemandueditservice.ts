import { Component } from '@angular/core';
import {  IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import { NgForm } from '../../../../node_modules/@angular/forms';

/**
 * Generated class for the PemandueditservicePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pemandueditservice',
  templateUrl: 'pemandueditservice.html',
})
export class PemandueditservicePage {
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});
  public identitas: {nama?: string, harga?: number, deskripsi?: string};
  currentjasa_id: number;
  currentjasa: any;
  public new_identitas : {nama?: string, harga?: number, deskripsi?: string} = {}
  

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public http: Http,
    public userData: UserData,
    public loadCtrl: LoadingController,
    public toastCtrl: ToastController) {
    this.currentjasa_id = navParams.data.id
  }

  ionViewDidLoad() {
    this.getIdentitas()
    console.log('ionViewDidLoad PemandueditservicePage');
    console.log("nav params", this.currentjasa_id)
  }

  firstSet() {
    this.new_identitas.nama = this.currentjasa.nama_jasa;
    this.new_identitas.harga = this.currentjasa.harga_jasa;
    this.new_identitas.deskripsi = this.currentjasa.deskripsi;
    console.log("asiiik", this.new_identitas);
  }

  getIdentitas() {
    this.http.get(this.userData.BASE_URL+'api/jasa/detail/'+this.currentjasa_id, this.options).subscribe(data=> {
      let response = data.json();
      if(response.status == true){
        this.currentjasa = response.data[0];
        console.log("jasaaaaa", this.currentjasa);
        this.firstSet();
      }
    })
  }

  saveUpdateIdentitas(form: NgForm) {
    let loading = this.loadCtrl.create({
      content: 'Tunggu sebentar...'
    });
    loading.present();
    let newValue = JSON.stringify({
      id: this.currentjasa_id,
      nama: this.new_identitas.nama,
      harga: this.new_identitas.harga,
      deskripsi: this.new_identitas.deskripsi
    })
    this.http.post(this.userData.BASE_URL+'api/pemandu/jasa/identitas/update',newValue,this.options).subscribe(data => {
      let response = data.json();
      if(response.success == true){
        loading.dismiss();
        this.showAlert("Sukses Update Informasi")
        console.log(response);
        this.navCtrl.pop();
      }
    })
  }

  showAlert(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

}
