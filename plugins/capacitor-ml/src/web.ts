import { registerWebPlugin, WebPlugin } from '@capacitor/core';
import { CapacitorMLPlugin } from './definitions';
import { ImageOrientation } from './text-detector';

export class CapacitorMLWeb extends WebPlugin implements CapacitorMLPlugin {
  constructor() {
    super({
      name: 'CapacitorML',
      platforms: ['web'],
    });
  }
  echo(options: { filepath: string; orientation: ImageOrientation | undefined; }): Promise<{ textDetections: string[]; }> {
    /*throw new Error('Method not implemented.');
    console.log('ECHO', options);*/
    return Promise.reject("Web Plugin Not implemented");
  }
}

const CapacitorML = new CapacitorMLWeb();

export { CapacitorML };

registerWebPlugin(CapacitorML);
