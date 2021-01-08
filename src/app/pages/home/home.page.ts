import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Result } from 'src/app/models/Result';
import { PhotoService } from 'src/app/services/photo.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  V_Results = [];

  constructor(
    private _photoService: PhotoService,
    private _router: Router
  ) { }

  ngOnInit() {
    this._photoService.O_Results.subscribe(res => {
      this.V_Results = res;
    });
  }

  F_OnAddPhotoToGallery() {
    this._photoService.DetectTextInImage().then(() => {
      this._router.navigate(["detail-photo"]);
    });
  }

  F_OnClick(result: Result) {
    this._photoService.O_ActiveResult.next(result);
    this._router.navigate(["detail-photo"]);
  }

}
