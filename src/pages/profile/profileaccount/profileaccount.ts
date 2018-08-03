import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ToastController } from 'ionic-angular';
import { UserData } from '../../../providers/user-data';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../../tabs/tabs'
import { AlertService } from '../../../providers/util/alert.service';


@IonicPage()
@Component({
  selector: 'page-profileaccount',
  templateUrl: 'profileaccount.html',
})
export class ProfileAccountPage {
  nama: string;
  email: string;
  nohp: string;
  urlprofpict : string;
  BASE_URL = 'http://setapakbogor.site/';

  HAS_LOGGED_IN = 'hasLoggedIn';
  constructor(public navCtrl: NavController, 
    public alertService: AlertService,
    public navParams: NavParams, 
    public userData : UserData, 
    public storage: Storage, 
    public app: App,
    public toastCtrl :ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestPage');
  }
  ionViewWillEnter(){
    this.getName();
    this.getEmail();
    this.getNohp();
    this.profpict();
    this.getId();
  }

  getName() {
    this.userData.getName().then((nama) => {
      this.nama = nama;
    });
  }
  profpict() {
    this.userData.getProfilePict().then((profpict) => {
      this.urlprofpict = profpict;
      console.log('profpict',this.urlprofpict)   
    });
  }
  getId(){
    this.userData.getId().then((id) => {
      console.log('this user id by emiel',id);
    });
  }
  getEmail() {
    this.userData.getEmail().then((email) => {
      this.email = email;
    });
  }

  getNohp() {
    this.userData.getNohp().then((nohp) => {
      this.nohp = nohp;
    });
  }

  loadToken() {
    this.storage.get('token').then((val) => {
      console.log('Your Token is ', val)
    })
  }
  loadUserData() {
    this.storage.get('user_data').then((val) => {
      console.log('Your userdata is ', val)
    })
  }

  loadLoggedIn() {
    this.storage.get(this.HAS_LOGGED_IN).then((val) => {
      console.log('Your Logged Status is ', val)
    })
  }
  
  logout() {
    this.alertService.presentAlertWithCallback('Are you sure?',
      'This will log you out of this application.').then((yes) => {
        if (yes) {
          this.userData.logout();
          this.app.getRootNav().setRoot(TabsPage);
          //this.navCtrl.setRoot(TabsPage,{opentab:3})
          this.showAlert('Logout Sukses')         
        }
      });
    // this.userData.logout();
    // this.app.getRootNav().setRoot(TabsPage); // refresh tabs root dan push tabspage yang not logged in
    // // this.navCtrl.setRoot(TabsPage); //mulai dari awal tabspagenya
    // // this.navCtrl.popToRoot(); //ngilangin history back page yang numpuk
    // this.showAlert('Logout Sukses')
    
  }

  doRefresh(refresher){
    setTimeout(() => {
      refresher.complete();
      this.getName();
      this.getEmail();
      this.getNohp();
      this.profpict(); 
      //     
    }, 1000);
  }

  editProfile(){
    this.app.getRootNav().push('EditprofilePage')
  }
  updateProfileImage(){
    
  }
  navChangePassword(){
    this.app.getRootNav().push('EditpasswordPage')
  }

  showAlert(message){
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
}
