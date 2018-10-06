import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import { PemanduDataProvider } from '../../../providers/pemandu-data/pemandu-data';
import { shiftInitState } from '../../../../node_modules/@angular/core/src/view';
/**
 * Generated class for the PemandutransberjalanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pemandutransberjalan',
  templateUrl: 'pemandutransberjalan.html',
})


export class PemandutransberjalanPage {
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});

  user_id: any;
  BASE_URL = 'http://setapakbogor.site/'
;  pemandu_id: any;
  status: any = 3;
  dataTransStatusHs: any = [];
  dataTransStatusJasa: any = [];
  dataTransStatusBarang: any = [];
  start_tabs: any;
  
  segment: String = 'homestay';
  constructor(public http: Http, public app: App, public userData: UserData, public pemanduData: PemanduDataProvider,public navCtrl: NavController, public navParams: NavParams) {
  }

  doRefresh(refresher) {
    setTimeout(() => {
      refresher.complete();
      this.ionViewWillEnter();
      //     
    }, 1000);
  }

  selectedSegment(value){
    this.segment = value;
    //req api
    if(this.segment == 'homestay'){
      this.getTransHomestayTungguBayar(this.status);
    }else if(this.segment == 'produk'){
      this.getTransJasaTungguBayar(this.status);
    }else if(this.segment =='jasa'){
      this.getTransProdukTungguBayar(this.status);
    }  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PemandutransmenunggubayarPage');
  }

  ionViewWillEnter() {
    this.getTransHomestayTungguBayar(this.status);
    this.getTransJasaTungguBayar(this.status);
    this.getTransProdukTungguBayar(this.status);
    this.start_tabs = "homestay";
  }

  getTransHomestayTungguBayar(status: any) {
    this.pemanduData.getPemanduId().then(id => {
      this.pemandu_id = id
      this.status = status
      this.http.get(this.userData.BASE_URL+'api/transaksi/homestay/'+this.pemandu_id+'/'+status, this.options).subscribe(data => {
        let response = data.json();
        if(response.status == true) {
          this.dataTransStatusHs = response.data;
          // console.log(this.dataTransStatus);
          for(let i = 0; i < this.dataTransStatusHs.length; i++){
            this.getDetailTransHomestay(this.dataTransStatusHs[i].homestay_id, i)
            this.getDetailTransPemesanHs(this.dataTransStatusHs[i].user_id, i)
          }
          console.log("Homestay nih = ", this.dataTransStatusHs)
        }
      })
    })
  }

  getDetailTransHomestay(id: number, i: number) {
    this.http.get(this.userData.BASE_URL+'api/homestay/detail/'+id, this.options).subscribe(data => {
      let response = data.json();
      // console.log("HS dari data trans status", response.data[0]);
      this.dataTransStatusHs[i].namaHS = response.data[0].nama_homestay
      // console.log("this.dataTransStatus[i] = ", this.dataTransStatus[i].namaHS)
    })
  }

  getDetailTransPemesanHs(id: number, i: number) {
    this.http.get(this.userData.BASE_URL+'api/wisatawan/detail/'+id, this.options).subscribe(data => {
      let response = data.json();
      // console.log("Pemesan dari data trans status ", response.data[0])
      this.dataTransStatusHs[i].namaPemesan = response.data[0].nama;
      this.dataTransStatusHs[i].noPemesan = response.data[0].no_hp;
      this.dataTransStatusHs[i].photoPemesan = response.data[0].photo;
      // console.log("nih potonya", this.dataTransStatusHs);
    })
  }

  navDetailTransHomestay(id: number) {
    this.app.getRootNav().push('PemandupesananhomestayPage', {transaction_id: id});
  }

  getTransJasaTungguBayar(status) {
    this.pemanduData.getPemanduId().then(id => {
      this.pemandu_id = id
      this.status = status
      this.http.get(this.userData.BASE_URL+'api/transaksi/jasa/'+this.pemandu_id+'/'+status, this.options).subscribe(data => {
        let response = data.json();
        if(response.status == true) {
          this.dataTransStatusJasa = response.data;
          // console.log(this.dataTransStatus);
          for(let i = 0; i < this.dataTransStatusJasa.length; i++){
            this.getDetailTransJasa(this.dataTransStatusJasa[i].jasa_id, i)
            this.getDetailTransPemesanJasa(this.dataTransStatusJasa[i].user_id, i)
          }
          console.log("Jasa nih = ", this.dataTransStatusJasa)
        }
      })
    })
  }

  getDetailTransJasa(id: number, i: number) {
    this.http.get(this.userData.BASE_URL+'api/jasa/detail/'+id, this.options).subscribe(data => {
      let response = data.json();
      // console.log("jasa response", response);
      this.dataTransStatusJasa[i].namaJasa = response.data[0].nama_jasa
    })
  }

  getDetailTransPemesanJasa(id: number, i: number) {
    this.http.get(this.userData.BASE_URL+'api/wisatawan/detail/'+id, this.options).subscribe(data => {
      let response = data.json();
      // console.log("Pemesan dari data trans status ", response.data[0])
      this.dataTransStatusJasa[i].namaPemesan = response.data[0].nama;
      this.dataTransStatusJasa[i].noPemesan = response.data[0].no_hp;
      this.dataTransStatusJasa[i].photoPemesan = response.data[0].photo;
    })
  }

  navDetailTransJasa(id: number) {
    this.app.getRootNav().push('PemandupesananservicePage', {transaction_id: id});
  }

  getTransProdukTungguBayar(status: number) {
    this.pemanduData.getPemanduId().then(id => {
      this.pemandu_id = id
      this.status = status
      this.http.get(this.userData.BASE_URL+'api/transaksi/produk/'+this.pemandu_id+'/'+status, this.options).subscribe(data => {
        let response = data.json();
        if(response.status == true) {
          this.dataTransStatusBarang = response.data;
          // console.log(this.dataTransStatus);
          for(let i = 0; i < this.dataTransStatusBarang.length; i++){
            this.getDetailTransBarang(this.dataTransStatusBarang[i].barang_id, i)
            this.getDetailTransPemesanBarang(this.dataTransStatusBarang[i].user_id, i)
          }
          console.log("Barang nih = ", this.dataTransStatusBarang)
        }
      })
    })
  }

  getDetailTransBarang(id: number, i: number) {
    this.http.get(this.userData.BASE_URL+'api/produk/detail/'+id, this.options).subscribe(data => {
      let response = data.json();
      console.log("Barang nih response nya", response);
      this.dataTransStatusBarang[i].namaBarang = response.data[0].nama_barang
      // console.log("this.dataTransStatus[i] = ", this.dataTransStatus[i].namaHS)
    })
  }

  getDetailTransPemesanBarang(id: number, i: number) {
    this.http.get(this.userData.BASE_URL+'api/wisatawan/detail/'+id, this.options).subscribe(data => {
      let response = data.json();
      // console.log("Pemesan dari data trans status ", response.data[0])
      this.dataTransStatusBarang[i].namaPemesan = response.data[0].nama;
      this.dataTransStatusBarang[i].noPemesan = response.data[0].no_hp;
      this.dataTransStatusBarang[i].photoPemesan = response.data[0].photo;
    })
  }

  navDetailTransProduk(id: number) {
    this.app.getRootNav().push('PemandupesananprodukPage', {transaction_id: id});
  }
}
