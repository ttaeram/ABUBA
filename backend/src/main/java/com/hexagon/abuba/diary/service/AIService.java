package com.hexagon.abuba.diary.service;

import com.google.cloud.vision.v1.*;
import com.google.cloud.vision.v1.Image;
import com.hexagon.abuba.global.openfeign.FinAIAPIClient;
import com.hexagon.abuba.global.openfeign.dto.request.AnalyseRequestDTO;
import com.hexagon.abuba.global.openfeign.dto.response.AnalyseResponseDTO;
import com.hexagon.abuba.s3.service.S3Service;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import javax.swing.*;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;


@Service
@Slf4j
public class AIService {
    private final FinAIAPIClient finAIAPIClient;
    private final S3Service s3Service;
    @Value("${naver.client-id}")
    private String clientId;

    @Value("${naver.client-secret}")
    private String clientSecret;

    public AIService(FinAIAPIClient finAIAPIClient, S3Service s3Service) {
        this.finAIAPIClient = finAIAPIClient;
        this.s3Service = s3Service;
    }

    public String getSentiment(String text) {
        log.info("getSentiment");
        log.info("clientId: {}", clientId);
        log.info("clientSecret: {}", clientSecret);
        AnalyseRequestDTO requestDTO = new AnalyseRequestDTO(text);
        AnalyseResponseDTO responseDTO = finAIAPIClient.analyzeSentiment(clientId, clientSecret, requestDTO);

        return responseDTO.document().sentiment();
    }

    public String uploadCroppedFace(BufferedImage croppedFace, String fileName) {
        try {
            // BufferedImage를 ByteArrayOutputStream으로 변환
            ByteArrayOutputStream os = new ByteArrayOutputStream();
            ImageIO.write(croppedFace, "jpg", os);
            InputStream inputStream = new ByteArrayInputStream(os.toByteArray());

            // S3에 업로드, mimeType은 "image/jpeg"로 설정
            return s3Service.uploadFile(inputStream, fileName, "cropped_faces", "image/jpeg");
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload cropped face image", e);
        }
    }

    @Async
    public CompletableFuture<String> detectFacesGcs(String s3Url) {
        List<AnnotateImageRequest> requests = new ArrayList<>();
        ImageSource imgSource = ImageSource.newBuilder().setImageUri(s3Url).build();
        Image img = Image.newBuilder().setSource(imgSource).build();
        Feature feat = Feature.newBuilder().setType(Feature.Type.FACE_DETECTION).build();
        AnnotateImageRequest request = AnnotateImageRequest.newBuilder().addFeatures(feat).setImage(img).build();
        requests.add(request);

        try (ImageAnnotatorClient client = ImageAnnotatorClient.create()) {
            BatchAnnotateImagesResponse response = client.batchAnnotateImages(requests);
            List<AnnotateImageResponse> responses = response.getResponsesList();

            for (AnnotateImageResponse res : responses) {
                if (res.hasError()) {
                    log.error("Error: {}", res.getError().getMessage());
                    return CompletableFuture.completedFuture(null);
                }
                for (FaceAnnotation annotation : res.getFaceAnnotationsList()) {
                    BoundingPoly boundingPoly = annotation.getBoundingPoly();

                    BufferedImage croppedFace = cropFace(s3Url, boundingPoly);

                    String uploadedFileName = uploadCroppedFace(croppedFace, "face_image.jpg");
                    log.info("Uploaded cropped face image to S3 with file name: {}", uploadedFileName);

                    // 비동기 작업 결과 반환
                    return CompletableFuture.completedFuture(uploadedFileName);
                }
            }
        } catch (IOException e) {
            log.error("IOException occurred: ", e);
            // 예외 발생 시 비동기 결과 처리
            return CompletableFuture.failedFuture(e);
        }
        // 얼굴을 감지하지 못한 경우
        return CompletableFuture.completedFuture(null);
    }


    public BufferedImage cropFace(String s3Url, BoundingPoly boundingPoly) {
        try {
            // S3 URL에서 이미지를 로드합니다.
            URL url = new URL(s3Url);
            BufferedImage originalImage = ImageIO.read(url);

            // 바운딩 박스 좌표를 이용해 얼굴 부분만 잘라냅니다.
            int x = boundingPoly.getVertices(0).getX();
            int y = boundingPoly.getVertices(0).getY();
            int width = boundingPoly.getVertices(1).getX() - x;
            int height = boundingPoly.getVertices(2).getY() - y;

            BufferedImage croppedFace = originalImage.getSubimage(x, y, width, height);

            // 잘라낸 얼굴 이미지를 반환합니다.
            return croppedFace;
        } catch (IOException e) {
            log.error("Failed to crop face from image", e);
            throw new RuntimeException("Failed to crop face from image", e);
        }
    }
}
