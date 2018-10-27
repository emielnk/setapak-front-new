import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { PemandulisthomestayPage } from './pemandulisthomestay';
// import { PemanduedithomestayPage } from '../pemanduedithomestay/pemanduedithomestay';

@NgModule({
  declarations: [
    PemandulisthomestayPage,
  ],
  imports: [
    IonicPageModule.forChild(PemandulisthomestayPage),
  ]
})
export class PemandulisthomestayPageModule {}
