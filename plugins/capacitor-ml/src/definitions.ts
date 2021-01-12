import { ImageOrientation } from "./text-detector";

declare module '@capacitor/core' {
  interface PluginRegistry {
    CapacitorML: CapacitorMLPlugin;
    //CapacitorML: {};
  }
}

//export default {};
export interface CapacitorMLPlugin {
  //echo(options: { value: string }): Promise<{ value: string }>;
  echo(options: { filepath: string, orientation: ImageOrientation | undefined }): Promise<{ textDetections: any[] }>;
  //detectText(filepath: string, orientation?: ImageOrientation): Promise<string[]>;

}
