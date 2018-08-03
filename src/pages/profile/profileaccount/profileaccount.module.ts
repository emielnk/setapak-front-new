import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileAccountPage } from './profileaccount';

@NgModule({
  declarations: [
    ProfileAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileAccountPage),
  ],
})
export class TestPageModule {}
