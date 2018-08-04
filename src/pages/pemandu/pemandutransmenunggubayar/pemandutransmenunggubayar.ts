import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import { PemanduDataProvider } from '../../../providers/pemandu-data/pemandu-data';
/**
 * Generated class for the PemandutransmenunggubayarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pemandutransmenunggubayar',
  templateUrl: 'pemandutransmenunggubayar.html',
})
export class PemandutransmenunggubayarPage {

  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});

  user_id: any;
  pemandu_id: any;
  status: any;
  dataTransStatusHs: any = [];
  
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
    // if(this.segment == 'homestay'){
    //   this.getTransaksiHomestay(this.token);
    // }else if(this.segment == 'produk'){
    //   this.getTransaksiProduk(this.token);
    // }else if(this.segment =='jasa'){
    //   this.getTransaksiJasa(this.token);
    // }  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PemandutransmenunggubayarPage');
  }

  ionViewWillEnter() {
    this.getTransHomestayTungguBayar(2);
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
          console.log("this.dataTransStatusHs = ", this.dataTransStatusHs)
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
    })
  }

  navDetailTransHomestay(id: number) {
    this.app.getRootNav().push('PemandupesananhomestayPage', {transaction_id: id});
  }

}
