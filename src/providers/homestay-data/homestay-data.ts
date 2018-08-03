import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Events,ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AuthHttp } from 'angular2-jwt';
/**     contoh data dari homestay
            "homestay_id": 1,
            "pemandu_id": 1,
            "fasilitas_id": 9,
            "alamatcategory_id": 17,
            "nama_homestay": "Rumah Studio Kirana",
            "harga_perhari": 150000,
            "deskripsi": "Homestay diberikan oleh pemandu Amos",
            "alamat": "Jl raya dramaga",
            "status_avail": "1",
            "mainphoto": "./public/uploads/homestayphoto/homestayPhoto-1.jpg"
 */
@Injectable()
export class HomestayData {
  BASE_URL = 'http://setapakbogor.site/';     
  data:any;
  constructor(public http: HttpClient) {
    console.log('Hello HomestayDataProvider Provider');
  }

}
