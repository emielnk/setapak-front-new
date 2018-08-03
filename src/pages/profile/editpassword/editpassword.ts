import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { UserData } from '../../../providers/user-data';
import { AuthHttp } from 'angular2-jwt';
import { NgForm } from '@angular/forms';

/**
 * Generated class for the EditpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-editpassword',
  templateUrl: 'editpassword.html',
})
export class EditpasswordPage {
  user: {user_id?:string, oldpassword?: string, newpassword?: string, confirmpassword?: string} = {};
  token: string;
  submitted = false;
  temp: any;
  loading: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public userData: UserData,
  	public toastCtrl: ToastController,
  	public loadCtrl: LoadingController,
    public authHttp: AuthHttp) {
  }
  ionViewWillEnter(){
  	this.userData.getData().then((value)=>{
      this.user.user_id = value.user_id;
    });
    this.userData.getToken().then((token) => {
      this.token = token;
    })
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad EditpasswordPage');
  }

  onUpdate(form: NgForm) {
    this.submitted = true;
    let loading = this.loadCtrl.create({
        content: 'Tunggu sebentar...'
    });
    if (form.valid) {
    	loading.present();
      let param = JSON.stringify({
        old_password : this.user.oldpassword,
        new_password : this.user.newpassword,
        confirm_password : this.user.confirmpassword,
        user_id: this.user.user_id,
        token : this.token
      });
      this.authHttp.post(this.userData.BASE_URL+'api/user/changepassword',param).subscribe(res => {        
      	loading.dismiss();
        let response = res.json();
        if(response.status == 200) {
          this.userData.login(response.data);
          this.showAlert(response.message);
          this.navCtrl.popToRoot();
        } else if(response.status == 400) {
          this.showAlert(response.message);
        }
      }, err => { 
      	loading.dismiss();
         this.showError(err);
      });

    }
  }

  showError(err: any){  
    err.status==0? 
    this.showAlert("Tidak ada koneksi. Cek kembali sambungan Internet perangkat Anda"):
    this.showAlert("Tidak dapat menyambungkan ke server. Mohon muat kembali halaman ini");
  }
  showAlert(message: string){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
}
