package com.gnykoua.CapacitorML;

import android.graphics.Bitmap;
import android.graphics.Point;

import androidx.annotation.NonNull;

import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.ml.vision.FirebaseVision;
import com.google.firebase.ml.vision.common.FirebaseVisionImage;
import com.google.firebase.ml.vision.text.FirebaseVisionText;
import com.google.firebase.ml.vision.text.FirebaseVisionTextRecognizer;

import org.json.JSONArray;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TextDetector {

    public void detectText(final PluginCall call, Bitmap bitmap) {
        FirebaseVisionImage image;

        try {
            image = FirebaseVisionImage.fromBitmap(bitmap);
            final int width = bitmap.getWidth();
            final int height = bitmap.getHeight();

            FirebaseVisionTextRecognizer textDetector = FirebaseVision.getInstance().getOnDeviceTextRecognizer();

            textDetector.processImage(image).addOnSuccessListener(new OnSuccessListener<FirebaseVisionText>() {
                @Override
                public void onSuccess(FirebaseVisionText firebaseVisionText) {
                    ArrayList<Object> detectedText = new ArrayList<>();

                    for (FirebaseVisionText.TextBlock detectedBlocks : firebaseVisionText.getTextBlocks()) {
                        for (FirebaseVisionText.Line line : detectedBlocks.getLines()) {
                            /*Point[] cornerPoints = line.getCornerPoints();
                            Point topLeft = cornerPoints[0];
                            Point topRight = cornerPoints[1];
                            Point bottomRight = cornerPoints[2];
                            Point bottomLeft = cornerPoints[3];*/

                            Map<String, Object> textDetection = new HashMap<>();

                            /*List<Double> topLeftList = new ArrayList<>();
                            topLeftList.add((double) topLeft.x / width);
                            topLeftList.add((double) (height - topLeft.y) / height);

                            List<Double> topRightList = new ArrayList<>();
                            topRightList.add((double) topRight.x / width);
                            topRightList.add((double) (height - topRight.y) / height);

                            List<Double> bottomLeftList = new ArrayList<>();
                            bottomLeftList.add((double) bottomLeft.x / width);
                            bottomLeftList.add((double) (height - bottomLeft.y) / height);

                            List<Double> bottomRightList = new ArrayList<>();
                            bottomRightList.add((double) bottomRight.x / width);
                            bottomRightList.add((double) (height - bottomRight.y) / height);

                            textDetection.put("topLeft", topLeftList);
                            textDetection.put("topRight", topLeftList);
                            textDetection.put("bottomLeft", topLeftList);
                            textDetection.put("bottomRight", topLeftList);*/
                            textDetection.put("text", line.getText());

                            detectedText.add(textDetection);
                        }
                    }

                    call.success(new JSObject().put("textDetections", new JSONArray(detectedText)));

                }
            }).addOnFailureListener (new OnFailureListener() {
                @Override
                public void onFailure(@NonNull Exception e) {
                    call.reject("FirebaseVisionTextRecognizer couldn't process the given image", e);
                }
            });

        } catch (Exception e){
            e.printStackTrace();
            call.reject(e.getLocalizedMessage(), e);
        }
    }
}
