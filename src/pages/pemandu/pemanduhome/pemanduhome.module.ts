import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PemanduhomePage } from './pemanduhome';

@NgModule({
  declarations: [
    PemanduhomePage,
  ],
  imports: [
    IonicPageModule.forChild(PemanduhomePage),
  ],
})
export class PemanduhomePageModule {}
