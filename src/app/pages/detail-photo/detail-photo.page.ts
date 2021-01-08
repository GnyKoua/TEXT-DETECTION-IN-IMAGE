import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Result } from 'src/app/models/Result';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-detail-photo',
  templateUrl: './detail-photo.page.html',
  styleUrls: ['./detail-photo.page.scss'],
})
export class DetailPhotoPage implements OnInit {

  V_Result: Result;

  constructor(
    private _photoService: PhotoService,
    private _navCtrl: NavController
  ) { }

  ngOnInit() {
    this._photoService.O_ActiveResult.subscribe(res => {
      this.V_Result = res;

      if (this.V_Result == null) {
        this._navCtrl.back();
      }
    });
  }

}
