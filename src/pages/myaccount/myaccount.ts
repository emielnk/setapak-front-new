import { Storage } from '@ionic/storage';
import { Component } from '@angular/core';
import { NavController, ToastController, NavParams, LoadingController, IonicPage, App} from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { Http, Headers, RequestOptions } from '@angular/http';
import { UserData } from '../../providers/user-data';
import { TabsPage } from '../tabs/tabs';
/**
 * Generated class for the MyaccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-myaccount',
  templateUrl: 'myaccount.html',
})
export class MyaccountPage {
  HAS_LOGGED_IN = 'hasLoggedIn';
  login: {email?: string, password?: string} = {};
  submitted = false;
  headers = new Headers({ 'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});

  constructor(public storage: Storage,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public http: Http,
    public navParams: NavParams,
    public userData : UserData,
    public loadCtrl: LoadingController,
    public app : App) {
  }

  
  ionViewDidLoad() {
    console.log('ionViewDidLoad MyaccountPage');
  }
  onLogin(form: NgForm) {
    this.submitted = true;
    let loading = this.loadCtrl.create({
        content: 'Tunggu sebentar...'
    });
    
    if (form.valid) {
      loading.present();
      let input = JSON.stringify({ 
        email: this.login.email,        
        password: this.login.password,
        
      });         
      this.http.post(this.userData.BASE_URL+"api/user/login",input,this.options).subscribe(data => {
        let response = data.json();
        loading.dismiss();        
        if(response.status == 200) {             
           this.userData.login(response.data);
           this.userData.setToken(response.token);   
           //this.navCtrl.setRoot(TabsPage); //mulai dari awal tabspagenya
           //this.navCtrl.popToRoot(); //ngilangin history back page yang numpuk
           this.app.getRootNav().setRoot(TabsPage);
          this.showAlert(response.message);
        } else {           
          this.showAlert(response.message);
        }
      }, err => { 
        console.log('errornya',err)
          loading.dismiss();
          let data = err.json();
          if(err.status == 400){
            this.showAlert(data.message);
          } else{
            this.showError(err);
          }
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

  onForgotPassword(){
    this.app.getRootNav().push('LupapasswordPage') // tab gak keliatan
  }

  onSignup(){
    this.app.getRootNav().push('SignupPage') // tab gak keliatan
  }
  // navigateToLoginPage(): void {
  //   //this.navCtrl.push('LoginPage')
  //   this.app.getRootNav().push('LoginPage')
  // }

  // navigateToSignupPage(): void {
  //   //this.navCtrl.push('SignupPage') // tab keliatan
  //   this.app.getRootNav().push('SignupPage') // tab gak keliatan
  // }

  loadToken() {
    this.storage.get('token').then((val) => {
      console.log('Your Token is ', val)
    })
  }

  loadUserData() {
    this.storage.get('user_data').then((val) => {
      console.log('Your yser data is ', val)
    })
  }

  loadLoggedIn() {
    this.storage.get(this.HAS_LOGGED_IN).then((val) => {
      console.log('Your Logged Status is ', val)
    })
  }
  logout() {
    this.userData.logout();
  }
}