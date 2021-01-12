import { Plugins } from '@capacitor/core';
const { CapacitorML } = Plugins;

export interface TextDetection {
    bottomLeft: [number, number]; // [x-coordinate, y-coordinate]
    bottomRight: [number, number]; // [x-coordinate, y-coordinate]
    topLeft: [number, number]; // [x-coordinate, y-coordinate]
    topRight: [number, number]; // [x-coordinate, y-coordinate]
    text: string;
}

export enum ImageOrientation {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT",
}

export class TextDetector {
    async detectText(_filepath: string, _orientation?: ImageOrientation): Promise<string[]> {
        const response = await CapacitorML.echo({ filepath: _filepath, orientation: _orientation })

        return response.textDetections;
    }
}