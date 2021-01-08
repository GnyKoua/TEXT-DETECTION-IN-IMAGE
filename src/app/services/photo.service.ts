import { Injectable } from '@angular/core';
import { CameraPhoto, CameraResultType, CameraSource, FilesystemDirectory, Plugins } from '@capacitor/core';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ImageOrientation } from 'plugins/capacitor-ml/src/text-detector';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Photo } from '../models/Photo';
import { Result } from '../models/Result';

const { Camera, Filesystem, CapacitorML } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  O_Results: BehaviorSubject<Result[]> = new BehaviorSubject<Result[]>([]);
  O_ActiveResult: BehaviorSubject<Result> = new BehaviorSubject<Result>(null);
  private results: Result[] = [];

  constructor(
    private _loadingCtrl: LoadingController,
    private _alertCtrl: AlertController,
    private _storage: Storage,
    private _platform: Platform
  ) { }

  GetResults() {
    this._storage.get(environment.RESULTS_KEY).then(async res => {
      if (res != null) {

        for (let item of res) {
          const readFile = await Filesystem.readFile({
            path: item.photo.filepath,
            directory: FilesystemDirectory.Data
          });

          item.photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
        }
        this.results = res;
        this.O_Results.next(this.results);
      }
    });
  }

  private SaveResults() {
    return this._storage.set(environment.RESULTS_KEY, this.results);
  }

  async DetectTextInImage() {
    return new Promise((resolve, reject) => {
      //Take a picture
      Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt,
        quality: 100
      }).then(capturedPhoto => {
        if (this._platform.is("capacitor")) {
          this._loadingCtrl.create({
            message: 'Détection de texte...',
          }).then(loader => {
            loader.present();

            //Detect text in picture
            CapacitorML.echo({ filepath: capturedPhoto.path, orientation: ImageOrientation.Up }).then(async res => {

              this.savePicture(capturedPhoto).then(savedImageFile => {
                this.results.unshift({
                  photo: savedImageFile,
                  textDetected: res.textDetections
                });
                this.O_Results.next(this.results);

                this.O_ActiveResult.next(this.results[0]);

                this.SaveResults().then(() => {
                  loader.dismiss();

                  resolve(true);
                });
              });

            }).catch(e => {
              loader.dismiss();

              this._alertCtrl.create({
                message: e,
                backdropDismiss: false,
                buttons: [
                  {
                    text: "OK",
                    role: "cancel",
                    handler: () => {
                      this._alertCtrl.dismiss();
                    }
                  }
                ]
              });
            });
          });

        } else {
          this.savePicture(capturedPhoto).then(savedImageFile => {
            this.results.unshift({
              photo: savedImageFile,
              textDetected: []
            });
            this.O_Results.next(this.results);

            this.O_ActiveResult.next(this.results[0]);

            this.SaveResults();

          });

        }
      });
    });
  }


  private async savePicture(cameraPhoto: CameraPhoto): Promise<Photo> {
    const base64Data = await this.readAsBase64(cameraPhoto);

    const fileName = new Date().getTime() + '.jpeg';
    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data
    });

    return new Photo(fileName, cameraPhoto.webPath);
  }

  private async readAsBase64(cameraPhoto: CameraPhoto) {
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();

    return await this.convertBlobToBase64(blob) as string;
  }

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}
