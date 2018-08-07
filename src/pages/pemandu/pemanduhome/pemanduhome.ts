import { Component, ViewChild } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, DateTime, App, LoadingController, Content} from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import { PemanduDataProvider } from '../../../providers/pemandu-data/pemandu-data';
import { dateDataSortValue } from '../../../../node_modules/ionic-angular/umd/util/datetime-util';
import { Storage } from '@ionic/storage';
import { ViewartikelPageModule } from '../../artikel/viewartikel/viewartikel.module';

/**
 * Generated class for the PemanduhomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pemanduhome',
  templateUrl: 'pemanduhome.html',
})
export class PemanduhomePage {
  @ViewChild(Content) content: Content;
  BASE_URL = 'http://setapakbogor.site/';
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});
  datadiambil: any
  user_id: any;
  pemandu_id: any;
  profile_pemandu: any;
  alamat: any
  tanggal: any;
  alamat_cat: any
  created_at: any
  nama_comp: any
  deskripsi: any
  loading: any;
  segment: String = 'homestay';
  dataTransHomestay: any = [];
  dataTransJasa: any = [];
  dataTransProduk: any = [];
  nama_homestay: any = [];
  pemesan_homestay: any = [];
  pemesan_nomor: any = [];
  start_tabs: any;
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private http: Http, 
    private userData: UserData,
    public storage: Storage,
    public events: Events,
    public pemanduData: PemanduDataProvider,
    public app: App,
    public loadCtrl: LoadingController) {
  }

  getReadyData(){
    return new Promise((resolve) => {        
      this.getProfile();
      this.start_tabs = "homestay";   
      resolve(true);
    });
  }
  /*
    MAIN LOADER
  */
  ionViewDidLoad() {
    console.log('ionViewDidLoad PemanduhomePage');
    this.ionViewWillEnter()
  }

  ionViewWillEnter() {
    this.loading = this.loadCtrl.create({
      content: 'Tunggu sebentar...'
      });
      this.loading.present()
      this.getReadyData().then((x) => {
        if (x) this.loading.dismiss();
    });  
  }

  doRefresh(refresher){
    setTimeout(() => {
      refresher.complete();
      this.ionViewWillEnter();
      //     
    }, 1000);
  }

  selectedSegment(value){
    //console.log('segment yang dipilih ', value);
    this.segment = value;
    //req api
    if(this.segment == 'homestay'){
      this.getProfile();
    }else if(this.segment == 'produk'){
      this.getTransaksiProduk();
    }else if(this.segment =='jasa'){
      this.getTransaksiJasa();
    }  
  }

  /* 
    PROVIDERS LOAD
  */

  getProfile() {
    this.userData.getId().then((id) => {
      console.log('ini di pemanduhome', id);
      this.user_id = id;
      this.http.get(this.userData.BASE_URL+'api/pemandu/currentprofile/'+this.user_id, this.options).subscribe(data => {
        let response = data.json()
        // console.log("ini responsenya", response)
        if(response.status == true) {
          this.profile_pemandu = response.data[0]
          this.created_at = this.profile_pemandu.created_at;
          this.tanggal = this.created_at.substring(0,10);
          console.log(this.tanggal)
          this.profile_pemandu.created_at = this.tanggal;
          this.pemanduData.setPemanduStorage(response.data);
          this.getTransaksiHomestay();
          this.getTransaksiJasa();
          this.getTransaksiProduk();
        }
        if(response.status == "norecord") {
          this.navCtrl.push('PemanduregisPage')
        }
      })
    });
  }

  getTransaksiHomestay() {
    this.pemanduData.getPemanduId().then((id) => {
      this.pemandu_id = id;
      this.http.get(this.userData.BASE_URL+'api/pemandu/transaksi/homestay/'+this.pemandu_id, this.options).subscribe(data => {
        let response = data.json();
        this.dataTransHomestay = response
        if(response.length > 0) {
          this.dataTransHomestay = response.data
          for(var i = 0; i<this.dataTransHomestay.length; i++){
          // console.log("this.dataTransHomestay[i].homestay_id = ", this.dataTransHomestay[i].homestay_id)
            this.setNamaHomestay(this.dataTransHomestay[i].homestay_id, i);
            this.setPemesanHomestay(this.dataTransHomestay[i].user_id, i);
          }
        }
        if(response.length <= 0) {
          this.dataTransHomestay = response.length;
        }
      })
    })
  }

  setNamaHomestay(id: any, i: any) {
    this.http.get(this.userData.BASE_URL+'api/homestay/detail/'+id, this.options).subscribe(data => {
      let response = data.json();
      this.dataTransHomestay[i].namaHS = response.data[0].nama_homestay
      this.dataTransHomestay[i].idHS = response.data[0].homestay_id
    })
  }
  
  setPemesanHomestay(id: any, i: number) {
    this.http.get(this.userData.BASE_URL+'api/wisatawan/detail/'+id, this.options).subscribe(data => {
      let response = data.json();
      // console.log("response detail wisatawan homestay = ", response.data[0])
      this.dataTransHomestay[i].namaPemesan = response.data[0].nama;
      this.dataTransHomestay[i].noPemesan = response.data[0].no_hp;
      this.dataTransHomestay[i].photoPemesan = response.data[0].photo;
    })
  }


  
  getTransaksiJasa() {
    this.pemanduData.getPemanduId().then((id) => {
      console.log('ini buat transaksi jasa', id);
      this.pemandu_id = id;
      this.http.get(this.userData.BASE_URL+'api/pemandu/transaksi/jasa/'+this.pemandu_id, this.options).subscribe(data => {
        let response = data.json();
        let resp = response;
        console.log("transaksi jasa", response);
        if(response.length > 0){
          this.dataTransJasa = response.data;
          for(let i = 0; i < this.dataTransJasa.length; i++) {
            this.setNamaJasa(this.dataTransJasa[i].jasa_id, i)
            this.setPemesanJasa(this.dataTransJasa[i].user_id, i)
          }
        }
        if(response.length <= 0){
          this.dataTransJasa = response.length;
        }
      })
    })
  }

  setNamaJasa(id: any, i: any) {
    this.http.get(this.userData.BASE_URL+'api/jasa/detail/'+id, this.options).subscribe(data => {
      let response = data.json()
      this.dataTransJasa[i].namaJ = response.data[0].nama_jasa
      this.dataTransJasa[i].jasa_id = response.data[0].jasa_id
    })
  }

  setPemesanJasa(id: number, i: number) {
    this.http.get(this.userData.BASE_URL+'api/wisatawan/detail/'+id, this.options).subscribe(data => {
      let response = data.json();
      console.log("response detail wisatawan jasa = ", response.data[0])
      this.dataTransJasa[i].namaPemesan = response.data[0].nama;
      this.dataTransJasa[i].noPemesan = response.data[0].no_hp;
      this.dataTransJasa[i].photoPemesan = response.data[0].photo;
    })
  }

  getTransaksiProduk() {
    this.pemanduData.getPemanduId().then((id) => {
      console.log('ini buat transaksi produk', id);
      this.pemandu_id = id;
      this.http.get(this.userData.BASE_URL+'api/pemandu/transaksi/produk/'+this.pemandu_id, this.options).subscribe(data => {
        let response = data.json();
        console.log("transaksi produk", response);
        if(response.length > 0) {
          this.dataTransProduk = response.data;
          for(let i = 0; i < this.dataTransProduk.length; i++) {
            this.setNamaProduk(this.dataTransProduk[i].barang_id, i)
            this.setPemesanProduk(this.dataTransProduk[i].user_id, i)
          }
        }
        if(response.length <= 0) {
          this.dataTransProduk = response.length;
        }
      })
    })
  }

  setNamaProduk(id: number, i: number) {
    this.http.get(this.userData.BASE_URL+'api/produk/detail/'+id, this.options).subscribe(data => {
      let response = data.json()
      this.dataTransProduk[i].namaB = response.data[0].nama_barang
      this.dataTransProduk[i].barang_id = response.data[0].barang_id
    })
  }

  setPemesanProduk(id: number, i: number) {
    this.http.get(this.userData.BASE_URL+'api/wisatawan/detail/'+id, this.options).subscribe(data => {
      let response = data.json();
      console.log("response detail wisatawan produk = ", response.data[0])
      this.dataTransProduk[i].namaPemesan = response.data[0].nama;
      this.dataTransProduk[i].noPemesan = response.data[0].no_hp;
      this.dataTransProduk[i].photoPemesan = response.data[0].photo;
    })
  }

