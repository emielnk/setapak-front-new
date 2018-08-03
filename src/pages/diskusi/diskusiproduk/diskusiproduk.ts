import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, App, LoadingController, PopoverController } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';
import { PopoverdiskusiPage } from '../../popover/popoverdiskusi'
/**
 * Generated class for the DiskusiprodukPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-diskusiproduk',
  templateUrl: 'diskusiproduk.html',
})

export class DiskusiprodukPage {
  BASE_URL = 'http://setapakbogor.site/';
  userLoggedIn: any;
  loading:any;
  idProduk:any;
  tipeProduk :any;
  urlprofpict:any;
  jumlahdiskusi:number;
  dataDiskusi :any;
  currentUserId :any;
  userPemanduId:any;
  token:any;
  deleteIndex:any;
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});
  

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public http: Http,    
    public userData: UserData,
    public toastCtrl : ToastController,
    public app:App,
    public loadCtrl: LoadingController,
    public popoverCtrl: PopoverController) {
    this.idProduk = this.navParams.data.id
    this.tipeProduk = this.navParams.data.tipeproduk
    this.userPemanduId = this.navParams.data.userPemanduId
    this.deleteIndex = this.navParams.data.delete
    
  }
 
  ionViewDidLoad() {
    console.log('ionViewDidLoad DiskusiprodukPage');
    if(this.deleteIndex == 'pagebefore'){
        let index = this.navCtrl.getActive().index
        this.navCtrl.remove(index); //delete page before
    }
    //console.log('index', this.navCtrl.getActive().index)
  }

  ionViewWillEnter() {   
    console.log(this.navCtrl.getActive().index) 
    this.loading = this.loadCtrl.create({
      content: 'Tunggu sebentar...'
      });
      this.loading.present()
      this.getReadyData().then((x) => {
        if (x) this.loading.dismiss();
    });
  }

  
  getReadyData(){
    return new Promise((resolve) => {        
          this.getDataDiskusi(this.idProduk);          
          this.userData.hasLoggedIn().then((value)=>{
            this.userLoggedIn = value;
            if(this.userLoggedIn == true)  {
              this.userData.getId().then((value) => {
                this.currentUserId = value;
              });
              this.userData.getToken().then((value) => {
                this.token = value;
              });
            }   
          });
          
          resolve(true);
    });
  }

  getDataDiskusi(id){
    if(this.tipeProduk == 'Produk'){
      this.http.get(this.userData.BASE_URL+"api/diskusi/produk/"+id,this.options).subscribe(data => {
        let response = data.json();                
        if(response.status==200) {
           this.jumlahdiskusi = response.jumlah          
           this.dataDiskusi = response.data
           for(var i = 0 ; i<this.dataDiskusi.length; i++){
            this.getDataUserDiskusi(this.dataDiskusi[i].user_id,i)            
           } 
           //console.log('data',this.jumlahdiskusi,this.dataDiskusi)
        }else if(response.status == 204){ //jumlah diskusi 0
          this.jumlahdiskusi = response.jumlah
        }
     }, err => { 
        this.showError(err);
     });      
    }else if(this.tipeProduk == 'Homestay'){
      this.http.get(this.userData.BASE_URL+"api/diskusi/homestay/"+id,this.options).subscribe(data => {
        let response = data.json();                
        if(response.status==200){
           this.jumlahdiskusi = response.jumlah          
           this.dataDiskusi = response.data
           for(var i = 0 ; i<this.dataDiskusi.length; i++){
            this.getDataUserDiskusi(this.dataDiskusi[i].user_id,i)            
           } 
        }else if(response.status == 204){ //jumlah diskusi 0
          this.jumlahdiskusi = response.jumlah
        }
     }, err => { 
        this.showError(err);
     });
    }else if(this.tipeProduk == 'Jasa'){
      this.http.get(this.userData.BASE_URL+"api/diskusi/jasa/"+id,this.options).subscribe(data => {
        let response = data.json();                
        if(response.status==200) {
           this.jumlahdiskusi = response.jumlah          
           this.dataDiskusi = response.data 
           for(var i = 0 ; i<this.dataDiskusi.length; i++){
            this.getDataUserDiskusi(this.dataDiskusi[i].user_id,i)            
           }           
          }else if(response.status == 204){ //jumlah diskusi 0
           this.jumlahdiskusi = response.jumlah
        }
     }, err => { 
        this.showError(err);
     });
    }    
  }

getDataUserDiskusi(user_id,i){
    this.http.get(this.userData.BASE_URL+"api/user/profile/"+user_id,this.options).subscribe(data => {
      let response = data.json();
      console.log(response.data)
      if(response.status==200) {
        this.dataDiskusi[i].dataUser = response.data;                     
      }
   }, err => { 
      this.showError(err);
  });
}  
addDiskusi(){
  if(this.userLoggedIn == true ){    
    this.app.getRootNav().push('TambahdiskusiPage',{idproduk: this.idProduk, tipeproduk: this.tipeProduk, userid:this.currentUserId}); 
  }else{     
    this.showAlert("Harus Login Terlebih Dahulu");       
  }  
}
navCommentProduk(datadiskusi){
  this.app.getRootNav().push('CommentprodukPage',{datadiskusi: datadiskusi, tipeproduk: this.tipeProduk, userpemanduid : this.userPemanduId}); 

}

presentPopover(myEvent,diskusi_id) {
  myEvent.preventDefault(); // use this to prevent default event behavior
  myEvent.stopPropagation();
  console.log(diskusi_id)
  let popover = this.popoverCtrl.create(PopoverdiskusiPage ,{id: this.idProduk,tipeproduk:this.tipeProduk,userPemanduId:this.userPemanduId,token: this.token, diskusi_id: diskusi_id, index:this.navCtrl.getActive().index});
  popover.present({
    ev: myEvent
  });
}

doRefresh(refresher){
  setTimeout(() => {
    refresher.complete();
      this.getDataDiskusi(this.idProduk);          
      this.userData.hasLoggedIn().then((value)=>{
        this.userLoggedIn = value;
        if(this.userLoggedIn == true)  {
          this.userData.getId().then((value) => {
            this.currentUserId = value;
          });
          this.userData.getToken().then((value) => {
            this.token = value;
          });
        }   
      });
  }, 1000);
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
