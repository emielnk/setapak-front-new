import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, App, LoadingController } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';



@IonicPage()
@Component({
  selector: 'page-commentproduk',
  templateUrl: 'commentproduk.html',
})


export class CommentprodukPage {
  BASE_URL = 'http://setapakbogor.site/';
  userLoggedIn: any;
  loading:any;
  idProduk:any;
  tipeProduk :any;
  
  jumlahComment:number;

  dataDiskusi :any;
  dataComment :any;
  currentUserId :any;
  userPemanduId:any;
  tipeproduk : any;
  namaProduk :any;
  photoProduk : any;

  enterIsiComment:any;
  searchkey:any;
  isSearchbarOpened = false;
  newparametersearchkey:any;

  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public http: Http,    
    public userData: UserData,
    public toastCtrl : ToastController,
    public app:App,
    public loadCtrl: LoadingController) {
      this.dataDiskusi = this.navParams.data.datadiskusi,       
      this.userPemanduId = this.navParams.data.userpemanduid
      this.tipeproduk = this.navParams.data.tipeproduk
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentprodukPage');
  }

  ionViewWillEnter() {    
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
          this.getDataUserDiskusi(this.dataDiskusi.user_id)        
          this.getDataComment(this.dataDiskusi.diskusi_id);          
          this.userData.hasLoggedIn().then((value)=>{
            this.userLoggedIn = value;
            if(this.userLoggedIn == true)  {
              this.userData.getId().then((value) => {
                this.currentUserId = value;
              });
            }   
          });
          if(this.tipeproduk == 'Produk'){
            this.getDataProduk(this.dataDiskusi.produk_id);
            }else if(this.tipeproduk == 'Homestay'){
              this.getDataHomestay(this.dataDiskusi.produk_id);
            }else if(this.tipeproduk == 'Jasa'){
              this.getDataJasa(this.dataDiskusi.produk_id);
            }     
          
          resolve(true);
    });
  }

  getDataComment(id){
      this.http.get(this.userData.BASE_URL+"api/comment/"+id,this.options).subscribe(data => {
        let response = data.json();                
        if(response.status==200) {                   
           this.dataComment = response.data
           for(var i = 0 ; i<this.dataComment.length; i++){
            this.getDataUserComments(this.dataComment[i].user_id,i)            
           } 
        }else if(response.status == 204){ //jumlah diskusi 0
           
        }
     }, err => { 
        this.showError(err);
     });      
  }

  
  getDataProduk(idBarang){    
    this.http.get(this.userData.BASE_URL+"api/barang/"+idBarang,this.options).subscribe(data => {
      let response = data.json();
      console.log(data.json());
      if(response.status==200) {
         this.namaProduk = response.dataBarang.nama_barang
         this.photoProduk = response.dataBarang.mainphoto
         console.log(this.namaProduk)
      }
   }, err => { 
      this.showError(err);
   });
  }

  getDataHomestay(idHomestay){    
    this.http.get(this.userData.BASE_URL+"api/homestay/"+idHomestay,this.options).subscribe(data => {
      let response = data.json();
      if(response.status==200) {
         this.namaProduk = response.datahomestay.nama_homestay   
         this.photoProduk = response.datahomestay.mainphoto
         console.log(this.namaProduk)
      }
   }, err => { 
      this.showError(err);
   });
  }

  
  getDataJasa(idJasa){    
    this.http.get(this.userData.BASE_URL+"api/jasa/"+idJasa,this.options).subscribe(data => {
      let response = data.json();
      if(response.status==200) {
         this.namaProduk = response.dataJasa.nama_jasa  
         this.photoProduk = response.dataJasa.mainphoto

         console.log(this.namaProduk)
      }
   }, err => { 
      this.showError(err);
   });
  }

  onInput(event){
   this.enterIsiComment = event.target.value    
  }

  getDataUserComments(user_id,i){
    this.http.get(this.userData.BASE_URL+"api/user/profile/"+user_id,this.options).subscribe(data => {
      let response = data.json();
      console.log(response.data)
      if(response.status==200) {
        this.dataComment[i].dataUser = response.data;                     
      }
   }, err => { 
      this.showError(err);
  });
}
  getDataUserDiskusi(user_id){
    this.http.get(this.userData.BASE_URL+"api/user/profile/"+user_id,this.options).subscribe(data => {
      let response = data.json();
      console.log(response.data)
      if(response.status==200) {
        this.dataDiskusi.dataUser = response.data;                     
      }
  }, err => { 
      this.showError(err);
  });
  }
  addComment(){
    if(this.userLoggedIn == true ){    
      if(this.enterIsiComment != null && this.enterIsiComment != ''){   
        let input = JSON.stringify({
          diskusi_id : this.dataDiskusi.diskusi_id,
          user_id : this.currentUserId,        
          isi_comment: this.enterIsiComment
        });
        console.log(input)
        this.http.post(this.userData.BASE_URL+"api/comment/create",input,this.options).subscribe(data => {
          let response = data.json();       
          if(response.status == 200) {
              this.app.getRootNav().push('CommentprodukPage',{datadiskusi: this.dataDiskusi, userpemanduid:this.userPemanduId, tipeproduk :this.tipeproduk}).then(()=>{
              //let index = 4;
              const index = this.navCtrl.getActive().index-1;
              this.navCtrl.remove(index); 
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
    }else{     
      this.showAlert("Harus Login Terlebih Dahulu");       
    }
         
  }

  doRefresh(refresher){
    setTimeout(() => {
      refresher.complete();
      this.getDataUserDiskusi(this.dataDiskusi.user_id)        
          this.getDataComment(this.dataDiskusi.diskusi_id);          
          this.userData.hasLoggedIn().then((value)=>{
            this.userLoggedIn = value;
            if(this.userLoggedIn == true)  {
              this.userData.getId().then((value) => {
                this.currentUserId = value;
              });
            }   
          });
          if(this.tipeproduk == 'Produk'){
            this.getDataProduk(this.dataDiskusi.produk_id);
            }else if(this.tipeproduk == 'Homestay'){
              this.getDataHomestay(this.dataDiskusi.produk_id);
            }else if(this.tipeproduk == 'Jasa'){
              this.getDataJasa(this.dataDiskusi.produk_id);
            }
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
