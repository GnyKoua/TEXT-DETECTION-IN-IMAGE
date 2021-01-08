export class Photo {
    filepath: string;
    webviewPath: string;

    constructor(_filepath: string, _webviewPath: string) {
        this.filepath = _filepath;
        this.webviewPath = _webviewPath;
    }
}