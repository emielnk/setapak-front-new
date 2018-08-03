import { AuthHttp } from 'angular2-jwt';
import { Injectable } from '@angular/core';
import { Events,ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/*
  Generated class for the PemanduDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PemanduDataProvider {

  // pemandu_id: any; 
  constructor(public authHttp: AuthHttp, public storage: Storage, public events: Events) {
    console.log('Hello PemanduDataProvider Provider');
  }

  setPemanduStorage(data: any) {
    this.storage.set('pemandu-data', data[0]);
    console.log("ini data pemandu", data[0]);
    // this.pemandu_id = data[0].pemandu_id;
    this.events.publish('pemandu:login');
    console.log('pemandu storage set')
  }

  getPemanduId() {
    return this.storage.get('pemandu-data').then((value) => {
      return value.pemandu_id;
    })
  }

  getPemanduProfile() {
    return this.storage.get('pemandu-data').then(profile => {
      return profile;
    });
  }

}
