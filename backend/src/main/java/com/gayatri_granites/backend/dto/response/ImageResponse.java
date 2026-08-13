package com.gayatri_granites.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ImageResponse {
    private Long id;
    private String imageUrl;
    private Boolean isPrimary;
    private Integer displayOrder;
    // deliberately no s3Key - that's an internal implementation detail, not for the client
}