import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import { PemanduDataProvider } from '../../../providers/pemandu-data/pemandu-data';
import { NgForm } from '../../../../node_modules/@angular/forms';

/**
 * Generated class for the PemandueditproductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pemandueditproduct',
  templateUrl: 'pemandueditproduct.html',
})
export class PemandueditproductPage {
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});
  currentbarang_id: number;
  currentbarang: any;
  edited: any;
  public new_identitasbarang : {nama_barang?: string, harga?: number, deskripsi?: string, kuantitas?: number, berat?: number} = {}


  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public userData: UserData,
    public http: Http,
    public loadCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController) {
    this.currentbarang_id = navParams.data.barang_id;
    this.edited = navParams.data.edit
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PemandueditproductPage');
    console.log(this.edited)
    this.getDetailBarang();
  }

  firstSet() {
    this.new_identitasbarang.nama_barang = this.currentbarang.nama_barang;
    this.new_identitasbarang.deskripsi = this.currentbarang.deskripsi;
    this.new_identitasbarang.harga = this.currentbarang.harga;
    this.new_identitasbarang.berat = this.currentbarang.berat_gram;
    this.new_identitasbarang.kuantitas = this.currentbarang.kuantitas;
  }

  getDetailBarang() {
    this.http.get(this.userData.BASE_URL+'api/produk/detail/'+this.currentbarang_id, this.options).subscribe(data => {
      let response = data.json();
      if(response.status == true) {
        this.currentbarang = response.data[0];
        console.log("niiiiiiiiiiiiiiih", this.currentbarang);
      }
      this.firstSet();
    })
  }

  saveUpdateIdentitas(form: NgForm) {
    let loading = this.loadCtrl.create({
      content: 'Tunggu sebentar...'
    });
    loading.present();
    let newValue = JSON.stringify({
      id_barang: this.currentbarang_id,
      nama_barang: this.new_identitasbarang.nama_barang,
      harga: this.new_identitasbarang.harga,
      deskripsi: this.new_identitasbarang.deskripsi
    })
    this.http.post(this.userData.BASE_URL+'api/pemandu/barang/identitas/update',newValue,this.options).subscribe(data => {
      let response = data.json();
      if(response.success == true){
        loading.dismiss();
        this.showAlert(response.message)
        console.log(response);
        this.navCtrl.pop();
      }
    })
  }

  saveUpdateJumlah(form: NgForm) {
    let loading = this.loadCtrl.create({
      content: 'Tunggu sebentar...'
    });
    loading.present();
    let newValue = JSON.stringify({
      id_barang: this.currentbarang_id,
      berat: this.new_identitasbarang.berat,
      kuantitas: this.new_identitasbarang.kuantitas,
    })
    this.http.post(this.userData.BASE_URL+'api/pemandu/barang/jumlah/update',newValue,this.options).subscribe(data => {
      let response = data.json();
      if(response.success == true){
        loading.dismiss();
        this.showAlert(response.message)
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
