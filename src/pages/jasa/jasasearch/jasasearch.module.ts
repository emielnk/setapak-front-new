import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JasasearchPage } from './jasasearch';

@NgModule({
  declarations: [
    JasasearchPage,
  ],
  imports: [
    IonicPageModule.forChild(JasasearchPage),
  ],
})
export class JasasearchPageModule {}
