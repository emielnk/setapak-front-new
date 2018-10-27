import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import { PemanduDataProvider } from '../../../providers/pemandu-data/pemandu-data';

// import { PemanduedithomestayPage } from '../pemanduedithomestay/pemanduedithomestay';
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
  alamat_id: any;
  fasilitas_id: any;
  fasilitas: any;
  alamatcategory: any;
  currenthomestay: any;
  constructor(
    public alertCtrl: AlertController, 
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public http: Http, 
    public userData: UserData, 
    public pemanduData: PemanduDataProvider,
    public modalCtrl: ModalController  
  ) {
    this.currenthomestay_id = navParams.data.homestay_id
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PemandulisthomestayPage');
  }

  ionViewWillEnter() {
    // this.getPemanduId();
    // this.getAllMyHomestay();
    this.getHomestayById();
  }

  doRefresh(refresher){
    setTimeout(() => {
      refresher.complete();
      this.ionViewWillEnter();
      //     
    }, 1000);
  }

  getHomestayById() {
    this.http.get(this.userData.BASE_URL+'api/homestay/detail/'+this.currenthomestay_id, this.options).subscribe(data => {
      let response = data.json();
      if(response.status == true){
        this.currenthomestay = response.data[0];
        this.alamat_id = this.currenthomestay.alamatcategory_id;
        this.fasilitas_id = this.currenthomestay.fasilitas_id;
        this.getAlamatDetail(this.alamat_id);
        this.getFasilitasDetail(this.currenthomestay_id);
        this.getReview(this.currenthomestay_id);
        // console.log("ini data detailnya", this.currenthomestay);
      }
    })
  }

  getAlamatDetail(id: number) {
    this.http.get(this.userData.BASE_URL+'api/alamat/category/'+id, this.options).subscribe(data => {
      let response = data.json();
      if(response.data != null) {
        this.alamatcategory = response.data[0];
      }
    })
  }

  getFasilitasDetail(id: number) {
    this.http.get(this.userData.BASE_URL+'api/homestay/fasilitas/'+id, this.options).subscribe(data => {
      let response = data.json();
      if(response.status == true){
        this.fasilitas = response.data[0];
      }
      else {
        this.fasilitas = null;
      }
      // console.log(response);
      console.log("fasilitas",this.fasilitas);
    })
  }

  getReview(id: number) {
    let jenis_p = 'Homestay'
    this.http.get(this.userData.BASE_URL+'api/layanan/review/'+id+'/'+jenis_p, this.options).subscribe(data => {
      let response = data.json();
      if(response.status == 200) {
        this.currenthomestay.bintang = response.average;
        console.log("response masseeeee", response)
      }
      else
        this.currenthomestay.bintang = 0;
    });
  }

  touchEditHomestay(){
    const alert = this.alertCtrl.create({
      title: 'Maaf',
      subTitle: 'Mohon Maaf, Fitur Ini Belum Siap',
      buttons: ['OK']
    });
    alert.present();
  }

  navReviewPage(id: number) {
    this.navCtrl.push("PemandureviewPage", {homestay_id: id})
  }

  editFasilitasHs(id: number) {
    let editing = "fasilitas"
    this.navCtrl.push("PemanduedithomestayPage", {homestay_id: id, edit: editing})
  }

  editAlamatHs(id: number) {
    let editing = "alamat"
    this.navCtrl.push("PemanduedithomestayPage", {homestay_id: id, edit: editing})
  }

  editIdentitasHs(id: number) {
    let editing = "identitas"
    this.navCtrl.push("PemanduedithomestayPage", {homestay_id: id, edit: editing})
  }
}