/*
  NAVIGATIONS
*/
  scrollToTop() {
    this.content.scrollToTop();
  }

  navTambahProduk() {
    this.navCtrl.push("PemandutambahprodukPage");
  }

  navMyHomestay() {
    this.navCtrl.push("PemandulisthomestayPage");
  }

  navMyProduct() {
    this.navCtrl.push("PemandulistproductPage");
  }

  navMyService() {
    this.navCtrl.push("PemandulistservicePage");
  }

  navPemanduEditProfile() {
    this.navCtrl.push("PemandueditPage");
  }

  navSuccessTrans() {
    this.navCtrl.push("PemanadusuksesPage");
  }

  navFailedTrans() {
    this.navCtrl.push("PemanadufailedPage");
  }

  navProgressTrans() {
    this.navCtrl.push("PemanaduprogressPage");
  }

  navPemanduDiskusi() {
    this.navCtrl.push("PemandudiskusiallPage");
  }

  navPemanduPesanan() {
    this.navCtrl.push("PemandupesananPage");
  }

  navToTransaksiHistory() {
    this.navCtrl.push('PemanduhistoryallPage')
  }

  navDetailTransHomestay(id: number) {
    this.app.getRootNav().push('PemandupesananhomestayPage', {transaction_id: id});
  }

  navDetailTransProduk(id: number) {
    this.app.getRootNav().push('PemandupesananprodukPage', {transaction_id: id});
  }

  navDetailTransJasa(id: number) {
    this.app.getRootNav().push('PemandupesananservicePage', {transaction_id: id});
  }
}
