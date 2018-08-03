import { Component } from '@angular/core';
import { ViewController, NavController, App, ModalController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { UserData } from '../../providers/user-data';
import { AlertService } from '../../providers/util/alert.service';
import { Http,Headers,RequestOptions } from '@angular/http';

@Component({
  template: `
    <ion-list style="margin:0 !important;">
        <button  ion-item (click)="deleteDiskusi()">Delete</button>
    </ion-list>
  `
})
export class PopoverdiskusiPage {
  BASE_URL = 'http://setapakbogor.site/';
  role : string;
  token:any;
  diskusi_id:any;
  loading:any;
  idProduk:any;
  tipeProduk:any;
  userPemanduId:any;
  currentIndexPage:any;
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});
  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public alertService: AlertService,
    public app: App,
    public http: Http,
    public modalCtrl: ModalController,
    public userData: UserData, 
    public navParams: NavParams,
    public toastCtrl :ToastController,
    public loadCtrl: LoadingController,

  ) { 
    this.token = this.navParams.data.token;
    this.diskusi_id = this.navParams.data.diskusi_id
    this.idProduk = this.navParams.data.id,
    this.tipeProduk = this.navParams.data.tipeproduk,
    this.userPemanduId =  this.navParams.data.userPemanduId
    this.currentIndexPage = this.navParams.data.index
    console.log(this.currentIndexPage)
  }

  close() {
    this.viewCtrl.dismiss();
  }

  deleteDiskusi(){
    this.alertService.presentAlertWithCallback('Are you sure?',
    'This will delete entire of this discussion').then((yes) => {
      if (yes) {
          let loading = this.loadCtrl.create({
            content: 'Tunggu sebentar...'
          });      
          let input = JSON.stringify({
            token : this.token,
            diskusi_id : this.diskusi_id
          });          
          //console.log(input);
          this.http.post(this.userData.BASE_URL+"api/diskusi/delete",input,this.options).subscribe(data => {
            let response = data.json();       
            if(response.status == 200) {
                let currentIndex = this.navCtrl.getActive().index;
                this.app.getRootNav().push('DiskusiprodukPage',{id: this.idProduk ,tipeproduk: this.tipeProduk, userPemanduId:this.userPemanduId,delete:'pagebefore'}).then(()=>{
                //let index = 4;                           
                this.navCtrl.remove(this.currentIndexPage-1); 
                this.close()
                //remove page sebelumnya,
                //bisabuat fungsi filter juga
                this.showAlert(response.message); 
              });                
            }else{
                this.showAlert(response.message); 
            }
          }, err => { 
              this.loading.dismiss();
              this.showError(err);
          });           
      }
    });
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
}