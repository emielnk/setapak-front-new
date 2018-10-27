import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import { NgForm } from '../../../../node_modules/@angular/forms';

/**
 * Generated class for the PemanduedithomestayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pemanduedithomestay',
  templateUrl: 'pemanduedithomestay.html',
})


export class PemanduedithomestayPage {
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});

  currenthomestay_id: number
  public whatEdited: string
  public new_fasilitas: {ac?: string, wifi?: string, parkir?: number, kamar_mandi?: number, kamar_tidur?: number} = {};
  public new_alamatcat: {id?: number, kecamatan?: string, kabupaten?: string, provinsi?: string} = {}
  public new_alamathomestay: {alamat?: string} = {};
  public new_identitashomestay: {nama_homestay?: string, harga_perhari?: number, deskripsi?: string} = {}

  currenthomestay: any;
  fasilitas: any;
  alamat: any;
  alamat_id: any;
  alamatcategory: any;
  identitas: any;
  kecamatans: any;
  

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public http: Http,
    public userData: UserData,
    public loadCtrl: LoadingController
  ) {
    this.currenthomestay_id = navParams.data.homestay_id
    this.whatEdited = navParams.data.edit
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PemanduedithomestayPage');
    console.log('hs edited is', this.currenthomestay_id)
    console.log('hs edited is', this.whatEdited)
    this.getKecamatan();
    this.getInfoHomestay(this.currenthomestay_id, this.whatEdited)
    // this.setFirstEnterPage();
  }

  getKecamatan() {
    this.http.get(this.userData.BASE_URL+'api/alamat/kecamatan', this.options).subscribe( data=> {
      let response = data.json();
      this.kecamatans = response.data;
      console.log("kecamatans",this.kecamatans);
    })
  }

  setFirstEnterPage(edited: string) {
    if(edited == "fasilitas") {
      this.new_fasilitas.ac = this.fasilitas.ac;
      this.new_fasilitas.wifi = this.fasilitas.wifi;
      this.new_fasilitas.parkir = this.fasilitas.parkir_mobil;
      this.new_fasilitas.kamar_mandi = this.fasilitas.kamar_mandi;
      this.new_fasilitas.kamar_tidur = this.fasilitas.kamar_tidur;
      console.log("fasilitas object", this.new_fasilitas);
    }
    if(edited == "alamat") {
      this.new_alamatcat.id = this.alamat_id;
      this.new_alamatcat.kecamatan = this.alamatcategory.kecamatan;
      this.new_alamatcat.kabupaten = this.alamatcategory.kabupaten;
      this.new_alamatcat.provinsi = this.alamatcategory.provinsi;
      this.new_alamathomestay.alamat = this.alamat;
      console.log("alamat cat newwwww object", this.new_alamatcat);
      console.log("alamat new hs", this.new_alamathomestay);
    }
    if(edited == "identitas") {
      this.new_identitashomestay.nama_homestay = this.currenthomestay.nama_homestay;
      this.new_identitashomestay.harga_perhari = this.currenthomestay.harga_perhari;
      this.new_identitashomestay.deskripsi = this.currenthomestay.deskripsi;
      console.log("identitas hsssssss", this.new_identitashomestay);
    }
  }

  getInfoHomestay(id: number, edited: string) {
    if(edited == "fasilitas") {
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
        this.setFirstEnterPage(edited)
      })
    }
    if(edited == "alamat") {
      this.http.get(this.userData.BASE_URL+'api/homestay/detail/'+this.currenthomestay_id, this.options).subscribe(data => {
        let response = data.json();
        if(response.status == true){
          this.currenthomestay = response.data[0];
          this.alamat_id = this.currenthomestay.alamatcategory_id;
          this.alamat = this.currenthomestay.alamat;
          console.log("ini data detailnya", this.currenthomestay);
          this.http.get(this.userData.BASE_URL+'api/alamat/category/'+this.alamat_id, this.options).subscribe(data => {
            let response = data.json();
            if(response.data != null) {
              this.alamatcategory = response.data[0];
              console.log("alamat breeee", this.alamatcategory)
              this.setFirstEnterPage(edited);
            }
          })
        }
      })
    }
    if(edited == "identitas") {
      this.http.get(this.userData.BASE_URL+'api/homestay/detail/'+this.currenthomestay_id, this.options).subscribe(data => {
        let response = data.json();
        if(response.status == true){
          this.currenthomestay = response.data[0];
          this.setFirstEnterPage(edited);
          console.log("currenthsssss", this.currenthomestay)
        }
      })
    }
  }

  saveUpdateFasilitas(form: NgForm) {
    let loading = this.loadCtrl.create({
      content: 'Tunggu sebentar...'
    });
    loading.present();
    let newValue = JSON.stringify({
      ac: this.new_fasilitas.ac,
      wifi: this.new_fasilitas.wifi,
      parkir_mobil: this.new_fasilitas.parkir,
      kamar_tidur: this.new_fasilitas.kamar_tidur,
      kamar_mandi: this.new_fasilitas.kamar_mandi
    })
    console.log("inputan baru geeeeeeeeeeeeees", newValue);
    loading.dismiss();
  }

  saveUpdateAlamat(from: NgForm) {
    let loading = this.loadCtrl.create({
      content: 'Tunggu sebentar...'
    });
    loading.present();
    let newValueAlamatCat = JSON.stringify({
      id: this.new_alamatcat.id,
      // kecamatan: this.new_alamatcat.kecamatan
    })
    let newValueAlamat = JSON.stringify({
      alamat: this.new_alamathomestay.alamat,
    })
    console.log("alamat cat baruuuuu", newValueAlamatCat);
    console.log("alamat baru", newValueAlamat);
    loading.dismiss();
  }

  saveUpdateIdentitas(form: NgForm) {
    let loading = this.loadCtrl.create({
      content: 'Tunggu sebentar...'
    });
    loading.present();
    console.log("wkwkwkwkwkwkwkwkw")
    loading.dismiss(0);
  }

}
