import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, App, LoadingController } from 'ionic-angular';
import { Http,Headers,RequestOptions } from '@angular/http';
import { UserData } from '../../../providers/user-data';


@IonicPage()
@Component({
  selector: 'page-viewevent',
  templateUrl: 'viewevent.html',
})
export class VieweventPage {
  userLoggedIn: any;
  loading:any;
  BASE_URL = 'http://setapakbogor.site/'; 
  headers = new Headers({ 
    'Content-Type': 'application/json'});
  options = new RequestOptions({ headers: this.headers});
  
  idEvent :any; 
  dataEvent:any;
  dataComments:any;
  enterIsiComment:any;
  currentUserId:any;
  token:any;
  dataAlamatCategory:any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public http: Http,    
    public userData: UserData,
    public toastCtrl : ToastController,
    public app:App,
    public loadCtrl: LoadingController) {
      this.idEvent = this.navParams.data.eventid
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VieweventPage');
  }

  ionViewWillEnter(){      
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
          this.getEvent(this.idEvent);         
          this.getEventComments(this.idEvent);          
          this.userData.hasLoggedIn().then((value)=>{
            this.userLoggedIn = value;
            if(this.userLoggedIn == true)  {
              this.userData.getId().then((value) => {
                this.currentUserId = value;
              });
            }   
          });    
          this.userData.getToken().then((token) => {
            this.token = token;
          });   
          resolve(true);
    });
  }


  getEvent(idEvent){   
    this.http.get(this.userData.BASE_URL+"api/event/"+idEvent,this.options).subscribe(data => {
         let response = data.json();
         console.log(response.data)
	       if(response.status==200) {
           this.dataEvent = response.data;
           this.getAlamatCategory(this.dataEvent.alamatcategory_id)              
	       }
	    }, err => { 
	       this.showError(err);
	    });
  }

  getAlamatCategory(idAlamatCategory){   
    this.http.get(this.userData.BASE_URL+"api/alamat/category/"+idAlamatCategory,this.options).subscribe(data => {
         let response = data.json();
         console.log(response.data)
	       if(response.status==200) {
           this.dataAlamatCategory = response.data[0];                       
         }
	    }, err => { 
	       this.showError(err);
	    });
  }


  getEventComments(idEvent){   
    this.http.get(this.userData.BASE_URL+"api/event/comments/"+idEvent,this.options).subscribe(data => {
         let response = data.json();        
	       if(response.status==200) {
           this.dataComments = response.data;
           for(var i = 0 ; i<this.dataComments.length; i++){
            this.getDataUser(this.dataComments[i].user_id,i)            
           } 
           console.log(this.dataComments)             
	       }
	    }, err => { 
	       this.showError(err);
	    });
  }

  getDataUser(user_id,i){
    this.http.get(this.userData.BASE_URL+"api/user/profile/"+user_id,this.options).subscribe(data => {
      let response = data.json();
      console.log(response.data)
      if(response.status==200) {
        this.dataComments[i].dataUser = response.data;                     
      }
   }, err => { 
      this.showError(err);
   });

  }
   onInput(event){
    this.enterIsiComment = event.target.value 
    //console.log(this.enterIsiComment)   
   }

   addComment(){
    this.loading = this.loadCtrl.create({
      content: 'Tunggu sebentar...'
    });
    this.loading.present();
    if(this.userLoggedIn == true ){    
      if(this.enterIsiComment != null && this.enterIsiComment != ''){   
        let input = JSON.stringify({
          event_id : this.idEvent,      
          isi_comment: this.enterIsiComment,
          token:this.token
        });
        console.log(input)
        this.http.post(this.userData.BASE_URL+"api/event/comments/create",input,this.options).subscribe(data => {
          this.loading.dismiss();
          let response = data.json();  
          //console.log(response)     
          if(response.status == 200) {            
            this.app.getRootNav().push('VieweventPage',{eventid:this.idEvent}).then(()=>{
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

      }else{
        this.loading.dismiss();     
        this.showAlert("Isi Comment terlebih dahulu"); 
      }
    }else{
      this.loading.dismiss();     
      this.showAlert("Harus Login Terlebih Dahulu");       
    }
   }

   openWebView(link){
      window.open(link,'_system', 'location=yes');
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
