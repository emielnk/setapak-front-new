import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, RequestOptions } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicStorageModule } from '@ionic/storage';
import { Transfer } from '@ionic-native/transfer';
import { FileChooser } from '@ionic-native/file-chooser';
import { FileOpener } from '@ionic-native/file-opener';
import { Http } from '@angular/http';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { MyApp } from './app.component';
// import { HttpClient } from '@angular/common/http';

//General
import { PopoverdiskusiPage } from '../pages/popover/popoverdiskusi';

//page
import { MybookingPage } from '../pages/mybooking/mybooking';
import { NotificationPage } from '../pages/notification/notification';
import { HomePage } from '../pages/home/home';
import { MyaccountPage } from '../pages/myaccount/myaccount';
import { TabsPage } from '../pages/tabs/tabs';
import { ProfileAccountPage } from '../pages/profile/profileaccount/profileaccount';
//page pemandu
import { PemanduhomePage } from '../pages/pemandu/pemanduhome/pemanduhome';

//provider
import { UserData } from '../providers/user-data';
import { AlertService } from '../providers/util/alert.service';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';
import { Camera } from '@ionic-native/camera';
import { HomestayData } from '../providers/homestay-data/homestay-data';
import { PemanduDataProvider } from '../providers/pemandu-data/pemandu-data';
import { ImagePicker } from '@ionic-native/image-picker';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Base64 } from '@ionic-native/base64';
// import { IonMarqueeModule } from 'ionic-marquee';

//component module

//set the auth http for API

export function getAuthHttp(http, Storage) {
  return new AuthHttp(new AuthConfig({
    headerPrefix: "",
    noJwtError: true,   
    globalHeaders: [{'Content-Type': 'application/json'}],
    tokenGetter: (() => {return Storage.get('token')}),
  }), http);
}

@NgModule({
  declarations: [
    MyApp,
    MybookingPage,
    NotificationPage,
    HomePage,
    MyaccountPage,    
    TabsPage,
    ProfileAccountPage,
    PopoverdiskusiPage,
    // IonMarqueeModule,
    PemanduhomePage
    
  ],
  imports: [
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp),    
    IonicStorageModule.forRoot(),    
    FormsModule,
    // IonMarqueeModule
  ],

  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MybookingPage,
    NotificationPage,
    HomePage,
    MyaccountPage,
    TabsPage,
    ProfileAccountPage,
    PopoverdiskusiPage,
    PemanduhomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserData,
    // HomestayData,
    AlertService,
    Camera,
    Transfer,  
    FileChooser,
    FileOpener,  
    File,
    ImagePicker,
    FileTransfer,
    Base64,
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http, Storage]
    },
    HomestayData,
    PemanduDataProvider
  ]
})
export class AppModule {}