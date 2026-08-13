package com.gayatri_granites.backend.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import org.springframework.stereotype.Service;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;

import javax.imageio.ImageIO;

@Service
public class QrCodeService {

    public byte[] generateQrCode(
            String content,
            int width,
            int height
    ) {

        try {

            Map<EncodeHintType, Object> hints = new HashMap<>();

            hints.put(
                    EncodeHintType.MARGIN,
                    1
            );

            BitMatrix bitMatrix =
                    new MultiFormatWriter().encode(
                            content,
                            BarcodeFormat.QR_CODE,
                            width,
                            height,
                            hints
                    );

            BufferedImage bufferedImage =
                    MatrixToImageWriter.toBufferedImage(bitMatrix);

            ByteArrayOutputStream outputStream =
                    new ByteArrayOutputStream();

            ImageIO.write(
                    bufferedImage,
                    "PNG",
                    outputStream
            );

            return outputStream.toByteArray();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to generate QR code",
                    e
            );
        }
    }
}