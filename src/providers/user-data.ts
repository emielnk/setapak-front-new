import { Injectable } from '@angular/core';
import { Events,ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class UserData {
  HAS_LOGGED_IN = 'hasLoggedIn';
  BASE_URL = 'http://setapakbogor.site/';     
  data:any;
  idUser: any;
  token: string;

  // isi dari userdata yang kesimpen di storage
  // {user_id: 22, 
  // email: "amostiberio@gmail.com", 
  // password: "83a291a32137f869ed9a209d065b6d95", 
  // nama: "Amos Tiberio Sungguraja", 
  // alamat: "jl swadaya ix rt 09/01 no 17 jaticempaka pondokgede bekasi 17411",
  // "no_hp": "081289063136",
  // "role": "user",
  // "photo": "./public/uploads/userphoto/userPhoto-22.png", 
  // …}
  
  constructor(
    public events: Events,
    public toastCtrl: ToastController,
    public storage: Storage,
    public authHttp: AuthHttp
  ) {
    console.log('userdata provider init')
      this.getToken().then(
        val =>{
          this.token = val;
          console.log('userdata token ', this.token)
        }
      )
   }

  login(data: any) {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.storage.set('user_data', data);
    this.idUser = data.user_id;
    console.log("ini user ID", this.idUser);
    console.log('id user setted ', data.user_id);
    this.events.publish('user:login');
  };

  signup(data: string) {
    this.storage.set(this.HAS_LOGGED_IN, true);
    this.storage.set('user_data', data);
    this.events.publish('user:signup');
  };

  logout() {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove('user_data');
    this.storage.remove('token');
    this.events.publish('user:logout');
    this.storage.clear()
  };

  setUsername(username: string) {
    this.storage.set('username', username);
  };
  setToken(token: string){
    console.log('token setted')
    this.token = token;
    this.storage.set('token', token);
  };
  setAddress(address: string){
    this.storage.get('user_data').then((value) => {
      let data = value;
      data.address = address;
      this.storage.set('user_data', data);
    });
  }
  getData() {
    return this.storage.get('user_data').then((value) => {
      return value;
    });
  }
  
  updateProfilePict(picture) {
    this.storage.get('user_data').then((value) => {
      let data = value;
      data.photo = picture;
      this.storage.set('user_data', data);
    });
  }
  
  getName() {
    return this.storage.get('user_data').then((value) => {
      return value.nama;
    });
  };
  getEmail() {
    return this.storage.get('user_data').then((value) => {
      return value.email;
    });
  };
  
  getNohp() {
    return this.storage.get('user_data').then((value) => {
      return value.no_hp;
    });
  };
  
  getProfilePict() {
    return this.storage.get('user_data').then((value) => {
      //return this.BASE_URL + value.photo.slice( 1 );
      return value.photo;
    });
  };
  
  getToken() {
    return this.storage.get('token').then((value) => {
      return value;
    });
  }; 
  
  getId(){
    return this.storage.get('user_data').then((value) => {
      return value.user_id;
    });
  }

  // return a promise
  hasLoggedIn() {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
    return value === true;
    });
  };


//   load() {
//   if (this.data) {
//     // already loaded data
//     return Promise.resolve(this.data);
//   }

//   // don't have the data yet
//   return new Promise(resolve => {
//     // We're using Angular HTTP provider to request the data,
//     // then on the response, it'll map the JSON data to a parsed JS object.
//     // Next, we process the data and resolve the promise with the new data.
//     this.http.get('https://randomuser.me/api/')
//       .map(res => res.json())
//       .subscribe(data => {
//         // we've got back the raw data, now generate the core schedule data
//         // and save the data for later reference
//         this.data = data;
//         console.log(data);
//         resolve(this.data);
//       });
//   });
// }

}
