import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { NavController, ToastController, NavParams, LoadingController, IonicPage, App } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';

import { UserData } from '../../../providers/user-data';


@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  password_type: string = 'password';
  user: {name?: string, email?: string, alamat?: string, nohp?: string, password?: string, confirmpassword?: string} = {};
  submitted = false;
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});

  constructor( 
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public http: Http,
    public navParams: NavParams,
    public userData : UserData,
    public loadCtrl: LoadingController,
    public app : App) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }
  togglePasswordMode() {   
    this.password_type = this.user.password === 'text' ? 'password' : 'text';
  }
  onSignup(form: NgForm) {
    this.submitted = true;
    let loading = this.loadCtrl.create({
        content: 'Tunggu sebentar...'
    });  
    if (form.valid) {
      loading.present();
      let input = JSON.stringify({ 
        nama: this.user.name, 
        email: this.user.email,
        alamat:this.user.alamat,
        nohp:this.user.nohp,
        password: this.user.password,
        confirmpassword: this.user.confirmpassword,
      });
     console.log(input)
      this.http.post(this.userData.BASE_URL+"api/user/register",input,this.options).subscribe(data => {
           loading.dismiss();
           let response = data.json();           
           this.showAlert(response.message);
           this.navCtrl.pop();
        }, err => { 
           loading.dismiss();
           this.showError(err);
           console.log(err);
        });
    }
  }

  showError(err: any){  
    err.status==0? 
    this.showAlert("Tidak ada koneksi. Cek kembali sambungan Internet perangkat Anda"):
    this.showAlert("Tidak dapat menyambungkan ke server. Mohon muat kembali halaman ini");
  }
  showAlert(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

  onLogin(){
    this.app.getRootNav().push('LoginPage') // tab gak keliatan
  }
}
