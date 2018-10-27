import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PemanduedithomestayPage } from './pemanduedithomestay';
// import { PemandulisthomestayPage } from '../pemandulisthomestay/pemandulisthomestay';

@NgModule({
  declarations: [
    PemanduedithomestayPage,
    // PemandulisthomestayPage
  ],
  imports: [
    IonicPageModule.forChild(PemanduedithomestayPage),
    // IonicPageModule.forChild(PemandulisthomestayPage)
  ],
})
export class PemanduedithomestayPageModule {}
