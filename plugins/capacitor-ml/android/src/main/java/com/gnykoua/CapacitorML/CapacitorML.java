package com.gnykoua.CapacitorML;

import android.graphics.Bitmap;
import android.graphics.Matrix;
import android.graphics.Point;
import android.net.Uri;
import android.provider.MediaStore;

import com.getcapacitor.NativePlugin;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;

import java.io.IOException;

@NativePlugin
public class CapacitorML extends Plugin {

    @PluginMethod
    public void echo(PluginCall call) throws IOException {
        /*String value = call.getString("value");

        JSObject ret = new JSObject();
        ret.put("value", value);
        call.success(ret);*/

        String filepath = call.getString("filepath");
        if (filepath == null) {
            call.reject("filepath not specified");
            return;
        }

        String orientation = call.getString("orientation");

        // Creating a bitmap from the filepath we received from the capacitor plugin call
        Bitmap bitmap = MediaStore.Images.Media.getBitmap(this.getContext().getContentResolver(), Uri.parse(filepath));

        // converting the orientation we received into rotation that bitmap could use
        int rotation = this.orientationToRotation(orientation);

        int width = bitmap.getWidth();
        int height = bitmap.getHeight();

        Matrix matrix = new Matrix();
        matrix.setRotate((float)rotation);

        //createBitmap(Bitmap source, int x, int y, int width, int height, Matrix m, boolean filter) returns a bitmap from subset of the source bitmap, transformed by the optional matrix.
        Bitmap rotatedBitmap = Bitmap.createBitmap(bitmap, 0, 0, width, height, matrix, true);

        TextDetector td = new TextDetector();
        td.detectText(call, rotatedBitmap);

    }


    private int orientationToRotation(String orientation) {
        switch (orientation) {
            case "UP":
                return 0;
            case "RIGHT":
                return 90;
            case "DOWN":
                return 180;
            case "LEFT":
                return 270;
            default:
                return 0;
        }
    }
}
